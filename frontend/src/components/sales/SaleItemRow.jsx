import { useMemo } from "react";
import { Trash2 } from "lucide-react";
import Input from "../ui/input/Input";

const SaleItemRow = ({
  item,
  onQuantityChange,
  onRemove,
  onTogglePromotion,
  isMobile = false,
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

  if (isMobile) {
    return (
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="font-medium text-white">{item.product.name}</p>
            <p className="text-sm text-gray-400">
              Stock: {item.product.stock} {item.product.unit}
            </p>
          </div>
          <button
            onClick={() => onRemove(item.product.id)}
            className="text-red-400 hover:text-red-500 ml-2"
          >
            <Trash2 size={18} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Cantidad:</span>
            <Input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                onQuantityChange(item.product.id, parseInt(e.target.value) || 1)
              }
              className="!w-full text-center mt-1"
            />
          </div>
          <div>
            <span className="text-gray-400">Unidad:</span>
            <p className="text-gray-300 mt-1">{item.product.unit}</p>
          </div>
          <div>
            <span className="text-gray-400">Precio Unit.:</span>
            <p className="text-gray-300 mt-1">${item.product.unitPrice.toFixed(2)}</p>
          </div>
          <div>
            <span className="text-gray-400">Total:</span>
            <p className="font-semibold text-white mt-1">${total.toFixed(2)}</p>
          </div>
        </div>
        
        {item.product.promotion && (
          <div className="flex justify-center">
            <button
              onClick={() => onTogglePromotion(item.product.id)}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                item.promotionApplied
                  ? "bg-green-900/50 text-green-300"
                  : "bg-gray-600 text-gray-300"
              }`}
            >
              Promoción: {item.promotionApplied ? "Activada" : "Desactivada"}
            </button>
          </div>
        )}
      </div>
    );
  }

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
