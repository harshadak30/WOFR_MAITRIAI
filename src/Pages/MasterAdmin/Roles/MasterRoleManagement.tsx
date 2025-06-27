

import React, { useState } from "react";
import { PlusCircle, Search } from "lucide-react";
import { useRoleManagement } from "../../../hooks/useRoleManagement";
import Buttons from "../../../component/common/Button/Buttons";
import MessageAlert from "../../../component/common/ui/MessageAlert";
import RoleTable from "../../../component/common/Role/RoleTable";
import Modal from "../../../component/common/ui/Modal";
import CreateRoleForm from "./CreateRoleForm";

const MasterRoleManagement: React.FC<{ isReadOnly: boolean }> = ({
  isReadOnly,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    message,
    setMessage,
    isCreatingRole,
    isLoading,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    currentRoles,
    roleModules,
    roleActions,
    selectedRole,
    setSelectedRole,
    handleApply,
    handleToggleChange,
    handleSaveSingleAssignment,
    handleCreateRole,
    moduleOptions,
    actionOptions,
    getActionOptionsForModules,
    groupedRoleMappings,
    validateSingleRoleSelection,
  } = useRoleManagement(isReadOnly);

  const filteredRoles = currentRoles.filter(
    (role) =>
      role.role_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (role.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  

  return (
    <div className="mx-auto bg-white shadow rounded-lg overflow-hidden transition-all duration-200">

      {message && (
        <MessageAlert
          message={message}
          onClose={() => setMessage("")}
          type={
            message.includes("failed") || message.includes("Please select both")
              ? "error"
              : "success"
          }
        />
      )}

      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="fles items-center">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {!isReadOnly && (
          <div className="flex space-x-3 items-center">
            <Buttons
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center transition-all duration-200 hover:scale-105"
            >
              <PlusCircle size={18} className="mr-2" />
              Create Role
            </Buttons>
          
          </div>
        )}
      </div>

      <RoleTable
        currentRoles={filteredRoles}
        indexOfFirstItem={(currentPage - 1) * itemsPerPage}
        roleModules={roleModules}
        roleActions={roleActions}
        selectedRole={selectedRole}
        moduleOptions={moduleOptions}
        actionOptions={actionOptions}
        getActionOptionsForModules={getActionOptionsForModules}
        isReadOnly={isReadOnly}
        isLoading={isLoading}
        toggleDropdown={(roleId, type) => {
          if (isReadOnly) return;
          setSelectedRole(
            selectedRole?.id === roleId && selectedRole?.type === type
              ? null
              : { id: roleId, type }
          );
        }}
        handleApply={handleApply}
        handleToggleChange={handleToggleChange}
        handleSaveSingleAssignment={handleSaveSingleAssignment}
        validateSingleRoleSelection={validateSingleRoleSelection}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        groupedRoleMappings={groupedRoleMappings}
      />

     
      <Modal
  isOpen={isCreateModalOpen}
  onClose={() => setIsCreateModalOpen(false)}
  title="Create New Role"
>
  <CreateRoleForm
    onSubmit={handleCreateRole} 
    onCancel={() => setIsCreateModalOpen(false)}
    isLoading={isCreatingRole}
    title="Create Master Role"
    submitButtonText="Create Role"
  />
</Modal>
    </div>
  );
};

export default MasterRoleManagement;