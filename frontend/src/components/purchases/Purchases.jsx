import { useState } from "react";
import { Calendar, Download, Plus, Save } from "lucide-react";
import { ProductRow } from "./ProductRow";
import { PromotionsModal } from "./PromotionsModal";
import Input from "../ui/input/Input";
import Card from "../ui/card/Card";

const Purchases = ({
  products,
  onAddProduct,
  onProductChange,
  onRemoveProduct,
}) => {
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
    onProductChange(productId, {
      ...products.find((p) => p.id === productId),
      promotions: newPromotions,
    });
  };
  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-[var(--color-bg-secondary)] p-4 rounded-lg border border-[var(--color-border)]">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Registro de Compras
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Gestión de productos y promociones de venta
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Calendar
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
              />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10"
              />
            </div>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-md"
            >
              <Save size={18} /> Guardar
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
            >
              <Download size={18} /> Exportar
            </button>
          </div>
        </div>
        <Card
          title="Productos Registrados"
          actions={
            <button
              onClick={onAddProduct}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
            >
              <Plus size={18} /> Agregar Producto
            </button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase">
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
                    onProductChange={onProductChange}
                    onRemoveProduct={onRemoveProduct}
                    onOpenPromoModal={handleOpenPromoModal}
                  />
                ))}
              </tbody>
            </table>
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
