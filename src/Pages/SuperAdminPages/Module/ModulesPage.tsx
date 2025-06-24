
import React, { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import TableHeader from "../../../component/common/ui/Table/TableHeader";
import Toggle from "../../../component/common/ui/Toggle";
import Pagination from "../../../component/common/ui/Table/Pagination";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";
import axios from "../../../helper/axios";

type Assignment = {
  user_id: string;
  tenant_id: string | null;
  tenant_name: string | null;
  module_id: number;
  module_name: string;
  assigned_by: number;
  assignment_date: string;
  total_screen: number;
  module_data: Array<{
    actions: any;
    screen_id: number;
    action_id: number;
    action_name: string;
    role_id: number;
    role_name: string;
    status: string;
    all_sub_actions: Array<{
      sub_action_id: number;
      sub_action_name: string;
    }>;
  }>;
};

type ModuleView = {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  tenant_name: string | null;
  assignment_date: string;
  total_screens: number;
};

const ModulesPage: React.FC = () => {
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
  const itemsPerPage = 10;

  const { authState } = useAuth();
  const token = authState.token;

  // Configure axios defaults
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  axios.defaults.headers.common["accept"] = "application/json";

  const fetchModules = async (page: number, limit: number, search?: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = await axios.get(
        `api/v1/assigned-user-role-module-actions?${params}`
      );

      if (response.data.success) {
        const assignments: Assignment[] = response.data.data.assignments;
        const moduleMap = new Map<number, ModuleView>();
        const rolesMap: Record<number, Set<string>> = {};
        const actionsMap: Record<number, Set<string>> = {};

        assignments.forEach((assignment) => {
          // Use only module_id as key to group all assignments for the same module
          if (!moduleMap.has(assignment.module_id)) {
            moduleMap.set(assignment.module_id, {
              id: assignment.module_id,
              name: assignment.module_name,
              description: `${assignment.module_name} Module`,
              enabled: true,
              tenant_name: null, // Will be set to show multiple tenants if applicable
              assignment_date: assignment.assignment_date,
              total_screens: assignment.total_screen,
            });
            rolesMap[assignment.module_id] = new Set();
            actionsMap[assignment.module_id] = new Set();
          } else {
            // Update total screens to maximum value if multiple assignments
            const existingModule = moduleMap.get(assignment.module_id)!;
            existingModule.total_screens = Math.max(
              existingModule.total_screens,
              assignment.total_screen
            );

            // Update assignment date to most recent
            if (
              new Date(assignment.assignment_date) >
              new Date(existingModule.assignment_date)
            ) {
              existingModule.assignment_date = assignment.assignment_date;
            }
          }

          // Collect unique roles and actions for this module across all assignments
          assignment.module_data.forEach((moduleData) => {
            rolesMap[assignment.module_id].add(moduleData.role_name);

            moduleData.actions.forEach((action: { action_name: string }) => {
              actionsMap[assignment.module_id].add(action.action_name);
            });
          });
        });

        // Convert Sets to Arrays
        const finalRolesMap: Record<number, string[]> = {};
        const finalActionsMap: Record<number, string[]> = {};

        Object.keys(rolesMap).forEach((moduleId) => {
          const id = parseInt(moduleId);
          finalRolesMap[id] = Array.from(rolesMap[id]);
          finalActionsMap[id] = Array.from(actionsMap[id]);
        });

        setModules(Array.from(moduleMap.values()));
        setModuleSelectedRoles(finalRolesMap);
        setModuleSelectedActions(finalActionsMap);
        setTotalItems(response.data.data.total || moduleMap.size);
      }
    } catch (error) {
      console.error("Error fetching assigned modules:", error);
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
      // TODO: Replace with actual API endpoint when available
      // const response = await axios.patch(`api/v1/assigned-modules-status/${moduleId}`);
      
      // For now, just update the state
      setModules((prev) =>
        prev.map((mod) =>
          mod.id === moduleId ? { ...mod, enabled: !mod.enabled } : mod
        )
      );

      toast.success(
        `Module status updated successfully`
      );
      

    } catch (error) {
      console.error("Error toggling module status:", error);
      toast.error("Failed to toggle module status");
    } finally {
      setToggleLoading(null);
    }
  };

  const toggleDropdown = (moduleId: number, type: "action" | "role") => {
    setExpandedDropdown(
      expandedDropdown?.id === moduleId && expandedDropdown?.type === type
        ? null
        : { id: moduleId, type }
    );
  };

  return (
    <div className=" p-4 lg:p-6">
      <div className=" mx-auto space-y-6">
        {/* Search Header */}
        <div className=" rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="relative w-full lg:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-sm text-gray-600 font-medium">
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
                  <TableHeader className="w-16 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    #
                  </TableHeader>
                  <TableHeader className="min-w-[140px] text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Module
                  </TableHeader>
                  <TableHeader className="min-w-[160px] text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Description
                  </TableHeader>
                  <TableHeader className="min-w-[180px] text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Actions
                  </TableHeader>
                  <TableHeader className="min-w-[180px] text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Roles
                  </TableHeader>
                  <TableHeader className="w-20 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
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
                      <td className="px-4 py-4 text-center text-sm font-medium text-gray-900">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900 truncate">
                          {module.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 truncate">
                          {module.description || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <button
                            onClick={() => toggleDropdown(module.id, "action")}
                            className="inline-flex justify-between items-center w-full min-w-[160px] px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150"
                          >
                            {selectedActions.length > 0 ? (
                              <span className="flex items-center">
                                <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2 py-1 rounded-full">
                                  {selectedActions.length}
                                </span>
                                <span className="text-sm">Actions</span>
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500">
                                Select Actions
                              </span>
                            )}
                            <ChevronDown
                              size={16}
                              className={`ml-2 transition-transform duration-200 ${
                                expandedDropdown?.id === module.id &&
                                expandedDropdown?.type === "action"
                                  ? "transform rotate-180"
                                  : ""
                              }`}
                            />
                          </button>
                          {expandedDropdown?.id === module.id &&
                            expandedDropdown?.type === "action" && (
                              <div className="absolute z-20 mt-1 w-80 bg-white rounded-lg shadow-xl border border-gray-200 animate-fadeIn">
                                <div className="p-4 border-b border-gray-100">
                                  <span className="text-sm font-semibold text-gray-900">
                                    Actions ({selectedActions.length})
                                  </span>
                                </div>
                                <div className="p-2 max-h-60 overflow-y-auto">
                                  {selectedActions.length > 0 ? (
                                    selectedActions.map((action, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50"
                                      >
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span className="text-sm text-gray-700">
                                          {action}
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="p-3 text-sm text-gray-500 text-center">
                                      No actions assigned
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <button
                            onClick={() => toggleDropdown(module.id, "role")}
                            className="inline-flex justify-between items-center w-full min-w-[160px] px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150"
                          >
                            {selectedRoles.length > 0 ? (
                              <span className="flex items-center">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2 py-1 rounded-full">
                                  {selectedRoles.length}
                                </span>
                                <span className="text-sm">Roles</span>
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500">
                                Select Roles
                              </span>
                            )}
                            <ChevronDown
                              size={16}
                              className={`ml-2 transition-transform duration-200 ${
                                expandedDropdown?.id === module.id &&
                                expandedDropdown?.type === "role"
                                  ? "transform rotate-180"
                                  : ""
                              }`}
                            />
                          </button>
                          {expandedDropdown?.id === module.id &&
                            expandedDropdown?.type === "role" && (
                              <div className="absolute z-20 mt-1 w-80 bg-white rounded-lg shadow-xl border border-gray-200 animate-fadeIn">
                                <div className="p-4 border-b border-gray-100">
                                  <span className="text-sm font-semibold text-gray-900">
                                    Roles ({selectedRoles.length})
                                  </span>
                                </div>
                                <div className="p-2 max-h-60 overflow-y-auto">
                                  {selectedRoles.length > 0 ? (
                                    selectedRoles.map((role, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50"
                                      >
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <span className="text-sm text-gray-700">
                                          {role}
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="p-3 text-sm text-gray-500 text-center">
                                      No roles assigned
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="relative inline-block">
                          <Toggle
                            enabled={module.enabled}
                            onChange={() => handleToggleChange(module.id)}
                          />
                          {toggleLoading === module.id && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-200 border-t-blue-600"></div>
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
    </div>
  );
};

export default ModulesPage;