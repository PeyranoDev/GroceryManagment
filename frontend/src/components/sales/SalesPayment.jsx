import Card from "../ui/card/Card";
import { MoneyText } from "../../utils/MoneyText";
import PaymentMethodPicker from "./PaymentMethodPicker";

const SalesPayment = ({ details, total = 0, totalUSD = 0, moneda = 1, cotizacionDolar = 0, onDetailChange, onPrev, onConfirm, onCancel }) => {
  const canConfirm = !!details.paymentMethod;
  const isUSD = moneda === 2;

  return (
    <Card size="narrow" title="Pago">
      <div className="space-y-4">
        <div>
          <div className="block text-sm font-medium text-[var(--color-secondary-text)] mb-1">Método de pago</div>
          <PaymentMethodPicker value={details.paymentMethod} onChange={(e) => onDetailChange('paymentMethod', e.target.value)} />
        </div>

        <div className="flex justify-between items-end">
          <div className="text-[var(--color-secondary-text)]">Total a pagar:</div>
          <div className={`text-2xl font-extrabold ${isUSD ? 'text-green-600' : 'text-[var(--color-text)]'}`}>
            {isUSD ? `US$ ${totalUSD.toFixed(2)}` : <MoneyText value={total} />}
          </div>
        </div>
        {cotizacionDolar > 0 && (
          <div className="text-sm text-center text-[var(--color-secondary-text)]">
            {isUSD 
              ? <>Equivalente: <MoneyText value={total} /></>
              : <>Equivalente: <span className="text-green-600">US$ {totalUSD.toFixed(2)}</span></>}
          </div>
        )}

        <div className="flex justify-between">
          <button type="button" onClick={onPrev} className="px-4 py-2 rounded-md bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--color-text)] font-semibold">Anterior</button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md bg-[var(--color-error)] hover:bg-[var(--color-error-dark)] text-[var(--color-text)] font-semibold">Descartar</button>
            <button type="button" onClick={onConfirm} disabled={!canConfirm} className={`px-4 py-2 rounded-md font-semibold ${canConfirm ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-[var(--color-text)]' : 'bg-[var(--color-primary)]/50 text-[var(--color-text)] cursor-not-allowed'}`}>Confirmar Venta</button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SalesPayment;
