// import { useState, useCallback, useMemo, useContext } from "react";
// import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import { HelpCircle, LogOut, X, ChevronLeft, ChevronRight } from "lucide-react";
// import Swal from "sweetalert2";
// import { DashboardRoutes } from "../../router/DashboardRoutes";
// import icons from "../../../public/icons/index";
// import { AuthContext } from "../../context/AuthContext";

// interface SidebarProps {
//   isOpen: boolean;
//   isMobile: boolean;
//   toggleSidebar: () => void;
//   toggleSidebarVisibility: () => void;
// }

// export const DashboardSidebar = ({
//   isOpen,
//   isMobile,
//   toggleSidebar,
//   toggleSidebarVisibility,
// }: SidebarProps) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
//     {}
//   );
//   const { authState, logout } = useContext(AuthContext);

//   // Prefer user_type from context state or fallback to localStorage
//   const userType = useMemo(
//     () => authState.user_type ,
//     [authState.user_type]
//   );

//   const toggleExpand = useCallback((name: string) => {
//     setExpandedItems((prev) => ({ ...prev, [name]: !prev[name] }));
//   }, []);

//   const handleLogout = useCallback(() => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You will be logged out!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, logout!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         logout();
//         Swal.fire({
//           title: "Logged out!",
//           text: "You have been logged out successfully.",
//           icon: "success",
//           timer: 1500,
//           showConfirmButton: false,
//         }).then(() => navigate("/login"));
//       }
//     });
//   }, [logout, navigate]);

//   const filteredRoutes = useMemo(
//     () =>
//       DashboardRoutes.filter((route) => route.allowedRoles.includes(userType)),
//     [userType]
//   );

//   const processedRoutes = useMemo(() => {
//     return DashboardRoutes.filter((route) =>
//       route.allowedRoles.includes(userType)
//     ).map((route) => {
//       const visibleChildren = route.children?.filter((child) =>
//         child.allowedRoles.includes(userType)
//       );

//       const isParentActive =
//         visibleChildren?.some((child) =>
//           location.pathname.startsWith(`/dashboard/${child.path}`)
//         ) || location.pathname === `/dashboard/${route.path}`;

//       return {
//         ...route,
//         visibleChildren,
//         isParentActive,
//       };
//     });
//   }, [userType, location.pathname]);

//   return (
//     <aside
//       className={`bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300
//       ${isOpen ? "w-64" : "w-20"}
//       ${isMobile ? "fixed shadow-lg" : "relative"} z-30`}
//     >
//       {/* Top Logo and Toggle */}
//       <div className="h-20 flex items-center justify-between px-4 border-b border-gray-200">
//         {(!isMobile || isOpen) && (
//           <img
//             src={icons.logo}
//             alt="Dashboard logo"
//             className={`h-15 object-contain ${
//               !isOpen && !isMobile ? "mx-auto" : ""
//             }`}
//             loading="lazy"
//           />
//         )}

//         <div className="flex justify-end w-full">
//           {!isMobile && (
//             <button
//               onClick={toggleSidebar}
//               className="p-2 rounded-full hover:bg-gray-100 text-gray-500 bg-gray-100"
//               aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
//             >
//               {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
//             </button>
//           )}
//           {isMobile && (
//             <button
//               onClick={toggleSidebarVisibility}
//               className="p-2 ml-1 rounded-full hover:bg-gray-100 text-gray-500"
//               aria-label="Close sidebar"
//             >
//               <X size={20} />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Sidebar Menu */}
//       <div className="px-3 py-4 flex-1 overflow-y-auto">
//         <nav className="space-y-2">
//           {/* {filteredRoutes.map((item) => {
//             const visibleChildren = useMemo(
//               () =>
//                 item.children?.filter((child) =>
//                   child.allowedRoles.includes(userType)
//                 ),
//               [item.children, userType]
//             );

//             const isParentActive = useMemo(
//               () =>
//                 visibleChildren?.some((child) =>
//                   location.pathname.startsWith(`/dashboard/${child.path}`)
//                 ) || location.pathname === `/dashboard/${item.path}`,
//               [visibleChildren, location.pathname, item.path]
//             );

//             return (
//               <div key={item.name}>
//                 {visibleChildren && visibleChildren.length > 0 ? (
//                   <>
//                     <button
//                       onClick={() => toggleExpand(item.name)}
//                       className={`flex items-center justify-start w-full px-3 py-2 text-sm rounded-md
//                         ${
//                           isParentActive
//                             ? "bg-[#3BB6FE] text-white"
//                             : "text-gray-700 hover:bg-gray-100"
//                         }`}
//                     >
//                       <span className="text-gray-500">{item.icon}</span>
//                       {isOpen && !isMobile && (
//                         <span className="ml-2">{item.name}</span>
//                       )}
//                     </button>

//                     {expandedItems[item.name] && (
//                       <div
//                         className={`mt-1 space-y-1 ${
//                           isOpen
//                             ? "ml-4"
//                             : "flex flex-col items-center justify-center"
//                         }`}
//                       >
//                         {visibleChildren.map((child) => (
//                           <NavLink
//                             key={child.name}
//                             to={`/dashboard/${child.path}`}
//                             className={({ isActive }) =>
//                               `flex items-center ${
//                                 isOpen ? "px-3" : "justify-center"
//                               } py-2 text-sm rounded-md ${
//                                 isActive
//                                   ? "bg-[#3BB6FE] text-white"
//                                   : "text-gray-700 hover:bg-gray-100"
//                               }`
//                             }
//                             onClick={() => {
//                               if (isMobile) toggleSidebarVisibility();
//                             }}
//                           >
//                             <span className="text-gray-500">{child.icon}</span>
//                             {isOpen && (
//                               <span className="ml-3">{child.name}</span>
//                             )}
//                           </NavLink>
//                         ))}
//                       </div>
//                     )}
//                   </>
//                 ) : (
//                   <NavLink
//                     to={`/dashboard/${item.path}`}
//                     className={({ isActive }) =>
//                       `flex items-center px-3 py-2 text-sm rounded-md ${
//                         isActive
//                           ? "bg-[#3BB6FE] text-white"
//                           : "text-gray-700 hover:bg-gray-100"
//                       }`
//                     }
//                     onClick={() => {
//                       if (isMobile) toggleSidebarVisibility();
//                     }}
//                   >
//                     <span className="text-gray-500">{item.icon}</span>
//                     {isOpen && !isMobile && (
//                       <span className="ml-3">{item.name}</span>
//                     )}
//                   </NavLink>
//                 )}
//               </div>
//             );
//           })} */}

//           {processedRoutes.map((item) => (
//             <div key={item.name}>
//               {item.visibleChildren && item.visibleChildren.length > 0 ? (
//                 <>
//                   <button
//                     onClick={() => toggleExpand(item.name)}
//                     className={`flex items-center justify-start w-full px-3 py-2 text-sm rounded-md
//             ${
//               item.isParentActive
//                 ? "bg-[#3BB6FE] text-white"
//                 : "text-gray-700 hover:bg-gray-100"
//             }`}
//                   >
//                     <span className="text-gray-500">{item.icon}</span>
//                     {isOpen && !isMobile && (
//                       <span className="ml-2">{item.name}</span>
//                     )}
//                   </button>

//                   {expandedItems[item.name] && (
//                     <div
//                       className={`mt-1 space-y-1 ${
//                         isOpen
//                           ? "ml-4"
//                           : "flex flex-col items-center justify-center"
//                       }`}
//                     >
//                       {item.visibleChildren.map((child) => (
//                         <NavLink
//                           key={child.name}
//                           to={`/dashboard/${child.path}`}
//                           className={({ isActive }) =>
//                             `flex items-center ${
//                               isOpen ? "px-3" : "justify-center"
//                             } py-2 text-sm rounded-md ${
//                               isActive
//                                 ? "bg-[#3BB6FE] text-white"
//                                 : "text-gray-700 hover:bg-gray-100"
//                             }`
//                           }
//                           onClick={() => {
//                             if (isMobile) toggleSidebarVisibility();
//                           }}
//                         >
//                           <span className="text-gray-500">{child.icon}</span>
//                           {isOpen && <span className="ml-3">{child.name}</span>}
//                         </NavLink>
//                       ))}
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <NavLink
//                   to={`/dashboard/${item.path}`}
//                   className={({ isActive }) =>
//                     `flex items-center px-3 py-2 text-sm rounded-md ${
//                       isActive
//                         ? "bg-[#3BB6FE] text-white"
//                         : "text-gray-700 hover:bg-gray-100"
//                     }`
//                   }
//                   onClick={() => {
//                     if (isMobile) toggleSidebarVisibility();
//                   }}
//                 >
//                   <span className="text-gray-500">{item.icon}</span>
//                   {isOpen && !isMobile && (
//                     <span className="ml-3">{item.name}</span>
//                   )}
//                 </NavLink>
//               )}
//             </div>
//           ))}
//         </nav>
//       </div>

//       {/* Bottom Menu */}
//       <div className="p-3 border-t border-gray-200">
//         <button className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100 w-full">
//           <HelpCircle size={20} className="text-gray-500" />
//           {isOpen && !isMobile && <span className="ml-3">Help</span>}
//         </button>
//         <button
//           className="flex items-center px-3 py-2 text-sm rounded-md text-red-600 hover:bg-red-50 w-full mt-2"
//           onClick={handleLogout}
//         >
//           <LogOut size={20} className="text-red-500" />
//           {isOpen && !isMobile && <span className="ml-3">Logout</span>}
//         </button>
//       </div>
//     </aside>
//   );
// };






// import { useState, useCallback, useMemo, useContext } from "react";
// import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import { HelpCircle, LogOut, X, ChevronLeft, ChevronRight } from "lucide-react";
// import Swal from "sweetalert2";
// import { DashboardRoutes } from "../../router/DashboardRoutes";
// import icons from "../../../public/icons/index";
// import { AuthContext } from "../../context/AuthContext";

// interface SidebarProps {
//   isOpen: boolean;
//   isMobile: boolean;
//   toggleSidebar: () => void;
//   toggleSidebarVisibility: () => void;
// }

// export const DashboardSidebar = ({
//   isOpen,
//   isMobile,
//   toggleSidebar,
//   toggleSidebarVisibility,
// }: SidebarProps) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
//   const { authState, logout } = useContext(AuthContext);

//   const userType = useMemo(
//     () => authState.user_type,
//     [authState.user_type]
//   );

//   const toggleExpand = useCallback((name: string) => {
//     setExpandedItems((prev) => ({ ...prev, [name]: !prev[name] }));
//   }, []);

//   const handleLogout = useCallback(() => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You will be logged out!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, logout!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         logout();
//         Swal.fire({
//           title: "Logged out!",
//           text: "You have been logged out successfully.",
//           icon: "success",
//           timer: 1500,
//           showConfirmButton: false,
//         }).then(() => navigate("/login"));
//       }
//     });
//   }, [logout, navigate]);

//   // Helper function to check if any child route is active
//   const isChildRouteActive = (children: any[], basePath?: string) => {
//     return children?.some((child) => {
//       const fullPath = `/dashboard/${child.path}`;
//       if (child.children) {
//         return isChildRouteActive(child.children, child.path);
//       }
//       return location.pathname === fullPath || location.pathname.startsWith(fullPath + '/');
//     });
//   };

//   // Helper function to render nested children (for Master submenu)
//   const renderNestedChildren = (children: any[], parentName: string, level: number = 1) => {
//     return children.map((child) => (
//       <div key={child.name} className={`ml-${level * 3}`}>
//         {child.children && child.children.length > 0 ? (
//           <>
//             <button
//               onClick={() => toggleExpand(`${parentName}-${child.name}`)}
//               className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group
//                 ${isChildRouteActive(child.children, child.path)
//                   ? " text-blue-700 border border-blue-200"
//                   : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//                 }`}
//             >
//               <span className={`flex-shrink-0 ${isChildRouteActive(child.children, child.path) ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"}`}>
//                 {child.icon}
//               </span>
//               <span className="ml-3 truncate">{child.name}</span>
//             </button>

//             {expandedItems[`${parentName}-${child.name}`] && (
//               <div className="mt-1 space-y-1">
//                 {child.children
//                   .filter((nestedChild: any) => nestedChild.allowedRoles.includes(userType))
//                   .map((nestedChild: any) => (
//                     <NavLink
//                       key={nestedChild.name}
//                       to={`/dashboard/${nestedChild.path}`}
//                       className={({ isActive }) =>
//                         `flex items-center px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
//                           isActive
//                             ? "bg-[#3BB6FE] text-white shadow-sm"
//                             : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//                         }`
//                       }
//                       onClick={() => {
//                         if (isMobile) toggleSidebarVisibility();
//                       }}
//                     >
//                       <span className="flex-shrink-0 text-current">
//                         {nestedChild.icon}
//                       </span>
//                       <span className="ml-3 truncate">{nestedChild.name}</span>
//                     </NavLink>
//                   ))}
//               </div>
//             )}
//           </>
//         ) : (
//           <NavLink
//             to={`/dashboard/${child.path}`}
//             className={({ isActive }) =>
//               `flex items-center px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
//                 isActive
//                   ? "bg-[#3BB6FE] text-white shadow-sm"
//                   : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//               }`
//             }
//             onClick={() => {
//               if (isMobile) toggleSidebarVisibility();
//             }}
//           >
//             <span className="flex-shrink-0 text-current">
//               {child.icon}
//             </span>
//             <span className="ml-3 truncate">{child.name}</span>
//           </NavLink>
//         )}
//       </div>
//     ));
//   };

//   const processedRoutes = useMemo(() => {
//     return DashboardRoutes.filter((route) =>
//       route.allowedRoles.includes(userType)
//     ).map((route) => {
//       const visibleChildren = route.children?.filter((child) =>
//         child.allowedRoles.includes(userType)
//       );

//       const isParentActive =
//         visibleChildren?.some((child) => {
//           if (child.children) {
//             return isChildRouteActive(child.children, child.path);
//           }
//           return location.pathname.startsWith(`/dashboard/${child.path}`);
//         }) || location.pathname === `/dashboard/${route.path}`;

//       return {
//         ...route,
//         visibleChildren,
//         isParentActive,
//       };
//     });
//   }, [userType, location.pathname]);

//   return (
//     <aside
//       className={`bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 ease-in-out
//       ${isOpen ? "w-64" : "w-16"}
//       ${isMobile ? "fixed shadow-xl z-50" : "relative z-30"}`}
//     >
//       {/* Header Section */}
//       <div className="h-16 flex items-center justify-between px-3 border-b border-gray-200 bg-gray-50">
//         {isOpen && (
//           <div className="flex items-center min-w-0">
//             <img
//               src={icons.logo}
//               alt="Dashboard logo"
//               className="h-8 w-auto object-contain flex-shrink-0"
//               loading="lazy"
//             />
//           </div>
//         )}

//         <div className={`flex ${isOpen ? "justify-end" : "justify-center"} ${isOpen ? "" : "w-full"}`}>
//           {!isMobile && (
//             <button
//               onClick={toggleSidebar}
//               className="p-1.5 rounded-md hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200"
//               aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
//             >
//               {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
//             </button>
//           )}
//           {isMobile && (
//             <button
//               onClick={toggleSidebarVisibility}
//               className="p-1.5 rounded-md hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200"
//               aria-label="Close sidebar"
//             >
//               <X size={18} />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Navigation Menu */}
//       <div className="flex-1 overflow-y-auto py-3 px-2">
//         <nav className="space-y-1">
//           {processedRoutes.map((item) => (
//             <div key={item.name}>
//               {item.visibleChildren && item.visibleChildren.length > 0 ? (
//                 <>
//                   <button
//                     onClick={() => toggleExpand(item.name)}
//                     className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group
//                       ${item.isParentActive
//                         ? " text-blue-700 border border-blue-200"
//                         : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//                       }`}
//                   >
//                     <span className={`flex-shrink-0 ${item.isParentActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"}`}>
//                       {item.icon}
//                     </span>
//                     {isOpen && (
//                       <span className="ml-3 truncate">{item.name}</span>
//                     )}
//                   </button>

//                   {expandedItems[item.name] && isOpen && (
//                     <div className="mt-1 ml-3 space-y-1">
//                       {renderNestedChildren(item.visibleChildren, item.name)}
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <NavLink
//                   to={`/dashboard/${item.path}`}
//                   className={({ isActive }) =>
//                     `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
//                       isActive
//                         ? "bg-[#3BB6FE] text-white shadow-sm"
//                         : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//                     }`
//                   }
//                   onClick={() => {
//                     if (isMobile) toggleSidebarVisibility();
//                   }}
//                 >
//                   <span className={`flex-shrink-0 text-current`}>
//                     {item.icon}
//                   </span>
//                   {isOpen && (
//                     <span className="ml-3 truncate">{item.name}</span>
//                   )}
//                 </NavLink>
//               )}
//             </div>
//           ))}
//         </nav>
//       </div>

//       {/* Footer Section */}
//       <div className="border-t border-gray-200 p-2 bg-gray-50">
//         <button 
//           className={`flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 ${!isOpen ? "justify-center" : ""}`}
//         >
//           <HelpCircle size={18} className="text-gray-500 flex-shrink-0" />
//           {isOpen && <span className="ml-3 truncate">Help</span>}
//         </button>
//         <button
//           className={`flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-all duration-200 mt-1 ${!isOpen ? "justify-center" : ""}`}
//           onClick={handleLogout}
//         >
//           <LogOut size={18} className="text-red-500 flex-shrink-0" />
//           {isOpen && <span className="ml-3 truncate">Logout</span>}
//         </button>
//       </div>
//     </aside>
//   );
// };






import { ChevronLeft, ChevronRight, ChevronDown, HelpCircle, LogOut, X } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import icons from "../../../public/icons";
import { useState, useContext, useMemo, useCallback } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";
import { DashboardRoutes } from "../../router/DashboardRoutes";

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
  toggleSidebarVisibility: () => void;
}

export const DashboardSidebar = ({
  isOpen,
  isMobile,
  toggleSidebar,
  toggleSidebarVisibility,
}: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const { authState, logout } = useContext(AuthContext);

  const userType = useMemo(
    () => authState.user_type,
    [authState.user_type]
  );

  // Updated toggleExpand to only allow one parent dropdown open at a time
  const toggleExpand = useCallback((name: string) => {
    setExpandedItems((prev) => {
      // Check if we're toggling a top-level parent or a nested item
      const isTopLevelParent = !name.includes('-');
      
      if (isTopLevelParent) {
        // For top-level parents, close all other top-level parents
        const newState: Record<string, boolean> = {};
        
        // Close all top-level parents
        Object.keys(prev).forEach(key => {
          if (!key.includes('-')) {
            newState[key] = false;
          } else {
            // Keep nested items as they were if their parent is being opened
            const parentName = key.split('-')[0];
            if (parentName === name && prev[name]) {
              newState[key] = prev[key];
            } else {
              newState[key] = false;
            }
          }
        });
        
        // Toggle the current parent
        newState[name] = !prev[name];
        
        return newState;
      } else {
        // For nested items, just toggle normally
        return { ...prev, [name]: !prev[name] };
      }
    });
  }, []);

  const handleLogout = useCallback(() => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          title: "Logged out!",
          text: "You have been logged out successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => navigate("/login"));
      }
    });
  }, [logout, navigate]);

  const isChildRouteActive = (children: any[], basePath?: string): boolean => {
    return children?.some((child) => {
      const fullPath = `/dashboard/${child.path}`;
      if (child.children) {
        return isChildRouteActive(child.children, child.path);
      }
      return location.pathname === fullPath || location.pathname.startsWith(fullPath + '/');
    }) ?? false;
  };

  const renderNestedChildren = (children: any[], parentName: string, level: number = 1) => {
    return children.map((child) => (
      <div key={child.name} className={`${isOpen ? `ml-${level * 3}` : ''}`}>
        {child.children && child.children.length > 0 ? (
          <>
            <button
              onClick={() => toggleExpand(`${parentName}-${child.name}`)}
              className={`flex items-center w-full px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200 group ${!isOpen ? "justify-center" : "justify-between"}
                ${isChildRouteActive(child.children, child.path)
                  ? " text-blue-700 border border-blue-200"
                  : "text-gray-800 hover:bg-gray-100 hover:text-black"
                }`}
            >
              <div className="flex items-center">
                <span className={`flex-shrink-0 ${isChildRouteActive(child.children, child.path) ? "text-blue-600" : "text-gray-700 group-hover:text-black"}`}>
                  {child.icon}
                </span>
                {isOpen && <span className="ml-3 truncate font-semibold">{child.name}</span>}
              </div>
              {isOpen && (
                <span className={`flex-shrink-0 transition-transform duration-200 ${expandedItems[`${parentName}-${child.name}`] ? 'rotate-180' : ''}`}>
                  <ChevronDown size={16} />
                </span>
              )}
            </button>

            {expandedItems[`${parentName}-${child.name}`] && (
              <div className={`${isOpen ? "mt-1 space-y-1" : "space-y-1"}`}>
                {child.children
                  .filter((nestedChild: any) => nestedChild.allowedRoles.includes(userType))
                  .map((nestedChild: any) => (
                    <NavLink
                      key={nestedChild.name}
                      to={`/dashboard/${nestedChild.path}`}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${!isOpen ? "justify-center" : ""} ${
                          isActive
                            ? "bg-[#3BB6FE] text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`
                      }
                      onClick={() => {
                        if (isMobile) toggleSidebarVisibility();
                      }}
                    >
                      <span className="flex-shrink-0 text-current">
                        {nestedChild.icon}
                      </span>
                      {isOpen && <span className="ml-3 truncate">{nestedChild.name}</span>}
                    </NavLink>
                  ))}
              </div>
            )}
          </>
        ) : (
          <NavLink
            to={`/dashboard/${child.path}`}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${!isOpen ? "justify-center" : ""} ${
                isActive
                  ? "bg-[#3BB6FE] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`
            }
            onClick={() => {
              if (isMobile) toggleSidebarVisibility();
            }}
          >
            <span className="flex-shrink-0 text-current">
              {child.icon}
            </span>
            {isOpen && <span className="ml-3 truncate">{child.name}</span>}
          </NavLink>
        )}
      </div>
    ));
  };

  const processedRoutes = useMemo(() => {
    return DashboardRoutes.filter((route) =>
      route.allowedRoles.includes(userType ?? "")
    ).map((route) => {
      const visibleChildren = route.children?.filter((child) =>
        child.allowedRoles.includes(userType ?? "")
      );

      const isParentActive =
        visibleChildren?.some((child) => {
          if (child.children) {
            return isChildRouteActive(child.children, child.path);
          }
          return location.pathname.startsWith(`/dashboard/${child.path}`);
        }) || location.pathname === `/dashboard/${route.path}`;

      return {
        ...route,
        visibleChildren,
        isParentActive,
      };
    });
  }, [userType, location.pathname]);

  return (
    <aside
      className={`bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 ease-in-out
      ${isOpen ? "w-64" : "w-16"}
      ${isMobile ? "fixed shadow-xl z-50" : "relative z-30"}`}
    >
      {/* Header Section */}
      <div className="h-16 flex items-center justify-between px-3 border-b border-gray-200 bg-gray-50">
        {isOpen && (
          <div className="flex items-center min-w-0">
            <img
              src={icons.logo}
              alt="Dashboard logo"
              className="h-8 w-auto object-contain flex-shrink-0"
              loading="lazy"
            />
          </div>
        )}

        <div className={`flex ${isOpen ? "justify-end" : "justify-center"} ${isOpen ? "" : "w-full"}`}>
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-md hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200"
              aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          )}
          {isMobile && (
            <button
              onClick={toggleSidebarVisibility}
              className="p-1.5 rounded-md hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-3 px-2">
        <nav className="space-y-1">
          {processedRoutes.map((item) => (
            <div key={item.name} className="relative">
              {item.visibleChildren && item.visibleChildren.length > 0 ? (
                <>
                  <button
                    onClick={() => toggleExpand(item.name)}
                    className={`flex items-center w-full px-3 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 group ${!isOpen ? "justify-center" : "justify-between"}
                      ${item.isParentActive
                        ? " text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-100 hover:text-black"
                      }`}
                  >
                    <div className="flex items-center">
                      <span className={`flex-shrink-0 ${item.isParentActive ? "text-blue-600" : "text-gray-800 group-hover:text-black"}`}>
                        {item.icon}
                      </span>
                      {isOpen && <span className="ml-3 truncate font-bold">{item.name}</span>}
                    </div>
                    {isOpen && (
                      <span className={`flex-shrink-0 transition-transform duration-200 ${expandedItems[item.name] ? 'rotate-180' : ''}`}>
                        <ChevronDown size={16} />
                      </span>
                    )}
                  </button>

                  {expandedItems[item.name] && (
                    <div className={`${isOpen ? "mt-1 space-y-1" : "space-y-1"}`}>
                      {renderNestedChildren(item.visibleChildren, item.name)}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={`/dashboard/${item.path}`}
                  className={({ isActive }) =>
                    `flex items-center w-full px-3 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 group ${!isOpen ? "justify-center" : ""} ${
                      isActive
                        ? "bg-[#3BB6FE] text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 hover:text-black"
                    }`
                  }
                  onClick={() => {
                    if (isMobile) toggleSidebarVisibility();
                  }}
                >
                  <span className={`flex-shrink-0 text-current`}>
                    {item.icon}
                  </span>
                  {isOpen && <span className="ml-3 truncate font-bold">{item.name}</span>}
                </NavLink>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Section */}
      <div className="border-t border-gray-200 p-2 bg-gray-50">
        <button 
          className={`flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 ${!isOpen ? "justify-center" : ""}`}
        >
          <HelpCircle size={18} className="text-gray-500 flex-shrink-0" />
          {isOpen && <span className="ml-3 truncate">Help</span>}
        </button>
        <button
          className={`flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-all duration-200 mt-1 ${!isOpen ? "justify-center" : ""}`}
          onClick={handleLogout}
        >
          <LogOut size={18} className="text-red-500 flex-shrink-0" />
          {isOpen && <span className="ml-3 truncate">Logout</span>}
        </button>
      </div>
    </aside>
  );
};






// import { useState, useCallback, useMemo, useContext } from "react";
// import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import { HelpCircle, LogOut, X, ChevronLeft, ChevronRight } from "lucide-react";
// import Swal from "sweetalert2";
// import { DashboardRoutes } from "../../router/DashboardRoutes";
// import icons from "../../../public/icons/index";
// import { AuthContext } from "../../context/AuthContext";

// interface SidebarProps {
//   isOpen: boolean;
//   isMobile: boolean;
//   toggleSidebar: () => void;
//   toggleSidebarVisibility: () => void;
// }

// export const DashboardSidebar = ({
//   isOpen,
//   isMobile,
//   toggleSidebar,
//   toggleSidebarVisibility,
// }: SidebarProps) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
//   const { authState, logout } = useContext(AuthContext);

//   const userType = useMemo(
//     () => authState.user_type,
//     [authState.user_type]
//   );

//   const toggleExpand = useCallback((name: string) => {
//     setExpandedItems((prev) => ({ ...prev, [name]: !prev[name] }));
//   }, []);

//   const handleLogout = useCallback(() => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You will be logged out!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, logout!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         logout();
//         Swal.fire({
//           title: "Logged out!",
//           text: "You have been logged out successfully.",
//           icon: "success",
//           timer: 1500,
//           showConfirmButton: false,
//         }).then(() => navigate("/login"));
//       }
//     });
//   }, [logout, navigate]);

//   const processedRoutes = useMemo(() => {
//     return DashboardRoutes.filter((route) =>
//       route.allowedRoles.includes(userType)
//     ).map((route) => {
//       const visibleChildren = route.children?.filter((child) =>
//         child.allowedRoles.includes(userType)
//       );

//       const isParentActive =
//         visibleChildren?.some((child) =>
//           location.pathname.startsWith(`/dashboard/${child.path}`)
//         ) || location.pathname === `/dashboard/${route.path}`;

//       return {
//         ...route,
//         visibleChildren,
//         isParentActive,
//       };
//     });
//   }, [userType, location.pathname]);

//   return (
//     <aside
//       className={`bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 ease-in-out
//       ${isOpen ? "w-64" : "w-16"}
//       ${isMobile ? "fixed shadow-xl z-50" : "relative z-30"}`}
//     >
//       {/* Header Section */}
//       <div className="h-16 flex items-center justify-between px-3 border-b border-gray-200 bg-gray-50">
//         {isOpen && (
//           <div className="flex items-center min-w-0">
//             <img
//               src={icons.logo}
//               alt="Dashboard logo"
//               className="h-8 w-auto object-contain flex-shrink-0"
//               loading="lazy"
//             />
//           </div>
//         )}

//         <div className={`flex ${isOpen ? "justify-end" : "justify-center"} ${isOpen ? "" : "w-full"}`}>
//           {!isMobile && (
//             <button
//               onClick={toggleSidebar}
//               className="p-1.5 rounded-md hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200"
//               aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
//             >
//               {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
//             </button>
//           )}
//           {isMobile && (
//             <button
//               onClick={toggleSidebarVisibility}
//               className="p-1.5 rounded-md hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200"
//               aria-label="Close sidebar"
//             >
//               <X size={18} />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Navigation Menu */}
//       <div className="flex-1 overflow-y-auto py-3 px-2">
//         <nav className="space-y-1">
//           {processedRoutes.map((item) => (
//             <div key={item.name}>
//               {item.visibleChildren && item.visibleChildren.length > 0 ? (
//                 <>
//                   <button
//                     onClick={() => toggleExpand(item.name)}
//                     className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group
//                       ${item.isParentActive
//                         ? "bg-3BB6FE text-blue-700 border border-blue-200"
//                         : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//                       }`}
//                   >
//                     <span className={`flex-shrink-0 ${item.isParentActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"}`}>
//                       {item.icon}
//                     </span>
//                     {isOpen && (
//                       <span className="ml-3 truncate">{item.name}</span>
//                     )}
//                   </button>

//                   {expandedItems[item.name] && isOpen && (
//                     <div className="mt-1 ml-6 space-y-1">
//                       {item.visibleChildren.map((child) => (
//                         <NavLink
//                           key={child.name}
//                           to={`/dashboard/${child.path}`}
//                           className={({ isActive }) =>
//                             `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
//                               isActive
//                                 ? "bg-[#3BB6FE] text-white shadow-sm"
//                                 : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//                             }`
//                           }
//                           onClick={() => {
//                             if (isMobile) toggleSidebarVisibility();
//                           }}
//                         >
//                           <span className={`flex-shrink-0 text-current`}>
//                             {child.icon}
//                           </span>
//                           <span className="ml-3 truncate">{child.name}</span>
//                         </NavLink>
//                       ))}
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <NavLink
//                   to={`/dashboard/${item.path}`}
//                   className={({ isActive }) =>
//                     `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
//                       isActive
//                         ? "bg-[#3BB6FE] text-white shadow-sm"
//                         : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//                     }`
//                   }
//                   onClick={() => {
//                     if (isMobile) toggleSidebarVisibility();
//                   }}
//                 >
//                   <span className={`flex-shrink-0 text-current`}>
//                     {item.icon}
//                   </span>
//                   {isOpen && (
//                     <span className="ml-3 truncate">{item.name}</span>
//                   )}
//                 </NavLink>
//               )}
//             </div>
//           ))}
//         </nav>
//       </div>

//       {/* Footer Section */}
//       <div className="border-t border-gray-200 p-2 bg-gray-50">
//         <button 
//           className={`flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 ${!isOpen ? "justify-center" : ""}`}
//         >
//           <HelpCircle size={18} className="text-gray-500 flex-shrink-0" />
//           {isOpen && <span className="ml-3 truncate">Help</span>}
//         </button>
//         <button
//           className={`flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-all duration-200 mt-1 ${!isOpen ? "justify-center" : ""}`}
//           onClick={handleLogout}
//         >
//           <LogOut size={18} className="text-red-500 flex-shrink-0" />
//           {isOpen && <span className="ml-3 truncate">Logout</span>}
//         </button>
//       </div>
//     </aside>
//   );
// };