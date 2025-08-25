import { useMemo } from "react";
import { Trash2 } from "lucide-react";
import Input from "../ui/input/Input";

const SaleItemRow = ({
  item,
  onQuantityChange,
  onRemove,
  onTogglePromotion,
}) => {
  const total = useMemo(() => {
    if (item.promotionApplied && item.product.promotion) {
      const promo = item.product.promotion;
      const promoSets = Math.floor(item.quantity / promo.quantity);
      const remainingQty = item.quantity % promo.quantity;
      return promoSets * promo.price + remainingQty * item.product.unitPrice;
    }
    return item.quantity * item.product.unitPrice;
  }, [item]);

  return (
    <tr className="border-b border-[var(--color-border)]">
      <td className="p-3">
        <p className="font-medium text-white">{item.product.name}</p>
        <p className="text-sm text-gray-400">
          Stock: {item.product.stock} {item.product.unit}
        </p>
      </td>
      <td className="p-3">
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) =>
            onQuantityChange(item.product.id, parseInt(e.target.value) || 1)
          }
          className="!w-20 text-center"
        />
      </td>
      <td className="p-3 text-gray-300">{item.product.unit}</td>
      <td className="p-3 text-gray-300">
        ${item.product.unitPrice.toFixed(2)}
      </td>
      <td className="p-3 font-semibold text-white">${total.toFixed(2)}</td>
      <td className="p-3">
        {item.product.promotion ? (
          <button
            onClick={() => onTogglePromotion(item.product.id)}
            className={`px-2 py-1 text-xs font-bold rounded-full flex items-center gap-1 transition-colors ${
              item.promotionApplied
                ? "bg-green-900/50 text-green-300"
                : "bg-gray-600 text-gray-300"
            }`}
          >
            <span>{item.promotionApplied ? "Activada" : "Desactivada"}</span>
          </button>
        ) : (
          <span className="text-sm text-gray-500">N/A</span>
        )}
      </td>
      <td className="p-3 text-center">
        <button
          onClick={() => onRemove(item.product.id)}
          className="text-red-400 hover:text-red-500"
        >
          <Trash2 size={20} />
        </button>
      </td>
    </tr>
  );
};

export default SaleItemRow;
