// oc-frontend/src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Allow access if user is logged in OR admin token exists
  const adminToken = localStorage.getItem("adminToken");
  if (!user && !adminToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}