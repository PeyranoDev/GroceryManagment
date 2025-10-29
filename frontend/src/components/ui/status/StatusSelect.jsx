import Select from "../select/Select";

const ORDER_OPTIONS = [
  { value: "Created", label: "Creado" },
  { value: "InPreparation", label: "En preparación" },
  { value: "ReadyForPickup", label: "Listo para retirar" },
  { value: "OutForDelivery", label: "En reparto" },
  { value: "Delivered", label: "Entregado" },
  { value: "Cancelled", label: "Cancelado" },
];

const PAYMENT_OPTIONS = [
  { value: "Pending", label: "Pendiente" },
  { value: "PartiallyPaid", label: "Pago parcial" },
  { value: "Paid", label: "Pagado" },
  { value: "Refunded", label: "Reembolsado" },
  { value: "Cancelled", label: "Cancelado" },
];

const getVariant = (type, value) => {
  if (type === "order") {
    if (value === "Delivered") return "success";
    if (value === "Cancelled") return "error";
    return "warning";
  }
  if (type === "payment") {
    if (value === "Paid") return "success";
    if (value === "Cancelled" || value === "Refunded") return "error";
    return "warning";
  }
  return undefined;
};

const StatusSelect = ({ type, value, onChange, selectClassName = "w-[140px] h-[35px] !py-1" }) => {
  const options = type === "order" ? ORDER_OPTIONS : PAYMENT_OPTIONS;
  const variant = getVariant(type, value);
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      selectClassName={selectClassName}
      variant={variant}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-[var(--color-bg-input)] text-[var(--color-text)]">
          {opt.label}
        </option>
      ))}
    </Select>
  );
};

export default StatusSelect;

