import { Routes, Route, useNavigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ToastContainer } from "react-toastify";

import Purchases from "./components/purchases/Purchases";
import Dashboard from "./components/dashboard/Dashboard";
import Sales from "./components/sales/Sales";
import Inventory from "./components/inventory/Inventory";
import Reports from "./components/reports/Reports";
import Delivery from "./components/delivery/Delivery";
import Header from "./components/ui/header/Header";
import Login from "./components/login/Login";

import { useAuthStorage } from "./hooks/useAuthStorage";
import { useEffect } from "react";

function App() {
  const navigate = useNavigate();
  const { user, saveUser, clearUser, loading } = useAuthStorage();

  const handleLogin = (user) => {
    saveUser(user, user.remember);
    navigate("/ventas");
  };

  const handleLogout = () => clearUser();

  useEffect(() => {
    if (!loading && user) {
      navigate("/ventas");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="text-center p-8 text-gray-300">Cargando sesión...</div>
    );
  }

  return (
    <>
      <div className="app">
        {user && <Header user={user} onLogout={handleLogout} />}

        <main>
          <Routes>
            <Route
              path="/login"
              element={<Login handleLogin={handleLogin} />}
            />

            <Route element={<ProtectedRoute user={user} />}>
              <Route path="/ventas" element={<Sales />} />
              <Route path="/pedidos" element={<Delivery />} />
              <Route path="/compras" element={<Purchases />} />
              <Route path="/inventario" element={<Inventory />} />
              <Route path="/reportes" element={<Reports />} />
            </Route>

            <Route element={<ProtectedRoute user={user} onlyAdmin={true} />}>
              <Route path="/" element={<Dashboard />} />
            </Route>
          </Routes>
        </main>
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
    </>
  );
}

export default App;
