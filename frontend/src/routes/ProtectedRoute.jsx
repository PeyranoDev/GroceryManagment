import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({
  user,
  onlyAdmin = false,
  deniedPath = "/login",
}) {
  if (!user) return <Navigate to={deniedPath} />;

  if (onlyAdmin && !user.isSuperAdmin) return <Navigate to={deniedPath} />;

  return <Outlet />;
}
