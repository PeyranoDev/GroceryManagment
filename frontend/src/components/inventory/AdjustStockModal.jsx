import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";

const AdjustStockModal = ({ isOpen, onClose, product, onSave }) => {
  const [newStock, setNewStock] = useState(product?.stock || 0);
  useEffect(() => {
    if (product) setNewStock(product.stock);
  }, [product]);

  const handleSave = () => {
    onSave(product.id, newStock);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ajustar Stock de ${product?.name}`}
    >
      <div className="flex flex-col gap-4 p-3 sm:p-4">
        <p className="text-[var(--color-secondary-text)] text-sm sm:text-base">
          Stock actual:{" "}
          <strong >
            {product?.stock} {product?.unit}
          </strong>
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-1">
          <label className="block text-sm font-medium text-[var(--color-secondary-text)]">
            Nuevo Stock
          </label>
          <Input
            type="number"
            value={newStock}
            onChange={(e) => setNewStock(parseFloat(e.target.value) || 0)}
            className="sm:!w-1/3"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
          <button
            onClick={onClose}
            className="bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--color-text)] font-semibold py-2 px-4 rounded-md text-sm sm:text-base"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-dark)] text-[var(--color-text)] font-semibold py-2 px-4 rounded-md text-sm sm:text-base"
          >
            Guardar Ajuste
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AdjustStockModal;
