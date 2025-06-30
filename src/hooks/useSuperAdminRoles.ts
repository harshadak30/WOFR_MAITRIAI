

// import { useEffect, useMemo, useState, useCallback } from "react";
// import axios from "../helper/axios";
// import { useAuth } from "./useAuth";

// interface Role {
//   role_id: number;
//   role_name: string;
//   description?: string;
//   status?: string;
//   enabled: boolean;
//   source?: "superadmin" | "assigned";
// }

// interface SubAction {
//   sub_action_id: number;
//   sub_action_name: string;
// }

// interface Action {
//   action_id: number;
//   action_name: string;
//   sub_actions: SubAction[];
// }

// interface ModuleWithActions {
//   module_id: number;
//   module_name: string;
//   actions: Action[];
//   roles: Role[];
// }

// interface SuperAdminRoleMapping {
//   mapping_id: number;
//   super_admin_role_id: number;
//   super_admin_role_name: string;
//   role_id: number;
//   role_name: string;
//   module_id: number;
//   module_name: string;
//   action_id: number;
//   action_name: string;
//   sub_actions: SubAction[];
//   created_at: string;
// }

// interface MasterAdminRoleMapping {
//   module_data: any;
//   assignment_date: any;
//   status: any;
//   mapping_id: number;
//   role_id: number;
//   role_name: string;
//   module_id: number;
//   module_name: string;
//   action_id: number;
//   action_name: string;
//   sub_actions: SubAction[];
//   created_at: string;
// }

// interface SuperAdminRoleMappingsResponse {
//   success: boolean;
//   data: SuperAdminRoleMapping[];
//   total: number;
// }

// interface AssignedSubAction {
//   sub_action_id: number;
//   sub_action_name: string;
// }

// interface AssignedAction {
//   screen_id: number;
//   action_id: number;
//   action_name: string;
//   all_sub_actions: AssignedSubAction[];
// }

// interface AssignedModuleRole {
//   role_id: number;
//   role_name: string;
//   status: string;
//   actions: AssignedAction[];
// }

// interface AssignedModule {
//   user_id: string;
//   tenant_id: string | null;
//   tenant_name: string | null;
//   module_id: number;
//   module_name: string;
//   assigned_by: number;
//   assignment_date: string;
//   total_screen: number;
//   module_data: AssignedModuleRole[];
// }

// interface AssignedUserRoleModuleActionsResponse {
//   success: boolean;
//   data: {
//     assignments: AssignedModule[];
//   };
//   meta: {
//     page: number;
//     limit: number;
//     total_items: number;
//     total_pages: number;
//   };
// }

// interface SuperAdminRoleMappingPayload {
//   superadmin_role_id: number;
//   mappings: {
//     module_id: number;
//     action_id: number;
//     sub_action_ids: number[];
//   }[];
// }

// export const UseSuperAdminRoles = () => {
//   // State management
//   const [superAdminRoles, setSuperAdminRoles] = useState<Role[]>([]);
//   const [superAdminRoleMappings, setSuperAdminRoleMappings] = useState<SuperAdminRoleMapping[]>([]);
//   const [MasterAdminRoleMappings, setMasterAdminRoleMappings] = useState<MasterAdminRoleMapping[]>([]);
//   const [groupedModuleActions, setGroupedModuleActions] = useState<ModuleWithActions[]>([]);
//   const [message, setMessage] = useState("");
//   const [isCreatingRole, setIsCreatingRole] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const { authState } = useAuth();

//   // Memoized auth headers to prevent recreation on every render
//   const getAuthHeaders = useCallback(() => {
//     const token = authState.token;
//     return {
//       Authorization: `Bearer ${token}`,
//       Accept: "application/json",
//     };
//   }, [authState.token]);

//   // Optimized API calls with better error handling
//   const fetchSuperAdminRoles = useCallback(async () => {
//     try {
//       const { data } = await axios.get(
//         `/api/v1/superadmin/roles?page=1&limit=100&sort_by=role_id&order=asc`,
//         {
//           headers: getAuthHeaders(),
//         }
//       );

//       const rolesData = data.data.roles.map((r: any) => ({
//         ...r,
//         enabled: r.status === "active",
//         source: "superadmin" as const,
//       }));

//       setSuperAdminRoles(rolesData);
//     } catch (error) {
//       console.error("Failed to fetch super admin roles:", error);
//       setMessage("Failed to fetch super admin roles.");
//     }
//   }, [getAuthHeaders]);

//   const fetchSuperAdminRoleMappings = useCallback(async () => {
//     try {
//       const { data }: { data: SuperAdminRoleMappingsResponse } =
//         await axios.get(`/api/v1/super-admin-role-mappings`, {
//           headers: getAuthHeaders(),
//         });

//       setSuperAdminRoleMappings(data.data);
//     } catch (error) {
//       console.error("Failed to fetch super admin role mappings:", error);
//       setMessage("Failed to fetch super admin role mappings.");
//     }
//   }, [getAuthHeaders]);

//   const fetchAssignedRoles = useCallback(async () => {
//     try {
//       const { data }: { data: AssignedUserRoleModuleActionsResponse } =
//         await axios.get(
//           `/api/v1/assigned-user-role-module-actions?page=1&limit=100`,
//           {
//             headers: getAuthHeaders(),
//           }
//         );
//       const transformedModules: ModuleWithActions[] = [];
      
//       // setMasterAdminRoleMappings(data.data.assignments);
//       setMasterAdminRoleMappings(data.data.assignments.flatMap((assignment: AssignedModule) => 
//   assignment.module_data.map((roleData: AssignedModuleRole) => ({
//     module_data: roleData,
//     assignment_date: assignment.assignment_date,
//     status: roleData.status,
//     mapping_id: 0, // You'll need to provide appropriate values
//     role_id: roleData.role_id,
//     role_name: roleData.role_name,
//     module_id: assignment.module_id,
//     module_name: assignment.module_name,
//     action_id: roleData.actions[0]?.action_id || 0,
//     action_name: roleData.actions[0]?.action_name || '',
//     sub_actions: roleData.actions[0]?.all_sub_actions || [],
//     created_at: assignment.assignment_date
//   }))
// ));
//       data.data.assignments.forEach((assignment: AssignedModule) => {
//         const moduleActions: Action[] = [];
//         const moduleRoles: Role[] = [];

//         assignment.module_data.forEach((roleData: AssignedModuleRole) => {
//           const role: Role = {
//             role_id: roleData.role_id,
//             role_name: roleData.role_name,
//             enabled: roleData.status === "active",
//             source: "assigned" as const,
//           };

//           moduleRoles.push(role);

//           roleData.actions.forEach((actionData: AssignedAction) => {
//             const existingAction = moduleActions.find(
//               (a) => a.action_id === actionData.action_id
//             );

//             if (!existingAction) {
//               const action: Action = {
//                 action_id: actionData.action_id,
//                 action_name: actionData.action_name,
//                 sub_actions: actionData.all_sub_actions.map((subAction) => ({
//                   sub_action_id: subAction.sub_action_id,
//                   sub_action_name: subAction.sub_action_name,
//                 })),
//               };
//               moduleActions.push(action);
//             } else {
//               actionData.all_sub_actions.forEach((subAction) => {
//                 if (
//                   !existingAction.sub_actions.find(
//                     (sa) => sa.sub_action_id === subAction.sub_action_id
//                   )
//                 ) {
//                   existingAction.sub_actions.push({
//                     sub_action_id: subAction.sub_action_id,
//                     sub_action_name: subAction.sub_action_name,
//                   });
//                 }
//               });
//             }
//           });
//         });

//         const module: ModuleWithActions = {
//           module_id: assignment.module_id,
//           module_name: assignment.module_name,
//           actions: moduleActions,
//           roles: moduleRoles,
//         };

//         transformedModules.push(module);
//       });

//       setGroupedModuleActions(transformedModules);
//     } catch (error) {
//       console.error("Failed to fetch assigned user role module actions:", error);
//       setMessage("Failed to fetch assigned user role module actions.");
//     }
//   }, [getAuthHeaders]);

//   // Memoized computed values for better performance
//   const availableSuperAdminRoles = useMemo(() => {
//     return superAdminRoles
//       .filter(role => role.enabled)
//       .sort((a, b) => a.role_name.localeCompare(b.role_name));
//   }, [superAdminRoles]);

//   const moduleOptions = useMemo(() => {
//     const uniqueModules = new Map<
//       string,
//       { id: string; label: string; module_id: number }
//     >();

//     // Get modules from super admin mappings
//     superAdminRoleMappings.forEach((mapping) => {
//       if (!uniqueModules.has(mapping.module_name)) {
//         uniqueModules.set(mapping.module_name, {
//           id: mapping.module_name,
//           label: mapping.module_name,
//           module_id: mapping.module_id,
//         });
//       }
//     });

//     // Also get from grouped module actions
//     groupedModuleActions.forEach((module) => {
//       if (!uniqueModules.has(module.module_name)) {
//         uniqueModules.set(module.module_name, {
//           id: module.module_name,
//           label: module.module_name,
//           module_id: module.module_id,
//         });
//       }
//     });

//     return Array.from(uniqueModules.values()).sort((a, b) => 
//       a.label.localeCompare(b.label)
//     );
//   }, [superAdminRoleMappings, groupedModuleActions]);

//   // Optimized action options with memoization
//   const getActionOptionsForModules = useCallback((selectedModules: string[]) => {
//     if (!selectedModules || selectedModules.length === 0) return [];

//     const actions: { id: string; label: string; action_id: number }[] = [];
//     const seen = new Set<string>();

//     superAdminRoleMappings.forEach((mapping) => {
//       if (
//         selectedModules.includes(mapping.module_name) &&
//         !seen.has(mapping.action_name)
//       ) {
//         seen.add(mapping.action_name);
//         actions.push({
//           id: mapping.action_name,
//           label: mapping.action_name,
//           action_id: mapping.action_id,
//         });
//       }
//     });

//     groupedModuleActions.forEach((module) => {
//       if (selectedModules.includes(module.module_name)) {
//         module.actions.forEach((action) => {
//           if (!seen.has(action.action_name)) {
//             seen.add(action.action_name);
//             actions.push({
//               id: action.action_name,
//               label: action.action_name,
//               action_id: action.action_id,
//             });
//           }
//         });
//       }
//     });

//     return actions.sort((a, b) => a.label.localeCompare(b.label));
//   }, [superAdminRoleMappings, groupedModuleActions]);

//   // Optimized sub-action options with memoization
//   const getSubActionOptionsForModulesAndActions = useCallback((
//     selectedModules: string[],
//     selectedAction: string
//   ) => {
//     if (!selectedModules || selectedModules.length === 0 || !selectedAction)
//       return [];
  
//     const subActions: {
//       id: string;
//       label: string;
//       sub_action_id: number;
//       parent_action: string;
//     }[] = [];
//     const seen = new Set<string>();
  
//     // Collect all sub-actions for the selected modules and action
//     superAdminRoleMappings.forEach((mapping) => {
//       if (
//         selectedModules.includes(mapping.module_name) &&
//         selectedAction === mapping.action_name
//       ) {
//         mapping.sub_actions.forEach((subAction) => {
//           const uniqueKey = `${subAction.sub_action_name}`;
//           if (!seen.has(uniqueKey)) {
//             seen.add(uniqueKey);
//             subActions.push({
//               id: subAction.sub_action_name,
//               label: `${subAction.sub_action_name} (${mapping.action_name})`,
//               sub_action_id: subAction.sub_action_id,
//               parent_action: mapping.action_name,
//             });
//           }
//         });
//       }
//     });
  
//     // Also get from grouped module actions
//     groupedModuleActions.forEach((module) => {
//       if (selectedModules.includes(module.module_name)) {
//         module.actions.forEach((action) => {
//           if (selectedAction === action.action_name) {
//             action.sub_actions.forEach((subAction) => {
//               const uniqueKey = `${subAction.sub_action_name}`;
//               if (!seen.has(uniqueKey)) {
//                 seen.add(uniqueKey);
//                 subActions.push({
//                   id: subAction.sub_action_name,
//                   label: `${subAction.sub_action_name} (${action.action_name})`,
//                   sub_action_id: subAction.sub_action_id,
//                   parent_action: action.action_name,
//                 });
//               }
//             });
//           }
//         });
//       }
//     });
  
//     return subActions.sort((a, b) => a.label.localeCompare(b.label));
//   }, [superAdminRoleMappings, groupedModuleActions]);

//   // Updated role mapping creation with the new API structure
//   const handleCreateSuperAdminRoleMapping = useCallback(async (
//     superAdminRoleId: number,
//     selectedModules: string[],
//     selectedActions: string,
//     selectedSubActions: string[]
//   ) => {
//     if (
//       !superAdminRoleId ||
//       selectedModules.length === 0 ||
//       !selectedActions
//     ) {
//       setMessage("Please select super admin role, modules, and actions");
//       return false;
//     }

//     try {
//       setIsLoading(true);
//       const moduleIds = moduleOptions
//         .filter((module) => selectedModules.includes(module.id))
//         .map((module) => module.module_id);

//       const actionId = getActionOptionsForModules(selectedModules).find(
//         (action) => action.id === selectedActions
//       )?.action_id;

//       if (!actionId) {
//         setMessage("Invalid action selected");
//         return false;
//       }

//       const subActionIds: number[] = [];
//       if (selectedSubActions.length > 0) {
//         const availableSubActions = getSubActionOptionsForModulesAndActions(
//           selectedModules,
//           selectedActions
//         );
//         selectedSubActions.forEach((subActionName) => {
//           const subAction = availableSubActions.find(
//             (sa) => sa.id === subActionName
//           );
//           if (subAction) {
//             subActionIds.push(subAction.sub_action_id);
//           }
//         });
//       }

//       const mappings = moduleIds.map((moduleId) => ({
//         module_id: moduleId,
//         action_id: actionId,
//         sub_action_ids: subActionIds,
//       }));
   

//       const payload: SuperAdminRoleMappingPayload = {
//         superadmin_role_id: superAdminRoleId,
//         mappings: mappings,
//       };

//       await axios.post("/api/v1/super-admin-role-mappings", payload, {
//         headers: {
//           ...getAuthHeaders(),
//           "Content-Type": "application/json",
//         },
//       });

//       const superAdminRoleName =
//         superAdminRoles.find((r) => r.role_id === superAdminRoleId)
//           ?.role_name || superAdminRoleId.toString();

//       setMessage(
//         `Successfully created super admin role mapping for: ${superAdminRoleName}`
//       );

//       await fetchSuperAdminRoleMappings();

//       return true;
//     } catch (error: any) {
//       console.error("Failed to create super admin role mapping:", error);
//       const errorMessage = error?.response?.data?.detail || 
//                           error?.response?.data?.message || 
//                           error?.message || 
//                           "Unknown error";                          
//       setMessage(`Failed to create super admin role mapping: ${errorMessage}`);
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   }, [
//     moduleOptions,
//     getActionOptionsForModules,
//     getSubActionOptionsForModulesAndActions,
//     getAuthHeaders,
//     superAdminRoles,
//     fetchSuperAdminRoleMappings
//   ]);

//   const handleCreateRole = useCallback(
//     async (roleData: { role_name: string; description: string; status: string }) => {
//       if (!roleData.role_name.trim()) {
//         setMessage("Role name is required");
//         return; // just return nothing
//       }
  
//       setIsCreatingRole(true);
//       try {
//         const { data } = await axios.post("api/v1/superadmin/roles", roleData, {
//           headers: {
//             ...getAuthHeaders(),
//             "Content-Type": "application/json",
//           },
//         });
  
//         const newRole = data.data.role;
  
//         setSuperAdminRoles((prev) => [
//           ...prev,
//           {
//             ...newRole,
//             enabled: newRole.status === "active",
//             source: "superadmin" as const,
//           },
//         ]);
//         setMessage(`Role "${roleData.role_name}" created successfully`);
  
//         await fetchSuperAdminRoles();
//       } catch (error: any) {
//         console.error( error);
//         const errorMessage =
//           error?.response?.data?.detail ||
//           "Unknown error";
  
//         setMessage(`Failed : ${errorMessage}`);
//       } finally {
//         setIsCreatingRole(false);
//       }
//     },
//     [getAuthHeaders, fetchSuperAdminRoles]
//   );
  


//   // Initialize data on mount
//   useEffect(() => {
//     const initializeData = async () => {
//       setIsLoading(true);
//       try {
//         await Promise.all([
//           fetchSuperAdminRoles(),
//           fetchSuperAdminRoleMappings(),
//           fetchAssignedRoles(),
//         ]);
//       } catch (error) {
//         console.error("Failed to initialize data:", error);
//         setMessage("Failed to load initial data. Please refresh the page.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initializeData();
//   }, [fetchSuperAdminRoles, fetchSuperAdminRoleMappings, fetchAssignedRoles]);

//   return {
//     superAdminRoleMappings,
//     message,
//     setMessage,
//     isCreatingRole,
//     isLoading,
//     availableSuperAdminRoles,
//     handleCreateRole,
//     handleCreateSuperAdminRoleMapping,
//     moduleOptions,
//     MasterAdminRoleMappings,
//     groupedModuleActions,
//     getActionOptionsForModules,
//     getSubActionOptionsForModulesAndActions,
//   };
// };



import { useEffect, useMemo, useState, useCallback } from "react";
import axios from "../helper/axios";
import { useAuth } from "./useAuth";


interface Role {
  role_id: number;
  role_name: string;
  description?: string;
  status?: string;
  enabled: boolean;
  source?: "superadmin" | "assigned";
}


interface SubAction {
  sub_action_id: number;
  sub_action_name: string;
}


interface Action {
  action_id: number;
  action_name: string;
  sub_actions: SubAction[];
}


interface ModuleWithActions {
  module_id: number;
  module_name: string;
  actions: Action[];
  roles: Role[];
}


interface SuperAdminRoleMapping {
  mapping_id: number;
  super_admin_role_id: number;
  super_admin_role_name: string;
  role_id: number;
  role_name: string;
  module_id: number;
  module_name: string;
  action_id: number;
  action_name: string;
  sub_actions: SubAction[];
  created_at: string;
}


interface MasterAdminRoleMapping {
  module_data: any;
  assignment_date: any;
  status: any;
  mapping_id: number;
  role_id: number;
  role_name: string;
  module_id: number;
  module_name: string;
  action_id: number;
  action_name: string;
  sub_actions: SubAction[];
  created_at: string;
}


interface SuperAdminRoleMappingsResponse {
  success: boolean;
  data: SuperAdminRoleMapping[];
  total: number;
}


interface AssignedSubAction {
  sub_action_id: number;
  sub_action_name: string;
}


interface AssignedAction {
  screen_id: number;
  action_id: number;
  action_name: string;
  all_sub_actions: AssignedSubAction[];
}


interface AssignedModuleRole {
  role_id: number;
  role_name: string;
  status: string;
  actions: AssignedAction[];
}


interface AssignedModule {
  user_id: string;
  tenant_id: string | null;
  tenant_name: string | null;
  module_id: number;
  module_name: string;
  assigned_by: number;
  assignment_date: string;
  total_screen: number;
  module_data: AssignedModuleRole[];
}


interface AssignedUserRoleModuleActionsResponse {
  success: boolean;
  data: {
    assignments: AssignedModule[];
  };
  meta: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}


interface SuperAdminRoleMappingPayload {
  superadmin_role_id: number;
  mappings: {
    module_id: number;
    action_id: number;
    sub_action_ids: number[];
  }[];
}


interface PaginationParams {
  page: number;
  limit: number;
  sort_by?: string;
  order?: 'asc' | 'desc';
}


export const UseSuperAdminRoles = () => {
  // State management
  const [superAdminRoles, setSuperAdminRoles] = useState<Role[]>([]);
  const [superAdminRoleMappings, setSuperAdminRoleMappings] = useState<SuperAdminRoleMapping[]>([]);
  const [MasterAdminRoleMappings, setMasterAdminRoleMappings] = useState<MasterAdminRoleMapping[]>([]);
  const [groupedModuleActions, setGroupedModuleActions] = useState<ModuleWithActions[]>([]);
  const [message, setMessage] = useState("");
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  // Dynamic pagination parameters
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 1,
    limit: 100,
    sort_by: 'role_id',
    order: 'asc'
  });


  const { authState } = useAuth();


  // Memoized auth headers to prevent recreation on every render
  const getAuthHeaders = useCallback(() => {
    const token = authState.token;
    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };
  }, [authState.token]);


  // Helper function to build query string from pagination params
  const buildQueryString = useCallback((params: PaginationParams) => {
    const queryParams = new URLSearchParams();
    queryParams.append('page', params.page.toString());
    queryParams.append('limit', params.limit.toString());
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.order) queryParams.append('order', params.order);
    return queryParams.toString();
  }, []);


  // Update pagination parameters
  const updatePaginationParams = useCallback((newParams: Partial<PaginationParams>) => {
    setPaginationParams(prev => ({ ...prev, ...newParams }));
  }, []);


  // Optimized API calls with better error handling and dynamic pagination
  const fetchSuperAdminRoles = useCallback(async (params?: Partial<PaginationParams>) => {
    try {
      const queryParams = params ? { ...paginationParams, ...params } : paginationParams;
      const queryString = buildQueryString(queryParams);
     
      const { data } = await axios.get(
        `/api/v1/superadmin/roles?${queryString}`,
        {
          headers: getAuthHeaders(),
        }
      );


      const rolesData = data.data.roles.map((r: any) => ({
        ...r,
        enabled: r.status === "active",
        source: "superadmin" as const,
      }));


      setSuperAdminRoles(rolesData);
    } catch (error) {
      console.error("Failed to fetch super admin roles:", error);
      setMessage("Failed to fetch super admin roles.");
    }
  }, [getAuthHeaders, paginationParams, buildQueryString]);


  const fetchSuperAdminRoleMappings = useCallback(async (params?: Partial<PaginationParams>) => {
    try {
      const queryParams = params ? { ...paginationParams, ...params } : paginationParams;
      const queryString = buildQueryString(queryParams);
     
      const { data }: { data: SuperAdminRoleMappingsResponse } =
        await axios.get(`/api/v1/super-admin-role-mappings?${queryString}`, {
          headers: getAuthHeaders(),
        });


      setSuperAdminRoleMappings(data.data);
    } catch (error) {
      console.error("Failed to fetch super admin role mappings:", error);
      setMessage("Failed to fetch super admin role mappings.");
    }
  }, [getAuthHeaders, paginationParams, buildQueryString]);


  const fetchAssignedRoles = useCallback(async (params?: Partial<PaginationParams>) => {
    try {
      const queryParams = params ? { ...paginationParams, ...params } : paginationParams;
      const queryString = buildQueryString(queryParams);
     
      const { data }: { data: AssignedUserRoleModuleActionsResponse } =
        await axios.get(
          `/api/v1/assigned-user-role-module-actions?${queryString}`,
          {
            headers: getAuthHeaders(),
          }
        );
      const transformedModules: ModuleWithActions[] = [];
     
      setMasterAdminRoleMappings(data.data.assignments.flatMap((assignment: AssignedModule) =>
        assignment.module_data.map((roleData: AssignedModuleRole) => ({
          module_data: roleData,
          assignment_date: assignment.assignment_date,
          status: roleData.status,
          mapping_id: 0,
          role_id: roleData.role_id,
          role_name: roleData.role_name,
          module_id: assignment.module_id,
          module_name: assignment.module_name,
          action_id: roleData.actions[0]?.action_id || 0,
          action_name: roleData.actions[0]?.action_name || '',
          sub_actions: roleData.actions[0]?.all_sub_actions || [],
          created_at: assignment.assignment_date
        }))
      ));
     
      data.data.assignments.forEach((assignment: AssignedModule) => {
        const moduleActions: Action[] = [];
        const moduleRoles: Role[] = [];


        assignment.module_data.forEach((roleData: AssignedModuleRole) => {
          const role: Role = {
            role_id: roleData.role_id,
            role_name: roleData.role_name,
            enabled: roleData.status === "active",
            source: "assigned" as const,
          };


          moduleRoles.push(role);


          roleData.actions.forEach((actionData: AssignedAction) => {
            const existingAction = moduleActions.find(
              (a) => a.action_id === actionData.action_id
            );


            if (!existingAction) {
              const action: Action = {
                action_id: actionData.action_id,
                action_name: actionData.action_name,
                sub_actions: actionData.all_sub_actions.map((subAction) => ({
                  sub_action_id: subAction.sub_action_id,
                  sub_action_name: subAction.sub_action_name,
                })),
              };
              moduleActions.push(action);
            } else {
              actionData.all_sub_actions.forEach((subAction) => {
                if (
                  !existingAction.sub_actions.find(
                    (sa) => sa.sub_action_id === subAction.sub_action_id
                  )
                ) {
                  existingAction.sub_actions.push({
                    sub_action_id: subAction.sub_action_id,
                    sub_action_name: subAction.sub_action_name,
                  });
                }
              });
            }
          });
        });


        const module: ModuleWithActions = {
          module_id: assignment.module_id,
          module_name: assignment.module_name,
          actions: moduleActions,
          roles: moduleRoles,
        };


        transformedModules.push(module);
      });


      setGroupedModuleActions(transformedModules);
    } catch (error) {
      console.error("Failed to fetch assigned user role module actions:", error);
      setMessage("Failed to fetch assigned user role module actions.");
    }
  }, [getAuthHeaders, paginationParams, buildQueryString]);


  // Memoized computed values for better performance
  const availableSuperAdminRoles = useMemo(() => {
    return superAdminRoles
      .filter(role => role.enabled)
      .sort((a, b) => a.role_name.localeCompare(b.role_name));
  }, [superAdminRoles]);


  const moduleOptions = useMemo(() => {
    const uniqueModules = new Map<
      string,
      { id: string; label: string; module_id: number }
    >();


    // Get modules from super admin mappings
    superAdminRoleMappings.forEach((mapping) => {
      if (!uniqueModules.has(mapping.module_name)) {
        uniqueModules.set(mapping.module_name, {
          id: mapping.module_name,
          label: mapping.module_name,
          module_id: mapping.module_id,
        });
      }
    });


    // Also get from grouped module actions
    groupedModuleActions.forEach((module) => {
      if (!uniqueModules.has(module.module_name)) {
        uniqueModules.set(module.module_name, {
          id: module.module_name,
          label: module.module_name,
          module_id: module.module_id,
        });
      }
    });


    return Array.from(uniqueModules.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [superAdminRoleMappings, groupedModuleActions]);


  // Get assigned sub-actions for a specific role-module-action combination
  const getAssignedSubActionsForRoleModuleAction = useCallback((
    roleId: number,
    moduleName: string,
    actionName: string
  ) => {
    const assignedSubActions = new Set<number>();
   
    superAdminRoleMappings.forEach((mapping) => {
      if (
        mapping.super_admin_role_id === roleId &&
        mapping.module_name === moduleName &&
        mapping.action_name === actionName
      ) {
        mapping.sub_actions.forEach((subAction) => {
          assignedSubActions.add(subAction.sub_action_id);
        });
      }
    });
   
    return assignedSubActions;
  }, [superAdminRoleMappings]);


  // Optimized action options with memoization
  const getActionOptionsForModules = useCallback((selectedModules: string[]) => {
    if (!selectedModules || selectedModules.length === 0) return [];


    const actions: { id: string; label: string; action_id: number }[] = [];
    const seen = new Set<string>();


    superAdminRoleMappings.forEach((mapping) => {
      if (
        selectedModules.includes(mapping.module_name) &&
        !seen.has(mapping.action_name)
      ) {
        seen.add(mapping.action_name);
        actions.push({
          id: mapping.action_name,
          label: mapping.action_name,
          action_id: mapping.action_id,
        });
      }
    });


    groupedModuleActions.forEach((module) => {
      if (selectedModules.includes(module.module_name)) {
        module.actions.forEach((action) => {
          if (!seen.has(action.action_name)) {
            seen.add(action.action_name);
            actions.push({
              id: action.action_name,
              label: action.action_name,
              action_id: action.action_id,
            });
          }
        });
      }
    });


    return actions.sort((a, b) => a.label.localeCompare(b.label));
  }, [superAdminRoleMappings, groupedModuleActions]);


  // Enhanced sub-action options with smart filtering for unassigned sub-actions
  const getSubActionOptionsForModulesAndActions = useCallback((
    selectedModules: string[],
    selectedAction: string,
    currentRoleId?: number
  ) => {
    if (!selectedModules || selectedModules.length === 0 || !selectedAction)
      return [];
 
    const subActions: {
      id: string;
      label: string;
      sub_action_id: number;
      parent_action: string;
    }[] = [];
    const seen = new Set<string>();
 
    // Get assigned sub-actions for the current role to filter them out
    const assignedSubActionIds = currentRoleId
      ? getAssignedSubActionsForRoleModuleAction(currentRoleId, selectedModules[0], selectedAction)
      : new Set<number>();


    // Collect all sub-actions for the selected modules and action
    superAdminRoleMappings.forEach((mapping) => {
      if (
        selectedModules.includes(mapping.module_name) &&
        selectedAction === mapping.action_name
      ) {
        mapping.sub_actions.forEach((subAction) => {
          const uniqueKey = `${subAction.sub_action_name}`;
          // Only include unassigned sub-actions
          if (!seen.has(uniqueKey) && !assignedSubActionIds.has(subAction.sub_action_id)) {
            seen.add(uniqueKey);
            subActions.push({
              id: subAction.sub_action_name,
              label: `${subAction.sub_action_name} (${mapping.action_name})`,
              sub_action_id: subAction.sub_action_id,
              parent_action: mapping.action_name,
            });
          }
        });
      }
    });
 
    // Also get from grouped module actions
    groupedModuleActions.forEach((module) => {
      if (selectedModules.includes(module.module_name)) {
        module.actions.forEach((action) => {
          if (selectedAction === action.action_name) {
            action.sub_actions.forEach((subAction) => {
              const uniqueKey = `${subAction.sub_action_name}`;
              // Only include unassigned sub-actions
              if (!seen.has(uniqueKey) && !assignedSubActionIds.has(subAction.sub_action_id)) {
                seen.add(uniqueKey);
                subActions.push({
                  id: subAction.sub_action_name,
                  label: `${subAction.sub_action_name} (${action.action_name})`,
                  sub_action_id: subAction.sub_action_id,
                  parent_action: action.action_name,
                });
              }
            });
          }
        });
      }
    });
 
    return subActions.sort((a, b) => a.label.localeCompare(b.label));
  }, [superAdminRoleMappings, groupedModuleActions, getAssignedSubActionsForRoleModuleAction]);


  // Updated role mapping creation with the new API structure
  const handleCreateSuperAdminRoleMapping = useCallback(async (
    superAdminRoleId: number,
    selectedModules: string[],
    selectedActions: string,
    selectedSubActions: string[]
  ) => {
    if (
      !superAdminRoleId ||
      selectedModules.length === 0 ||
      !selectedActions
    ) {
      setMessage("Please select super admin role, modules, and actions");
      return false;
    }


    try {
      setIsLoading(true);
      const moduleIds = moduleOptions
        .filter((module) => selectedModules.includes(module.id))
        .map((module) => module.module_id);


      const actionId = getActionOptionsForModules(selectedModules).find(
        (action) => action.id === selectedActions
      )?.action_id;


      if (!actionId) {
        setMessage("Invalid action selected");
        return false;
      }


      const subActionIds: number[] = [];
      if (selectedSubActions.length > 0) {
        const availableSubActions = getSubActionOptionsForModulesAndActions(
          selectedModules,
          selectedActions,
          superAdminRoleId
        );
        selectedSubActions.forEach((subActionName) => {
          const subAction = availableSubActions.find(
            (sa) => sa.id === subActionName
          );
          if (subAction) {
            subActionIds.push(subAction.sub_action_id);
          }
        });
      }


      const mappings = moduleIds.map((moduleId) => ({
        module_id: moduleId,
        action_id: actionId,
        sub_action_ids: subActionIds,
      }));


      const payload: SuperAdminRoleMappingPayload = {
        superadmin_role_id: superAdminRoleId,
        mappings: mappings,
      };


      await axios.post("/api/v1/super-admin-role-mappings", payload, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      });


      const superAdminRoleName =
        superAdminRoles.find((r) => r.role_id === superAdminRoleId)
          ?.role_name || superAdminRoleId.toString();


      setMessage(
        `Successfully created super admin role mapping for: ${superAdminRoleName}`
      );


      await fetchSuperAdminRoleMappings();


      return true;
    } catch (error: any) {
      console.error("Failed to create super admin role mapping:", error);
      const errorMessage = error?.response?.data?.detail ||
                          error?.response?.data?.message ||
                          error?.message ||
                          "Unknown error";                          
      setMessage(`Failed to create super admin role mapping: ${errorMessage}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [
    moduleOptions,
    getActionOptionsForModules,
    getSubActionOptionsForModulesAndActions,
    getAuthHeaders,
    superAdminRoles,
    fetchSuperAdminRoleMappings
  ]);


  const handleCreateRole = useCallback(
    async (roleData: { role_name: string; description: string; status: string }) => {
      if (!roleData.role_name.trim()) {
        setMessage("Role name is required");
        return;
      }
 
      setIsCreatingRole(true);
      try {
        const { data } = await axios.post("api/v1/superadmin/roles", roleData, {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
        });
 
        const newRole = data.data.role;
 
        setSuperAdminRoles((prev) => [
          ...prev,
          {
            ...newRole,
            enabled: newRole.status === "active",
            source: "superadmin" as const,
          },
        ]);
        setMessage(`Role "${roleData.role_name}" created successfully`);
 
        await fetchSuperAdminRoles();
      } catch (error: any) {
        console.error(error);
        const errorMessage =
          error?.response?.data?.detail ||
          "Unknown error";
 
        setMessage(`Failed : ${errorMessage}`);
      } finally {
        setIsCreatingRole(false);
      }
    },
    [getAuthHeaders, fetchSuperAdminRoles]
  );


  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchSuperAdminRoles(),
          fetchSuperAdminRoleMappings(),
          fetchAssignedRoles(),
        ]);
      } catch (error) {
        console.error("Failed to initialize data:", error);
        setMessage("Failed to load initial data. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };


    initializeData();
  }, [fetchSuperAdminRoles, fetchSuperAdminRoleMappings, fetchAssignedRoles]);


  return {
    superAdminRoleMappings,
    message,
    setMessage,
    isCreatingRole,
    isLoading,
    availableSuperAdminRoles,
    handleCreateRole,
    handleCreateSuperAdminRoleMapping,
    moduleOptions,
    MasterAdminRoleMappings,
    groupedModuleActions,
    getActionOptionsForModules,
    getSubActionOptionsForModulesAndActions,
    paginationParams,
    updatePaginationParams,
    fetchSuperAdminRoles,
    fetchSuperAdminRoleMappings,
    fetchAssignedRoles,
    getAssignedSubActionsForRoleModuleAction,
  };
};

