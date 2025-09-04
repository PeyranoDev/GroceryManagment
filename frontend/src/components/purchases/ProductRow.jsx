import { DollarSign, Settings2, Trash2 } from "lucide-react";
import { useMemo } from "react";
import Input from "../ui/input/Input";
import Select from "../ui/select/Select";

export const ProductRow = ({
  product,
  onProductChange,
  onRemoveProduct,
  onOpenPromoModal,
  isMobile = false,
}) => {
  const displayUnit = product.unitType === "peso" ? "kg" : "u";
  const unitPrice = useMemo(() => {
    const total = parseFloat(product.totalPrice) || 0;
    const quantity = parseFloat(product.quantity) || 0;
    return quantity > 0 ? (total / quantity).toFixed(2) : "0.00";
  }, [product.totalPrice, product.quantity]);
  const handleFieldChange = (field, value) =>
    onProductChange(product.id, { ...product, [field]: value });

  if (isMobile) {
    return (
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-4 space-y-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nombre del producto</label>
            <Input
              placeholder="Nombre del producto"
              value={product.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Unidad de Medida</label>
              <Select
                value={product.unitType}
                onChange={(e) => handleFieldChange("unitType", e.target.value)}
              >
                <option value="peso">Peso (kg)</option>
                <option value="unidad">Unidad (u)</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Cantidad</label>
              <Input
                type="number"
                placeholder="0"
                value={product.quantity}
                onChange={(e) => handleFieldChange("quantity", e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Precio Total</label>
            <Input
              type="number"
              placeholder="0.00"
              value={product.totalPrice}
              onChange={(e) => handleFieldChange("totalPrice", e.target.value)}
              icon={<DollarSign size={16} className="text-gray-400" />}
            />
          </div>
          
          <div className="bg-gray-800/50 p-3 rounded-md">
            <span className="text-sm text-gray-400">Precio Unitario:</span>
            <p className="text-lg font-semibold text-[var(--color-text)]">${unitPrice} / {displayUnit}</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[var(--color-border)]">
          <button
            onClick={() => onOpenPromoModal(product)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-[var(--color-text)] font-medium py-2 px-3 rounded-md text-sm flex-1"
          >
            <Settings2 size={14} />
            Promociones
          </button>
          <button
            onClick={() => onRemoveProduct(product.id)}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-[var(--color-text)] font-medium py-2 px-3 rounded-md text-sm flex-1"
          >
            <Trash2 size={14} />
            Eliminar
          </button>
        </div>
      </div>
    );
  }

  return (
    <tr className="border-b border-[var(--color-bg-input)]">
      <td className="p-2 w-1/4">
        <Input
          placeholder="Nombre del producto"
          value={product.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
        />
      </td>
      <td className="p-2 w-[15%]">
        <Select
          value={product.unitType}
          onChange={(e) => handleFieldChange("unitType", e.target.value)}
        >
          <option value="peso">Peso (kg)</option>
          <option value="unidad">Unidad (u)</option>
        </Select>
      </td>
      <td className="p-2 w-[10%]">
        <Input
          type="number"
          placeholder="0"
          value={product.quantity}
          onChange={(e) => handleFieldChange("quantity", e.target.value)}
        />
      </td>
      <td className="p-2 w-[15%]">
        <Input
          type="number"
          placeholder="0.00"
          value={product.totalPrice}
          onChange={(e) => handleFieldChange("totalPrice", e.target.value)}
          icon={<DollarSign size={14} className="text-gray-400" />}
        />
      </td>
      <td className="p-2 w-[12%] text-center font-mono text-[var(--color-secondary-text)]">
        ${unitPrice} / {displayUnit}
      </td>
      <td className="p-2 w-[15%] text-center">
        <button
          onClick={() => onOpenPromoModal(product)}
          className="flex items-center justify-center w-full gap-2 bg-gray-700/50 text-[var(--color-secondary-text)] hover:bg-gray-700 font-semibold py-1 px-3 rounded-md text-xs"
        >
          <Settings2 size={14} />
          <span>Gestionar ({product.promotions.length})</span>
        </button>
      </td>
      <td className="p-2 w-[5%] text-center">
        <button
          onClick={() => onRemoveProduct(product.id)}
          className="text-red-400 hover:text-red-500"
        >
          <Trash2 size={20} />
        </button>
      </td>
    </tr>
  );
};
