import React, { useRef, useEffect, useState } from "react";
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
  const dropdownRefs = useRef<Record<string, HTMLButtonElement>>({});
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    openUpward: boolean;
  }>({ left: 0, openUpward: false });

  // Calculate smart dropdown position
  const calculateDropdownPosition = (buttonElement: HTMLButtonElement) => {
    const buttonRect = buttonElement.getBoundingClientRect();
    const tableContainer = tableContainerRef.current;
    
    if (!tableContainer) return { left: 0, openUpward: false };
    
    const containerRect = tableContainer.getBoundingClientRect();
    const dropdownHeight = 350; // Approximate dropdown height
    const spaceBelow = containerRect.bottom - buttonRect.bottom;
    const spaceAbove = buttonRect.top - containerRect.top;
    
    // Calculate position relative to the table container
    const relativeLeft = buttonRect.left - containerRect.left;
    
    // Determine if dropdown should open upward
    const shouldOpenUpward = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;
    
    if (shouldOpenUpward) {
      return {
        bottom: containerRect.bottom - buttonRect.top + 8,
        left: relativeLeft,
        openUpward: true,
      };
    } else {
      return {
        top: buttonRect.bottom - containerRect.top + 8,
        left: relativeLeft,
        openUpward: false,
      };
    }
  };

  // Close dropdown on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (selectedRole) {
        toggleDropdown(-1, "module"); // Use invalid ID to close
      }
    };

    const tableContainer = tableContainerRef.current;
    if (tableContainer) {
      tableContainer.addEventListener('scroll', handleScroll);
      return () => tableContainer.removeEventListener('scroll', handleScroll);
    }
  }, [selectedRole, toggleDropdown]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedRole && tableContainerRef.current) {
        const target = event.target as Node;
        const isClickInsideTable = tableContainerRef.current.contains(target);
        
        // Check if click is on a dropdown button
        const isClickOnDropdownButton = Object.values(dropdownRefs.current).some(
          button => button && button.contains(target)
        );
        
        // If click is outside table or not on a dropdown button, close dropdown
        if (!isClickInsideTable || !isClickOnDropdownButton) {
          // Check if click is inside the dropdown itself
          const dropdownElement = document.querySelector('.dropdown-content');
          const isClickInsideDropdown = dropdownElement && dropdownElement.contains(target);
          
          if (!isClickInsideDropdown) {
            toggleDropdown(-1, "module");
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedRole, toggleDropdown]);

  // Enhanced toggle dropdown with position calculation
  const handleToggleDropdown = (roleId: number, type: "module" | "action") => {
    if (isReadOnly) return;
    
    const buttonKey = `${roleId}-${type}`;
    const buttonElement = dropdownRefs.current[buttonKey];
    
    if (buttonElement) {
      const position = calculateDropdownPosition(buttonElement);
      setDropdownPosition(position);
    }
    
    toggleDropdown(roleId, type);
  };

  return (
    <div 
      ref={tableContainerRef}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative"
    >
      <div className="overflow-x-auto">
        <div className="max-h-[70vh] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
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
                          ref={(el) => {
                            if (el) dropdownRefs.current[`${role.role_id}-module`] = el;
                          }}
                          onClick={() => handleToggleDropdown(role.role_id, "module")}
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
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          ref={(el) => {
                            if (el) dropdownRefs.current[`${role.role_id}-action`] = el;
                          }}
                          onClick={() => handleToggleDropdown(role.role_id, "action")}
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

      {/* Smart positioned dropdown for modules */}
      {!isReadOnly &&
        selectedRole &&
        selectedRole.type === "module" && (
          <div 
            className="dropdown-content absolute z-50 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 animate-fadeIn"
            style={{
              top: dropdownPosition.openUpward ? 'auto' : dropdownPosition.top,
              bottom: dropdownPosition.openUpward ? dropdownPosition.bottom : 'auto',
              left: dropdownPosition.left,
              maxWidth: 'calc(100vw - 2rem)',
            }}
          >
            <MultiSelectDropdown
              title="Modules"
              options={moduleOptions}
              selectedOptions={
                roleModules[selectedRole.id] || 
                [...new Set((groupedRoleMappings[currentRoles.find(r => r.role_id === selectedRole.id)?.role_name] || []).map((m) => m.module_name))]
              }
              onApply={(selected) =>
                handleApply(selectedRole.id, selected, "module")
              }
              onReset={() =>
                handleApply(selectedRole.id, [], "module")
              }
              onClose={() => toggleDropdown(-1, "module")}
            />
          </div>
        )}

      {/* Smart positioned dropdown for actions */}
      {!isReadOnly &&
        selectedRole &&
        selectedRole.type === "action" && (
          <div 
            className="dropdown-content absolute z-50 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 animate-fadeIn"
            style={{
              top: dropdownPosition.openUpward ? 'auto' : dropdownPosition.top,
              bottom: dropdownPosition.openUpward ? dropdownPosition.bottom : 'auto',
              left: dropdownPosition.left,
              maxWidth: 'calc(100vw - 2rem)',
            }}
          >
            <MultiSelectDropdown
              title="Actions"
              options={getActionOptionsForModules(
                roleModules[selectedRole.id] || 
                [...new Set((groupedRoleMappings[currentRoles.find(r => r.role_id === selectedRole.id)?.role_name] || []).map((m) => m.module_name))]
              )}
              selectedOptions={
                roleActions[selectedRole.id] || 
                [...new Set((groupedRoleMappings[currentRoles.find(r => r.role_id === selectedRole.id)?.role_name] || []).map((m) => m.action_name))]
              }
              onApply={(selected) =>
                handleApply(selectedRole.id, selected, "action")
              }
              onReset={() =>
                handleApply(selectedRole.id, [], "action")
              }
              onClose={() => toggleDropdown(-1, "action")}
            />
          </div>
        )}
    </div>
  );
};

export default RoleTable;