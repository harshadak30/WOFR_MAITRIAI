
// import React, { useState, useEffect } from "react";
// import { ChevronDown } from "lucide-react";
// import { UserData } from "../../../types";
// import { useAuth } from "../../../hooks/useAuth";
// import { useNavigate } from "react-router-dom";
// import axios from "../../../helper/axios";
// import toast from "react-hot-toast";
// import { roleOptions } from "../../../data/mockData";
// import TableHeader from "../../../component/common/ui/Table/TableHeader";
// import MultiSelectDropdown from "../../../component/common/ui/MultiSelectDropdown";
// import Toggle from "../../../component/common/ui/Toggle";
// import Pagination from "../../../component/common/ui/Table/Pagination";

// interface ExternalOrganizationUserProps {
//   isReadOnly: boolean;
//   searchTerm?: string;
// }

// const ExternalOrganizations: React.FC<ExternalOrganizationUserProps> = ({
//   isReadOnly,
//   searchTerm = "",
// }) => {
//   const [users, setUsers] = useState<UserData[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [moduleDropdownOptions, setModuleDropdownOptions] = useState<
//     { id: string; label: string }[]
//   >([]);
//   const [, setError] = useState<string | null>(null);
//   const [itemsPerPage] = useState(10);
//   const [selectedUser, setSelectedUser] = useState<{
//     id: number;
//     type: "role" | "module";
//   } | null>(null);
//   const { authState } = useAuth();
//   const [userSelectedRoles] = useState<
//     Record<number, string[]>
//   >({});
//   const [userSelectedModules, setUserSelectedModules] = useState<
//     Record<number, string[]>
//   >({});
//   const [originalUserModules, setOriginalUserModules] = useState<
//     Record<number, string[]>
//   >({});
//   const navigate = useNavigate();
//   const token = authState.token;

//   // API 1: Fetch all users
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get("api/users/v1/all-users", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const transformed = response.data
//           .filter((user: any) => user.user_type !== "master_admin")
//           .map((user: any, index: number) => ({
//             id: index + 1,
//             user_id: user.user_id,
//             username: user.username,
//             email: user.email,
//             phone_number: user.phone_number,
//             user_type: user.user_type,
//             is_verified: user.is_verified,
//             organization_name: user.organization_name || "--",
//             status: user.status,
//             created_at: user.created_at,
//             enabled: user.status === "active",
//           }));

//         setUsers(transformed);
//         fetchAllUserAssignments(transformed);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // API 2: Fetch all modules
//   useEffect(() => {
//     const fetchModules = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(
//           "api/v1/modules?page=1&limit=10&sort_by=module_id&order=asc",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               Accept: "application/json",
//             },
//           }
//         );

//         const modules = response.data.data.modules || [];
//         const formattedModules = modules.map((module: any) => ({
//           id: String(module.module_id),
//           label: module.module_name,
//         }));

//         setModuleDropdownOptions(formattedModules);
//       } catch (err) {
//         console.error("Failed to fetch modules:", err);
//         setError("Failed to fetch modules");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchModules();
//   }, []);

//   // API 3: Fetch all user assignments
//   const fetchAllUserAssignments = async (usersList: UserData[]) => {
//     try {
//       const response = await axios.get("api/v1/user-role-assignments", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: "application/json",
//         },
//       });
//       const assignments = response.data.data.assignments;
//       const userModulesMap: Record<number, string[]> = {};

//       usersList.forEach((user) => {
//         const userAssignments = assignments.filter(
//           (a: any) => a.user_id === user.user_id
//         );
//         const moduleIds = userAssignments.map((a: any) => String(a.module_id));
//         userModulesMap[user.id] = moduleIds;
//       });

//       setUserSelectedModules(userModulesMap);
//       setOriginalUserModules(userModulesMap);
//     } catch (err) {
//       console.error("Failed to fetch assignments:", err);
//     }
//   };

//   // API 4: Assign modules to user
//   const handleApplyModules = async (
//     userId: number,
//     selectedModules: string[]
//   ) => {
//     if (isReadOnly) return;

//     try {
//       const originalModules = originalUserModules[userId] || [];
//       const newModules = selectedModules.filter(
//         (moduleId) => !originalModules.includes(moduleId)
//       );

//       if (newModules.length > 0) {
//         await axios.post(
//           "api/v1/assign-user-role-module-actions",
//           {
//             user_id: users.find((u) => u.id === userId)?.user_id,
//             module_ids: newModules.map((id) => Number(id)),
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//       }

//       toast.success("Modules updated successfully!", {
//         position: "top-right",
//       duration: 2000, 
     
//       });

//       setUserSelectedModules((prev) => ({
//         ...prev,
//         [userId]: selectedModules,
//       }));

//       setOriginalUserModules((prev) => ({
//         ...prev,
//         [userId]: selectedModules,
//       }));

//       setSelectedUser(null);
//     } catch (error) {
//       const errorMessage = (error as any)?.response?.data?.detail || "An unexpected error occurred.";
//       toast.error(errorMessage, {
//         position: "top-right",
//         duration: 2000,
//       });
//     }
//   };

//   const filteredUsers = users.filter(
//     (user) =>
//       user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.phone_number.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const totalItems = filteredUsers.length;
//   const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

//   const handleToggleChange = (id: number) => {
//     if (isReadOnly) return;
//     setUsers(
//       users.map((user) =>
//         user.id === id ? { ...user, enabled: !user.enabled } : user
//       )
//     );
//   };

//   const handleResetModules = (userId: number) => {
//     if (isReadOnly) return;
//     setUserSelectedModules({
//       ...userSelectedModules,
//       [userId]: [],
//     });
//   };

//   const handleToNavigate = (user: UserData) => {
//     navigate(`userDetails/${user.user_id}`, {
//       state: {
//         user,
//         roles: userSelectedRoles[user.id] || [],
//         modules: userSelectedModules[user.id] || [],
//       },
//     });
//   };

//   const toggleDropdown = (userId: number, type: "role" | "module") => {
//     if (isReadOnly) return;
//     setSelectedUser(
//       selectedUser?.id === userId && selectedUser?.type === type
//         ? null
//         : { id: userId, type }
//     );
//   };

//   const getSelectedText = (userId: number, type: "role" | "module") => {
//     const items =
//       type === "role" ? userSelectedRoles[userId] : userSelectedModules[userId];
//     if (!items?.length) return type === "role" ? "Select Roles" : "Select Modules";

//     const options = type === "role" ? roleOptions : moduleDropdownOptions;
//     const selectedLabels = items
//       .map((id) => options.find((opt) => opt.id === id)?.label)
//       .filter(Boolean);

//     return (
//       <span className="flex items-center">
//         <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2 py-1 rounded-full">
//           {selectedLabels.length}
//         </span>
//         {type === "role" ? "Roles" : "Modules"}
//       </span>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
//       <div className="mx-auto space-y-6">

//         {/* Table Container */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <TableHeader className="w-16 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">#</TableHeader>
//                   <TableHeader className="min-w-[160px] text-xs font-semibold text-gray-700 uppercase tracking-wide">Organization</TableHeader>
//                   <TableHeader className="min-w-[140px] text-xs font-semibold text-gray-700 uppercase tracking-wide">User</TableHeader>
//                   <TableHeader className="min-w-[180px] text-xs font-semibold text-gray-700 uppercase tracking-wide">Email</TableHeader>
//                   <TableHeader className="min-w-[120px] text-xs font-semibold text-gray-700 uppercase tracking-wide">Phone</TableHeader>
//                   <TableHeader className="min-w-[180px] text-xs font-semibold text-gray-700 uppercase tracking-wide">Modules</TableHeader>
//                   <TableHeader className="w-24 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">Created</TableHeader>
//                   <TableHeader className="w-20 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">Status</TableHeader>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentItems.map((user, index) => (
//                   <tr
//                     key={user.user_id}
//                     className="hover:bg-gray-50 transition-colors duration-150"
//                   >
//                     <td 
//                       className="px-4 py-4 text-center text-sm font-medium text-gray-900 cursor-pointer"
//                       onClick={() => handleToNavigate(user)}
//                     >
//                       {indexOfFirstItem + index + 1}
//                     </td>
//                     <td
//                       className="px-6 py-4 cursor-pointer"
//                       onClick={() => handleToNavigate(user)}
//                     >
//                       <div className="text-sm text-gray-700 truncate">
//                         {user.organization_name}
//                       </div>
//                     </td>
//                     <td
//                       className="px-6 py-4 cursor-pointer"
//                       onClick={() => handleToNavigate(user)}
//                     >
//                       <div className="text-sm text-gray-700 truncate">
//                         {user.username}
//                       </div>
//                     </td>
//                     <td
//                       className="px-6 py-4 cursor-pointer"
//                       onClick={() => handleToNavigate(user)}
//                     >
//                       <div className="text-sm text-gray-700 truncate">
//                         {user.email}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-700">
//                         {user.phone_number}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="relative">
//                         <button
//                           onClick={() => toggleDropdown(user.id, "module")}
//                           className={`inline-flex justify-between items-center w-full min-w-[160px] px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg shadow-sm transition-all duration-150 ${
//                             isReadOnly
//                               ? "opacity-70 cursor-not-allowed text-gray-500"
//                               : "text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                           }`}
//                           disabled={isReadOnly}
//                         >
//                           {userSelectedModules[user.id]?.length > 0 ? (
//                             getSelectedText(user.id, "module")
//                           ) : (
//                             <span className="text-sm text-gray-500">Select Modules</span>
//                           )}
//                           <ChevronDown
//                             size={16}
//                             className={`ml-2 transition-transform duration-200 ${
//                               selectedUser?.id === user.id &&
//                               selectedUser?.type === "module"
//                                 ? "transform rotate-180"
//                                 : ""
//                             }`}
//                           />
//                         </button>

//                         {!isReadOnly &&
//                           selectedUser?.id === user.id &&
//                           selectedUser?.type === "module" && (
//                             <div className="absolute z-20 mt-1 w-80 bg-white rounded-lg shadow-xl border border-gray-200 animate-fadeIn">
//                               <MultiSelectDropdown
//                                 title="Modules"
//                                 options={moduleDropdownOptions}
//                                 selectedOptions={
//                                   userSelectedModules[user.id] || []
//                                 }
//                                 onApply={(selected) =>
//                                   handleApplyModules(user.id, selected)
//                                 }
//                                 onReset={() => handleResetModules(user.id)}
//                               />
//                             </div>
//                           )}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-center">
//                       <div className="text-sm text-gray-600">
//                         {new Date(user.created_at).toLocaleDateString()}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-center">
//                       <div className="relative inline-block">
//                         <Toggle
//                           enabled={user.enabled}
//                           onChange={() => handleToggleChange(user.id)}
//                           className={
//                             isReadOnly ? "opacity-50 cursor-not-allowed" : ""
//                           }
//                         />
//                       </div>
//                     </td>
//                   </tr>
//                 ))}

//                 {currentItems.length === 0 && (
//                   <tr>
//                     <td colSpan={8} className="px-6 py-12 text-center">
//                       <div className="text-gray-500">
//                         {loading ? (
//                           <div className="flex items-center justify-center">
//                             <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-600 mr-3"></div>
//                             <span className="text-sm">Loading users...</span>
//                           </div>
//                         ) : (
//                           <span className="text-sm">No users found</span>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             totalItems={totalItems}
//             itemsPerPage={itemsPerPage}
//             onPageChange={setCurrentPage}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExternalOrganizations;
// 
 import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { UserData } from "../../../types";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "../../../helper/axios";
import toast from "react-hot-toast";
import { roleOptions } from "../../../data/mockData";
import TableHeader from "../../../component/common/ui/Table/TableHeader";
import MultiSelectDropdown from "../../../component/common/ui/MultiSelectDropdown";
import Toggle from "../../../component/common/ui/Toggle";
import Pagination from "../../../component/common/ui/Table/Pagination";

interface ExternalOrganizationUserProps {
  isReadOnly: boolean;
  searchTerm?: string;
}

const ExternalOrganizations: React.FC<ExternalOrganizationUserProps> = ({
  isReadOnly,
  searchTerm = "",
}) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [moduleDropdownOptions, setModuleDropdownOptions] = useState<
    { id: string; label: string }[]
  >([]);
  const [, setError] = useState<string | null>(null);
  const [itemsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    type: "role" | "module";
  } | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    openUpward: boolean;
  }>({ left: 0, openUpward: false });
  const { authState } = useAuth();
  const [userSelectedRoles] = useState<
    Record<number, string[]>
  >({});
  const [userSelectedModules, setUserSelectedModules] = useState<
    Record<number, string[]>
  >({});
  const [originalUserModules, setOriginalUserModules] = useState<
    Record<number, string[]>
  >({});
  const navigate = useNavigate();
  const token = authState.token;
  const dropdownRefs = useRef<Record<number, HTMLButtonElement>>({});
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // API 1: Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("api/users/v1/all-users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const transformed = response.data
          .filter((user: any) => user.user_type !== "master_admin")
          .map((user: any, index: number) => ({
            id: index + 1,
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            phone_number: user.phone_number,
            user_type: user.user_type,
            is_verified: user.is_verified,
            organization_name: user.organization_name || "--",
            status: user.status,
            created_at: user.created_at,
            enabled: user.status === "active",
          }));

        setUsers(transformed);
        fetchAllUserAssignments(transformed);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // API 2: Fetch all modules
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "api/v1/modules?page=1&limit=10&sort_by=module_id&order=asc",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const modules = response.data.data.modules || [];
        const formattedModules = modules.map((module: any) => ({
          id: String(module.module_id),
          label: module.module_name,
        }));

        setModuleDropdownOptions(formattedModules);
      } catch (err) {
        console.error("Failed to fetch modules:", err);
        setError("Failed to fetch modules");
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  // API 3: Fetch all user assignments
  const fetchAllUserAssignments = async (usersList: UserData[]) => {
    try {
      const response = await axios.get("api/v1/user-role-assignments", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const assignments = response.data.data.assignments;
      const userModulesMap: Record<number, string[]> = {};

      usersList.forEach((user) => {
        const userAssignments = assignments.filter(
          (a: any) => a.user_id === user.user_id
        );
        const moduleIds = userAssignments.map((a: any) => String(a.module_id));
        userModulesMap[user.id] = moduleIds;
      });

      setUserSelectedModules(userModulesMap);
      setOriginalUserModules(userModulesMap);
    } catch (err) {
      console.error("Failed to fetch assignments:", err);
    }
  };

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
      if (selectedUser) {
        setSelectedUser(null);
      }
    };

    const tableContainer = tableContainerRef.current;
    if (tableContainer) {
      tableContainer.addEventListener('scroll', handleScroll);
      return () => tableContainer.removeEventListener('scroll', handleScroll);
    }
  }, [selectedUser]);

  // API 4: Assign modules to user
  const handleApplyModules = async (
    userId: number,
    selectedModules: string[]
  ) => {
    if (isReadOnly) return;

    try {
      const originalModules = originalUserModules[userId] || [];
      const newModules = selectedModules.filter(
        (moduleId) => !originalModules.includes(moduleId)
      );

      if (newModules.length > 0) {
        await axios.post(
          "api/v1/assign-user-role-module-actions",
          {
            user_id: users.find((u) => u.id === userId)?.user_id,
            module_ids: newModules.map((id) => Number(id)),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      toast.success("Modules updated successfully!", {
        position: "top-right",
      duration: 2000, 
      // hideProgressBar: true,
      // closeOnClick: true,
      // pauseOnHover: true,
      // draggable: true,
      });

      setUserSelectedModules((prev) => ({
        ...prev,
        [userId]: selectedModules,
      }));

      setOriginalUserModules((prev) => ({
        ...prev,
        [userId]: selectedModules,
      }));

      setSelectedUser(null);
    } catch (error) {
      const errorMessage = (error as any)?.response?.data?.detail || "An unexpected error occurred.";
      toast.error(errorMessage, {
        position: "top-right",
        duration: 2000,
      });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handleToggleChange = (id: number) => {
    if (isReadOnly) return;
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, enabled: !user.enabled } : user
      )
    );
  };

  const handleResetModules = (userId: number) => {
    if (isReadOnly) return;
    setUserSelectedModules({
      ...userSelectedModules,
      [userId]: [],
    });
  };

  const handleToNavigate = (user: UserData) => {
    navigate(`userDetails/${user.user_id}`, {
      state: {
        user,
        roles: userSelectedRoles[user.id] || [],
        modules: userSelectedModules[user.id] || [],
      },
    });
  };

  const toggleDropdown = (userId: number, type: "role" | "module") => {
    if (isReadOnly) return;
    
    const isCurrentlyOpen = selectedUser?.id === userId && selectedUser?.type === type;
    
    if (isCurrentlyOpen) {
      setSelectedUser(null);
    } else {
      const buttonElement = dropdownRefs.current[userId];
      if (buttonElement) {
        const position = calculateDropdownPosition(buttonElement);
        setDropdownPosition(position);
      }
      setSelectedUser({ id: userId, type });
    }
  };

  const getSelectedText = (userId: number, type: "role" | "module") => {
    const items =
      type === "role" ? userSelectedRoles[userId] : userSelectedModules[userId];
    if (!items?.length) return type === "role" ? "Select Roles" : "Select Modules";

    const options = type === "role" ? roleOptions : moduleDropdownOptions;
    const selectedLabels = items
      .map((id) => options.find((opt) => opt.id === id)?.label)
      .filter(Boolean);

    return (
      <span className="flex items-center">
        <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2 py-1 rounded-full">
          {selectedLabels.length}
        </span>
        {type === "role" ? "Roles" : "Modules"}
      </span>
    );
  };

  return (
    <div className=" bg-gray-50 p-4 lg:p-6">
      <div className="mx-auto space-y-6">
        {/* Header Info */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">External Organizations</h1>
              <p className="text-sm text-gray-600 mt-1">Manage user permissions and module assignments</p>
            </div>
            <div className="text-sm text-gray-600 font-medium">
              {totalItems} users found
            </div>
          </div>
        </div> */}

        {/* Table Container */}
        <div 
          ref={tableContainerRef}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative"
        >
          <div className="overflow-x-auto">
            <div className=" overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <TableHeader className="w-16 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">#</TableHeader>
                    <TableHeader className="min-w-[160px] text-xs font-semibold text-gray-700 uppercase tracking-wide">Organization</TableHeader>
                    <TableHeader className="min-w-[140px] text-xs font-semibold text-gray-700 uppercase tracking-wide">User</TableHeader>
                    <TableHeader className="min-w-[180px] text-xs font-semibold text-gray-700 uppercase tracking-wide">Email</TableHeader>
                    <TableHeader className="min-w-[120px] text-xs font-semibold text-gray-700 uppercase tracking-wide">Phone</TableHeader>
                    <TableHeader className="min-w-[180px] text-xs font-semibold text-gray-700 uppercase tracking-wide">Modules</TableHeader>
                    <TableHeader className="w-24 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">Created</TableHeader>
                    <TableHeader className="w-20 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">Status</TableHeader>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((user, index) => (
                    <tr
                      key={user.user_id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td 
                        className="px-4 py-4 text-center text-sm font-medium text-gray-900 cursor-pointer"
                        onClick={() => handleToNavigate(user)}
                      >
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td
                        className="px-6 py-4 cursor-pointer"
                        onClick={() => handleToNavigate(user)}
                      >
                        <div className="text-sm text-gray-700 truncate">
                          {user.organization_name}
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 cursor-pointer"
                        onClick={() => handleToNavigate(user)}
                      >
                        <div className="text-sm text-gray-700 truncate">
                          {user.username}
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 cursor-pointer"
                        onClick={() => handleToNavigate(user)}
                      >
                        <div className="text-sm text-gray-700 truncate">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">
                          {user.phone_number}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <button
                            ref={(el) => {
                              if (el) dropdownRefs.current[user.id] = el;
                            }}
                            onClick={() => toggleDropdown(user.id, "module")}
                            className={`inline-flex justify-between items-center w-full min-w-[160px] px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg shadow-sm transition-all duration-150 ${
                              isReadOnly
                                ? "opacity-70 cursor-not-allowed text-gray-500"
                                : "text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            }`}
                            disabled={isReadOnly}
                          >
                            {userSelectedModules[user.id]?.length > 0 ? (
                              getSelectedText(user.id, "module")
                            ) : (
                              <span className="text-sm text-gray-500">Select Modules</span>
                            )}
                            <ChevronDown
                              size={16}
                              className={`ml-2 transition-transform duration-200 ${
                                selectedUser?.id === user.id &&
                                selectedUser?.type === "module"
                                  ? "transform rotate-180"
                                  : ""
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-sm text-gray-600">
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="relative inline-block">
                          <Toggle
                            enabled={user.enabled}
                            onChange={() => handleToggleChange(user.id)}
                            className={
                              isReadOnly ? "opacity-50 cursor-not-allowed" : ""
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))}

                  {currentItems.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          {loading ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-600 mr-3"></div>
                              <span className="text-sm">Loading users...</span>
                            </div>
                          ) : (
                            <span className="text-sm">No users found</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />

          {/* Smart positioned dropdown */}
          {!isReadOnly &&
            selectedUser &&
            selectedUser.type === "module" && (
              <div 
                className="absolute z-50 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 animate-fadeIn"
                style={{
                  top: dropdownPosition.openUpward ? 'auto' : dropdownPosition.top,
                  bottom: dropdownPosition.openUpward ? dropdownPosition.bottom : 'auto',
                  left: dropdownPosition.left,
                  maxWidth: 'calc(100vw - 2rem)',
                }}
              >
                <MultiSelectDropdown
                  title="Modules"
                  options={moduleDropdownOptions}
                  selectedOptions={
                    userSelectedModules[selectedUser.id] || []
                  }
                  onApply={(selected) =>
                    handleApplyModules(selectedUser.id, selected)
                  }
                  onReset={() => handleResetModules(selectedUser.id)}
                  onClose={() => setSelectedUser(null)}
                />
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ExternalOrganizations;