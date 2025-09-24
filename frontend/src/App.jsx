import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";

import Purchases from "./components/purchases/Purchases";
import Dashboard from "./components/dashboard/Dashboard";
import Sales from "./components/sales/Sales";
import Inventory from "./components/inventory/Inventory";
import Reports from "./components/reports/Reports";
import Delivery from "./components/delivery/Delivery";
import Header from "./components/ui/header/Header";
import Login from "./components/login/Login";

import { useEffect } from "react";

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, logout, loading } = useAuth();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      navigate("/ventas");
    } catch (error) {
      console.error("Error en login:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (!loading && user && location.pathname === "/") {
      if (user.isSuperAdmin) {
        navigate("/dashboard");
      } else {
        navigate("/ventas");
      }
    }
  }, [loading, user, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="text-center p-8 text-gray-300">Cargando sesión...</div>
    );
  }

  return (
    <div className="app">
      {user && <Header user={user} onLogout={handleLogout} />}

      <main>
        <Routes>
          <Route
            path="/login"
            element={<Login handleLogin={handleLogin} />}
          />

          <Route element={<ProtectedRoute useOutlet={true} />}>
            <Route path="/ventas" element={<Sales />} />
            <Route path="/pedidos" element={<Delivery />} />
            <Route path="/compras" element={<Purchases />} />
            <Route path="/inventario" element={<Inventory />} />
            <Route path="/reportes" element={<Reports />} />
          </Route>

          <Route element={<ProtectedRoute useOutlet={true} onlyAdmin={true} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </main>

      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
