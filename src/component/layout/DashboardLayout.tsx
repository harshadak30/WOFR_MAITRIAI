import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { DashboardSidebar } from "../../Pages/DashboardContent/DashBoardSiderbar";
import { DashboardHeader } from "../../Pages/DashboardContent/DashBoardHeader";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle mobile detection and sidebar state
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
      setSidebarVisible(!mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleOverlayClick = () => {
    if (isMobile) setSidebarVisible(false);
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarVisible(!sidebarVisible);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const toggleSidebarVisibility = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="flex h-screen bg-[#f0f1f5] relative">
      {/* Overlay for mobile */}
      {isMobile && sidebarVisible && (
        <div
          className="fixed inset-0 bg-transparent z-20"
          onClick={handleOverlayClick}
        />
      )}

      <div
        className={`transition-all duration-300 ${
          isMobile && !sidebarVisible ? "hidden" : ""
        }`}
      >
        <DashboardSidebar
          isOpen={sidebarOpen}
          isMobile={isMobile}
          toggleSidebar={toggleSidebar}
          toggleSidebarVisibility={toggleSidebarVisibility}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          toggleSidebar={isMobile ? toggleSidebarVisibility : toggleSidebar}
          sidebarVisible={sidebarVisible}
        />
        <div className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
