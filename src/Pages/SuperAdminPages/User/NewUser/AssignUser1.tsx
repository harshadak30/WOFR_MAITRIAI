import React, { useEffect, useState } from "react";
import { ChevronDown, X, User, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../../../hooks/useAuth";
import axios from "../../../../helper/axios";

interface Role {
  role_id: number;
  role_name: string;
  description: string;
  status: string;
  created_by: string;
  created_at: string;
}

interface AssignUserProps {
  user: any;
  module?: string;
  onClose: () => void;
}

interface APIResponse {
  success: boolean;
  data: {
    roles: Role[];
  };
  meta: null;
}

const MultiSelectDropdown = ({
  label,
  selectedValues,
  options,
  onChange,
  placeholder,
  disabled = false,
}: {
  label: string;
  selectedValues: string[];
  options: { id: string; name: string }[];
  onChange: (values: string[]) => void;
  placeholder: string;
  disabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOptions = options.filter(opt => selectedValues.includes(opt.id));

  const handleToggleOption = (optionId: string) => {
    const newValues = selectedValues.includes(optionId)
      ? selectedValues.filter(id => id !== optionId)
      : [...selectedValues, optionId];
    onChange(newValues);
  };

  const getDisplayText = () => {
    if (selectedOptions.length === 0) return placeholder;
    if (selectedOptions.length === 1) return selectedOptions[0].name;
    return `${selectedOptions.length} roles selected`;
  };

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full px-3 py-2 text-left bg-white border rounded-lg text-sm transition-colors ${
            disabled
              ? "bg-gray-50 border-gray-200 cursor-not-allowed text-gray-400"
              : isOpen
              ? "border-blue-500"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={selectedOptions.length > 0 ? "text-gray-900" : "text-gray-500"}>
              {getDisplayText()}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg">
            <div className="max-h-48 overflow-y-auto">
              {options.length === 0 ? (
                <div className="px-3 py-2 text-gray-500 text-sm text-center">
                  No options available
                </div>
              ) : (
                <div className="py-1">
                  {options.map((option) => {
                    const isSelected = selectedValues.includes(option.id);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleToggleOption(option.id)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none flex items-center justify-between"
                      >
                        <span>{option.name}</span>
                        {isSelected && (
                          <Check className="h-4 w-4 text-blue-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Selected roles display */}
      {selectedOptions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <span
              key={option.id}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {option.name}
              <button
                type="button"
                onClick={() => handleToggleOption(option.id)}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const AssignUser1: React.FC<AssignUserProps> = ({ user, onClose }) => {
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [allRoles, setAllRoles] = useState<Role[]>([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuth();
  const token = authState.token;
  const userType = authState.user_type;

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get<APIResponse>(
          `api/v1/user-assignment-roles`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        

        if (response.data.success && response.data.data.roles) {
          setAllRoles(response.data.data.roles);
        } else {
          setError("No roles found in response");
        }
      } catch (err) {
        console.error("Error fetching roles:", err);
        setError("Failed to fetch user roles");
      } finally {
        setLoading(false);
      }
    };

    if (userType === "super_admin") {
      fetchRoles();
    }
  }, [userType, token]);

  const handleRoleChange = (roleIds: string[]) => {
    setSelectedRoleIds(roleIds);
  };

  const handleSaveAssignments = async () => {
    if (selectedRoleIds.length === 0) {
      toast.error("Please select at least one role");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        tenant_user_id: user.tenant_user_id,
        role_id: selectedRoleIds.map(id => parseInt(id)),
      };


      await axios.post("api/v1/assign-tenant-user-screen", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      toast.success("User roles assigned successfully!");
      window.location.reload();
      onClose();
    } catch (err: any) {
      console.error("Error saving assignments:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to assign roles";
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  // Convert roles to dropdown options format
  const roleOptions = allRoles.map((role) => ({
    id: role.role_id.toString(),
    name: role.role_name,
  }));

 

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-xl flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-gray-700">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-xl max-w-md">
          <div className="text-red-600 mb-4 text-center">{error}</div>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl flex flex-col">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">
            Assign User Roles
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* User Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-gray-600" />
              <span className="font-medium text-gray-900">{user.name}</span>
            </div>
            <div className="text-sm text-gray-600 grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>Email: {user.email}</div>
              <div>Tenant: {user.tenant_name}</div>
              <div>ID: {user.tenant_user_id}</div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <MultiSelectDropdown
              label="Select Roles"
              selectedValues={selectedRoleIds}
              options={roleOptions}
              onChange={handleRoleChange}
              placeholder="Choose roles to assign"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3 flex-shrink-0">
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={handleSaveAssignments}
            disabled={saving || selectedRoleIds.length === 0}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Assigning...
              </>
            ) : (
              `Assign ${selectedRoleIds.length} Role${selectedRoleIds.length !== 1 ? 's' : ''}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignUser1;