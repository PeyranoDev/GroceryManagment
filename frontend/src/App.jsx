import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Purchases from "./components/purchases/Purchases";
import Dashboard from "./components/dashboard/Dashboard";
import Sales from "./components/sales/Sales";
import Inventory from "./components/inventory/Inventory";
import Reports from "./components/reports/Reports";
import Delivery from "./components/delivery/Delivery";
import Header from "./components/ui/header/Header";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  const [user, setUser] = useState({ name: "Admin", id: 1 });

  const [purchaseProducts, setPurchaseProducts] = useState([]);

  const handleLogin = () => setUser({ name: "Admin", id: 1 });
  const handleLogout = () => setUser(null);

  const handleAddPurchaseProduct = () =>
    setPurchaseProducts((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        purchaseUnit: "peso",
        quantity: "",
        unitLabel: "",
        totalPrice: "",
        promotions: [],
      },
    ]);
  const handleRemovePurchaseProduct = (productId) =>
    setPurchaseProducts((prev) => prev.filter((p) => p.id !== productId));
  const handlePurchaseProductChange = (productId, updatedProduct) =>
    setPurchaseProducts((prev) =>
      prev.map((p) => (p.id === productId ? updatedProduct : p))
    );

  return (
    <ThemeProvider>
      <style>{`input[type="date"]::-webkit-calendar-picker-indicator { display: none; -webkit-appearance: none; }`}</style>
      <div className="app bg-background text-text min-h-screen transition-colors duration-300">
        <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />

        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ventas" element={<Sales />} />
            <Route path="/pedidos" element={<Delivery />} />
            <Route
              path="/compras"
              element={
                <Purchases
                  products={purchaseProducts}
                  onAddProduct={handleAddPurchaseProduct}
                  onProductChange={handlePurchaseProductChange}
                  onRemoveProduct={handleRemovePurchaseProduct}
                />
              }
            />
            <Route path="/inventario" element={<Inventory />} />
            <Route path="/reportes" element={<Reports />} />
          </Routes>
        </main>
        
      </div>
    </ThemeProvider>
  );
}

export default App;