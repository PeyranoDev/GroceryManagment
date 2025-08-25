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
        <p className="text-gray-300 text-sm sm:text-base">
          Stock actual:{" "}
          <strong >
            {product?.stock} {product?.unit}
          </strong>
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-1">
          <label className="block text-sm font-medium text-gray-300">
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
            className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md text-sm sm:text-base"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md text-sm sm:text-base"
          >
            Guardar Ajuste
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AdjustStockModal;
