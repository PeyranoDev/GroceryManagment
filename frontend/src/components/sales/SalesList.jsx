import { useEffect, useMemo, useState } from "react";
import { MoneyText } from "../../utils/MoneyText";
import { ListOrdered, Search } from "lucide-react";
import Toast from "../ui/toast/Toast";
import Select from "../ui/select/Select";
import StatusSelect from "../ui/status/StatusSelect";
import Card from "../ui/card/Card";
import Input from "../ui/input/Input";
import { useSales } from "../../hooks/useSales";
import { useNavigate } from "react-router-dom";

const SalesList = () => {
  const navigate = useNavigate();
  const { 
    sales,
    loading,
    error,
    fetchSales,
    updateOrderStatus,
    updatePaymentStatus,
    getSalesByDateRange,
  } = useSales();
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");
  const [searchTerm, setSearchTerm] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [rangeLoading, setRangeLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rangeResults, setRangeResults] = useState(null);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const openToast = (message, type = "success") => {
    setToastMsg(message);
    setToastType(type);
    setToastOpen(true);
  };

  const handleOrderStatusChange = async (saleId, value) => {
    try {
      await updateOrderStatus(saleId, value);
      openToast(`Pedido #${saleId} → ${value}`, "success");
    } catch {
      openToast(`Error cambiando pedido #${saleId}`, "info");
    }
  };

  const handleFetchRange = async () => {
    if (!startDate || !endDate) {
      openToast("Seleccione ambas fechas", "info");
      return;
    }
    try {
      setRangeLoading(true);
      const result = await getSalesByDateRange(startDate, endDate);
      const items = result.data || result || [];
      setRangeResults(Array.isArray(items) ? items : []);
      openToast(`Ventas del rango: ${Array.isArray(items) ? items.length : 0}`, "success");
    } catch (err) {
      openToast(err?.message || "No se pudieron obtener ventas por rango", "info");
    } finally {
      setRangeLoading(false);
    }
  };

  const handlePaymentStatusChange = async (saleId, value) => {
    try {
      await updatePaymentStatus(saleId, value);
      openToast(`Pago #${saleId} → ${value}`, "success");
    } catch {
      openToast(`Error cambiando pago #${saleId}`, "info");
    }
  };

  const isClosed = (s) => (s.orderStatus === 'Delivered' && s.paymentStatus === 'Paid');
  const isCancelled = (s) => (s.orderStatus === 'Cancelled' || s.paymentStatus === 'Cancelled');

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const base = rangeResults !== null ? rangeResults : (sales || []);
    return base
      .filter((s) => {
        const idMatch = String(s.id).includes(term);
        const nameMatch = (s.customerName || "").toLowerCase().includes(term);
        const paymentOk =
          paymentFilter === "all" ||
          (s.paymentMethod || "").toLowerCase() === paymentFilter.toLowerCase();
        const channel =
          s.deliveryAddress || s.customerPhone ? "online" : "presencial";
        const channelOk = channelFilter === "all" || channel === channelFilter;
        return (term === "" || idMatch || nameMatch) && paymentOk && channelOk;
      })
      .sort((a, b) => {
        if (sortBy === "date") {
          const ad = new Date(a.date).getTime();
          const bd = new Date(b.date).getTime();
          return sortDir === "asc" ? ad - bd : bd - ad;
        }
        const at = a.total || 0;
        const bt = b.total || 0;
        return sortDir === "asc" ? at - bt : bt - at;
      });
  }, [sales, searchTerm, paymentFilter, channelFilter, sortBy, sortDir]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSortBy(column);
    setSortDir(column === "date" ? "desc" : "asc");
  };

  const renderAmount = (n) => (
    <span className="font-semibold text-[var(--color-text)]">
      <MoneyText value={n || 0} />
    </span>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-[var(--color-secondary-text)]">
          Cargando ventas...
        </div>
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

  return (
    <Card
      title={
        <>
          <ListOrdered size={22} /> Ventas Registradas
        </>
      }
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <Input
          placeholder="Buscar por ID o cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={
            <Search size={18} className="text-[var(--color-secondary-text)]" />
          }
        />
      <div className="flex items-center gap-3 w-full md:w-auto">
          <Input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="max-w-xs" label="Desde" />
          <Input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} className="max-w-xs" label="Hasta" />
          <button onClick={handleFetchRange} className="px-3 py-2 rounded-md bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-[var(--color-text)] font-semibold">
            {rangeLoading ? "Procesando..." : "Buscar"}
          </button>
          <Select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="max-w-xs"
            label="Canal"
          >
            <option value="all">Todos</option>
            <option value="presencial">Presencial</option>
            <option value="online">Online</option>
          </Select>
          <Select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="max-w-xs"
            label="Pago"
          >
            <option value="all">Todos</option>
            <option>Efectivo</option>
            <option>Tarjeta</option>
            <option>Transferencia</option>
          </Select>
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto rounded-t-md">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-[var(--color-secondary-text)] uppercase bg-[var(--color-border)]">
            <tr>
              <th className="p-3">N°</th>
              <th className="p-3">ID</th>
              <th className="p-3">
                <button
                  onClick={() => handleSort("date")}
                  className="flex items-center gap-1 cursor-pointer select-none"
                >
                  Fecha
                </button>
              </th>
              <th className="p-3">Items</th>
              <th className="p-3">Canal</th>
              <th className="p-3">Pedido</th>
              <th className="p-3">Pago</th>
              <th className="p-3">
                <button
                  onClick={() => handleSort("total")}
                  className="flex items-center gap-1 cursor-pointer select-none"
                >
                  Total
                </button>
              </th>
              <th className="p-3">Método</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, idx) => (
              <tr key={s.id} className="border-b border-[var(--color-border)]">
                <td className="p-3 font-mono text-[var(--color-secondary-text)]">
                  {filtered.length - idx}
                </td>
                <td className="p-3 font-mono text-[var(--color-secondary-text)]">
                  {s.id}
                </td>
                <td className="p-3 text-[var(--color-secondary-text)]">
                  {new Date(s.date).toLocaleString("es-AR")}
                </td>
                <td className="p-3 text-[var(--color-secondary-text)]">
                  {Array.isArray(s.items) ? s.items.length : 0}
                </td>
                <td className="p-3 text-[var(--color-secondary-text)]">
                  {s.isOnline ? 'online' : 'presencial'}
                </td>
                <td className="p-3">
                  {isCancelled(s)
                    ? <span className="inline-block px-2 py-0.5 rounded-sm bg-[var(--color-error-dark)] text-[var(--color-text)] text-xs">Cancelado</span>
                    : (isClosed(s)
                      ? <span className="inline-block px-2 py-0.5 rounded-sm bg-[var(--color-success-dark)] text-[var(--color-text)] text-xs">Entregado</span>
                      : <StatusSelect type="order" value={s.orderStatus || "Created"} onChange={(val) => handleOrderStatusChange(s.id, val)} />)}
                </td>
                <td className="p-3">
                  {isCancelled(s)
                    ? <span className="inline-block px-2 py-0.5 rounded-sm bg-[var(--color-error-dark)] text-[var(--color-text)] text-xs">Cancelado</span>
                    : (isClosed(s)
                      ? <span className="inline-block px-2 py-0.5 rounded-sm bg-[var(--color-success-dark)] text-[var(--color-text)] text-xs">Pagado</span>
                      : <StatusSelect type="payment" value={s.paymentStatus || "Pending"} onChange={(val) => handlePaymentStatusChange(s.id, val)} />)}
                </td>
                <td className="p-3">{renderAmount(s.total || 0)}</td>
                <td className="p-3 text-[var(--color-secondary-text)]">
                  {s.paymentMethod || "—"}
                </td>
                <td className="p-3">
                  <div className="flex justify-center">
                    <button
                      onClick={() => navigate(`/ventas/registradas/${s.id}`)}
                      className="px-3 py-1 rounded-md bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-dark)] text-[var(--color-text)] font-semibold"
                    >
                      Ver detalle
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-4 text-sm text-center text-[var(--color-secondary-text)]">
            No se encontraron ventas.
          </div>
        )}
      </div>

      <div className="md:hidden space-y-4">
        {filtered.length > 0 ? (
          filtered.map((s, idx) => (
            <div
              key={s.id}
              className="bg-[var(--surface)] border border-[var(--color-border)] rounded-lg p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-[var(--color-text)] text-base">
                    Venta #{s.id}
                  </h3>
                  <p className="text-xs text-[var(--color-secondary-text)]">
                    N° {filtered.length - idx}
                  </p>
                  <p className="text-sm text-[var(--color-secondary-text)] mt-1">
                    {new Date(s.date).toLocaleString("es-AR")}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-[var(--color-secondary-text)]">
                    Items:
                  </span>{" "}
                  <span className="text-[var(--color-text)]">
                    {Array.isArray(s.items) ? s.items.length : 0}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--color-secondary-text)]">
                    Total:
                  </span>{" "}
                  <span>{renderAmount(s.total || 0)}</span>
                </div>
                <div>
                  <span className="text-[var(--color-secondary-text)]">Canal:</span>{" "}
                  <span className="text-[var(--color-text)]">{s.isOnline ? 'online' : 'presencial'}</span>
                </div>
                <div>
                  <span className="text-[var(--color-secondary-text)]">Pedido:</span>{" "}
                  {isCancelled(s)
                    ? <span className="inline-block px-2 py-0.5 rounded-sm bg-[var(--color-error-dark)] text-[var(--color-text)] text-xs">Cancelado</span>
                    : (isClosed(s)
                      ? <span className="inline-block px-2 py-0.5 rounded-sm bg-[var(--color-success-dark)] text-[var(--color-text)] text-xs">Entregado</span>
                      : <StatusSelect type="order" value={s.orderStatus || "Created"} onChange={(val) => handleOrderStatusChange(s.id, val)} />)}
                </div>
                <div>
                  <span className="text-[var(--color-secondary-text)]">Pago:</span>{" "}
                  {isCancelled(s)
                    ? <span className="inline-block px-2 py-0.5 rounded-sm bg-[var(--color-error-dark)] text-[var(--color-text)] text-xs">Cancelado</span>
                    : (isClosed(s)
                      ? <span className="inline-block px-2 py-0.5 rounded-sm bg-[var(--color-success-dark)] text-[var(--color-text)] text-xs">Pagado</span>
                      : <StatusSelect type="payment" value={s.paymentStatus || "Pending"} onChange={(val) => handlePaymentStatusChange(s.id, val)} />)}
                </div>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => navigate(`/ventas/registradas/${s.id}`)}
                  className="w-full px-3 py-2 rounded-md bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-dark)] text-[var(--color-text)] font-semibold"
                >
                  Ver detalle
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-sm text-center text-[var(--color-secondary-text)]">
            No se encontraron ventas.
          </div>
        )}
      </div>
      <Toast
        open={toastOpen}
        message={toastMsg}
        type={toastType}
        onClose={() => setToastOpen(false)}
      />
    </Card>
  );
};

export default SalesList;
