import { useEffect, useState } from "react";
import { DollarSign, Plus, Trash2 } from "lucide-react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import { getUnitFromProduct } from "../../utils/unit";
import { sanitizeInt, clamp } from "../../utils/number";

export const PromotionsModal = ({ isOpen, onClose, product, onSave }) => {
  const [promotions, setPromotions] = useState([]);
  useEffect(() => {
    if (product) {
      setPromotions(product.promotions);
    }
  }, [product]);
  if (!product) return null;

  const displayUnit = getUnitFromProduct(product);

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
                onChange={(e) => {
                  const q = clamp(sanitizeInt(e.target.value), 0, 999);
                  handlePromotionChange(index, "quantity", String(q));
                }}
              />
              <span className="font-semibold text-[var(--color-secondary-text)] text-sm sm:text-base">
                {displayUnit}
              </span>
              <span className="text-[var(--color-secondary-text)]">=</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:flex-grow">
              <Input
                type="text"
                placeholder="Precio"
                className="flex-grow"
                value={promo.price}
                onChange={(e) =>
                  handlePromotionChange(index, "price", e.target.value)
                }
                icon={<DollarSign size={14} className="text-[var(--color-secondary-text)]" />}
                format="currency"
                id={`promo-price-${index}`}
                ariaLabel="Precio de promoción"
              />
              <button
                onClick={() => handleRemovePromotion(index)}
                className="text-[var(--color-error)] hover:text-[var(--color-error-dark)] p-2 rounded-md hover:bg-[var(--color-error-dark)]/50 flex-shrink-0"
              >
                <Trash2 size={16} sm:size={18} />
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={handleAddPromotion}
          className="w-full mt-2 bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--color-secondary-text)] font-semibold text-sm py-2 px-4 rounded-md flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          <span>Agregar Promoción</span>
        </button>
      </div>
      <div className="p-3 sm:p-4 bg-[var(--color-bg-secondary)] border-[var(--color-border)] flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
        <button
          onClick={onClose}
          className="btn-secondary !bg-[var(--surface)] text-sm sm:text-base"
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
