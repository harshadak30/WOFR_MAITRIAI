


import { RouteObject, Navigate } from "react-router-dom";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import AppSolutions from "../Pages/WORF/AppSolution";
import FreeTrial from "../Pages/WORF/FreeTrial";
import WofrLeaseIntro from "../Pages/WORF/WofrLeaseIntro";
import ResetPasswordForm from "../Pages/Auth/ResetPasswordForm";
import WOFRDashboard from "../Pages/HomeScreen/Dashboard";
import Calendly from "../Calendly/Calendly";
import NotFound from "../Pages/NotFound";
import { DashboardRoutes } from "./DashboardRoutes";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "../Pages/unauthorized/Unauthorized";
import BulkUpload from "../Pages/LeaseMangement/createLease/BulkUpload/BulkUpload";
import CreateLease from "../Pages/LeaseMangement/createLease/CreateLease";
import PublicLayoutWrapper from "../component/layout/PublicLayoutWrapper";
import DashboardLayout from "../component/layout/DashboardLayout";
import UserProfile from "../Pages/MasterAdmin/Users/UserProfile";
import SuperUserProfile from "../Pages/SuperAdminPages/User/SuperUserProfile";

export const publicRoutes: RouteObject[] = [
  {
    element: <PublicLayoutWrapper />,
    children: [
      {
        path: "/",
        element: <WOFRDashboard />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/book-demo",
        element: <Calendly />,
      },
      {
        path: "/wofr/lease-intro",
        element: <WofrLeaseIntro />,
      },
      {
        path: "/free-trial",
        element: <FreeTrial />,
      },
      {
        path: "/explore-solutions",
        element: <AppSolutions />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordForm />,
      },
    ],
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

// Function to recursively flatten all routes (including nested children)
const flattenRoutes = (routes: any[]): any[] => {
  const flattened: any[] = [];

  routes.forEach((route) => {
    // Add the main route if it has an element
    if (route.element) {
      flattened.push({
        path: route.path,
        element: (
          <ProtectedRoute allowedRoles={route.allowedRoles}>
            {route.element}
          </ProtectedRoute>
        ),
      });
    }

    // Process children recursively
    if (route.children) {
      route.children.forEach((child: any) => {
        // Add child route if it has an element
        if (child.element) {
          flattened.push({
            path: child.path,
            element: (
              <ProtectedRoute allowedRoles={child.allowedRoles}>
                {child.element}
              </ProtectedRoute>
            ),
          });
        }

        // Process nested children (like Master submenu items)
        if (child.children) {
          child.children.forEach((nestedChild: any) => {
            if (nestedChild.element) {
              flattened.push({
                path: nestedChild.path,
                element: (
                  <ProtectedRoute allowedRoles={nestedChild.allowedRoles}>
                    {nestedChild.element}
                  </ProtectedRoute>
                ),
              });
            }
          });
        }
      });
    }
  });

  return flattened;
};

const InitialDashboardRedirect = () => {
  const lastRoute = localStorage.getItem('lastRoute');
  
  // Check if the lastRoute is valid and not the dashboard overview
  if (lastRoute && lastRoute !== '/dashboard/overview') {
    return <Navigate to={lastRoute} replace />;
  }
  
  // Default to overview
  return <Navigate to="/dashboard/overview" replace />;
};

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <InitialDashboardRedirect />,
      },
      
      // Use the new flatten function to handle all nested routes
      ...flattenRoutes(DashboardRoutes),

      // Additional dynamic routes
      {
        path: "users/userDetails/:id",
        element: (
          <ProtectedRoute allowedRoles={["dev", "master_admin", "super_admin"]}>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/SuperuserDetails/:id",
        element: (
          <ProtectedRoute allowedRoles={["dev", "super_admin"]}>
            <SuperUserProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "create-lease",
        element: (
          <ProtectedRoute allowedRoles={["dev", "master_admin", "super_admin"]}>
            <CreateLease />
          </ProtectedRoute>
        ),
      },
      {
        path: "bulk-upload",
        element: (
          <ProtectedRoute allowedRoles={["dev", "master_admin", "super_admin"]}>
            <BulkUpload />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
