import Card from "../ui/card/Card";
import { MoneyText } from "../../utils/MoneyText";

const SalesSummary = ({ 
  subtotal, 
  total, 
  deliveryCost, 
  isOnline,
  cart = [],
  footerActions
}) => {
  return (
    <Card size="medium" title={<div className="w-full text-center">Resumen de Venta</div>}>
      <div className="space-y-4" style={{ fontFamily: 'Arial, sans-serif' }}>
        {Array.isArray(cart) && cart.length > 0 && (
          <div className="space-y-2">
            <div className="hidden md:block overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--surface)] shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-[var(--color-secondary-text)] uppercase bg-[var(--color-border)]/60">
                  <tr>
                    <th className="p-3">Producto</th>
                    <th className="p-3">Cantidad</th>
                    <th className="p-3 text-right">Precio Unitario</th>
                    <th className="p-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, idx) => (
                    <tr key={item.product.id} className={`border-b border-[var(--color-border)] ${idx % 2 === 0 ? 'bg-[var(--surface)]' : 'bg-[var(--surface-muted)]'}`}>
                      <td className="p-3 text-[var(--color-text)]">{item.product.name}</td>
                      <td className="p-3 text-[var(--color-secondary-text)]">{item.quantity}</td>
                      <td className="p-3 text-right text-[var(--color-secondary-text)] font-semibold"><MoneyText value={item.product.unitPrice || item.product.salePrice || 0} /></td>
                      <td className="p-3 text-right text-[var(--color-text)] font-semibold"><MoneyText value={item.quantity * (item.product.unitPrice || item.product.salePrice || 0)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-2">
              {cart.map((item) => (
                <div key={item.product.id} className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--surface)] shadow-sm">
                  <div className="flex justify-between"><span className="text-[var(--color-secondary-text)]">Producto</span><span className="text-[var(--color-text)]">{item.product.name}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--color-secondary-text)]">Cantidad</span><span className="text-[var(--color-text)]">{item.quantity}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--color-secondary-text)]">Precio Unitario</span><span className="text-[var(--color-secondary-text)] font-semibold"><MoneyText value={item.product.unitPrice || item.product.salePrice || 0} /></span></div>
                  <div className="flex justify-between"><span className="text-[var(--color-secondary-text)]">Subtotal</span><span className="text-[var(--color-text)] font-semibold"><MoneyText value={item.quantity * (item.product.unitPrice || item.product.salePrice || 0)} /></span></div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="space-y-3 border-t border-[var(--color-border)]/60 pt-3">
          {deliveryCost > 0 && (
            <div className="flex justify-between text-[var(--color-secondary-text)]">
              <p>Subtotal:</p>
              <p className="font-semibold text-[var(--color-text)]"><MoneyText value={subtotal || 0} /></p>
            </div>
          )}
          {isOnline && deliveryCost > 0 && (
            <div className="flex justify-between text-[var(--color-secondary-text)]">
              <p>Costo de Envío:</p>
              <p className="font-semibold text-[var(--color-text)]"><MoneyText value={deliveryCost || 0} /></p>
            </div>
          )}
          <div className="flex justify-between text-[var(--color-text)]">
            <p>Total:</p>
            <p className="text-3xl font-extrabold"><MoneyText value={total || 0} /></p>
          </div>
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
