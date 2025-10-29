import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useState } from "react";


import Purchases from "./components/purchases/Purchases";
import Dashboard from "./components/dashboard/Dashboard";
import Sales from "./components/sales/Sales";
import SalesList from "./components/sales/SalesList";
import SaleDetail from "./components/sales/SaleDetail";
import Inventory from "./components/inventory/Inventory";
import UsersAdmin from "./components/admin/UsersAdmin";
import Header from "./components/ui/header/Header";
import Login from "./components/login/Login";

function App() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const handleLogin = (user) => {
    setUser(user);
    
    navigate(user.isSuperAdmin ? "/dashboard" : "/caja");
  };
  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      <div className="app">
        {user && (
          <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />
        )}

        <main>
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  <Navigate to={user.isSuperAdmin ? "/dashboard" : "/caja"} replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/login"
              element={<Login handleLogin={handleLogin} />}
            />


            <Route element={<ProtectedRoute user={user} />}> 
              <Route path="/caja" element={<Sales />} />
              <Route path="/ventas/registradas" element={<SalesList />} />
              <Route path="/ventas/registradas/:id" element={<SaleDetail />} />
              <Route path="/inventario" element={<Inventory />} />
            </Route>

            <Route element={<ProtectedRoute user={user} onlyAdmin={true} />}> 
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/usuarios" element={<UsersAdmin />} />
              <Route path="/compras" element={<Purchases />} />
              
            </Route>
          </Routes>
        </main>
      </div>

    </>
  );
}

export default App;
