import { Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import Purchases from "./components/purchases/Purchases";
import Dashboard from "./components/dashboard/Dashboard";
import Sales from "./components/sales/Sales";
import SalesList from "./components/sales/SalesList";
import SaleDetail from "./components/sales/SaleDetail";
import Inventory from "./components/inventory/Inventory";
import UsersAdmin from "./components/admin/UsersAdmin";
import Header from "./components/ui/header/Header";
import Toast from "./components/ui/toast/Toast";
import Login from "./components/login/Login";

function AppContent() {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");

  const handleLogin = (userData) => {
    const shouldGoToDashboard = userData.isSuperAdmin || userData.currentRole === 'Admin' || userData.currentRole === 2;
    navigate(shouldGoToDashboard ? "/dashboard" : "/caja");
    setToastMsg("Sesión iniciada correctamente");
    setToastType("success");
    setToastOpen(true);
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem('toast_after_navigation');
      if (raw) {
        const data = JSON.parse(raw);
        setToastMsg(data?.message || 'Operación realizada');
        setToastType(data?.type || 'success');
        setToastOpen(true);
        localStorage.removeItem('toast_after_navigation');
      }
    } catch {}
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDefaultRoute = () => {
    if (!user) return "/login";
    return isAdmin() ? "/dashboard" : "/caja";
  };

  return (
    <div className="app">
      {user && (
        <Header user={user} onLogout={handleLogout} />
      )}

      <main>
        <Routes>
          <Route
            path="/"
            element={<Navigate to={getDefaultRoute()} replace />}
          />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to={getDefaultRoute()} replace />
              ) : (
                <Login handleLogin={handleLogin} />
              )
            }
          />

          <Route element={<ProtectedRoute requiredRole="Staff" />}> 
            <Route path="/caja" element={<Sales />} />
            <Route path="/ventas/registradas" element={<SalesList />} />
            <Route path="/ventas/registradas/:id" element={<SaleDetail />} />
            <Route path="/inventario" element={<Inventory />} />
          </Route>

          <Route element={<ProtectedRoute requiredRole="Admin" />}> 
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/usuarios" element={<UsersAdmin />} />
            <Route path="/compras" element={<Purchases />} />
          </Route>
        </Routes>
      </main>
      <Toast open={toastOpen} message={toastMsg} type={toastType} onClose={() => setToastOpen(false)} />
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
