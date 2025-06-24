import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ChevronDown, Check, PlusCircle, X } from "lucide-react";
import React from "react";
import { UseSuperAdminRoles } from "../../../hooks/useSuperAdminRoles";
import CreateRoleForm from "../../MasterAdmin/Roles/CreateRoleForm";
import Modal from "../../../component/common/ui/Modal";
import { Badge } from "../../../component/common/ui/Badge";
import { DropdownButton } from "../../../component/common/ui/DropdownButton";




const SuperRoleManagement: React.FC<{ isReadOnly: boolean }> = ({
  isReadOnly,
}) => {
  const {
    superAdminRoleMappings,
    message,
    setMessage,
    isCreatingRole,
    isLoading,
    MasterAdminRoleMappings,
    availableSuperAdminRoles,
    handleCreateRole,
    handleCreateSuperAdminRoleMapping,
    moduleOptions,
    getActionOptionsForModules,
    getSubActionOptionsForModulesAndActions,
  } = UseSuperAdminRoles();

  // Form state
  const [selectedSuperAdminRole, setSelectedSuperAdminRole] = useState("");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [selectedActions, setSelectedActions] = useState("");
  const [selectedSubActions, setSelectedSubActions] = useState<string[]>([]);

  // UI state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isModuleDropdownOpen, setIsModuleDropdownOpen] = useState(false);
  const [, setIsActionDropdownOpen] = useState(false);
  const [isSubActionDropdownOpen, setIsSubActionDropdownOpen] = useState(false);
  const [expandedDropdown, setExpandedDropdown] = useState<{
    id: string;
    type: string;
  } | null>(null);
  const [searchTerm] = useState("");

  // Refs
  const moduleDropdownRef = useRef<HTMLDivElement>(null);
  const actionDropdownRef = useRef<HTMLDivElement>(null);
  const subActionDropdownRef = useRef<HTMLDivElement>(null);

  // Memoized computed values
  const availableActions = useMemo(
    () => getActionOptionsForModules(selectedModules),
    [getActionOptionsForModules, selectedModules]
  );

  const availableSubActions = useMemo(
    () =>
      getSubActionOptionsForModulesAndActions(selectedModules, selectedActions),
    [getSubActionOptionsForModulesAndActions, selectedModules, selectedActions]
  );
  const masterAdminFlattenedData = useMemo(() => {
    const grouped = new Map<string, any>();

    MasterAdminRoleMappings?.forEach((moduleMapping: any) => {
      moduleMapping?.module_data?.forEach((roleData: any) => {
        const groupKey = `${roleData.role_id}-${moduleMapping.module_name}`;

        if (!grouped.has(groupKey)) {
          grouped.set(groupKey, {
            role_id: roleData.role_id,
            role_name: roleData.role_name,
            status: roleData.status,
            assignment_date: moduleMapping.assignment_date,
            module_name: moduleMapping.module_name,
            actions: [],
          });
        }

        const existingGroup = grouped.get(groupKey)!;
        roleData?.actions?.forEach((action: any) => {
          existingGroup.actions.push({
            action_id: action.action_id,
            action_name: action.action_name,
            sub_actions: action.all_sub_actions ?? [],
          });
        });
      });
    });

    return Array.from(grouped.values());
  }, [MasterAdminRoleMappings]);

  const superAdminFlattenedData = useMemo(() => {
    const grouped = new Map<string, any>();

    superAdminRoleMappings?.forEach((mapping) => {
      const groupKey = `${mapping.super_admin_role_name}-${mapping.module_name}`;

      if (!grouped.has(groupKey)) {
        grouped.set(groupKey, {
          super_admin_role_name: mapping.super_admin_role_name,
          module_name: mapping.module_name,
          actions: [],
        });
      }

      const existingGroup = grouped.get(groupKey)!;

      // Check if action already exists
      let existingAction = existingGroup.actions.find(
        (action: any) => action.action_name === mapping.action_name
      );

      if (!existingAction) {
        existingAction = {
          action_name: mapping.action_name,
          sub_actions: [],
        };
        existingGroup.actions.push(existingAction);
      }

      // Add sub-actions to the action
      mapping.sub_actions.forEach((subAction) => {
        if (
          !existingAction.sub_actions.find(
            (sa: any) => sa.sub_action_id === subAction.sub_action_id
          )
        ) {
          existingAction.sub_actions.push({
            ...subAction,
            parent_action: mapping.action_name,
          });
        }
      });
    });

    return Array.from(grouped.values());
  }, [superAdminRoleMappings]);


  const filteredSuperAdminData = useMemo(() => {
    if (!searchTerm) return superAdminFlattenedData;
    return superAdminFlattenedData.filter(
      (item: any) =>
        item.super_admin_role_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.module_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [superAdminFlattenedData, searchTerm]);

  const filteredMasterData = useMemo(() => {
    if (!searchTerm) return masterAdminFlattenedData;
    return masterAdminFlattenedData.filter(
      (item: any) =>
        item.role_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.module_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.action_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [masterAdminFlattenedData, searchTerm]);

  // Callbacks
  const handleModuleToggle = useCallback((moduleId: string) => {
    setSelectedModules((prev) => {
      if (prev.includes(moduleId)) {
        return prev.filter((id) => id !== moduleId);
      } else {
        return [...prev, moduleId];
      }
    });
  }, []);

  const handleSubActionToggle = useCallback((subActionId: string) => {
    setSelectedSubActions((prev) => {
      if (prev.includes(subActionId)) {
        return prev.filter((id) => id !== subActionId);
      } else {
        return [...prev, subActionId];
      }
    });
  }, []);

  const resetForm = useCallback(() => {
    setSelectedSuperAdminRole("");
    setSelectedModules([]);
    setSelectedActions("");
    setSelectedSubActions([]);
    setIsModuleDropdownOpen(false);
    setIsActionDropdownOpen(false);
    setIsSubActionDropdownOpen(false);
  }, []);

  const submitPermission = useCallback(async () => {
    if (
      !selectedSuperAdminRole ||
      selectedModules.length === 0 ||
      !selectedActions
    ) {
      setMessage("Please select super admin role, modules, and actions");
      return;
    }

    const superAdminRoleId = parseInt(selectedSuperAdminRole);

    const success = await handleCreateSuperAdminRoleMapping(
      superAdminRoleId,
      selectedModules,
      selectedActions,
      selectedSubActions
    );

    if (success) {
      resetForm();
    }
  }, [
    selectedSuperAdminRole,
    selectedModules,
    selectedActions,
    selectedSubActions,
    handleCreateSuperAdminRoleMapping,
    resetForm,
    setMessage,
  ]);

  const toggleDropdown = useCallback(
    (id: number | string, type: "actions" | "subactions") => {
      const dropdownId = `${id}`;
      setExpandedDropdown(
        expandedDropdown?.id === dropdownId && expandedDropdown?.type === type
          ? null
          : { id: dropdownId, type }
      );
    },
    [expandedDropdown]
  );

  // Effects
  useEffect(() => {
    setSelectedActions("");
    setSelectedSubActions([]);
    setIsActionDropdownOpen(false);
    setIsSubActionDropdownOpen(false);
  }, [selectedModules]);

  useEffect(() => {
    setSelectedSubActions([]);
    setIsSubActionDropdownOpen(false);
  }, [selectedActions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        moduleDropdownRef.current &&
        !moduleDropdownRef.current.contains(target)
      ) {
        setIsModuleDropdownOpen(false);
      }
      if (
        actionDropdownRef.current &&
        !actionDropdownRef.current.contains(target)
      ) {
        setIsActionDropdownOpen(false);
      }
      if (
        subActionDropdownRef.current &&
        !subActionDropdownRef.current.contains(target)
      ) {
        setIsSubActionDropdownOpen(false);
      }

      const isDropdownClick =
        target.closest("[data-dropdown-toggle]") ||
        target.closest("[data-dropdown-content]");
      if (!isDropdownClick) {
        setExpandedDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message, setMessage]);

  return (
    <div className=" bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4 lg:p-6">
      <div className="max-w-full mx-auto space-y-6 lg:space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1"></div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none font-medium"
                disabled={isReadOnly}
              >
                <PlusCircle size={18} className="mr-2 flex-shrink-0" />
                <span className="whitespace-nowrap">Create Role</span>
              </button>
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`mt-4 p-4 rounded-lg border-l-4 ${
                message.includes("Failed") || message.includes("failed")
                  ? "bg-red-50 text-red-700 border-red-400"
                  : "bg-green-50 text-green-700 border-green-400"
              }`}
            >
              <div className="flex items-start">
                <div className="flex-1 text-sm font-medium">{message}</div>
                <button
                  onClick={() => setMessage("")}
                  className="ml-2 text-current opacity-70 hover:opacity-100"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Form Section */}
          <div className="mt-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
              {/* Super Admin Role Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Super Admin Role
                  <span className="text-xs text-gray-500 font-normal ml-2">
                    ({availableSuperAdminRoles.length} available)
                  </span>
                </label>
                <div className="relative">
                  <select
                    value={selectedSuperAdminRole}
                    onChange={(e) => setSelectedSuperAdminRole(e.target.value)}
                    disabled={isReadOnly || isLoading}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm transition-all duration-200 ${
                      selectedSuperAdminRole
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  >
                    <option value="">Choose Super Admin Role...</option>
                    {availableSuperAdminRoles.map((role) => (
                      <option key={role.role_id} value={role.role_id}>
                        {role.role_name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {selectedSuperAdminRole && (
                  <div className="mt-2">
                    <Badge variant="blue" size="sm">
                      ✓{" "}
                      {
                        availableSuperAdminRoles.find(
                          (r) => r.role_id.toString() === selectedSuperAdminRole
                        )?.role_name
                      }
                    </Badge>
                  </div>
                )}
              </div>

              {/* Module Multi-Select Dropdown */}
              <div ref={moduleDropdownRef} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Modules
                  <span className="text-xs text-gray-500 font-normal ml-2">
                    ({moduleOptions.length} available)
                  </span>
                </label>
                <div className="relative">
                  <DropdownButton
                    onClick={() =>
                      setIsModuleDropdownOpen(!isModuleDropdownOpen)
                    }
                    isOpen={isModuleDropdownOpen}
                    disabled={
                      !selectedSuperAdminRole || isReadOnly || isLoading
                    }
                  >
                    {selectedModules.length === 0
                      ? "Choose Modules..."
                      : selectedModules.length === 1
                      ? selectedModules[0]
                      : `${selectedModules.length} modules selected`}
                  </DropdownButton>

                  {isModuleDropdownOpen && moduleOptions.length > 0 && (
                    <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto">
                      <div className="p-2">
                        {moduleOptions.map((module) => (
                          <label
                            key={module.id}
                            className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer rounded-md transition-colors duration-150"
                          >
                            <input
                              type="checkbox"
                              checked={selectedModules.includes(module.id)}
                              onChange={() => handleModuleToggle(module.id)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mr-3 flex-shrink-0"
                            />
                            <span className="text-sm text-gray-700 flex-1 truncate">
                              {module.label}
                            </span>
                            {selectedModules.includes(module.id) && (
                              <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {selectedModules.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedModules.slice(0, 3).map((moduleName, index) => (
                      <Badge key={index} variant="blue" size="sm">
                        {moduleName}
                      </Badge>
                    ))}
                    {selectedModules.length > 3 && (
                      <Badge variant="blue" size="sm">
                        +{selectedModules.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Action Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Action
                  <span className="text-xs text-gray-500 font-normal ml-2">
                    ({availableActions.length} available)
                  </span>
                </label>
                <div className="relative">
                  <select
                    value={selectedActions}
                    onChange={(e) => setSelectedActions(e.target.value)}
                    disabled={
                      selectedModules.length === 0 || isReadOnly || isLoading
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed text-sm transition-all duration-200 hover:border-gray-400"
                  >
                    <option value="">Choose Action...</option>
                    {availableActions.map((action) => (
                      <option key={action.id} value={action.id}>
                        {action.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {selectedActions && (
                  <div className="mt-2">
                    <Badge variant="green" size="sm">
                      {selectedActions}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Sub-Action Multi-Select Dropdown */}
              <div ref={subActionDropdownRef} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Sub Actions
                  <span className="text-xs text-gray-500 font-normal ml-2">
                    ({availableSubActions.length} available)
                  </span>
                </label>
                <div className="relative">
                  <DropdownButton
                    onClick={() =>
                      setIsSubActionDropdownOpen(!isSubActionDropdownOpen)
                    }
                    isOpen={isSubActionDropdownOpen}
                    disabled={!selectedActions || isReadOnly || isLoading}
                  >
                    {selectedSubActions.length === 0
                      ? "Choose Sub Actions..."
                      : selectedSubActions.length === 1
                      ? selectedSubActions[0]
                      : `${selectedSubActions.length} sub actions selected`}
                  </DropdownButton>

                  {isSubActionDropdownOpen &&
                    availableSubActions.length > 0 && (
                      <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto">
                        <div className="p-2">
                          {availableSubActions.map((subAction) => (
                            <label
                              key={`${subAction.parent_action}-${subAction.id}`}
                              className="flex items-start px-3 py-2 hover:bg-gray-50 cursor-pointer rounded-md transition-colors duration-150"
                            >
                              <input
                                type="checkbox"
                                checked={selectedSubActions.includes(
                                  subAction.id
                                )}
                                onChange={() =>
                                  handleSubActionToggle(subAction.id)
                                }
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mr-3 mt-0.5 flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <span className="text-sm text-gray-700 block truncate">
                                  {subAction.label}
                                </span>
                                {/* <div className="text-xs text-gray-500 truncate">
                                  {subAction.parent_action}
                                </div> */}
                              </div>
                              {selectedSubActions.includes(subAction.id) && (
                                <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                              )}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
                {selectedSubActions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedSubActions
                      .slice(0, 2)
                      .map((subActionName, index) => (
                        <Badge key={index} variant="orange" size="sm">
                          {subActionName}
                        </Badge>
                      ))}
                    {selectedSubActions.length > 2 && (
                      <Badge variant="orange" size="sm">
                        +{selectedSubActions.length - 2} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 ">
              <div className="flex-1" />
              <button
                onClick={resetForm}
                className="px-5 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Reset Form
              </button>
              <button
                onClick={submitPermission}
                disabled={
                  !selectedSuperAdminRole ||
                  selectedModules.length === 0 ||
                  !selectedActions ||
                  isReadOnly ||
                  isLoading
                }
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg font-medium"
              >
                {isLoading ? "Creating Mapping..." : "Create Role Mapping"}
              </button>
            </div>
          </div>
        </div>

        {/* Master Admin Role Permissions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 lg:px-6 py-4 border-b border-gray-200 bg-gray-50">
            {/* <h2 className="text-xl font-semibold text-gray-900">
              Master Admin Role Permissions
            </h2> */}
            <h3 className="text-xl font-semibold text-gray-900">
              Default Master roles available for assignment. 
              {/* Create dynamic roles using the form above. */}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 lg:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-3 lg:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-3 lg:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Module
                  </th>
                  <th className="px-3 lg:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                  <th className="px-3 lg:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sub Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMasterData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 lg:px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                       
                        <div className="text-gray-500 text-sm">
                          {searchTerm
                            // ? "No modules have been assigned to your user. Please contact the Master User for access."
                            ? "Once a module is assigned, you will be able to access the Master Admin role."
                             : "No modules have been assigned to your Account. Please contact the Master User for access."}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMasterData.map((roleData: any, index) => (
                    <tr
                      key={`master-${roleData.role_id}-${roleData.module_name}-${roleData.action_name}-${index}`}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                        {index + 1}
                      </td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                        <Badge variant="white">{roleData.role_name}</Badge>
                      </td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                        <Badge variant="white">{roleData.module_name}</Badge>
                      </td>
                      <td className="px-3 lg:px-6 py-4">
                        <div className="relative">
                          <button
                            data-dropdown-toggle
                            onClick={() =>
                              toggleDropdown(`master-${index}`, "actions")
                            }
                            className="inline-flex justify-between items-center min-w-[120px] px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150"
                          >
                            <span className="flex items-center">
                              <Badge variant="green" size="sm">
                                {roleData.actions.length}
                              </Badge>
                              <span className="text-sm ml-2">Actions</span>
                            </span>
                            <ChevronDown
                              size={16}
                              className={`ml-2 flex-shrink-0 transition-transform duration-200 ${
                                expandedDropdown?.id === `master-${index}` &&
                                expandedDropdown?.type === "actions"
                                  ? "transform rotate-180"
                                  : ""
                              }`}
                            />
                          </button>
                          {expandedDropdown?.id === `master-${index}` &&
                            expandedDropdown?.type === "actions" && (
                              <div
                                data-dropdown-content
                                className="absolute z-30 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200"
                              >
                                <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                                  <span className="text-sm font-semibold text-gray-900">
                                    Actions for {roleData.module_name} (
                                    {roleData.actions.length})
                                  </span>
                                </div>
                                <div className="p-3 max-h-60 overflow-y-auto">
                                  <div className="space-y-2">
                                    {roleData.actions.map(
                                      (action: any, actionIdx: number) => (
                                        <div
                                          key={actionIdx}
                                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                                        >
                                          <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                                          <div className="flex-1 min-w-0">
                                            <span className="text-sm font-medium text-gray-900 block">
                                              {action.action_name}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                              Sub Actions:{" "}
                                              {action.sub_actions.length}
                                            </span>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                        </div>
                      </td>

                      <td className="px-3 lg:px-6 py-4">
                        <div className="relative">
                          <button
                            data-dropdown-toggle
                            onClick={() =>
                              toggleDropdown(`master-${index}`, "subactions")
                            }
                            className="inline-flex justify-between items-center min-w-[140px] px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150"
                          >
                            <span className="flex items-center">
                              <Badge variant="orange" size="sm">
                                {roleData.actions.reduce(
                                  (total: number, action: any) =>
                                    total + action.sub_actions.length,
                                  0
                                )}
                              </Badge>
                              <span className="text-sm ml-2">Sub Actions</span>
                            </span>
                            <ChevronDown
                              size={16}
                              className={`ml-2 flex-shrink-0 transition-transform duration-200 ${
                                expandedDropdown?.id === `master-${index}` &&
                                expandedDropdown?.type === "subactions"
                                  ? "transform rotate-180"
                                  : ""
                              }`}
                            />
                          </button>
                          {expandedDropdown?.id === `master-${index}` &&
                            expandedDropdown?.type === "subactions" && (
                              <div
                                data-dropdown-content
                                className="absolute z-30 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200"
                              >
                                <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                                  <span className="text-sm font-semibold text-gray-900">
                                    All Sub Actions (
                                    {roleData.actions.reduce(
                                      (total: number, action: any) =>
                                        total + action.sub_actions.length,
                                      0
                                    )}
                                    )
                                  </span>
                                </div>
                                <div className="p-3 max-h-60 overflow-y-auto">
                                  <div className="space-y-3">
                                    {roleData.actions.map(
                                      (action: any, actionIdx: number) => (
                                        <div
                                          key={actionIdx}
                                          className="border-b border-gray-100 pb-2 last:border-b-0"
                                        >
                                          <div className="text-xs font-medium text-gray-600 mb-2">
                                            {action.action_name}
                                          </div>
                                          <div className="space-y-1">
                                            {action.sub_actions.map(
                                              (
                                                subAction: any,
                                                subIdx: number
                                              ) => (
                                                <div
                                                  key={subIdx}
                                                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                                                >
                                                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                                                  <div className="flex-1 min-w-0">
                                                    <span className="text-sm font-medium text-gray-900 block">
                                                      {
                                                        subAction.sub_action_name
                                                      }
                                                    </span>
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Super Admin Role Permissions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 lg:px-6 py-4 border-b border-gray-200 bg-gray-50">
            {/* <h2 className="text-xl font-semibold text-gray-900">
              Super Admin Role Permissions
            </h2> */}
            <h3 className="text-xl font-semibold text-gray-900">
              Custom role mappings 
              {/* created through the form above. */}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 lg:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-3 lg:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Super Admin Role
                  </th>
                  <th className="px-3 lg:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Module
                  </th>
                  <th className="px-3 lg:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                  <th className="px-3 lg:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sub Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSuperAdminData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 lg:px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                     
                        <div className="text-gray-500 text-sm">
                          {searchTerm
                            ? "No matching role permissions found."
                            : "No role permissions assigned yet. Use the form above to assign permissions to roles."}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSuperAdminData.map((roleData: any, index) => (
                    <tr
                      key={`super-${roleData.super_admin_role_name}-${roleData.module_name}-${index}`}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                        {index + 1}
                      </td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                        <Badge variant="white">
                          {roleData.super_admin_role_name}
                        </Badge>
                      </td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                        <Badge variant="white">{roleData.module_name}</Badge>
                      </td>
                      <td className="px-3 lg:px-6 py-4">
                        <div className="relative">
                          <button
                            data-dropdown-toggle
                            onClick={() =>
                              toggleDropdown(`super-${index}`, "actions")
                            }
                            className="inline-flex justify-between items-center min-w-[120px] px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150"
                          >
                            <span className="flex items-center">
                              <Badge variant="green" size="sm">
                                {roleData.actions.length}
                              </Badge>
                              <span className="text-sm ml-2">Actions</span>
                            </span>
                            <ChevronDown
                              size={16}
                              className={`ml-2 flex-shrink-0 transition-transform duration-200 ${
                                expandedDropdown?.id === `super-${index}` &&
                                expandedDropdown?.type === "actions"
                                  ? "transform rotate-180"
                                  : ""
                              }`}
                            />
                          </button>
                          {expandedDropdown?.id === `super-${index}` &&
                            expandedDropdown?.type === "actions" && (
                              <div
                                data-dropdown-content
                                className="absolute z-30 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200"
                              >
                                <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                                  <span className="text-sm font-semibold text-gray-900">
                                    Actions for {roleData.module_name} (
                                    {roleData.actions.length})
                                  </span>
                                </div>
                                <div className="p-3 max-h-60 overflow-y-auto">
                                  <div className="space-y-2">
                                    {roleData.actions.map(
                                      (action: any, actionIdx: number) => (
                                        <div
                                          key={actionIdx}
                                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                                        >
                                          <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                                          <div className="flex-1 min-w-0">
                                            <span className="text-sm font-medium text-gray-900 block">
                                              {action.action_name}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                              Sub Actions:{" "}
                                              {action.sub_actions.length}
                                            </span>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                        </div>
                      </td>

                      <td className="px-3 lg:px-6 py-4">
                        <div className="relative">
                          <button
                            data-dropdown-toggle
                            onClick={() =>
                              toggleDropdown(`super-${index}`, "subactions")
                            }
                            className="inline-flex justify-between items-center min-w-[140px] px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150"
                          >
                            <span className="flex items-center">
                              <Badge variant="orange" size="sm">
                                {roleData.actions.reduce(
                                  (total: number, action: any) =>
                                    total + action.sub_actions.length,
                                  0
                                )}
                              </Badge>
                              <span className="text-sm ml-2">Sub Actions</span>
                            </span>
                            <ChevronDown
                              size={16}
                              className={`ml-2 flex-shrink-0 transition-transform duration-200 ${
                                expandedDropdown?.id === `super-${index}` &&
                                expandedDropdown?.type === "subactions"
                                  ? "transform rotate-180"
                                  : ""
                              }`}
                            />
                          </button>
                          {expandedDropdown?.id === `super-${index}` &&
                            expandedDropdown?.type === "subactions" && (
                              <div
                                data-dropdown-content
                                className="absolute z-30 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200"
                              >
                                <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                                  <span className="text-sm font-semibold text-gray-900">
                                    All Sub Actions (
                                    {roleData.actions.reduce(
                                      (total: number, action: any) =>
                                        total + action.sub_actions.length,
                                      0
                                    )}
                                    )
                                  </span>
                                </div>
                                <div className="p-3 max-h-60 overflow-y-auto">
                                  <div className="space-y-3">
                                    {roleData.actions.map(
                                      (action: any, actionIdx: number) => (
                                        <div
                                          key={actionIdx}
                                          className="border-b border-gray-100 pb-2 last:border-b-0"
                                        >
                                          <div className="text-xs font-medium text-gray-600 mb-2">
                                            {action.action_name}
                                          </div>
                                          <div className="space-y-1">
                                            {action.sub_actions.map(
                                              (
                                                subAction: any,
                                                subIdx: number
                                              ) => (
                                                <div
                                                  key={subIdx}
                                                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                                                >
                                                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                                                  <div className="flex-1 min-w-0">
                                                    <span className="text-sm font-medium text-gray-900 block">
                                                      {
                                                        subAction.sub_action_name
                                                      }
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                      Action:{" "}
                                                      {action.action_name}
                                                    </span>
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Role"
          size="md"
        >
          <CreateRoleForm
            onSubmit={handleCreateRole}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={isCreatingRole}
            title="Create New Role"
            submitButtonText="Create Role"
          />
        </Modal>
      </div>
    </div>
  );
};

export default SuperRoleManagement;
