import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({
  requiredRole = null,
  deniedPath = "/login",
}) {
  const { user, loading, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  if (!user) return <Navigate to={deniedPath} />;

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/caja" />;
  }

  return <Outlet />;
}
