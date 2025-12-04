import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import Select from "../ui/select/Select";
import { Loader2 } from "lucide-react";

const EditProductModal = ({ isOpen, onClose, product, onSave }) => {
  const [name, setName] = useState(product?.product?.name || product?.name || "");
  const [unit, setUnit] = useState(product?.unit || "kg");
  const [stock, setStock] = useState(product?.stock || 0);
  const [salePrice, setSalePrice] = useState(product?.salePrice ?? 0);
  const [submitting, setSubmitting] = useState(false);
  const normalizeNumber = (v) => {
    if (typeof v === 'number') return v;
    const s = String(v || '').trim();
    if (!s) return 0;
    return parseFloat(s.replace(/\./g, '').replace(/,/g, '.')) || 0;
  };
  const originalUnit = product?.unit || "kg";
  const originalStock = product?.stock || 0;
  const originalSalePrice = product?.salePrice ?? 0;
  const isDirty = unit !== originalUnit || normalizeNumber(stock) !== normalizeNumber(originalStock) || normalizeNumber(salePrice) !== normalizeNumber(originalSalePrice);

  useEffect(() => {
    if (product) {
      setName(product.product?.name || product.name || "");
      setUnit(product.unit || "kg");
      setStock(product.stock || 0);
      setSalePrice(product.salePrice ?? 0);
    }
  }, [product]);

  const handleSave = async () => {
    try {
      setSubmitting(true);
      await onSave(product.id, {
        unit,
        stock: typeof stock === "number" ? stock : parseFloat(stock) || 0,
        salePrice: typeof salePrice === "number" ? salePrice : parseFloat(salePrice) || 0,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isDirty || submitting) return;
    handleSave();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={"Editar producto"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-3 sm:p-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--color-secondary-text)]">Nombre</label>
          <div className="border border-[var(--color-border)] rounded-md px-3 py-2 text-[var(--color-secondary-text)]">{name}</div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-[var(--color-secondary-text)]">Unidad</label>
            <Select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="kg">Peso (kg)</option>
              <option value="u">Unidad (u)</option>
            </Select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-[var(--color-secondary-text)]">Stock</label>
            <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
          </div>
          <div className="flex-1">
            <label htmlFor="edit-salePrice" className="block text-sm font-medium text-[var(--color-secondary-text)]">Precio</label>
            <Input id="edit-salePrice" ariaLabel="Precio" type="text" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} format="currency" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--color-text)] font-semibold py-2 px-4 rounded-md text-sm sm:text-base"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting || !isDirty}
            className={`bg-[var(--color-primary)] ${(submitting || !isDirty) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[var(--color-primary-dark)]'} text-[var(--color-text)] font-semibold py-2 px-4 rounded-md text-sm sm:text-base`}
          >
            {submitting ? (<span className="inline-flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Procesando...</span>) : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProductModal;
