
import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { authState } = useContext(AuthContext);
  const location = useLocation();

  if (authState.isLoading) {
    return null;
  }

  const isAuthenticated = authState.isAuthenticated;
  const userType = authState.user_type;
  const isAuthorized =
    isAuthenticated && userType && allowedRoles.includes(userType);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAuthorized) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
