import { useEffect, useState } from "react";
import StatusSelect from "../ui/status/StatusSelect";
import Toast from "../ui/toast/Toast";
import { Receipt, ArrowLeft } from "lucide-react";
import { useSales } from "../../hooks/useSales";
import Card from "../ui/card/Card";
import { MoneyText } from "../../utils/MoneyText";
import { useNavigate, useParams } from "react-router-dom";
import { salesAPI } from "../../services/api";

const SaleDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { updateOrderStatus, updatePaymentStatus } = useSales();
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");

  const openToast = (message, type = "success") => {
    setToastMsg(message);
    setToastType(type);
    setToastOpen(true);
  };

  const handleOrderStatusChange = async (value) => {
    try {
      const updated = await updateOrderStatus(sale.id, value).catch(() => null);
      if (updated) setSale(updated);
      openToast(`Pedido #${sale.id} → ${value}`, "success");
    } catch {
      openToast(`Error cambiando pedido #${sale.id}`, "info");
    }
  };

  const handlePaymentStatusChange = async (value) => {
    try {
      const updated = await updatePaymentStatus(sale.id, value).catch(() => null);
      if (updated) setSale(updated);
      openToast(`Pago #${sale.id} → ${value}`, "success");
    } catch {
      openToast(`Error cambiando pago #${sale.id}`, "info");
    }
  };

  const isClosed = sale && sale.orderStatus === 'Delivered' && sale.paymentStatus === 'Paid';
  const isCancelled = sale && (sale.orderStatus === 'Cancelled' || sale.paymentStatus === 'Cancelled');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await salesAPI.getById(parseInt(id, 10));
        const data = res.data || res;
        setSale(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-[var(--color-secondary-text)]">Cargando venta...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-[var(--color-error)]">Error: {error}</div>
      </div>
    );
  }

  if (!sale) return null;

  return (
    <Card
      size="medium"
      title={<><Receipt size={22} /> Venta #{sale.id}</>}
      actions={
        <button onClick={() => navigate('/ventas/registradas')} className="flex items-center gap-2 bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--color-text)] font-semibold py-2 px-4 rounded-md">
          <ArrowLeft size={16} /> Volver a la lista
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div><span className="text-[var(--color-secondary-text)]">Fecha:</span> <span className="text-[var(--color-text)]">{new Date(sale.date).toLocaleDateString('es-AR')}</span></div>
        <div><span className="text-[var(--color-secondary-text)]">Hora:</span> <span className="text-[var(--color-text)]">{(() => { const d = new Date(sale.date); const h = String(d.getHours()).padStart(2,'0'); const m = String(d.getMinutes()).padStart(2,'0'); return `${h}:${m}`; })()}</span></div>
        <div><span className="text-[var(--color-secondary-text)]">Método de Pago:</span> <span className="text-[var(--color-text)]">{sale.paymentMethod || '—'}</span></div>
        {sale.customerName && <div><span className="text-[var(--color-secondary-text)]">Cliente:</span> <span className="text-[var(--color-text)]">{sale.customerName}</span></div>}
        {sale.customerPhone && <div><span className="text-[var(--color-secondary-text)]">Teléfono:</span> <span className="text-[var(--color-text)]">{sale.customerPhone}</span></div>}
        {sale.isOnline && sale.deliveryAddress && <div className="md:col-span-3"><span className="text-[var(--color-secondary-text)]">Dirección:</span> <span className="text-[var(--color-text)]">{sale.deliveryAddress}</span></div>}
      </div>
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <span className="text-[var(--color-secondary-text)] text-sm">Pedido:</span>
          {isCancelled
            ? <span className="inline-block px-2 py-0.5 rounded-sm bg-[var(--color-error-dark)] text-[var(--color-text)] text-xs">Cancelado</span>
            : (isClosed
              ? <span className="inline-block px-2 py-0.5 rounded-sm bg-[var(--color-success-dark)] text-[var(--color-text)] text-xs">Entregado</span>
              : <StatusSelect type="order" value={sale.orderStatus || 'Created'} onChange={(val) => handleOrderStatusChange(val)} selectClassName="w-[140px] h-[35px] !py-1" />)}
        </div>
        <div>
          <span className="text-[var(--color-secondary-text)] text-sm">Pago:</span>
          {isCancelled
            ? <span className="inline-block px-2 py-0.5 rounded-sm bg-[var(--color-error-dark)] text-[var(--color-text)] text-xs">Cancelado</span>
            : (isClosed
              ? <span className="inline-block px-2 py-0.5 rounded-sm bg-[var(--color-success-dark)] text-[var(--color-text)] text-xs">Pagado</span>
              : <StatusSelect type="payment" value={sale.paymentStatus || 'Pending'} onChange={(val) => handlePaymentStatusChange(val)} selectClassName="w-[140px] h-[35px] !py-1" />)}
        </div>
      </div>

      <div className="mt-3 hidden md:block overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] shadow-md">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-[var(--color-text)] uppercase bg-[var(--color-border)]">
            <tr>
              <th className="p-3">Producto</th>
              <th className="p-3">Cantidad</th>
              <th className="p-3 text-right">Precio Unitario</th>
              <th className="p-3 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {(sale.items || []).map((it, idx) => (
              <tr key={`${it.productId}-${it.productName}`} className={`border-b border-[var(--color-border)] ${idx % 2 === 0 ? 'bg-[var(--surface)]' : 'bg-[var(--color-bg-input)]'}`}>
                <td className="p-3 text-[var(--color-text)]">{it.product?.name || it.Product?.Name || it.productName}</td>
                <td className="p-3 text-[var(--color-secondary-text)]">{it.quantity}</td>
                <td className="p-3 text-right text-[var(--color-secondary-text)]"><MoneyText value={it.price ?? it.Price ?? 0} /></td>
                <td className="p-3 text-right"><MoneyText value={(it.price ?? it.Price ?? 0) * it.quantity} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-2 mt-3">
        {(sale.items || []).map((it) => (
          <div key={`${it.productId}-${it.productName}`} className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] shadow-md">
            <div className="flex justify-between"><span className="text-[var(--color-secondary-text)]">Producto</span><span className="text-[var(--color-text)]">{it.product?.name || it.Product?.Name || it.productName}</span></div>
            <div className="flex justify-between"><span className="text-[var(--color-secondary-text)]">Cantidad</span><span className="text-[var(--color-text)]">{it.quantity}</span></div>
            <div className="flex justify-between"><span className="text-[var(--color-secondary-text)]">Precio Unitario</span><span className="text-[var(--color-secondary-text)]"><MoneyText value={it.price ?? it.Price ?? 0} /></span></div>
            <div className="flex justify-between"><span className="text-[var(--color-secondary-text)]">Subtotal</span><span><MoneyText value={(it.price ?? it.Price ?? 0) * it.quantity} /></span></div>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {sale.deliveryCost > 0 && (
          <div className="flex justify-between text-[var(--color-secondary-text)]">
            <p>Subtotal:</p>
            <p className="font-semibold text-[var(--color-text)]"><MoneyText value={(sale.items || []).reduce((acc, it) => acc + (it.price ?? it.Price ?? 0) * it.quantity, 0)} /></p>
          </div>
        )}
        {sale.deliveryCost > 0 && (
          <div className="flex justify-between text-[var(--color-secondary-text)]">
            <p>Costo de Envío:</p>
            <p className="font-semibold text-[var(--color-text)]"><MoneyText value={sale.deliveryCost || 0} /></p>
          </div>
        )}
        <div className="flex justify-between text-[var(--color-text)] border-t border-[var(--color-border)] pt-2 mt-2">
          <p>Total:</p>
          <p className={`text-2xl font-extrabold ${(sale.moneda === 2 || sale.moneda === 'USD') ? 'text-green-600' : ''}`}>
            {(sale.moneda === 2 || sale.moneda === 'USD') 
              ? `US$ ${(sale.totalUSD || sale.total || 0).toFixed(2)}`
              : <MoneyText value={(sale.total ?? 0) + (sale.deliveryCost ?? 0)} />}
          </p>
        </div>
        {sale.cotizacionDolar > 0 && (
          <div className="text-sm text-center text-[var(--color-secondary-text)] mt-2">
            {(sale.moneda === 2 || sale.moneda === 'USD')
              ? <>Equivalente en ARS: <MoneyText value={sale.totalARS || sale.total || 0} /></>
              : <>Equivalente en USD: <span className="text-green-600">US$ {(sale.totalUSD || 0).toFixed(2)}</span></>}
            <span className="text-xs ml-2">(Cotización: ${sale.cotizacionDolar?.toFixed(2)})</span>
          </div>
        )}
      </div>
      <Toast open={toastOpen} message={toastMsg} type={toastType} onClose={() => setToastOpen(false)} />
    </Card>
  );
};

export default SaleDetail;
