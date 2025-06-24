

import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Bell, ChevronRight, Menu } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

interface HeaderProps {
  toggleSidebar?: () => void;
  sidebarVisible?: boolean;
}

const PAGE_INFO = {
  "/dashboard/modules": {
    title: "Module Management",
    description: "Manage your application modules and their settings.",
  },
  "/dashboard/users": {
    title: "User Management",
    description: "View and manage your organization's users and their access rights.",
  },
  "/dashboard/new": {
    title: "Our User Management",
    description: "View and manage your organization's users and their access rights.",
  },
  "/dashboard/roles": {
    title: "Our role Management",
    description: "View and manage your organization's users and their access rights.",
  },
  "/dashboard/financial": {
    title: "Financial Dashboard",
    description: "View financial reports and analytics.",
  },
  "/dashboard/role-management": {
    title: "Role Management",
    description: "View and manage your roles and their permissions.",
  },
  "/dashboard/Lease": {
    title: "Lease Management",
    description: "View and manage your roles and their permissions.",
  },
  "/dashboard/module": {
    title: "Module Management",
    description: "Manage your application modules and their settings.",
  },
  "dashboard/users": {
    title: "User Management",
    description: "View and manage your organization's users and their access rights.",
  },
  "/dashboard/role-mangement" :{
    title: "Role Management",
    description: "View and manage your roles and their permissions.",
  },
  "/dashboard/org-form" :{
    title: "Organazation Management",
    description: "View and manage your Organization's settings.",
  },
  "/dashboard/Entity":{
    title:"Entity Management",
    description: "View and manage your Entity's settings.",
  }
  ,
  "/dashboard/Lessor":{
    title:"Lessor Management",
    description: "View and manage your Lessor's settings.",
  }
  ,
  "/dashboard/Asset":{
    title:"Asset Management",
    description: "View and manage your Asset's settings.",
  },
  "/dashboard/GL":{
    title:"GL Management",
    description: "View and manage your GL's settings.",
  }
  ,
  "/dashboard/department":{
    title:"Department Management",
    description: "View and manage your department's settings.",
  },
  "/dashboard/Currency":{
    title:"Currency Management",
    description: "View and manage your Currency's settings.",
  }
};

export const DashboardHeader = ({
  toggleSidebar,
  sidebarVisible = true,
}: HeaderProps) => {
  const location = useLocation();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { authState } = useAuth();

  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 650);
  }, []);

  useEffect(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [checkMobile]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const target = event.target as Element;
      if (isNotificationsOpen && !target.closest("[data-notifications]")) {
        setIsNotificationsOpen(false);
      }
    },
    [isNotificationsOpen]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const { pageTitle, pageDescription } = useMemo(() => {
    if (location.pathname === "/dashboard/overview") {
      return {
        pageTitle: `Welcome!!!`,
        pageDescription: "Here's what's happening with your enterprise dashboard today.",
      };
    }

    const pathInfo = PAGE_INFO[location.pathname as keyof typeof PAGE_INFO];
    if (pathInfo) {
      return {
        pageTitle: pathInfo.title,
        pageDescription: pathInfo.description,
      };
    }

    if (location.pathname.startsWith("/users/")) {
      return {
        pageTitle: "User Profile",
        pageDescription: "",
      };
    }

    return {
      pageTitle: "Dashboard",
      pageDescription: "",
    };
  }, [location.pathname, authState]);

  const toggleNotifications = useCallback(() => {
    setIsNotificationsOpen((prev) => !prev);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="px-4 lg:px-6 py-3 flex items-center justify-between min-h-[64px]">
        {/* Left Section */}
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              aria-label="Toggle sidebar"
            >
              {sidebarVisible ? <Menu size={20} /> : <ChevronRight size={20} />}
            </button>
          )}

          <div className="min-w-0 flex-1">
            <h1 className="font-semibold text-gray-900 text-lg lg:text-xl xl:text-2xl truncate">
              {pageTitle}
            </h1>
            {pageDescription && (
              <p className="text-sm text-gray-600 mt-0.5 truncate hidden sm:block">
                {pageDescription}
              </p>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3 lg:space-x-4 flex-shrink-0">
          {/* Notifications */}
          <div className="relative" data-notifications>
            <button
              onClick={toggleNotifications}
              className="relative p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              aria-label="Notifications"
              aria-expanded={isNotificationsOpen}
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fadeIn">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {[1, 2, 3].map((_, i) => (
                    <div
                      key={i}
                      className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                    >
                      <p className="text-sm font-medium text-gray-900">
                        New user registered
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        10 minutes ago
                      </p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-gray-200">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Section */}
          <div className="flex items-center space-x-2 lg:space-x-3">
            {authState?.user_type && (
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                  authState.user_type === "Super Admin"
                    ? "bg-red-100 text-red-700"
                    : authState.user_type === "Master Admin"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {authState.user_type}
              </span>
            )}
            <button 
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full transition-all duration-200 hover:scale-105" 
              aria-label="User profile"
            >
              <img
                src="https://i.pravatar.cc/40?img=68"
                alt="User profile"
                className="w-8 h-8 lg:w-9 lg:h-9 rounded-full border-2 border-gray-200 shadow-sm"
                width="36"
                height="36"
                loading="lazy"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Description */}
      {/* {isMobile && pageDescription && (
        <div className="px-4 pb-3 ">
          <p className="text-xs text-gray-600 leading-relaxed">{pageDescription}</p>
        </div>
      )} */}
    </header>
  );
};