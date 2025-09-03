import { useState } from "react";
import { Calendar, Download, Plus, Save } from "lucide-react";
import { ProductRow } from "./ProductRow";
import { PromotionsModal } from "./PromotionsModal";
import Input from "../ui/input/Input";
import Card from "../ui/card/Card";

const Purchases = () => {
  const [products, setProducts] = useState([]);
  
  const handleAddProduct = () =>
    setProducts((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        unitType: "peso",
        quantity: "",
        unitLabel: "",
        totalPrice: "",
        promotions: [],
      },
    ]);
  
  const handleRemoveProduct = (productId) =>
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  
  const handleProductChange = (productId, updatedProduct) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? updatedProduct : p))
    );
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [selectedProductForPromos, setSelectedProductForPromos] =
    useState(null);
  const handleSave = () => {
    console.log("Guardando datos:", { date, products });
    alert("Datos guardados (revisa la consola)");
  };
  const handleExport = () => {
    console.log("Exportando datos...");
    alert("Exportación iniciada (revisa la consola)");
  };
  const handleOpenPromoModal = (product) => {
    setSelectedProductForPromos(product);
    setIsPromoModalOpen(true);
  };
  const handleClosePromoModal = () => setIsPromoModalOpen(false);
  const handleSavePromotions = (productId, newPromotions) => {
    handleProductChange(productId, {
      ...products.find((p) => p.id === productId),
      promotions: newPromotions,
    });
  };
  return (
    <>
      <div className="space-y-6">
        <div className="bg-[var(--color-bg-secondary)] p-4 rounded-lg border border-[var(--color-border)] space-y-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">
              Registro de Compras
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Gestión de productos y promociones de venta
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-auto">
              <Calendar
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10 w-full sm:w-auto"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={handleSave}
                className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-[var(--color-text)] font-semibold py-2 px-4 rounded-md"
              >
                <Save size={18} /> Guardar
              </button>
              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-[var(--color-text)] font-semibold py-2 px-4 rounded-md"
              >
                <Download size={18} /> Exportar
              </button>
            </div>
          </div>
        </div>
        <Card
          title="Productos Registrados"
          actions={
            <button
              onClick={handleAddProduct}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-[var(--color-text)] font-semibold py-2 px-4 rounded-md"
            >
              <Plus size={18} /> Agregar Producto
            </button>
          }
        >
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase">
                <tr>
                  <th className="p-2">Producto</th>
                  <th className="p-2">Unidad de Medida</th>
                  <th className="p-2">Cantidad</th>
                  <th className="p-2">Precio Total</th>
                  <th className="p-2 text-center">Precio Unitario</th>
                  <th className="p-2 text-center">Promociones</th>
                  <th className="p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <ProductRow
                    key={p.id}
                    product={p}
                    onProductChange={handleProductChange}
                    onRemoveProduct={handleRemoveProduct}
                    onOpenPromoModal={handleOpenPromoModal}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {products.map((p) => (
              <ProductRow
                key={p.id}
                product={p}
                onProductChange={handleProductChange}
                onRemoveProduct={handleRemoveProduct}
                onOpenPromoModal={handleOpenPromoModal}
                isMobile={true}
              />
            ))}
          </div>
        </Card>
      </div>
      <PromotionsModal
        isOpen={isPromoModalOpen}
        onClose={handleClosePromoModal}
        product={selectedProductForPromos}
        onSave={handleSavePromotions}
      />
    </>
  );
};

export default Purchases;
