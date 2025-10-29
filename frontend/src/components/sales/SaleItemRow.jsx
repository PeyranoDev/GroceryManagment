import { useMemo, useState } from "react";
import { MoneyText } from "../../utils/MoneyText";
import { Trash2 } from "lucide-react";
import Input from "../ui/input/Input";
import Select from "../ui/select/Select";

const SaleItemRow = ({
  item,
  onQuantityChange,
  onRemove,
  isMobile = false,
}) => {
  const [unitSel, setUnitSel] = useState(item.product.unit === 'kg' ? 'kg' : item.product.unit);
  const total = useMemo(() => {
    if (item.promotionApplied && item.product.promotion) {
      const promo = item.product.promotion;
      const qtyBase = typeof item.quantity === 'number' ? item.quantity : 0;
      const promoSets = Math.floor(qtyBase / promo.quantity);
      const remainingQty = qtyBase % promo.quantity;
      return promoSets * promo.price + remainingQty * item.product.unitPrice;
    }
    const qtyBase = typeof item.quantity === 'number' ? item.quantity : 0;
    return qtyBase * item.product.unitPrice;
  }, [item]);

  if (isMobile) {
    return (
      <div className="bg-[var(--surface)] border border-[var(--color-border)] rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="font-medium text-[var(--color-text)]">
              {item.product.name}
            </p>
            <p className="text-sm text-[var(--color-secondary-text)]">
              Stock: {item.product.stock} {item.product.unit}
            </p>
          </div>
          <button
            onClick={() => onRemove(item.product.id)}
            className="text-[var(--color-error)] hover:text-[var(--color-error-dark)] ml-2"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-[var(--color-secondary-text)]">Cantidad:</span>
            <Input
              type="number"
              value={(() => {
                if (item.quantity === "") return "";
                if (unitSel === 'kg') return item.quantity;
                if (unitSel === 'gr') return typeof item.quantity === 'number' ? Math.round(item.quantity * 1000) : '';
                return item.quantity;
              })()}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  onQuantityChange(item.product.id, "");
                  return;
                }
                let num = parseFloat(val);
                if (Number.isNaN(num)) return;
                const qtyBase = unitSel === 'gr' ? (num / 1000) : num;
                onQuantityChange(item.product.id, qtyBase);
              }}
              step={unitSel === 'kg' ? 0.001 : 1}
              inputMode={unitSel === 'kg' ? 'decimal' : 'numeric'}
              required
            />
            {item.product.unit === 'kg' && (
              <div className="mt-2">
                <Select value={unitSel} onChange={(e) => setUnitSel(e.target.value)}>
                  <option value="kg">kg</option>
                  <option value="gr">gr</option>
                </Select>
              </div>
            )}
          </div>
          <div>
            <span className="text-[var(--color-secondary-text)]">Unidad:</span>
            <p className="text-[var(--color-secondary-text)] mt-1">
              {item.product.unit}
            </p>
          </div>
          <div>
            <span className="text-[var(--color-secondary-text)]">Precio Unit.:</span>
            <p className="font-semibold text-[var(--color-text)] mt-1">
              <MoneyText value={item.product.unitPrice || 0} />
            </p>
          </div>
          <div>
            <span className="text-[var(--color-secondary-text)]">Total:</span>
            <p className="font-semibold text-[var(--color-text)] mt-1">
              <MoneyText value={total || 0} />
            </p>
          </div>
        </div>

        
      </div>
    );
  }

  return (
    <tr className="border-b border-[var(--color-border)]">
      <td className="p-3">
        <p className="font-medium text-[var(--color-text)]">
          {item.product.name}
        </p>
        <p className="text-sm text-[var(--color-secondary-text)]">
          Stock: {item.product.stock} {item.product.unit}
        </p>
      </td>
      <td className="p-3">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={(() => {
              if (item.quantity === "") return "";
              if (unitSel === 'kg') return item.quantity;
              if (unitSel === 'gr') return typeof item.quantity === 'number' ? Math.round(item.quantity * 1000) : '';
              return item.quantity;
            })()}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") { onQuantityChange(item.product.id, ""); return; }
              let num = parseFloat(val);
              if (Number.isNaN(num)) return;
              const qtyBase = unitSel === 'gr' ? (num / 1000) : num;
              onQuantityChange(item.product.id, qtyBase);
            }}
            className="!w-24 text-center"
            step={unitSel === 'kg' ? 0.001 : 1}
            inputMode={unitSel === 'kg' ? 'decimal' : 'numeric'}
            required
          />
          {item.product.unit === 'kg' && (
            <Select value={unitSel} onChange={(e) => setUnitSel(e.target.value)} className="!w-20">
              <option value="kg">kg</option>
              <option value="gr">gr</option>
            </Select>
          )}
        </div>
      </td>
      <td className="p-3 text-[var(--color-secondary-text)]">
        {item.product.unit}
      </td>
      <td className="p-3 font-semibold text-[var(--color-text)]">
        <MoneyText value={item.product.unitPrice || 0} />
      </td>
      <td className="p-3 font-semibold text-[var(--color-text)]">
        <MoneyText value={total || 0} />
      </td>
      <td className="p-3 text-center">
        <button
          onClick={() => onRemove(item.product.id)}
          className="text-[var(--color-error)] hover:text-[var(--color-error-dark)]"
        >
          <Trash2 size={20} />
        </button>
      </td>
    </tr>
  );
};

export default SaleItemRow;
