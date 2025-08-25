import { useEffect, useState } from "react";
import { DollarSign, Plus, Trash2 } from "lucide-react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";

export const PromotionsModal = ({ isOpen, onClose, product, onSave }) => {
  const [promotions, setPromotions] = useState([]);
  useEffect(() => {
    if (product) {
      setPromotions(product.promotions);
    }
  }, [product]);
  if (!product) return null;

  const displayUnit = product.unitType === "peso" ? "kg" : "u";

  const handlePromotionChange = (promoIndex, field, value) => {
    const newPromotions = [...promotions];
    newPromotions[promoIndex] = {
      ...newPromotions[promoIndex],
      [field]: value,
    };
    setPromotions(newPromotions);
  };
  const handleAddPromotion = () => {
    setPromotions([
      ...promotions,
      { id: crypto.randomUUID(), quantity: "", price: "" },
    ]);
  };
  const handleRemovePromotion = (promoIndex) => {
    setPromotions(promotions.filter((_, index) => index !== promoIndex));
  };
  const handleSave = () => {
    onSave(product.id, promotions);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Gestionar Promociones de "${product.name}"`}
    >
      <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
        {promotions.map((promo, index) => (
          <div
            key={promo.id}
            className="flex items-center gap-2 p-2  rounded-md"
          >
            <Input
              type="number"
              placeholder="Cant."
              className="w-24"
              value={promo.quantity}
              onChange={(e) =>
                handlePromotionChange(index, "quantity", e.target.value)
              }
            />
            <span className="font-semibold text-gray-300">
              {displayUnit}
            </span>
            <span className="text-gray-400">=</span>
            <Input
              type="number"
              placeholder="Precio"
              className="flex-grow"
              value={promo.price}
              onChange={(e) =>
                handlePromotionChange(index, "price", e.target.value)
              }
              icon={<DollarSign size={14} className="text-gray-400" />}
            />
            <button
              onClick={() => handleRemovePromotion(index)}
              className="text-red-400 hover:text-red-500 p-2 rounded-md hover:bg-red-900/50"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        <button
          onClick={handleAddPromotion}
          className="w-full mt-2 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold text-sm py-2 px-4 rounded-md flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          <span>Agregar Promoción</span>
        </button>
      </div>
      <div className="p-4 bg-[var(--color-bg-secondary)] border-gray-700 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="btn-secondary !bg-gray-700"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="btn-secondary"
        >
          Guardar Cambios
        </button>
      </div>
    </Modal>
  );
};
