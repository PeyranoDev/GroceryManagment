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

  const [purchaseProducts, setPurchaseProducts] = useState([
    {
      id: crypto.randomUUID(),
      name: "Rúcula",
      purchaseUnit: "atado",
      quantity: 3,
      unitLabel: "u",
      totalPrice: 5000,
      promotions: [
        { id: crypto.randomUUID(), quantity: 1, unit: "u", price: 1000 },
        { id: crypto.randomUUID(), quantity: 2, unit: "u", price: 1500 },
        { id: crypto.randomUUID(), quantity: 3, unit: "u", price: 2000 },
      ],
    },
    {
      id: crypto.randomUUID(),
      name: "Kiwi",
      purchaseUnit: "peso",
      quantity: 10,
      unitLabel: "kg",
      totalPrice: 43000,
      promotions: [
        { id: crypto.randomUUID(), quantity: 1, unit: "kg", price: 6000 },
        { id: crypto.randomUUID(), quantity: 2, unit: "kg", price: 10000 },
      ],
    },
  ]);

  const handleLogin = () => setUser({ name: "Tomillo" });
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
              <Route
                path="/"
                element={<Dashboard inventoryData={inventory} />}
              />
              <Route path="/ventas" element={<Sales />} />
              <Route
                path="/pedidos"
                element={<Delivery inventory={inventory} />}
              />
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
              <Route
                path="/inventario"
                element={
                  <Inventory
                    inventory={inventory}
                    onUpdateStock={handleUpdateStock}
                  />
                }
              />
              <Route path="/reportes" element={<Reports />} />
            </Routes>
        </main>
        
      </div>
    </ThemeProvider>
  );
}

export default App;
