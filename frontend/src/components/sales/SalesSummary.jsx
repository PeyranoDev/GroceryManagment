import Card from "../ui/card/Card";
import { MoneyText } from "../../utils/MoneyText";

const SalesSummary = ({ 
  subtotal, 
  total, 
  deliveryCost, 
  isOnline,
  cart = [],
  footerActions,
  moneda = 1,
  onMonedaChange,
  cotizacionDolar = 0
}) => {
  // Calcular totales en USD si hay cotización
  const subtotalUSD = cotizacionDolar > 0 ? (subtotal / cotizacionDolar) : 0;
  const totalUSD = cotizacionDolar > 0 ? (total / cotizacionDolar) : 0;
  
  return (
    <Card size="medium" title={<div className="w-full text-center">Resumen de Venta</div>}>
      <div className="space-y-4" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Selector de moneda */}
        {onMonedaChange && cotizacionDolar > 0 && (
          <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border)] bg-[var(--surface-muted)]">
            <span className="text-[var(--color-secondary-text)] text-sm">Moneda de pago:</span>
            <div className="flex gap-2">
              <button
                onClick={() => onMonedaChange(1)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  moneda === 1 
                    ? 'bg-[var(--color-primary)] text-white' 
                    : 'bg-[var(--color-border)] text-[var(--color-secondary-text)] hover:bg-[var(--color-border-hover)]'
                }`}
              >
                🇦🇷 ARS
              </button>
              <button
                onClick={() => onMonedaChange(2)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  moneda === 2 
                    ? 'bg-green-600 text-white' 
                    : 'bg-[var(--color-border)] text-[var(--color-secondary-text)] hover:bg-[var(--color-border-hover)]'
                }`}
              >
                🇺🇸 USD
              </button>
            </div>
          </div>
        )}
        
        {/* Cotización info */}
        {cotizacionDolar > 0 && (
          <div className="text-xs text-center text-[var(--color-secondary-text)]">
            Cotización dólar oficial: ${cotizacionDolar.toFixed(2)} ARS
          </div>
        )}
        
        {Array.isArray(cart) && cart.length > 0 && (
          <div className="space-y-2">
            <div className="hidden md:block overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--surface)] shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-[var(--color-secondary-text)] uppercase bg-[var(--color-border)]/60">
                  <tr>
                    <th className="p-3">Producto</th>
                    <th className="p-3">Cantidad</th>
                    <th className="p-3 text-right">Precio Unit. (ARS)</th>
                    {cotizacionDolar > 0 && <th className="p-3 text-right">Precio Unit. (USD)</th>}
                    <th className="p-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, idx) => {
                    const priceARS = item.product.unitPrice || item.product.salePrice || 0;
                    const priceUSD = item.product.salePriceUSD || (cotizacionDolar > 0 ? priceARS / cotizacionDolar : 0);
                    return (
                      <tr key={item.product.id} className={`border-b border-[var(--color-border)] ${idx % 2 === 0 ? 'bg-[var(--surface)]' : 'bg-[var(--surface-muted)]'}`}>
                        <td className="p-3 text-[var(--color-text)]">{item.product.name}</td>
                        <td className="p-3 text-[var(--color-secondary-text)]">{item.quantity}</td>
                        <td className="p-3 text-right text-[var(--color-secondary-text)] font-semibold"><MoneyText value={priceARS} /></td>
                        {cotizacionDolar > 0 && <td className="p-3 text-right text-green-600 font-semibold">US$ {priceUSD.toFixed(2)}</td>}
                        <td className="p-3 text-right text-[var(--color-text)] font-semibold">
                          {moneda === 2 
                            ? <span className="text-green-600">US$ {(item.quantity * priceUSD).toFixed(2)}</span>
                            : <MoneyText value={item.quantity * priceARS} />
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-2">
              {cart.map((item) => {
                const priceARS = item.product.unitPrice || item.product.salePrice || 0;
                const priceUSD = item.product.salePriceUSD || (cotizacionDolar > 0 ? priceARS / cotizacionDolar : 0);
                return (
                  <div key={item.product.id} className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--surface)] shadow-sm">
                    <div className="flex justify-between"><span className="text-[var(--color-secondary-text)]">Producto</span><span className="text-[var(--color-text)]">{item.product.name}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--color-secondary-text)]">Cantidad</span><span className="text-[var(--color-text)]">{item.quantity}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--color-secondary-text)]">Precio (ARS)</span><span className="text-[var(--color-secondary-text)] font-semibold"><MoneyText value={priceARS} /></span></div>
                    {cotizacionDolar > 0 && (
                      <div className="flex justify-between"><span className="text-[var(--color-secondary-text)]">Precio (USD)</span><span className="text-green-600 font-semibold">US$ {priceUSD.toFixed(2)}</span></div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-[var(--color-secondary-text)]">Subtotal</span>
                      <span className="text-[var(--color-text)] font-semibold">
                        {moneda === 2 
                          ? <span className="text-green-600">US$ {(item.quantity * priceUSD).toFixed(2)}</span>
                          : <MoneyText value={item.quantity * priceARS} />
                        }
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div className="space-y-3 border-t border-[var(--color-border)]/60 pt-3">
          {deliveryCost > 0 && (
            <div className="flex justify-between text-[var(--color-secondary-text)]">
              <p>Subtotal:</p>
              <p className="font-semibold text-[var(--color-text)]">
                {moneda === 2 
                  ? <span className="text-green-600">US$ {subtotalUSD.toFixed(2)}</span>
                  : <MoneyText value={subtotal || 0} />
                }
              </p>
            </div>
          )}
          {isOnline && deliveryCost > 0 && (
            <div className="flex justify-between text-[var(--color-secondary-text)]">
              <p>Costo de Envío:</p>
              <p className="font-semibold text-[var(--color-text)]">
                {moneda === 2 && cotizacionDolar > 0
                  ? <span className="text-green-600">US$ {(deliveryCost / cotizacionDolar).toFixed(2)}</span>
                  : <MoneyText value={deliveryCost || 0} />
                }
              </p>
            </div>
          )}
          <div className="flex justify-between text-[var(--color-text)]">
            <p>Total:</p>
            <p className="text-3xl font-extrabold">
              {moneda === 2 
                ? <span className="text-green-600">US$ {totalUSD.toFixed(2)}</span>
                : <MoneyText value={total || 0} />
              }
            </p>
          </div>
          {/* Mostrar equivalente en la otra moneda */}
          {cotizacionDolar > 0 && (
            <div className="text-sm text-center text-[var(--color-secondary-text)]">
              {moneda === 2 
                ? <>Equivalente: <MoneyText value={total || 0} /></>
                : <>Equivalente: <span className="text-green-600">US$ {totalUSD.toFixed(2)}</span></>
              }
            </div>
          )}
        </div>

      </div>
      {footerActions && (
        <div className="flex justify-between mt-3">
          {footerActions}
        </div>
      )}
    </Card>
  );
};

export default SalesSummary;
