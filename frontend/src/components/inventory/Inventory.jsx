import { useEffect, useState, useCallback } from "react";
import { Package, Search, Plus } from "lucide-react";
import { useInventory } from "../../hooks/useInventory";
import EditProductModal from "./EditProductModal";
import AddProductModal from "./AddProductModal";
import Card from "../ui/card/Card";
import Input from "../ui/input/Input";
import Select from "../ui/select/Select";
import InventoryList from "./InventoryList";
import ConfirmModal from "../ui/modal/ConfirmModal";
import Toast from "../ui/toast/Toast";
import { productsAPI } from "../../services/api";

const Inventory = () => {
  const { inventory, loading, error, createItem, updateItem, deleteItem, refresh } = useInventory();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const [filteredInventory, setFilteredInventory] = useState([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    const next = (inventory || [])
      .filter((item) =>
        (item.product?.name || item.name || "")
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase())
      )
      .filter((item) => {
        const stock = item.stock || 0;
        if (statusFilter === "low") return stock > 0 && stock <= 10;
        if (statusFilter === "out") return stock === 0;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          const an = (a.product?.name || a.name || "").toLowerCase();
          const bn = (b.product?.name || b.name || "").toLowerCase();
          return sortDir === "asc" ? an.localeCompare(bn) : bn.localeCompare(an);
        }
        const ad = new Date(a.lastUpdated || 0).getTime();
        const bd = new Date(b.lastUpdated || 0).getTime();
        return sortDir === "asc" ? ad - bd : bd - ad;
      });
    setFilteredInventory(next);
  }, [inventory, searchTerm, statusFilter, sortBy, sortDir]);

  const handleAdjustClick = useCallback((product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };


  const handleCreateProduct = async (payload) => {
    try {
      await productsAPI.create({
        name: (payload?.name || "").trim(),
        emoji: (payload?.emoji || "").trim(),
        categoryId: payload?.categoryId,
      });
      if (typeof refresh === "function") {
        await refresh();
      }
      setToastMsg("Producto creado correctamente");
      setToastType("success");
      setToastOpen(true);
    } catch (err) {
      alert(`Error al crear producto: ${err.message}`);
    }
  };

  const handleUpdateProduct = async (id, data) => {
    try {
      await updateItem(id, data);
      handleCloseModal();
      setToastMsg("Item de inventario actualizado");
      setToastType("success");
      setToastOpen(true);
    } catch (err) {
      alert(`Error al actualizar producto: ${err.message}`);
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteTarget) return;
    try {
      await deleteItem(deleteTarget.id);
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
      setToastMsg("Item eliminado");
      setToastType("success");
      setToastOpen(true);
    } catch (err) {
      alert(`Error al eliminar item: ${err.message}`);
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortBy(column);
    setSortDir(column === "lastUpdated" ? "desc" : "asc");
  };

  // Eliminado fetch bajo cambios de filtro para evitar re-render global; usamos filtrado local

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-[var(--color-secondary-text)]">Cargando inventario...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-[var(--color-error)]">Error: {error}</div>
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
        actions={
          <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-[var(--color-text)] font-semibold py-2 px-4 rounded-md">
            <Plus size={16} /> Crear Producto
          </button>
        }
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <Input
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} className="text-[var(--color-secondary-text)]" />}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="max-w-xs"
          >
            <option value="all">Todos los estados</option>
            <option value="low">Bajo Stock</option>
            <option value="out">Sin Stock</option>
          </Select>
        </div>

        <InventoryList
          items={filteredInventory}
          onAdjustClick={handleAdjustClick}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
          onDeleteClick={(item) => { setDeleteTarget(item); setDeleteConfirmOpen(true); }}
          isAdmin={true}
        />
      </Card>

      <EditProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        onSave={handleUpdateProduct}
      />

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleCreateProduct}
        onCategoryCreated={(cat) => { setToastMsg("Categoría creada correctamente"); setToastType("success"); setToastOpen(true); }}
      />

      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => { setDeleteConfirmOpen(false); setDeleteTarget(null); }}
        title="Eliminar Item"
        message={`¿Seguro que deseas eliminar "${deleteTarget?.name || ''}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDeleteItem}
        variant="danger"
      />

      <Toast open={toastOpen} message={toastMsg} type={toastType} onClose={() => setToastOpen(false)} />
    </>
  );
};

export default Inventory;
