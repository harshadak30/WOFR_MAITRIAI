import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import TableHeader from "../../../component/common/ui/Table/TableHeader";
import Toggle from "../../../component/common/ui/Toggle";
import Pagination from "../../../component/common/ui/Table/Pagination";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";
import axios from "../../../helper/axios";

type Mapping = {
  role_module_action_mapping_id: number;
  module_id: number;
  module_name: string;
  action_id: number;
  action_name: string;
  role_id: number;
  role_name: string;
  status: string;
  assignment_date: string;
  roles: Array<{ role_id: number; role_name: string }>;
  actions: Array<{ action_id: number; action_name: string }>;
};

type ModuleView = {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
};

const MasterModulesPage: React.FC = () => {
  const [modules, setModules] = useState<ModuleView[]>([]);
  const [moduleSelectedRoles, setModuleSelectedRoles] = useState<
    Record<number, string[]>
  >({});
  const [moduleSelectedActions, setModuleSelectedActions] = useState<
    Record<number, string[]>
  >({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedDropdown, setExpandedDropdown] = useState<{
    id: number;
    type: string;
  } | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [toggleLoading, setToggleLoading] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const itemsPerPage = 10;
  const dropdownRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const dropdownContentRef = useRef<HTMLDivElement | null>(null);

  const { authState } = useAuth();
  const token = authState.token;

  // Configure axios defaults
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  axios.defaults.headers.common["accept"] = "application/json";

  // Calculate dropdown position
  const calculateDropdownPosition = (buttonElement: HTMLButtonElement) => {
    const rect = buttonElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const dropdownHeight = 320; // Approximate dropdown height
    const dropdownWidth = Math.min(320, viewportWidth - 32); // Max width with padding

    let top = rect.bottom + window.scrollY + 4;
    let left = rect.left + window.scrollX;

    // Adjust if dropdown would go below viewport
    if (rect.bottom + dropdownHeight > viewportHeight) {
      top = rect.top + window.scrollY - dropdownHeight - 4;
    }

    // Adjust if dropdown would go beyond right edge
    if (left + dropdownWidth > viewportWidth) {
      left = viewportWidth - dropdownWidth - 16;
    }

    // Ensure it doesn't go beyond left edge
    if (left < 16) {
      left = 16;
    }

    return {
      top,
      left,
      width: dropdownWidth,
    };
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        expandedDropdown &&
        dropdownContentRef.current &&
        !dropdownContentRef.current.contains(event.target as Node)
      ) {
        const buttonKey = `${expandedDropdown.id}-${expandedDropdown.type}`;
        const buttonElement = dropdownRefs.current[buttonKey];
        if (buttonElement && !buttonElement.contains(event.target as Node)) {
          setExpandedDropdown(null);
          setDropdownPosition(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expandedDropdown]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (expandedDropdown) {
        const buttonKey = `${expandedDropdown.id}-${expandedDropdown.type}`;
        const buttonElement = dropdownRefs.current[buttonKey];
        if (buttonElement) {
          const position = calculateDropdownPosition(buttonElement);
          setDropdownPosition(position);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [expandedDropdown]);

  const fetchModules = async (page: number, limit: number, search?: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = await axios.get(
        `api/v1/grouped-module-actions-roles?${params}`
      );

      if (response.data.success) {
        const modulesData: Mapping[] = response.data.data.module_action_pairs;
        const uniqueModules = new Map<number, ModuleView>();
        const rolesMap: Record<number, string[]> = {};
        const actionsMap: Record<number, string[]> = {};

        modulesData.forEach((mod) => {
          if (!uniqueModules.has(mod.module_id)) {
            uniqueModules.set(mod.module_id, {
              id: mod.module_id,
              name: mod.module_name,
              description: `${mod.module_name} Module`,
              enabled: mod.status === "active",
            });
          }

          if (mod.roles) {
            rolesMap[mod.module_id] = mod.roles.map((role) => role.role_name);
          }
          if (mod.actions) {
            actionsMap[mod.module_id] = mod.actions.map(
              (action) => action.action_name
            );
          }
        });

        setModules(Array.from(uniqueModules.values()));
        setModuleSelectedRoles(rolesMap);
        setModuleSelectedActions(actionsMap);
        setTotalItems(response.data.data.total || uniqueModules.size);
      }
    } catch (error) {
      console.error("Error fetching grouped modules:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModules(currentPage, itemsPerPage, searchTerm);
  }, [currentPage, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

  const handleToggleChange = async (moduleId: number) => {
    setToggleLoading(moduleId);
    try {
      const response = await axios.patch(`api/v1/modules-status/${moduleId}`);

      if (response.data.success) {
        const newStatus = response.data.data.module.status;
        const isActive = newStatus === "active";

        setModules((prev) =>
          prev.map((mod) =>
            mod.id === moduleId ? { ...mod, enabled: isActive } : mod
          )
        );

        toast.success(
          `${response.data.data.module.module_name} is now ${
            isActive ? "Active" : "Inactive"
          }`
        );
      }
    } catch (error) {
      console.error("Error toggling module status:", error);
      toast.error("Failed to toggle module status");
    } finally {
      setToggleLoading(null);
    }
  };

  const toggleDropdown = (moduleId: number, type: "action" | "role") => {
    const buttonKey = `${moduleId}-${type}`;
    const buttonElement = dropdownRefs.current[buttonKey];

    if (expandedDropdown?.id === moduleId && expandedDropdown?.type === type) {
      setExpandedDropdown(null);
      setDropdownPosition(null);
    } else {
      setExpandedDropdown({ id: moduleId, type });
      if (buttonElement) {
        const position = calculateDropdownPosition(buttonElement);
        setDropdownPosition(position);
      }
    }
  };

  // Dropdown component
  const DropdownContent = ({
    moduleId,
    type,
  }: {
    moduleId: number;
    type: "action" | "role";
  }) => {
    const items =
      type === "action"
        ? moduleSelectedActions[moduleId] || []
        : moduleSelectedRoles[moduleId] || [];

    const title = type === "action" ? "Actions" : "Roles";
    const colorClass = type === "action" ? "bg-green-500" : "bg-blue-500";
    const emptyMessage =
      type === "action" ? "No actions assigned" : "No roles assigned";

    return (
      <div
        ref={dropdownContentRef}
        className="bg-white rounded-lg shadow-xl border border-gray-200 z-50"
        style={{
          position: "fixed",
          top: dropdownPosition?.top,
          left: dropdownPosition?.left,
          width: dropdownPosition?.width,
          maxHeight: "320px",
        }}
      >
        <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
          <span className="text-sm font-semibold text-gray-900">
            {title} ({items.length})
          </span>
          <button
            onClick={() => {
              setExpandedDropdown(null);
              setDropdownPosition(null);
            }}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={14} className="text-gray-500" />
          </button>
        </div>
        <div className="max-h-[240px] overflow-y-auto">
          {items.length > 0 ? (
            items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full ${colorClass}`}></div>
                <span className="text-sm text-gray-700 break-words">
                  {item}
                </span>
              </div>
            ))
          ) : (
            <div className="p-6 text-sm text-gray-500 text-center">
              {emptyMessage}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      <div className="mx-auto space-y-4 sm:space-y-6">
        {/* Search Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-80 lg:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium whitespace-nowrap">
              {totalItems} modules found
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                {modules.map((module, index) => {
                  const selectedActions =
                    moduleSelectedActions[module.id] || [];
                  const selectedRoles = moduleSelectedRoles[module.id] || [];

                  return (
                    <tr
                      key={module.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-center text-sm font-medium text-gray-900">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          <div
                            className="truncate max-w-[100px] sm:max-w-[140px]"
                            title={module.name}
                          >
                            {module.name}
                          </div>
                          {/* Show description on mobile as subtitle */}
                          <div
                            className="lg:hidden text-xs text-gray-500 mt-1 truncate max-w-[100px] sm:max-w-[140px]"
                            title={module.description}
                          >
                            {module.description || "-"}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                        <div
                          className="text-sm text-gray-600 truncate max-w-[140px]"
                          title={module.description}
                        >
                          {module.description || "-"}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="relative">
                          <button
                            ref={(el) => {
                              if (el) {
                                dropdownRefs.current[`${module.id}-action`] =
                                  el;
                              }
                            }}
                            onClick={() => toggleDropdown(module.id, "action")}
                            className="inline-flex justify-between items-center w-full min-w-[120px] sm:min-w-[140px] px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150"
                          >
                            {selectedActions.length > 0 ? (
                              <span className="flex items-center min-w-0">
                                <span className="bg-green-100 text-green-800 text-xs font-medium mr-1 sm:mr-2 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0">
                                  {selectedActions.length}
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
                                expandedDropdown?.id === module.id &&
                                expandedDropdown?.type === "action"
                                  ? "transform rotate-180"
                                  : ""
                              }`}
                            />
                          </button>
                        </div>
                      </td>

                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="relative">
                          <button
                            ref={(el) => {
                              if (el) {
                                dropdownRefs.current[`${module.id}-role`] = el;
                              }
                            }}
                            onClick={() => toggleDropdown(module.id, "role")}
                            className="inline-flex justify-between items-center w-full min-w-[120px] sm:min-w-[140px] px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150"
                          >
                            {selectedRoles.length > 0 ? (
                              <span className="flex items-center min-w-0">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-1 sm:mr-2 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0">
                                  {selectedRoles.length}
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
                                expandedDropdown?.id === module.id &&
                                expandedDropdown?.type === "role"
                                  ? "transform rotate-180"
                                  : ""
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                        <div className="relative inline-block">
                          <Toggle
                            enabled={module.enabled}
                            onChange={() => handleToggleChange(module.id)}
                          />
                          {toggleLoading === module.id && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-blue-200 border-t-blue-600"></div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {modules.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-600 mr-3"></div>
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Render dropdown portal */}
      {expandedDropdown && dropdownPosition && (
        <DropdownContent
          moduleId={expandedDropdown.id}
          type={expandedDropdown.type as "action" | "role"}
        />
      )}
    </div>
  );
};

export default MasterModulesPage;
