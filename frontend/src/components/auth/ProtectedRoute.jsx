import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute = ({
  children,
  onlyAdmin = false,
  useOutlet = false,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg)]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <p className="text-gray-300 text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg)]">
        <div className="bg-[var(--color-bg-secondary)] p-8 rounded-lg shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">
            Acceso Restringido
          </h2>
          <p className="text-gray-300 mb-6">
            Necesitas iniciar sesión para acceder a esta página.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  if (onlyAdmin && !user.isSuperAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg)]">
        <div className="bg-[var(--color-bg-secondary)] p-8 rounded-lg shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Acceso Denegado
          </h2>
          <p className="text-gray-300 mb-6">
            No tienes permisos de administrador para acceder a esta página.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return useOutlet ? <Outlet /> : children;
};

export default ProtectedRoute;