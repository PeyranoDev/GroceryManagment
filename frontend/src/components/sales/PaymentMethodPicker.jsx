import { DollarSign, CreditCard, QrCode, Wallet } from "lucide-react";

const methods = [
  { id: 'Efectivo', label: 'Efectivo', icon: DollarSign },
  { id: 'Crédito', label: 'Crédito', icon: CreditCard },
  { id: 'Débito', label: 'Débito', icon: CreditCard },
  { id: 'QR Mercado Pago', label: 'Mercado Pago', icon: QrCode },
];

const PaymentMethodPicker = ({ value, onChange, className = "" }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${className}`} role="radiogroup" aria-label="Método de pago">
      {methods.map((m) => {
        const Icon = m.icon;
        const selected = String(value) === String(m.id);
        return (
          <button
            key={m.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange && onChange({ target: { value: m.id } })}
            className={`h-16 w-full rounded-md border transition-colors ${selected ? 'border-[var(--color-primary)] bg-[var(--color-bg-input)] text-[var(--color-text)]' : 'border-[var(--color-border)] bg-[var(--color-bg-input)] text-[var(--color-secondary-text)] hover:bg-[var(--color-bg-input)]/80'}`}
          >
            <div className="flex items-center gap-3 px-3">
              <Icon size={24} />
              <div className="text-sm font-semibold">{m.label}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default PaymentMethodPicker;

