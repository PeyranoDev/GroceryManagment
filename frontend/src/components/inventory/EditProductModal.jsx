import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import Select from "../ui/select/Select";

const EditProductModal = ({ isOpen, onClose, product, onSave }) => {
  const [name, setName] = useState(product?.name || "");
  const [unit, setUnit] = useState(product?.unit || "kg");
  const [stock, setStock] = useState(product?.stock || 0);
  const [salePrice, setSalePrice] = useState(product?.salePrice ?? 0);

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setUnit(product.unit || "kg");
      setStock(product.stock || 0);
      setSalePrice(product.salePrice ?? 0);
    }
  }, [product]);

  const handleSave = () => {
    onSave(product.id, {
      name: name.trim(),
      unit,
      stock: typeof stock === "number" ? stock : parseFloat(stock) || 0,
      salePrice: typeof salePrice === "number" ? salePrice : parseFloat(salePrice) || 0,
    });
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={"Editar producto"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-3 sm:p-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--color-secondary-text)]">Nombre</label>
          <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
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
            className="bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-dark)] text-[var(--color-text)] font-semibold py-2 px-4 rounded-md text-sm sm:text-base"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProductModal;
