import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Auth check loading
  if (loading) {
    return <Loader text="Checking authentication..." />;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in
  return <Outlet />;
};

export default ProtectedRoute;