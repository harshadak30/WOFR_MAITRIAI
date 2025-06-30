import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import TableHeader from "../../../component/common/ui/Table/TableHeader";
import Toggle from "../../../component/common/ui/Toggle";
import Pagination from "../../../component/common/ui/Table/Pagination";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";
import axios from "../../../helper/axios";

type RoleMapping = {
  role_id: number;
  role_name: string;
};

type ActionMapping = {
  action_id: number;
  action_name: string;
};

type ModuleActionRoleMapping = {
  role_module_action_mapping_id: number;
  module_id: number;
  module_name: string;
  action_id: number;
  action_name: string;
  role_id: number;
  role_name: string;
  status: string;
  assignment_date: string;
  roles: RoleMapping[];
  actions: ActionMapping[];
};

type ModuleData = {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
};

type DropdownState = {
  moduleId: number;
  type: "action" | "role";
} | null;

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  openUpward: boolean;
};

type ModuleApiResponse = {
  module_id: number;
  module_name: string;
  description: string;
  status: "active" | "inactive";
  created_by: string;
  created_at: string;
};

const ITEMS_PER_PAGE = 10;

const MasterModulesPage: React.FC = () => {
  // State management
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [moduleRoleAssignments, setModuleRoleAssignments] = useState<
    Record<number, string[]>
  >({});
  const [moduleActionAssignments, setModuleActionAssignments] = useState<
    Record<number, string[]>
  >({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingModules, setIsLoadingModules] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<DropdownState>(null);
  const [totalModuleCount, setTotalModuleCount] = useState(0);
  const [moduleToggleLoading, setModuleToggleLoading] = useState<number | null>(
    null
  );
  const [dropdownPosition, setDropdownPosition] =
    useState<DropdownPosition | null>(null);
  const [moduleStatusMap, setModuleStatusMap] = useState<
    Record<number, string>
  >({});

  // Refs
  const dropdownTriggerRefs = useRef<Record<string, HTMLButtonElement | null>>(
    {}
  );
  const dropdownContentRef = useRef<HTMLDivElement | null>(null);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  const { authState } = useAuth();
  const authToken = authState.token;

  // Configure axios defaults
  axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
  axios.defaults.headers.common["accept"] = "application/json";

  // Enhanced responsive positioning calculation
  const calculateOptimalDropdownPosition = useCallback(
    (triggerElement: HTMLButtonElement): DropdownPosition => {
      const triggerRect = triggerElement.getBoundingClientRect();
      
      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Responsive dropdown width based on screen size
      let dropdownWidth: number;
      if (viewportWidth < 480) { // Extra small mobile
        dropdownWidth = Math.min(260, viewportWidth - 20); // 10px padding on each side
      } else if (viewportWidth < 640) { // Small mobile
        dropdownWidth = Math.min(280, viewportWidth - 24); // 12px padding on each side
      } else if (viewportWidth < 768) { // Large mobile
        dropdownWidth = Math.min(300, viewportWidth - 32); // 16px padding on each side
      } else if (viewportWidth < 1024) { // Tablet
        dropdownWidth = Math.min(320, viewportWidth - 40); // 20px padding on each side
      } else if (viewportWidth < 1280) { // Small desktop
        dropdownWidth = Math.min(340, viewportWidth - 48); // 24px padding on each side
      } else { // Large desktop
        dropdownWidth = Math.min(360, viewportWidth - 64); // 32px padding on each side
      }
      
      // Responsive max height based on screen size and viewport
      let maxDropdownHeight: number;
      if (viewportWidth < 480) { // Extra small mobile
        maxDropdownHeight = Math.min(200, viewportHeight * 0.35);
      } else if (viewportWidth < 640) { // Small mobile
        maxDropdownHeight = Math.min(220, viewportHeight * 0.4);
      } else if (viewportWidth < 768) { // Large mobile
        maxDropdownHeight = Math.min(250, viewportHeight * 0.45);
      } else if (viewportWidth < 1024) { // Tablet
        maxDropdownHeight = Math.min(280, viewportHeight * 0.5);
      } else { // Desktop
        maxDropdownHeight = Math.min(320, viewportHeight * 0.55);
      }
      
      // Calculate available space with responsive padding
      const bottomPadding = viewportWidth < 640 ? 10 : viewportWidth < 1024 ? 16 : 20;
      const topPadding = viewportWidth < 640 ? 10 : viewportWidth < 1024 ? 16 : 20;
      
      const spaceBelow = viewportHeight - triggerRect.bottom - bottomPadding;
      const spaceAbove = triggerRect.top - topPadding;
      
      // Determine if dropdown should open upward
      const shouldOpenUpward = spaceBelow < 150 && spaceAbove > spaceBelow;
      
      // Calculate vertical position and height
      let top: number;
      let maxHeight: number;
      
      if (shouldOpenUpward) {
        const availableHeight = Math.min(spaceAbove, maxDropdownHeight);
        top = triggerRect.top - availableHeight - 8;
        maxHeight = availableHeight;
      } else {
        const availableHeight = Math.min(spaceBelow, maxDropdownHeight);
        top = triggerRect.bottom + 8;
        maxHeight = availableHeight;
      }
      
      // Calculate horizontal position with responsive logic
      let left = triggerRect.left;
      const sidePadding = viewportWidth < 480 ? 10 : viewportWidth < 640 ? 12 : viewportWidth < 1024 ? 16 : 20;
      
      // Ensure dropdown doesn't overflow viewport horizontally
      if (left + dropdownWidth > viewportWidth - sidePadding) {
        left = viewportWidth - dropdownWidth - sidePadding;
      }
      if (left < sidePadding) {
        left = sidePadding;
      }
      
      // For small screens, try to center the dropdown relative to the trigger
      if (viewportWidth < 768) {
        const triggerCenter = triggerRect.left + (triggerRect.width / 2);
        const dropdownCenter = triggerCenter - (dropdownWidth / 2);
        
        // Only center if it fits within the viewport
        if (dropdownCenter >= sidePadding && dropdownCenter + dropdownWidth <= viewportWidth - sidePadding) {
          left = dropdownCenter;
        }
      }

      return {
        top,
        left,
        width: dropdownWidth,
        maxHeight,
        openUpward: shouldOpenUpward,
      };
    },
    []
  );

  const createDropdownTriggerKey = (
    moduleId: number,
    type: "action" | "role"
  ): string => {
    return `${moduleId}-${type}`;
  };

  // Event handlers
  const handleClickOutsideDropdown = useCallback(
    (event: MouseEvent) => {
      if (!activeDropdown) return;

      const target = event.target as Node;
      
      // Check if click is inside dropdown
      const isClickInsideDropdown = dropdownContentRef.current?.contains(target);
      if (isClickInsideDropdown) return;

      // Check if click is on trigger button
      const triggerKey = createDropdownTriggerKey(
        activeDropdown.moduleId,
        activeDropdown.type
      );
      const triggerElement = dropdownTriggerRefs.current[triggerKey];
      const isClickOnTrigger = triggerElement?.contains(target);

      if (!isClickOnTrigger) {
        closeDropdown();
      }
    },
    [activeDropdown]
  );

  const handleWindowResize = useCallback(() => {
    if (!activeDropdown) return;

    const triggerKey = createDropdownTriggerKey(
      activeDropdown.moduleId,
      activeDropdown.type
    );
    const triggerElement = dropdownTriggerRefs.current[triggerKey];

    if (triggerElement) {
      const newPosition = calculateOptimalDropdownPosition(triggerElement);
      setDropdownPosition(newPosition);
    }
  }, [activeDropdown, calculateOptimalDropdownPosition]);

  // Enhanced scroll handler that prevents dropdown from closing when scrolling inside it
  const handleScroll = useCallback((event: Event) => {
    if (!activeDropdown) return;
    
    const target = event.target as Element;
    
    // Check if the scroll is happening inside the dropdown content
    const isDropdownScroll = dropdownContentRef.current?.contains(target) || 
                            target === dropdownContentRef.current;
    
    // Only close dropdown if it's not scrolling inside the dropdown itself
    if (!isDropdownScroll) {
      closeDropdown();
    }
  }, [activeDropdown]);

  const closeDropdown = useCallback(() => {
    setActiveDropdown(null);
    setDropdownPosition(null);
  }, []);

  // Effect hooks
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideDropdown);
    window.addEventListener("resize", handleWindowResize);
    // Use capture phase to catch scroll events before they bubble
    document.addEventListener("scroll", handleScroll, true);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDropdown);
      window.removeEventListener("resize", handleWindowResize);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [handleClickOutsideDropdown, handleWindowResize, handleScroll]);

  // API functions
  const fetchModulesData = async (
    page: number,
    limit: number,
    searchTerm?: string
  ) => {
    setIsLoadingModules(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await axios.get(
        `api/v1/grouped-module-actions-roles?${queryParams}`
      );

      if (response.data.success) {
        const mappingsData: ModuleActionRoleMapping[] =
          response.data.data.module_action_pairs;
        const uniqueModulesMap = new Map<number, ModuleData>();
        const roleAssignmentsMap: Record<number, string[]> = {};
        const actionAssignmentsMap: Record<number, string[]> = {};

        mappingsData.forEach((mapping) => {
          // Create unique module entries
          if (!uniqueModulesMap.has(mapping.module_id)) {
            uniqueModulesMap.set(mapping.module_id, {
              id: mapping.module_id,
              name: mapping.module_name,
              description: `${mapping.module_name} Module`,
              enabled: mapping.status === "active",
            });
          }

          // Populate role assignments
          if (mapping.roles && mapping.roles.length > 0) {
            roleAssignmentsMap[mapping.module_id] = mapping.roles.map(
              (role) => role.role_name
            );
          }

          // Populate action assignments
          if (mapping.actions && mapping.actions.length > 0) {
            actionAssignmentsMap[mapping.module_id] = mapping.actions.map(
              (action) => action.action_name
            );
          }
        });

        setModules(Array.from(uniqueModulesMap.values()));
        setModuleRoleAssignments(roleAssignmentsMap);
        setModuleActionAssignments(actionAssignmentsMap);
        setTotalModuleCount(response.data.data.total || uniqueModulesMap.size);
      }
    } catch (error) {
      console.error("Error fetching modules data:", error);
      toast.error("Failed to fetch modules data");
    } finally {
      setIsLoadingModules(false);
    }
  };

  const toggleModuleStatus = async (moduleId: number) => {
    setModuleToggleLoading(moduleId);
    try {
      const response = await axios.patch(`api/v1/modules-status/${moduleId}`);

      if (response.data.success) {
        const updatedModule: ModuleApiResponse = response.data.data.module;
        const isModuleActive = updatedModule.status === "active";

        setModules((previousModules) =>
          previousModules.map((module) =>
            module.id === moduleId
              ? { ...module, enabled: isModuleActive }
              : module
          )
        );

        toast.success(
          `${updatedModule.module_name} is now ${
            isModuleActive ? "Active" : "Inactive"
          }`
        );
      }
    } catch (error) {
      console.error("Error toggling module status:", error);
      toast.error("Failed to update module status");
    } finally {
      setModuleToggleLoading(null);
      fetchModuleStatusMap(currentPage, ITEMS_PER_PAGE);
    }
  };

  const fetchModuleStatusMap = async (page: number, limit: number) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort_by: "module_id",
        order: "asc",
      });

      const response = await axios.get(`/api/v1/modules?${queryParams}`);

      if (response.data.success) {
        const statusMap: Record<number, string> = {};
        response.data.data.modules.forEach((mod: any) => {
          statusMap[mod.module_id] = mod.status;
        });

        setModuleStatusMap(statusMap);
      }
    } catch (err) {
      console.error("Failed to fetch module status list", err);
    }
  };

  const handleDropdownToggle = (
    moduleId: number,
    dropdownType: "action" | "role"
  ) => {
    const triggerKey = createDropdownTriggerKey(moduleId, dropdownType);
    const triggerElement = dropdownTriggerRefs.current[triggerKey];

    const isCurrentlyOpen =
      activeDropdown?.moduleId === moduleId &&
      activeDropdown?.type === dropdownType;

    if (isCurrentlyOpen) {
      closeDropdown();
    } else {
      setActiveDropdown({ moduleId, type: dropdownType });
      if (triggerElement) {
        const position = calculateOptimalDropdownPosition(triggerElement);
        setDropdownPosition(position);
      }
    }
  };

  // Effect hooks for data fetching
  useEffect(() => {
    fetchModulesData(currentPage, ITEMS_PER_PAGE, searchQuery);
    fetchModuleStatusMap(currentPage, ITEMS_PER_PAGE);
  }, [currentPage, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Calculated values
  const totalPages = Math.max(1, Math.ceil(totalModuleCount / ITEMS_PER_PAGE));
  const firstItemIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  // Component definitions
  const DropdownContent: React.FC<{
    moduleId: number;
    type: "action" | "role";
  }> = ({ moduleId, type }) => {
    const assignedItems =
      type === "action"
        ? moduleActionAssignments[moduleId] || []
        : moduleRoleAssignments[moduleId] || [];

    const dropdownTitle = type === "action" ? "Actions" : "Roles";
    const indicatorColor = type === "action" ? "bg-green-500" : "bg-blue-500";
    const emptyStateMessage =
      type === "action" ? "No actions assigned" : "No roles assigned";

    if (!dropdownPosition) return null;

    // Calculate responsive header height and padding
    const viewportWidth = window.innerWidth;
    const headerHeight = viewportWidth < 640 ? 48 : viewportWidth < 1024 ? 56 : 60;
    const itemPadding = viewportWidth < 640 ? "p-2" : viewportWidth < 1024 ? "p-2.5" : "p-3";
    const textSize = viewportWidth < 640 ? "text-xs" : "text-sm";
    const headerTextSize = viewportWidth < 640 ? "text-xs" : "text-sm";

    return (
      <div
        ref={dropdownContentRef}
        className="bg-white rounded-lg shadow-xl border border-gray-200 z-[9999] fixed"
        style={{
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: `${dropdownPosition.width}px`,
          maxHeight: `${dropdownPosition.maxHeight}px`,
        }}
      >
        {/* Dropdown Header */}
        <div 
          className={`flex items-center justify-between ${itemPadding} border-b border-gray-100 bg-gray-50 rounded-t-lg flex-shrink-0`}
          style={{ minHeight: `${headerHeight}px` }}
        >
          <span className={`${headerTextSize} font-semibold text-gray-900 truncate flex-1 mr-2`}>
            {dropdownTitle} ({assignedItems.length})
          </span>
          <button
            onClick={closeDropdown}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-150 flex-shrink-0"
            aria-label="Close dropdown"
          >
            <X size={viewportWidth < 640 ? 12 : 14} className="text-gray-500" />
          </button>
        </div>

        {/* Dropdown Content with proper scrolling */}
        <div 
          className="overflow-y-auto overflow-x-hidden"
          style={{ 
            maxHeight: `${dropdownPosition.maxHeight - headerHeight}px`,
            // Prevent scroll events from bubbling up and ensure smooth scrolling
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch', // For iOS smooth scrolling
          }}
          onScroll={(e) => {
            // Stop propagation to prevent closing dropdown
            e.stopPropagation();
          }}
          onWheel={(e) => {
            // Stop propagation for mouse wheel events
            e.stopPropagation();
          }}
          onTouchMove={(e) => {
            // Stop propagation for touch scroll events
            e.stopPropagation();
          }}
        >
          {assignedItems.length > 0 ? (
            assignedItems.map((item, itemIndex) => (
              <div
                key={`${type}-${itemIndex}`}
                className={`flex items-center gap-2 sm:gap-3 ${itemPadding} hover:bg-gray-50 transition-colors duration-150`}
              >
                <div
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${indicatorColor} flex-shrink-0`}
                />
                <span className={`${textSize} text-gray-700 break-words flex-1 leading-relaxed`}>
                  {item}
                </span>
              </div>
            ))
          ) : (
            <div className={`p-4 sm:p-6 ${textSize} text-gray-500 text-center`}>
              {emptyStateMessage}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      <div className="mx-auto space-y-4 sm:space-y-6">
        {/* Search Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-80 lg:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Modules Table Section */}
        <div 
          ref={tableContainerRef}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <TableHeader className="w-12 sm:w-16 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    #
                  </TableHeader>
                  <TableHeader className="min-w-[120px] sm:min-w-[140px] text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Module
                  </TableHeader>
                  <TableHeader className="min-w-[140px] sm:min-w-[160px] text-xs font-semibold text-gray-700 uppercase tracking-wide hidden lg:table-cell">
                    Description
                  </TableHeader>
                  <TableHeader className="min-w-[140px] sm:min-w-[180px] text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Actions
                  </TableHeader>
                  <TableHeader className="min-w-[140px] sm:min-w-[180px] text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Roles
                  </TableHeader>
                  <TableHeader className="w-16 sm:w-20 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Status
                  </TableHeader>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {modules.map((module, moduleIndex) => {
                  const assignedActions =
                    moduleActionAssignments[module.id] || [];
                  const assignedRoles = moduleRoleAssignments[module.id] || [];
                  const isCurrentModuleToggling =
                    moduleToggleLoading === module.id;

                  return (
                    <tr
                      key={module.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      {/* Row Number */}
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-center text-sm font-medium text-gray-900">
                        {firstItemIndex + moduleIndex + 1}
                      </td>

                      {/* Module Name */}
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          <div
                            className="truncate max-w-[100px] sm:max-w-[140px]"
                            title={module.name}
                          >
                            {module.name}
                          </div>
                          {/* Mobile description */}
                          <div
                            className="lg:hidden text-xs text-gray-500 mt-1 truncate max-w-[100px] sm:max-w-[140px]"
                            title={module.description}
                          >
                            {module.description || "-"}
                          </div>
                        </div>
                      </td>

                      {/* Description (Desktop only) */}
                      <td className="px-3 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                        <div
                          className="text-sm text-gray-600 truncate max-w-[140px]"
                          title={module.description}
                        >
                          {module.description || "-"}
                        </div>
                      </td>

                      {/* Actions Dropdown */}
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="relative">
                          <button
                            ref={(element) => {
                              if (element) {
                                const triggerKey = createDropdownTriggerKey(
                                  module.id,
                                  "action"
                                );
                                dropdownTriggerRefs.current[triggerKey] =
                                  element;
                              }
                            }}
                            onClick={() =>
                              handleDropdownToggle(module.id, "action")
                            }
                            className="inline-flex justify-between items-center w-full min-w-[120px] sm:min-w-[140px] px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150"
                            aria-expanded={
                              activeDropdown?.moduleId === module.id &&
                              activeDropdown?.type === "action"
                            }
                          >
                            {assignedActions.length > 0 ? (
                              <span className="flex items-center min-w-0">
                                <span className="bg-green-100 text-green-800 text-xs font-medium mr-1 sm:mr-2 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0">
                                  {assignedActions.length}
                                </span>
                                <span className="text-xs sm:text-sm truncate">
                                  Actions
                                </span>
                              </span>
                            ) : (
                              <span className="text-xs sm:text-sm text-gray-500 truncate">
                                Select Actions
                              </span>
                            )}
                            <ChevronDown
                              size={14}
                              className={`ml-1 sm:ml-2 transition-transform duration-200 flex-shrink-0 ${
                                activeDropdown?.moduleId === module.id &&
                                activeDropdown?.type === "action"
                                  ? "transform rotate-180"
                                  : ""
                              }`}
                            />
                          </button>
                        </div>
                      </td>

                      {/* Roles Dropdown */}
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="relative">
                          <button
                            ref={(element) => {
                              if (element) {
                                const triggerKey = createDropdownTriggerKey(
                                  module.id,
                                  "role"
                                );
                                dropdownTriggerRefs.current[triggerKey] =
                                  element;
                              }
                            }}
                            onClick={() =>
                              handleDropdownToggle(module.id, "role")
                            }
                            className="inline-flex justify-between items-center w-full min-w-[120px] sm:min-w-[140px] px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150"
                            aria-expanded={
                              activeDropdown?.moduleId === module.id &&
                              activeDropdown?.type === "role"
                            }
                          >
                            {assignedRoles.length > 0 ? (
                              <span className="flex items-center min-w-0">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-1 sm:mr-2 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0">
                                  {assignedRoles.length}
                                </span>
                                <span className="text-xs sm:text-sm truncate">
                                  Roles
                                </span>
                              </span>
                            ) : (
                              <span className="text-xs sm:text-sm text-gray-500 truncate">
                                Select Roles
                              </span>
                            )}
                            <ChevronDown
                              size={14}
                              className={`ml-1 sm:ml-2 transition-transform duration-200 flex-shrink-0 ${
                                activeDropdown?.moduleId === module.id &&
                                activeDropdown?.type === "role"
                                  ? "transform rotate-180"
                                  : ""
                              }`}
                            />
                          </button>
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                        <div className="relative inline-block">
                          <Toggle
                            enabled={moduleStatusMap[module.id] === "active"}
                            onChange={() => !isCurrentModuleToggling && toggleModuleStatus(module.id)}
                          />
                          
                          {isCurrentModuleToggling && (
                            <div className="absolute inset-0 bg-white bg-opacity-40 rounded-full flex items-center justify-center cursor-not-allowed">
                              <div className="h-4 w-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {/* Empty State */}
                {modules.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        {isLoadingModules ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-600 mr-3" />
                            <span className="text-sm">Loading modules...</span>
                          </div>
                        ) : (
                          <span className="text-sm">No modules found</span>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalModuleCount}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Dropdown Portal */}
      {activeDropdown && dropdownPosition && (
        <DropdownContent
          moduleId={activeDropdown.moduleId}
          type={activeDropdown.type}
        />
      )}
    </div>
  );
};

export default MasterModulesPage;