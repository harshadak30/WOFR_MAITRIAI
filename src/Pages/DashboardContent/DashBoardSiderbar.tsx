
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

  const isChildRouteActive = (children: any[], _basePath?: string): boolean => {
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


