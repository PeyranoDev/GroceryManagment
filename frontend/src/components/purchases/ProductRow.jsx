import { DollarSign, Settings2, Trash2 } from "lucide-react";
import { useMemo } from "react";
import Input from "../ui/input/Input";
import Select from "../ui/select/Select";

export const ProductRow = ({
  product,
  onProductChange,
  onRemoveProduct,
  onOpenPromoModal,
}) => {
  const displayUnit = product.unitType === "peso" ? "kg" : "u";
  const unitPrice = useMemo(() => {
    const total = parseFloat(product.totalPrice) || 0;
    const quantity = parseFloat(product.quantity) || 0;
    return quantity > 0 ? (total / quantity).toFixed(2) : "0.00";
  }, [product.totalPrice, product.quantity]);
  const handleFieldChange = (field, value) =>
    onProductChange(product.id, { ...product, [field]: value });

  return (
    <tr className="border-b border-[#141312]">
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
      <td className="p-2 w-[12%] text-center font-mono text-gray-300">
        ${unitPrice} / {displayUnit}
      </td>
      <td className="p-2 w-[15%] text-center">
        <button
          onClick={() => onOpenPromoModal(product)}
          className="flex items-center justify-center w-full gap-2 bg-gray-700/50 text-gray-300 hover:bg-gray-700 font-semibold py-1 px-3 rounded-md text-xs"
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
