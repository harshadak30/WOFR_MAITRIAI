


// import { User, Mail, UserPlus, X, Plus, Trash2 } from "lucide-react";
// import { useState } from "react";
// import { useAuth } from "../../../../hooks/useAuth";
// import axios from "../../../../helper/axios";

// // Types (keeping your existing interfaces)
// interface UserData {
//   name: string;
//   email: string;
//   nameError?: string;
//   emailError?: string;
// }

// type AddMultipleUsersModalProps = {
//   onClose: () => void;
//   onSave?: (users: UserData[]) => void;
//   modules?: any[];
// };

// const AddUserModal: React.FC<AddMultipleUsersModalProps> = ({
//   onClose,
// }) => {
//   const { authState } = useAuth();
//   const [users, setUsers] = useState<UserData[]>([
//     { name: "", email: "", nameError: "", emailError: "" }
//   ]);
//   const [isLoading, setIsLoading] = useState(false);

//   // Validation functions
//   const validateEmail = (email: string): string => {
//     const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!email) return "Email is required";
//     if (!re.test(email)) return "Please enter a valid email address";
//     return "";
//   };

//   const validateUserName = (name: string): string => {
//     if (!name.trim()) return "User name is required";
//     if (!/^[a-zA-Z\s]+$/.test(name)) return "Name should contain only letters and spaces";
//     return "";
//   };

//   // Add new user row
//   const addUserRow = () => {
//     setUsers([...users, { name: "", email: "", nameError: "", emailError: "" }]);
//   };

//   // Remove user row
//   const removeUserRow = (index: number) => {
//     if (users.length > 1) {
//       setUsers(users.filter((_, i) => i !== index));
//     }
//   };

//   // Update user data
//   const updateUser = (index: number, field: keyof UserData, value: string) => {
//     const newUsers = [...users];
//     newUsers[index] = { ...newUsers[index], [field]: value };
    
//     // Clear errors when user starts typing
//     if (field === 'name') {
//       newUsers[index].nameError = "";
//     } else if (field === 'email') {
//       newUsers[index].emailError = "";
//     }
    
//     setUsers(newUsers);
//   };

//   // Validate all users
//   const validateAllUsers = (): boolean => {
//     const newUsers = users.map(user => ({
//       ...user,
//       nameError: validateUserName(user.name),
//       emailError: validateEmail(user.email)
//     }));
    
//     setUsers(newUsers);
//     return newUsers.every(user => !user.nameError && !user.emailError);
//   };

//   // Create multiple users
//   const createMultipleUsers = async () => {
//     if (!validateAllUsers()) return;

//     setIsLoading(true);
//     try {
//       const token = authState.token;
//       const userData = users.map(user => ({
//         name: user.name,
//         email: user.email
//       }));

//       const response = await axios.post(
//         "api/v1/tenant-user",
//         userData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       onClose();
//       window.location.reload();
//     } catch (error) {
//       console.error("Error creating users:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const isFormValid = users.every(user => 
//     user.name && user.email && !user.nameError && !user.emailError
//   );

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        
//         {/* Header */}
//         <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-4 sm:px-6 py-4 sm:py-5">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-white/20 rounded-lg">
//                 <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
//               </div>
//               <div>
//                 <h2 className="text-lg sm:text-xl font-bold text-white">Add Multiple Users</h2>
//                 <p className="text-blue-100 text-xs sm:text-sm font-medium">
//                   Create multiple user accounts at once
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               disabled={isLoading}
//               className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 group"
//             >
//               <X className="h-5 w-5 text-white group-hover:rotate-90 transition-transform duration-200" />
//             </button>
//           </div>
//         </div>

//         {/* Form Content */}
//         <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
//           <div className="space-y-4">
//             {users.map((user, index) => (
//               <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-sm font-semibold text-gray-700">User {index + 1}</h3>
//                   {users.length > 1 && (
//                     <button
//                       onClick={() => removeUserRow(index)}
//                       className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </button>
//                   )}
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {/* Name Field */}
//                   <div className="space-y-2">
//                     <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                       <User className="h-4 w-4 text-blue-600" />
//                       Full Name
//                       <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       placeholder="Enter full name"
//                       value={user.name}
//                       onChange={(e) => updateUser(index, 'name', e.target.value)}
//                       onBlur={() => {
//                         const error = validateUserName(user.name);
//                         updateUser(index, 'nameError', error);
//                       }}
//                       className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                         user.nameError 
//                           ? "border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500" 
//                           : "border-gray-300 hover:border-gray-400"
//                       }`}
//                     />
//                     {user.nameError && (
//                       <p className="text-xs text-red-600 flex items-center gap-1">
//                         <span className="w-1 h-1 bg-red-600 rounded-full"></span>
//                         {user.nameError}
//                       </p>
//                     )}
//                   </div>

//                   {/* Email Field */}
//                   <div className="space-y-2">
//                     <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                       <Mail className="h-4 w-4 text-blue-600" />
//                       Email Address
//                       <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="email"
//                       placeholder="user@company.com"
//                       value={user.email}
//                       onChange={(e) => updateUser(index, 'email', e.target.value)}
//                       onBlur={() => {
//                         const error = validateEmail(user.email);
//                         updateUser(index, 'emailError', error);
//                       }}
//                       className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                         user.emailError 
//                           ? "border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500" 
//                           : "border-gray-300 hover:border-gray-400"
//                       }`}
//                     />
//                     {user.emailError && (
//                       <p className="text-xs text-red-600 flex items-center gap-1">
//                         <span className="w-1 h-1 bg-red-600 rounded-full"></span>
//                         {user.emailError}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Add User Button */}
//           <button
//             onClick={addUserRow}
//             className="mt-4 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2"
//           >
//             <Plus className="h-4 w-4" />
//             Add Another User
//           </button>
//         </div>

//         {/* Action Footer */}
//         <div className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-2 sm:justify-end">
//           <button
//             className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
//             onClick={onClose}
//             disabled={isLoading}
//           >
//             Cancel
//           </button>
//           <button
//             className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 shadow-lg"
//             onClick={createMultipleUsers}
//             disabled={!isFormValid || isLoading}
//           >
//             {isLoading ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
//                 Creating Users...
//               </>
//             ) : (
//               <>
//                 <UserPlus className="h-4 w-4" />
//                 Create {users.length} User{users.length > 1 ? 's' : ''}
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddUserModal;






import { User, Mail, UserPlus, X, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import axios from "../../../../helper/axios";

// Types (keeping your existing interfaces)
interface UserData {
  name: string;
  email: string;
  nameError?: string;
  emailError?: string;
}

type AddMultipleUsersModalProps = {
  onClose: () => void;
  onSave?: (users: UserData[]) => void;
  modules?: any[];
};

const AddUserModal: React.FC<AddMultipleUsersModalProps> = ({
  onClose,
}) => {
  const { authState } = useAuth();
  const [users, setUsers] = useState<UserData[]>([
    { name: "", email: "", nameError: "", emailError: "" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Validation functions
  const validateEmail = (email: string): string => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) return "Email is required";
    if (!re.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validateUserName = (name: string): string => {
    if (!name.trim()) return "User name is required";
    if (!/^[a-zA-Z\s]+$/.test(name)) return "Name should contain only letters and spaces";
    return "";
  };

  const handleEmailConflict = (error: any) => {
    if (error.response?.status === 409) {
      const errorMessage = error.response.data?.detail || "";
      const emailMatch = errorMessage.match(/email '([^']+)'/);
      if (emailMatch) {
        const conflictEmail = emailMatch[1];
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.email.toLowerCase() === conflictEmail.toLowerCase()
              ? { ...user, emailError: `Email '${conflictEmail}' already exists` }
              : user
          )
        );
        return;
      }
    }
    console.error("Error creating users:", error);
  };

  // Add new user row
  const addUserRow = () => {
    setUsers([...users, { name: "", email: "", nameError: "", emailError: "" }]);
  };

  // Remove user row
  const removeUserRow = (index: number) => {
    if (users.length > 1) {
      setUsers(users.filter((_, i) => i !== index));
    }
  };

  // Update user data
  const updateUser = (index: number, field: keyof UserData, value: string) => {
    const newUsers = [...users];
    newUsers[index] = { ...newUsers[index], [field]: value };

    // Clear errors when user starts typing
    if (field === 'name') {
      newUsers[index].nameError = "";
    } else if (field === 'email') {
      newUsers[index].emailError = "";
    }

    setUsers(newUsers);
  };

  // Validate all users
  const validateAllUsers = (): boolean => {
    const newUsers = users.map(user => ({
      ...user,
      nameError: validateUserName(user.name),
      emailError: validateEmail(user.email)
    }));

    setUsers(newUsers);
    return newUsers.every(user => !user.nameError && !user.emailError);
  };

  // Create multiple users
  const createMultipleUsers = async () => {
    if (!validateAllUsers()) return;

    setIsLoading(true);
    try {
      const token = authState.token;
      const userData = users.map(user => ({
        name: user.name,
        email: user.email
      }));

      const response = await axios.post(
        "api/v1/tenant-user",
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error creating users:", error);
      handleEmailConflict(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = users.every(user =>
    user.name && user.email && !user.nameError && !user.emailError
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">

        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Add Multiple Users</h2>
                <p className="text-blue-100 text-xs sm:text-sm font-medium">
                  Create multiple user accounts at once
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 group"
            >
              <X className="h-5 w-5 text-white group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {users.map((user, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700">User {index + 1}</h3>
                  {users.length > 1 && (
                    <button
                      onClick={() => removeUserRow(index)}
                      className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <User className="h-4 w-4 text-blue-600" />
                      Full Name
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={user.name}
                      onChange={(e) => updateUser(index, 'name', e.target.value)}
                      onBlur={() => {
                        const error = validateUserName(user.name);
                        updateUser(index, 'nameError', error);
                      }}
                      className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${user.nameError
                          ? "border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 hover:border-gray-400"
                        }`}
                    />
                    {user.nameError && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                        {user.nameError}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Mail className="h-4 w-4 text-blue-600" />
                      Email Address
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="user@company.com"
                      value={user.email}
                      onChange={(e) => {  // ✅ NEW CODE STARTS HERE
                        updateUser(index, 'email', e.target.value);
                        if (user.emailError) updateUser(index, 'emailError', '');
                      }}
                      onBlur={() => {
                        const error = validateEmail(user.email);
                        updateUser(index, 'emailError', error);
                      }}
                      className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${user.emailError
                          ? "border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 hover:border-gray-400"
                        }`}
                    />
                    {user.emailError && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                        {user.emailError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add User Button */}
          <button
            onClick={addUserRow}
            className="mt-4 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Another User
          </button>
        </div>

        {/* Action Footer */}
        <div className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-2 sm:justify-end">
          <button
            className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 shadow-lg"
            onClick={createMultipleUsers}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Creating Users...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Create {users.length} User{users.length > 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;



