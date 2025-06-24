

// import { useEffect, useMemo, useState } from "react";
// import axios from "../helper/axios";
// import { useAuth } from "./useAuth";

// interface Role {
//   role_id: number;
//   role_name: string;
//   description?: string;
//   status?: string;
//   enabled: boolean;
// }

// interface ModuleActionPair {
//   module_action_pair_id: number;
//   module_id: number;
//   module_name: string;
//   action_id: number;
//   action_name: string;
// }

// interface RoleMapping {
//   role_name: string;
//   module_name: string;
//   action_name: string;
//   status: string;
//   assignment_date: string;
// }

// export const useRoleManagement = (isReadOnly: boolean) => {
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [moduleActionPairs, setModuleActionPairs] = useState<
//     ModuleActionPair[]
//   >([]);
//   const [roleMappings, setRoleMappings] = useState<RoleMapping[]>([]);
//   const [roleModules, setRoleModules] = useState<Record<number, string[]>>({});
//   const [roleActions, setRoleActions] = useState<Record<number, string[]>>({});
//   const [selectedRole, setSelectedRole] = useState<{
//     id: number;
//     type: "module" | "action";
//   } | null>(null);
//   const [message, setMessage] = useState("");
//   const [isCreatingRole, setIsCreatingRole] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [totalItems, setTotalItems] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);

//   const [currentRoles, setCurrentRoles] = useState<Role[]>([]);
//   const { authState } = useAuth();

//   const getAuthHeaders = () => {
//      const token = authState.token;
//     return {
//       Authorization: `Bearer ${token}`,
//       Accept: "application/json",
//     };
//   };

//   const fetchRoles = async (page: number = currentPage, limit: number = 100) => {
//     setIsLoading(true);
//     try {
//       const { data } = await axios.get(`/api/v1/roles?page=${page}&limit=${limit}`, {
//         headers: getAuthHeaders(),
//       });

      
//       const rolesData = data.data.roles.map((r: any) => ({
//         ...r,
//         enabled: r.status === "active",
//       }));
      
//       setRoles(rolesData);
//       setCurrentRoles(rolesData);
//       setTotalItems(data.data.pagination?.total || rolesData.length);
//       setTotalPages(data.data.pagination?.totalPages || Math.ceil((data.data.pagination?.total || rolesData.length) / limit));
//     } catch (error) {
//       console.error("Failed to fetch roles:", error);
//       setMessage("Failed to fetch roles.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchModuleActionPairs = async (page: number = 1, limit: number = 100) => {
//     try {
//       const { data } = await axios.get(
//         `/api/v1/module-action-pair?page=${page}&limit=${limit}`,
//         {
//           headers: { Accept: "application/json" },
//         }
//       );
      
//       setModuleActionPairs(data.data.module_action_pairs);
//     } catch (error) {
//       console.error("Failed to fetch module-action pairs:", error);
//     }
//   };

//   const fetchRoleMappings = async (page: number = 1, limit: number = 100) => {
//     try {
//       const { data } = await axios.get(
//         `/api/v1/mapped-module-actions-roles?page=${page}&limit=${limit}&order=asc`,
//         {
//           headers: { Accept: "application/json" },
//         }
//       );

//       console.log("fetchrolemapping", data);
      
//       setRoleMappings(data.data.modules);
//     } catch (error) {
//       console.error("Failed to fetch role mappings:", error);
//     }
//   };

//   useEffect(() => {
//     fetchRoles(currentPage, itemsPerPage);
//   }, [currentPage, itemsPerPage]);

//   useEffect(() => {
//     fetchModuleActionPairs();
//     fetchRoleMappings();

//     const interval = setInterval(() => fetchRoleMappings(), 10000);
//     return () => clearInterval(interval);
//   }, []);

//   const moduleOptions = useMemo(() => {
//     const seen = new Set();
//     return moduleActionPairs
//       .filter(
//         ({ module_name }) => !seen.has(module_name) && seen.add(module_name)
//       )
//       .map(({ module_name }) => ({
//         id: module_name,
//         label: module_name,
//       }));
//   }, [moduleActionPairs]);

//   const getActionOptionsForModules = (selectedModules: string[]) => {
//     if (!selectedModules || selectedModules.length === 0) return [];
    
//     const seen = new Set();
//     return moduleActionPairs
//       .filter(({ module_name, action_name }) => 
//         selectedModules.includes(module_name) && 
//         !seen.has(action_name) && 
//         seen.add(action_name)
//       )
//       .map(({ action_name }) => ({
//         id: action_name,
//         label: action_name,
//       }));
//   };

//   const actionOptions = useMemo(() => {
//     const seen = new Set();
//     return moduleActionPairs
//       .filter(
//         ({ action_name }) => !seen.has(action_name) && seen.add(action_name)
//       )
//       .map(({ action_name }) => ({
//         id: action_name,
//         label: action_name,
//       }));
//   }, [moduleActionPairs]);

//   const groupedRoleMappings = useMemo(() => {
//     return roleMappings.reduce((acc, item) => {
//       if (!acc[item.role_name]) acc[item.role_name] = [];
//       acc[item.role_name].push(item);
//       return acc;
//     }, {} as Record<string, RoleMapping[]>);
//   }, [roleMappings]);

//   const handleToggleChange = (roleId: number) => {
//     if (isReadOnly) return;
//     setRoles((prev) =>
//       prev.map((r) =>
//         r.role_id === roleId ? { ...r, enabled: !r.enabled } : r
//       )
//     );
//     setCurrentRoles((prev) =>
//       prev.map((r) =>
//         r.role_id === roleId ? { ...r, enabled: !r.enabled } : r
//       )
//     );
//   };

//   const handleApply = (
//     roleId: number,
//     selected: string[],
//     type: "module" | "action"
//   ) => {
//     if (type === "module") {
//       setRoleModules((prev) => ({ ...prev, [roleId]: selected }));
//       // Clear actions when modules change
//       setRoleActions((prev) => ({ ...prev, [roleId]: [] }));
//     } else {
//       setRoleActions((prev) => ({ ...prev, [roleId]: selected }));
//     }
//     setSelectedRole(null);
//   };

//   const validateSingleRoleSelection = (roleId: number) => {
//     const modules = roleModules[roleId]?.length ?? 0;
//     const actions = roleActions[roleId]?.length ?? 0;
//     return modules > 0 && actions > 0;
//   };

//   const handleSaveAssignments = async () => {
//     const selectedIds = [
//       ...new Set([...Object.keys(roleModules), ...Object.keys(roleActions)]),
//     ].map(Number);

//     const invalid = selectedIds.filter((id) => !validateSingleRoleSelection(id));

//     if (invalid.length > 0) {
//       const names = roles
//         .filter((r) => invalid.includes(r.role_id))
//         .map((r) => r.role_name)
//         .join(", ");
//       setMessage(`Please select both modules and actions for: ${names}`);
//       return;
//     }

//     const assignments = Object.entries(roleActions).map(
//       ([roleId, actionNames]) => {
//         const selectedModules = roleModules[parseInt(roleId)] || [];
        
//         // Filter module-action pairs by BOTH selected modules AND selected actions
//         const moduleActionIds = moduleActionPairs
//           .filter((pair) => 
//             actionNames.includes(pair.action_name) && 
//             selectedModules.includes(pair.module_name)
//           )
//           .map((pair) => pair.module_action_pair_id);

//         return {
//           role_id: [parseInt(roleId)],
//           module_action_pair_ids: moduleActionIds,
//           status: "active",
//         };
//       }
//     );

//     try {
//       setIsLoading(true);
//       await axios.post(
//         "/api/v1/mapping-module-actions-roles",
//         { assignments },
//         {
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setMessage(
//         `Assigned to roles: ${assignments.map((a) => a.role_id[0]).join(", ")}`
//       );
//       fetchRoleMappings();
//       setRoleModules({});
//       setRoleActions({});
//     } catch (error) {
//       console.error("Assignment failed:", error);
//       setMessage("Assignment failed.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSaveSingleAssignment = async (roleId: number) => {
//     if (!validateSingleRoleSelection(roleId)) {
//       const roleName = roles.find(r => r.role_id === roleId)?.role_name || roleId.toString();
//       setMessage(`Please select both modules and actions for: ${roleName}`);
//       return;
//     }

//     const actionNames = roleActions[roleId] || [];
//     const selectedModules = roleModules[roleId] || [];
    
//     // Filter module-action pairs by BOTH selected modules AND selected actions
//     const moduleActionIds = moduleActionPairs
//       .filter((pair) => 
//         actionNames.includes(pair.action_name) && 
//         selectedModules.includes(pair.module_name)
//       )
//       .map((pair) => pair.module_action_pair_id);

//     const assignment = {
//       role_id: [roleId],
//       module_action_pair_ids: moduleActionIds,
//       status: "active",
//     };

//     try {
//       setIsLoading(true);
//       await axios.post(
//         "/api/v1/mapping-module-actions-roles",
//         { assignments: [assignment] },
//         {
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const roleName = roles.find(r => r.role_id === roleId)?.role_name || roleId.toString();
//       setMessage(`Successfully assigned to role: ${roleName}`);
//       fetchRoleMappings();
      
//       // Clear selections for this role
//       setRoleModules(prev => {
//         const newState = { ...prev };
//         delete newState[roleId];
//         return newState;
//       });
//       setRoleActions(prev => {
//         const newState = { ...prev };
//         delete newState[roleId];
//         return newState;
//       });
//     } catch (error) {
//       console.error("Assignment failed:", error);
//       setMessage("Assignment failed.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

  

//   const handleCreateRoleForSuperAdmin = async (roleData: {
//     role_name: string;
//     description: string;
//     status: string;
//   }) => {
//     setIsCreatingRole(true);
//     try {
//       const { data } = await axios.post("/api/v1/roles", roleData, {
//         headers: {
//           ...getAuthHeaders(),
//           "Content-Type": "application/json",
//         },
//       });

//       const newRole = data.data.role;
      
//       setRoles((prev) => [
//         ...prev,
//         { ...newRole, enabled: newRole.status === "active" },
//       ]);
//       setMessage(`Role "${roleData.role_name}" created successfully`);
      
//       // Refresh the current page data
//       fetchRoles(currentPage, itemsPerPage);
      
//       return true;
//     } catch (error: any) {
//       console.error("Failed to create role:", error);
//       setMessage(
//         `Failed to create role: ${
//           error?.response?.data?.meta?.message || "Unknown error"
//         }`
//       );
//       return false;
//     } finally {
//       setIsCreatingRole(false);
//     }
//   };


//   const handleCreateRole = async (roleData: {
//     role_name: string;
//     description: string;
//     status: string;
//   }) => {
//     setIsCreatingRole(true);
//     try {
//       const { data } = await axios.post("/api/v1/roles", roleData, {
//         headers: {
//           ...getAuthHeaders(),
//           "Content-Type": "application/json",
//         },
//       });

//       const newRole = data.data.role;
      
//       setRoles((prev) => [
//         ...prev,
//         { ...newRole, enabled: newRole.status === "active" },
//       ]);
//       setMessage(`Role "${roleData.role_name}" created successfully`);
      
//       // Refresh the current page data
//       fetchRoles(currentPage, itemsPerPage);
      
//       return true;
//     } catch (error: any) {
//       console.error("Failed to create role:", error);
//       setMessage(
//         `Failed to create role: ${
//           error?.response?.data?.meta?.message || "Unknown error"
//         }`
//       );
//       return false;
//     } finally {
//       setIsCreatingRole(false);
//     }
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const handleItemsPerPageChange = (newItemsPerPage: number) => {
//     setItemsPerPage(newItemsPerPage);
//     setCurrentPage(1); // Reset to first page when changing items per page
//   };

//   return {
//     roles,
//     moduleActionPairs,
//     roleMappings,
//     message,
//     setMessage,
//     isCreatingRole,
//     isLoading,
//     currentPage,
//     setCurrentPage: handlePageChange,
//     itemsPerPage,
//     setItemsPerPage: handleItemsPerPageChange,
//     totalItems,
//     totalPages,
//     currentRoles,
//     roleModules,
//     roleActions,
//     selectedRole,
//     setSelectedRole,
//     handleApply,
//     handleToggleChange,
//     handleSaveAssignments,
//     handleSaveSingleAssignment,
//     handleCreateRole,
//     handleCreateRoleForSuperAdmin,
//     fetchRoles,
//     fetchRoleMappings,
//     groupedRoleMappings,
//     moduleOptions,
//     actionOptions,
//     getActionOptionsForModules,
//     validateSingleRoleSelection,
//   };
// };

import { useEffect, useMemo, useState } from "react";
import axios from "../helper/axios";
import { useAuth } from "./useAuth";

interface Role {
  role_id: number;
  role_name: string;
  description?: string;
  status?: string;
  enabled: boolean;
}

interface ModuleActionPair {
  module_action_pair_id: number;
  module_id: number;
  module_name: string;
  action_id: number;
  action_name: string;
}

interface RoleMapping {
  role_name: string;
  module_name: string;
  action_name: string;
  status: string;
  assignment_date: string;
}

export const useRoleManagement = (isReadOnly: boolean) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [moduleActionPairs, setModuleActionPairs] = useState<
    ModuleActionPair[]
  >([]);
  const [roleMappings, setRoleMappings] = useState<RoleMapping[]>([]);
  const [roleModules, setRoleModules] = useState<Record<number, string[]>>({});
  const [roleActions, setRoleActions] = useState<Record<number, string[]>>({});
  const [selectedRole, setSelectedRole] = useState<{
    id: number;
    type: "module" | "action";
  } | null>(null);
  const [message, setMessage] = useState("");
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [currentRoles, setCurrentRoles] = useState<Role[]>([]);
  const { authState } = useAuth();

  const getAuthHeaders = () => {
     const token = authState.token;
    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };
  };

  const fetchRoles = async (page: number = currentPage, limit: number = itemsPerPage) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/api/v1/roles?page=${page}&limit=${limit}`, {
        headers: getAuthHeaders(),
      });

console.log( data , "roles");

      const rolesData = data.data.roles.map((r: any) => ({
        ...r,
        enabled: r.status === "active",
      }));
      
      setRoles(rolesData);
      setCurrentRoles(rolesData);
      setTotalItems(data.meta.total_items || rolesData.length);
      setTotalPages(data.meta.total_pages || Math.ceil((data.meta.total_items || rolesData.length) / limit));
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      setMessage("Failed to fetch roles.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchModuleActionPairs = async (page: number = 1, limit: number = 100) => {
    try {
      const { data } = await axios.get(
        `/api/v1/module-action-pair?page=${page}&limit=${limit}`,
        {
          headers: { Accept: "application/json" },
        }
      );
      
      setModuleActionPairs(data.data.module_action_pairs);
    } catch (error) {
      console.error("Failed to fetch module-action pairs:", error);
    }
  };

  const fetchRoleMappings = async (page: number = 1, limit: number = 100) => {
    try {
      const { data } = await axios.get(
        `/api/v1/mapped-module-actions-roles?page=${page}&limit=${limit}&order=asc`,
        {
          headers: { Accept: "application/json" },
        }
      );

      console.log("fetchrolemapping", data);
      
      setRoleMappings(data.data.modules);
    } catch (error) {
      console.error("Failed to fetch role mappings:", error);
    }
  };

  useEffect(() => {
    fetchRoles(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchModuleActionPairs();
    fetchRoleMappings();

    const interval = setInterval(() => fetchRoleMappings(), 10000);
    return () => clearInterval(interval);
  }, []);

  const moduleOptions = useMemo(() => {
    const seen = new Set();
    return moduleActionPairs
      .filter(
        ({ module_name }) => !seen.has(module_name) && seen.add(module_name)
      )
      .map(({ module_name }) => ({
        id: module_name,
        label: module_name,
      }));
  }, [moduleActionPairs]);

  const getActionOptionsForModules = (selectedModules: string[]) => {
    if (!selectedModules || selectedModules.length === 0) return [];
    
    const seen = new Set();
    return moduleActionPairs
      .filter(({ module_name, action_name }) => 
        selectedModules.includes(module_name) && 
        !seen.has(action_name) && 
        seen.add(action_name)
      )
      .map(({ action_name }) => ({
        id: action_name,
        label: action_name,
      }));
  };

  const actionOptions = useMemo(() => {
    const seen = new Set();
    return moduleActionPairs
      .filter(
        ({ action_name }) => !seen.has(action_name) && seen.add(action_name)
      )
      .map(({ action_name }) => ({
        id: action_name,
        label: action_name,
      }));
  }, [moduleActionPairs]);

  const groupedRoleMappings = useMemo(() => {
    return roleMappings.reduce((acc, item) => {
      if (!acc[item.role_name]) acc[item.role_name] = [];
      acc[item.role_name].push(item);
      return acc;
    }, {} as Record<string, RoleMapping[]>);
  }, [roleMappings]);

  const handleToggleChange = (roleId: number) => {
    if (isReadOnly) return;
    setRoles((prev) =>
      prev.map((r) =>
        r.role_id === roleId ? { ...r, enabled: !r.enabled } : r
      )
    );
    setCurrentRoles((prev) =>
      prev.map((r) =>
        r.role_id === roleId ? { ...r, enabled: !r.enabled } : r
      )
    );
  };

  const handleApply = (
    roleId: number,
    selected: string[],
    type: "module" | "action"
  ) => {
    if (type === "module") {
      setRoleModules((prev) => ({ ...prev, [roleId]: selected }));
      // Clear actions when modules change
      setRoleActions((prev) => ({ ...prev, [roleId]: [] }));
    } else {
      setRoleActions((prev) => ({ ...prev, [roleId]: selected }));
    }
    setSelectedRole(null);
  };

  const validateSingleRoleSelection = (roleId: number) => {
    const modules = roleModules[roleId]?.length ?? 0;
    const actions = roleActions[roleId]?.length ?? 0;
    return modules > 0 && actions > 0;
  };

  const handleSaveAssignments = async () => {
    const selectedIds = [
      ...new Set([...Object.keys(roleModules), ...Object.keys(roleActions)]),
    ].map(Number);

    const invalid = selectedIds.filter((id) => !validateSingleRoleSelection(id));

    if (invalid.length > 0) {
      const names = roles
        .filter((r) => invalid.includes(r.role_id))
        .map((r) => r.role_name)
        .join(", ");
      setMessage(`Please select both modules and actions for: ${names}`);
      return;
    }

    const assignments = Object.entries(roleActions).map(
      ([roleId, actionNames]) => {
        const selectedModules = roleModules[parseInt(roleId)] || [];
        
        // Filter module-action pairs by BOTH selected modules AND selected actions
        const moduleActionIds = moduleActionPairs
          .filter((pair) => 
            actionNames.includes(pair.action_name) && 
            selectedModules.includes(pair.module_name)
          )
          .map((pair) => pair.module_action_pair_id);

        return {
          role_id: [parseInt(roleId)],
          module_action_pair_ids: moduleActionIds,
          status: "active",
        };
      }
    );

    try {
      setIsLoading(true);
      await axios.post(
        "/api/v1/mapping-module-actions-roles",
        { assignments },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(
        `Assigned to roles: ${assignments.map((a) => a.role_id[0]).join(", ")}`
      );
      fetchRoleMappings();
      setRoleModules({});
      setRoleActions({});
    } catch (error) {
      console.error("Assignment failed:", error);
      setMessage("Assignment failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSingleAssignment = async (roleId: number) => {
    if (!validateSingleRoleSelection(roleId)) {
      const roleName = roles.find(r => r.role_id === roleId)?.role_name || roleId.toString();
      setMessage(`Please select both modules and actions for: ${roleName}`);
      return;
    }

    const actionNames = roleActions[roleId] || [];
    const selectedModules = roleModules[roleId] || [];
    
    // Filter module-action pairs by BOTH selected modules AND selected actions
    const moduleActionIds = moduleActionPairs
      .filter((pair) => 
        actionNames.includes(pair.action_name) && 
        selectedModules.includes(pair.module_name)
      )
      .map((pair) => pair.module_action_pair_id);

    const assignment = {
      role_id: [roleId],
      module_action_pair_ids: moduleActionIds,
      status: "active",
    };

    try {
      setIsLoading(true);
      await axios.post(
        "/api/v1/mapping-module-actions-roles",
        { assignments: [assignment] },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const roleName = roles.find(r => r.role_id === roleId)?.role_name || roleId.toString();
      setMessage(`Successfully assigned to role: ${roleName}`);
      fetchRoleMappings();
      
      // Clear selections for this role
      setRoleModules(prev => {
        const newState = { ...prev };
        delete newState[roleId];
        return newState;
      });
      setRoleActions(prev => {
        const newState = { ...prev };
        delete newState[roleId];
        return newState;
      });
    } catch (error) {
      console.error("Assignment failed:", error);
      setMessage("Assignment failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRole = async (roleData: {
    role_name: string;
    description: string;
    status: string;
  }) => {
    setIsCreatingRole(true);
    try {
      const { data } = await axios.post("/api/v1/roles", roleData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      });
// console.log(data , "roles");

      const newRole = data.data.role;
      
      setRoles((prev) => [
        ...prev,
        { ...newRole, enabled: newRole.status === "active" },
      ]);
      setMessage(`Role "${roleData.role_name}" created successfully`);
      
      // Refresh the current page data
      fetchRoles(currentPage, itemsPerPage);
      
      return true;
    } catch (error: any) {
      console.error("Failed to create role:", error);
      setMessage(
        `Failed to create role: ${
          error?.response?.data?.meta?.message || "Unknown error"
        }`
      );
      return false;
    } finally {
      setIsCreatingRole(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return {
    roles,
    moduleActionPairs,
    roleMappings,
    message,
    setMessage,
    isCreatingRole,
    isLoading,
    currentPage,
    setCurrentPage: handlePageChange,
    itemsPerPage,
    setItemsPerPage: handleItemsPerPageChange,
    totalItems,
    totalPages,
    currentRoles,
    roleModules,
    roleActions,
    selectedRole,
    setSelectedRole,
    handleApply,
    handleToggleChange,
    handleSaveAssignments,
    handleSaveSingleAssignment,
    handleCreateRole,
    fetchRoles,
    fetchRoleMappings,
    groupedRoleMappings,
    moduleOptions,
    actionOptions,
    getActionOptionsForModules,
    validateSingleRoleSelection,
  };
};