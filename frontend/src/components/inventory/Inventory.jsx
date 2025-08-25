import { useMemo, useState } from "react";
import { Edit, Package, Search } from "lucide-react";
import { useInventory } from "../../hooks/useInventory";
import AdjustStockModal from "./AdjustStockModal";
import Card from "../ui/card/Card";
import Input from "../ui/input/Input";
import Select from "../ui/select/Select";
import StockStatus from "./StockStatus";

const Inventory = () => {
  const { inventory, loading, error, updateStock, fetchInventory } = useInventory();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredInventory = useMemo(() => {
    return inventory
      .filter((item) =>
        (item.product?.name || item.name || '').toLowerCase().includes(searchTerm.trim().toLowerCase())
      )
      .filter((item) => {
        const stock = item.stock || 0;
        if (statusFilter === "low") return stock > 0 && stock <= 10;
        if (statusFilter === "out") return stock === 0;
        return true;
      });
  }, [inventory, searchTerm, statusFilter]);

  const handleAdjustClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveStock = async (productId, newStock) => {
    try {
      await updateStock(productId, newStock);
      handleCloseModal();
    } catch (error) {
      alert(`Error al ajustar stock: ${error.message}`);
    }
  };

  const handleFilterChange = (searchTerm, statusFilter) => {
    // Aplicar filtros localmente o hacer una nueva consulta al backend
    const filters = {};
    if (searchTerm) filters.searchTerm = searchTerm;
    if (statusFilter !== 'all') filters.statusFilter = statusFilter;
    
    if (Object.keys(filters).length > 0) {
      fetchInventory(filters);
    } else {
      fetchInventory();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-400">Cargando inventario...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <Card
        title={
          <>
            <Package size={22} /> Gestión de Inventario
          </>
        }
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <Input
            placeholder="Buscar producto por nombre..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              // Aplicar filtro después de un breve delay para evitar muchas consultas
              setTimeout(() => handleFilterChange(e.target.value, statusFilter), 300);
            }}
            icon={<Search size={18} className="text-gray-400" />}
          />
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              handleFilterChange(searchTerm, e.target.value);
            }}
            className="max-w-xs"
          >
            <option value="all">Todos los estados</option>
            <option value="low">Bajo Stock</option>
            <option value="out">Sin Stock</option>
          </Select>
        </div>

        <div className="overflow-x-auto rounded-t-md">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[var(--color-secondary-text)] uppercase bg-[var(--color-border)]">
              <tr>
                <th className="p-3">Producto</th>
                <th className="p-3">Stock Actual</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Última Actualización</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[var(--color-border)]"
                >
                  <td className="p-3 font-medium text-[var(--color-text)]">
                    {item.product?.name || item.name || 'Producto sin nombre'}
                  </td>
                  <td className="p-3 font-mono text-gray-300">
                    {item.stock || 0} {item.product?.unit || item.unit || 'u'}
                  </td>
                  <td className="p-3">
                    <StockStatus stock={item.stock || 0} />
                  </td>
                  <td className="p-3 text-[var(--color-secondary-text)]">
                    {item.lastUpdated
                      ? new Date(item.lastUpdated).toLocaleString("es-AR")
                      : "—"}
                  </td>
                  <td className="p-3 flex justify-center">
                    <button
                      onClick={() => handleAdjustClick(item)}
                      className="flex items-center gap-2 btn-secondary"
                    >
                      <Edit size={14} />
                      Ajustar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredInventory.length === 0 && (
            <div className="p-4 text-sm text-center text-[var(--color-secondary-text)]">
              No se encontraron productos.
            </div>
          )}
        </div>
      </Card>

      <AdjustStockModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        onSave={handleSaveStock}
      />
    </>
  );
};

export default Inventory;
