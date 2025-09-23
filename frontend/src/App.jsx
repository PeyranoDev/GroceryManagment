import { Routes, Route, useNavigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useState } from "react";

import { ToastContainer } from "react-toastify";

import Purchases from "./components/purchases/Purchases";
import Dashboard from "./components/dashboard/Dashboard";
import Sales from "./components/sales/Sales";
import Inventory from "./components/inventory/Inventory";
import Reports from "./components/reports/Reports";
import Delivery from "./components/delivery/Delivery";
import Header from "./components/ui/header/Header";
import Login from "./components/login/Login";

function App() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const handleLogin = (user) => {
    setUser(user);
    navigate("/ventas");
  };
  const handleLogout = () => setUser(null);

  return (
    <>
      <div className="app">
        {user && (
          <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />
        )}

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
