import React, { useState } from "react";
import UserDetail from "./UserDetail";
import SuperUserManagement from "../SuperUserManagement";

interface UserManagementWrapperProps {
  isReadOnly: boolean;
  searchTerm?: string;
}

const UserManagementWrapper: React.FC<UserManagementWrapperProps> = ({
  isReadOnly,
  searchTerm = "",
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleBackToList = () => {
    setSelectedUserId(null);
  };

  if (selectedUserId) {
    return (
      <UserDetail
        userId={selectedUserId}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <SuperUserManagement
      isReadOnly={isReadOnly}
      searchTerm={searchTerm}
      onUserSelect={handleUserSelect}
    />
  );
};

export default UserManagementWrapper;