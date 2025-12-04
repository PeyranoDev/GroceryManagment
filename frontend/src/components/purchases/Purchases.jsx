import { useState } from "react";
import { Plus } from "lucide-react";
import { ProductRow } from "./ProductRow";
import Card from "../ui/card/Card";
import PurchasesHeader from "./PurchasesHeader";
import { useInventory } from "../../hooks/useInventory";
import { isInvalidProduct } from "./validation";
import { getLocalDateString } from "../../utils/date";
import { purchasesAPI, productsAPI } from "../../services/api";
import AddProductModal from "../inventory/AddProductModal";
import ConfirmModal from "../ui/modal/ConfirmModal";
import Toast from "../ui/toast/Toast";
import "./purchases.css";

const Purchases = () => {
  const [products, setProducts] = useState([]);
  const [autoFocusId, setAutoFocusId] = useState(null);
  const [date, setDate] = useState(getLocalDateString());
  const { inventory, updateStock, createItem } = useInventory();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creatingForProductId, setCreatingForProductId] = useState(null);
  const [createDefaultName, setCreateDefaultName] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [addingId, setAddingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmAdjustOpen, setConfirmAdjustOpen] = useState(false);
  const [adjustTargetId, setAdjustTargetId] = useState(null);

  const handleAddProduct = () => {
    const newId = crypto.randomUUID();
    setProducts((prev) => [
      {
        id: newId,
        name: "",
        unitType: "peso",
        quantity: "",
        unitLabel: "",
        totalPrice: "",
        promotions: [],
      },
      ...prev,
    ]);
    setAutoFocusId(newId);
    setAddingId(newId);
    setTimeout(() => setAddingId(null), 400);
  };

  const handleRemoveProduct = (productId) => {
    setDeleteId(productId);
    setConfirmDeleteOpen(true);
  };

  const handleProductChange = (productId, updatedProduct) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? updatedProduct : p))
    );

  const handleSelectInventoryItem = (productId, item) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              name: item.name,
              selectedItemId: item.id,
              appliedQuantity: 0,
              unitLabel: item.unit || p.unitLabel || 'u',
              invalid: false,
              invalidProduct: false,
            }
          : p
      )
    );
  };

  const handleRequestCreateProduct = (productId, defaultName = "") => {
    setCreatingForProductId(productId);
    setCreateDefaultName(defaultName || "");
    setIsCreateModalOpen(true);
  };

  const handleCreateProductSave = async (payload) => {
    const createdResp = await productsAPI.create({
      name: payload.name,
      emoji: payload.emoji || "",
      categoryId: payload.categoryId,
    });
    const createdProduct = createdResp.data || createdResp;
    await fetchInventory();
    const match = inventory.find(
      (inv) => (inv.product?.id ?? inv.Product?.Id) === (createdProduct.id ?? createdProduct.Id)
        || ((inv.name || inv.Name || '').toLowerCase() === (createdProduct.name || createdProduct.Name || '').toLowerCase())
    );
    setProducts((prev) =>
      prev.map((p) =>
        p.id === creatingForProductId
          ? {
              ...p,
              name: createdProduct.name || createdProduct.Name,
              selectedItemId: match?.id ?? match?.Id,
              appliedQuantity: 0,
              unitLabel: match?.unit || match?.Unit || p.unitLabel || 'u',
              invalid: false,
              invalidProduct: false,
            }
          : p
      )
    );
    setIsCreateModalOpen(false);
    setCreatingForProductId(null);
  };

  const handleAdjustInventoryStock = async (itemId, delta) => {
    try {
      const invItem = inventory.find((i) => i.id === itemId);
      if (!invItem) return;
      const newStock = (invItem.stock || 0) + delta;
      await updateStock(itemId, Math.max(newStock, 0));
    } catch {
      // ignore localStorage write errors
    }
  };

  const loadPreviousPurchase = async () => {
    try {
      const resp = await purchasesAPI.getLatest();
      const purchase = resp.data || resp;
      const mapped = (purchase.items || []).map((it) => ({
        id: crypto.randomUUID(),
        name: it.productName,
        unitType: it.unit === 'kg' ? 'peso' : 'unidad',
        quantity: String(it.quantity ?? ''),
        unitLabel: it.unit || '',
        totalPrice: String(it.totalPrice ?? ''),
        promotions: [],
        selectedItemId: (() => {
          const match = inventory.find((inv) => (inv.name || '').toLowerCase() === (it.productName || '').toLowerCase());
          return match ? match.id : undefined;
        })(),
        appliedQuantity: 0,
        invalid: false,
        // isRegistered se asigna solo al confirmar guardado
      }));
      setProducts(mapped);
    } catch {
      alert('No se pudo cargar la compra anterior');
    }
  };

  const openAdjustForRow = (row) => {
    if (!row?.selectedItemId) return;
    setAdjustTargetId(row.id);
    setConfirmAdjustOpen(true);
  };

  const performAdjustConfirm = () => {
    if (!adjustTargetId) return;
    setProducts((prev) => prev.map(p => (
      p.id === adjustTargetId ? { ...p, isRegistered: false } : p
    )));
    setConfirmAdjustOpen(false);
    setAdjustTargetId(null);
  };


  const performDelete = () => {
    if (!deleteId) return;
    setDeletingId(deleteId);
    setConfirmDeleteOpen(false);
    setTimeout(() => {
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
      setDeletingId(null);
    }, 250);
  };

  const performSave = async () => {
    console.log("Guardando datos:", { date, products });
    await new Promise((r) => setTimeout(r, 1200));
    setToastMsg("Compra registrada");
    setToastOpen(true);
    setProducts((prev) => prev.map(p => ({ ...p, isRegistered: true })));
  };

  const copyRegisteredToExcel = async () => {
    const rows = products.filter(p => p.isRegistered);
    if (rows.length === 0) {
      setToastMsg("No hay productos registrados para copiar");
      setToastOpen(true);
      return;
    }
    const header = ["Producto", "Cantidad", "Unidad", "Precio Total", "Precio Unitario"];
    const lines = [header.join("\t")];
    for (const p of rows) {
      const quantity = parseFloat(p.quantity || 0) || 0;
      const total = (p.totalPrice || '').trim() === '' ? 0 : (parseFloat((p.totalPrice || '').replace(/\./g, '').replace(/,/g, '.')) || 0);
      const unit = p.unitLabel || '';
      const unitPrice = quantity > 0 ? (total / quantity) : 0;
      const fmt = (n) => Number(n || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      lines.push([
        p.name || '',
        String(quantity),
        unit,
        fmt(total),
        fmt(unitPrice),
      ].join("\t"));
    }
    const tsv = lines.join("\n");
    try {
      await navigator.clipboard.writeText(tsv);
      setToastMsg("Copiado en formato Excel");
      setToastOpen(true);
    } catch {
      setToastMsg("No se pudo copiar al portapapeles");
      setToastOpen(true);
    }
  };

  const pending = products.filter(p => !p.isRegistered);
  const registered = products.filter(p => p.isRegistered);
  const total = pending.length + registered.length;

  return (
    <div className="space-y-6">
      <PurchasesHeader
        onLoadPrevious={loadPreviousPurchase}
        saveDisabled={
          products.length === 0 ||
          products.filter(p => !p.isRegistered).some(isInvalidProduct)
        }
        onRequestSave={() => setConfirmSaveOpen(true)}
        onRequestCopyExcel={copyRegisteredToExcel}
        date={date}
        onDateChange={setDate}
      />
      <Card
        title="Productos Registrados"
        actions={
          <button
            onClick={handleAddProduct}
            className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-[var(--color-text)] font-semibold py-2 px-4 rounded-md"
          >
            <Plus size={18} /> Agregar Producto
          </button>
        }
        className="mb-5 max-w-[1100px] mx-auto"
      >
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm text-left table-fixed">
            <thead className="text-xs text-[var(--color-secondary-text)] uppercase">
              <tr>
                <th className="px-4 py-2 w-[4%]"></th>
                <th className="px-4 py-2">Producto</th>
                <th className="px-4 py-2">Cantidad</th>
                <th className="px-4 py-2">Precio Total</th>
                <th className="px-4 py-2">Precio Unitario</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pending.length > 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-2 text-xs text-[var(--color-secondary-text)]">Pendientes por registrar</td>
                </tr>
              )}
              {pending.map((p, idx) => (
                <ProductRow
                  key={p.id}
                  index={idx}
                  displayIndex={total - idx}
                  autoFocus={autoFocusId === p.id}
                  product={p}
                  onProductChange={handleProductChange}
                  onRemoveProduct={handleRemoveProduct}
                  inventory={inventory}
                  onSelectInventoryItem={handleSelectInventoryItem}
                  onRequestCreateProduct={handleRequestCreateProduct}
                  onAdjustInventoryStock={handleAdjustInventoryStock}
                  onAdjustClick={openAdjustForRow}
                  animState={p.id === addingId ? 'enter' : p.id === deletingId ? 'exit' : undefined}
                />
              ))}
              {registered.length > 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-2 text-xs text-[var(--color-secondary-text)]">Items registrados</td>
                </tr>
              )}
              {registered.map((p, idx) => (
                <ProductRow
                  key={p.id}
                  index={pending.length + idx}
                  displayIndex={total - (pending.length + idx)}
                  autoFocus={autoFocusId === p.id}
                  product={p}
                  onProductChange={handleProductChange}
                  onRemoveProduct={handleRemoveProduct}
                  inventory={inventory}
                  onSelectInventoryItem={handleSelectInventoryItem}
                  onRequestCreateProduct={handleRequestCreateProduct}
                  onAdjustInventoryStock={handleAdjustInventoryStock}
                  onAdjustClick={openAdjustForRow}
                  animState={p.id === addingId ? 'enter' : p.id === deletingId ? 'exit' : undefined}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <AddProductModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateProductSave}
        defaultName={createDefaultName}
      />
      <ConfirmModal
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        title="Eliminar producto"
        message="¿Estás seguro de eliminar este item de la compra?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={performDelete}
      />
      <ConfirmModal
        isOpen={confirmSaveOpen}
        onClose={() => setConfirmSaveOpen(false)}
        title="Confirmar guardado"
        message="¿Deseas guardar los cambios de esta compra?"
        confirmText="Guardar"
        cancelText="Cancelar"
        variant="success"
        onConfirm={performSave}
      />
      <ConfirmModal
        isOpen={confirmAdjustOpen}
        onClose={() => setConfirmAdjustOpen(false)}
        title="Editar producto"
        message="¿Desea editar este producto?"
        confirmText="Editar"
        cancelText="Cancelar"
        variant="success"
        onConfirm={performAdjustConfirm}
      />
      <Toast open={toastOpen} message={toastMsg} type="success" onClose={() => setToastOpen(false)} />
    </div>
  );
};

export default Purchases;
