import React from "react";
import { ChevronDown, Save } from "lucide-react";
import TableHeader from "../ui/Table/TableHeader";
import MultiSelectDropdown from "../ui/MultiSelectDropdown";
import Toggle from "../ui/Toggle";
import Pagination from "../ui/Table/Pagination";

interface RoleTableProps {
  currentRoles: any[];
  indexOfFirstItem: number;
  roleModules: Record<number, string[]>;
  roleActions: Record<number, string[]>;
  selectedRole: { id: number; type: "module" | "action" } | null;
  moduleOptions: { id: string; label: string }[];
  actionOptions: { id: string; label: string }[];
  getActionOptionsForModules: (
    selectedModules: string[]
  ) => { id: string; label: string }[];
  isReadOnly: boolean;
  toggleDropdown: (roleId: number, type: "module" | "action") => void;
  handleApply: (
    roleId: number,
    selected: string[],
    type: "module" | "action"
  ) => void;
  handleToggleChange: (roleId: number) => void;
  handleSaveSingleAssignment: (roleId: number) => void;
  validateSingleRoleSelection: (roleId: number) => boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  groupedRoleMappings: Record<string, any[]>;
  isLoading: boolean;
}

const RoleTable: React.FC<RoleTableProps> = ({
  currentRoles,
  indexOfFirstItem,
  roleModules,
  roleActions,
  selectedRole,
  moduleOptions,
  getActionOptionsForModules,
  isReadOnly,
  toggleDropdown,
  handleApply,
  handleToggleChange,
  handleSaveSingleAssignment,
  validateSingleRoleSelection,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  groupedRoleMappings,
  isLoading,
}) => {
  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader className="w-16 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                #
              </TableHeader>
              <TableHeader className="min-w-[140px] text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Role
              </TableHeader>
              <TableHeader className="min-w-[160px] text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Description
              </TableHeader>
              <TableHeader className="min-w-[180px] text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Modules
              </TableHeader>
              <TableHeader className="min-w-[180px] text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Actions
              </TableHeader>
              <TableHeader className="w-20 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Status
              </TableHeader>
              <TableHeader className="w-24 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Actions
              </TableHeader>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRoles.map((role, index) => {
              const mappings = groupedRoleMappings[role.role_name] || [];
              const existingModules = [
                ...new Set(mappings.map((m) => m.module_name)),
              ];
              const existingActions = [
                ...new Set(mappings.map((m) => m.action_name)),
              ];

              const selectedModules =
                roleModules[role.role_id] || existingModules;
              const selectedActions =
                roleActions[role.role_id] || existingActions;

              const availableActions =
                getActionOptionsForModules(selectedModules);
              const hasValidSelection = validateSingleRoleSelection(
                role.role_id
              );

              return (
                <tr
                  key={role.role_id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-4 py-4 text-center text-sm font-medium text-gray-900">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {role.role_name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 truncate">
                      {role.description || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(role.role_id, "module")}
                        className={`inline-flex justify-between items-center w-full min-w-[160px] px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg shadow-sm transition-all duration-150 ${
                          isReadOnly
                            ? "opacity-70 cursor-not-allowed text-gray-500"
                            : "text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                        disabled={isReadOnly}
                      >
                        {selectedModules.length > 0 ? (
                          <span className="flex items-center">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2 py-1 rounded-full">
                              {selectedModules.length}
                            </span>
                            <span className="text-sm">Modules</span>
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">
                            Select Modules
                          </span>
                        )}
                        <ChevronDown
                          size={16}
                          className={`ml-2 transition-transform duration-200 ${
                            selectedRole?.id === role.role_id &&
                            selectedRole?.type === "module"
                              ? "transform rotate-180"
                              : ""
                          }`}
                        />
                      </button>
                      {selectedRole?.id === role.role_id &&
                        selectedRole?.type === "module" && (
                          <div className="absolute z-20 mt-1 w-80 animate-fadeIn">
                            <MultiSelectDropdown
                              title="Modules"
                              options={moduleOptions}
                              selectedOptions={selectedModules}
                              onApply={(selected) =>
                                handleApply(role.role_id, selected, "module")
                              }
                              onReset={() =>
                                handleApply(role.role_id, [], "module")
                              }
                            />
                          </div>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(role.role_id, "action")}
                        className={`inline-flex justify-between items-center w-full min-w-[160px] px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg shadow-sm transition-all duration-150 ${
                          isReadOnly || selectedModules.length === 0
                            ? "opacity-70 cursor-not-allowed text-gray-500"
                            : "text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                        disabled={isReadOnly || selectedModules.length === 0}
                        title={
                          selectedModules.length === 0
                            ? "Please select modules first"
                            : ""
                        }
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
                            {selectedModules.length === 0
                              ? "Select modules first"
                              : "Select Actions"}
                          </span>
                        )}
                        <ChevronDown
                          size={16}
                          className={`ml-2 transition-transform duration-200 ${
                            selectedRole?.id === role.role_id &&
                            selectedRole?.type === "action"
                              ? "transform rotate-180"
                              : ""
                          }`}
                        />
                      </button>
                      {selectedRole?.id === role.role_id &&
                        selectedRole?.type === "action" &&
                        selectedModules.length > 0 && (
                          <div className="absolute z-20 mt-1 w-80 animate-fadeIn">
                            <MultiSelectDropdown
                              title="Actions"
                              options={availableActions}
                              selectedOptions={selectedActions}
                              onApply={(selected) =>
                                handleApply(role.role_id, selected, "action")
                              }
                              onReset={() =>
                                handleApply(role.role_id, [], "action")
                              }
                            />
                          </div>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Toggle
                      enabled={role.enabled}
                      onChange={() => handleToggleChange(role.role_id)}
                      className={
                        isReadOnly ? "opacity-50 cursor-not-allowed" : ""
                      }
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    {!isReadOnly && (
                      <button
                        onClick={() => handleSaveSingleAssignment(role.role_id)}
                        disabled={!hasValidSelection || isLoading}
                        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                          hasValidSelection && !isLoading
                            ? "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70"
                        }`}
                        title={
                          !hasValidSelection
                            ? "Please select both modules and actions"
                            : "Save assignments for this role"
                        }
                      >
                        <Save size={14} className="mr-1" />
                        Assign
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}

            {currentRoles.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-600 mr-3"></div>
                        <span className="text-sm">Loading roles...</span>
                      </div>
                    ) : (
                      <span className="text-sm">No roles found</span>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-gray-200">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default RoleTable;
