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
      <div className="p-3 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
        {promotions.map((promo, index) => (
          <div
            key={promo.id}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-2 rounded-md"
          >
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Input
                type="number"
                placeholder="Cant."
                className="w-20 sm:w-24"
                value={promo.quantity}
                onChange={(e) =>
                  handlePromotionChange(index, "quantity", e.target.value)
                }
              />
              <span className="font-semibold text-gray-300 text-sm sm:text-base">
                {displayUnit}
              </span>
              <span className="text-gray-400">=</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:flex-grow">
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
                className="text-red-400 hover:text-red-500 p-2 rounded-md hover:bg-red-900/50 flex-shrink-0"
              >
                <Trash2 size={16} sm:size={18} />
              </button>
            </div>
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
      <div className="p-3 sm:p-4 bg-[var(--color-bg-secondary)] border-gray-700 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
        <button
          onClick={onClose}
          className="btn-secondary !bg-gray-700 text-sm sm:text-base"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="btn-secondary text-sm sm:text-base"
        >
          Guardar Cambios
        </button>
      </div>
    </Modal>
  );
};
