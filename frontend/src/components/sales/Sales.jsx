import { useState, useEffect } from "react";
import { useProducts } from "../../hooks/useProducts";
import { useSales, useCart } from "../../hooks/useSales";
import SalesInfo from "./SalesInfo";
import Stepper from "./Stepper";
import Card from "../ui/card/Card";
import ProductSearch from "./ProductSearch";
import SalesSummary from "./SalesSummary";
import SalesPayment from "./SalesPayment";
import ConfirmModal from "../ui/modal/ConfirmModal";
import Toast from "../ui/toast/Toast";
import SalesCart from "./SalesCart";

const Sales = () => {
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const { loading: productsLoading, searchProducts } = useProducts();
  const { createSaleFromCart } = useSales();
  const {
    cart,
    addProductToCart,
    removeFromCart,
    updateQuantity,
    togglePromotion,
    clearCart,
    calculateTotals
  } = useCart();

  const [details, setDetails] = useState({
    date: new Date().toISOString().slice(0, 10),
    time: getCurrentTime(),
    client: "",
    paymentMethod: "Efectivo",
    observations: "",
    isOnline: false,
    deliveryCost: "",
  });
  const [step, setStep] = useState(() => {
    try {
      const saved = window.localStorage.getItem('sales_state');
      if (saved) { const s = JSON.parse(saved); return s.step || 1; }
    } catch {
      // ignore localStorage read errors
    }
    return 1;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  
  const [confirmCreateOpen, setConfirmCreateOpen] = useState(false);
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    const interval = setInterval(() => {
      setDetails((prev) => ({
        ...prev,
        time: getCurrentTime(),
      }));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleDetailChange = (key, value) =>
    setDetails((prev) => ({ ...prev, [key]: value }));

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim()) {
      const results = searchProducts(term);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleAddProductToCart = (product) => {
    addProductToCart(product);
    setSearchTerm("");
    setSearchResults([]);
  };

  const { subtotal, total } = calculateTotals(
    details.isOnline ? details.deliveryCost : 0
  );


  const resetSale = () => {
    clearCart();
    setDetails({
      date: new Date().toISOString().slice(0, 10),
      time: getCurrentTime(),
      client: "",
      paymentMethod: "Efectivo",
      observations: "",
      isOnline: false,
      deliveryCost: "",
    });
    setStep(1);
  };

  const finalizeSale = async () => {
    if (cart.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    // Validación: no permitir cantidades vacías o inválidas
    const hasInvalidQty = cart.some(
      (item) => !Number.isInteger(item.quantity) || item.quantity <= 0
    );
    if (hasInvalidQty) {
      alert("Hay productos con cantidad vacía o inválida. Complete las cantidades antes de guardar.");
      return;
    }

    try {
      const { subtotal, total } = calculateTotals(details.isOnline ? details.deliveryCost : 0);
      const getUserId = () => {
        try {
          const stored = window.localStorage.getItem('auth_user');
          const u = stored ? JSON.parse(stored) : null;
          return u?.id ?? u?.userId ?? 1;
        } catch { return 1; }
      };
      const cartPayload = {
        userId: getUserId(),
        cart: cart.map((item) => ({
          productId: item.product.id,
          salePrice: item.product.salePrice ?? item.product.unitPrice,
          quantity: item.quantity,
        })),
        details: {
          date: new Date(details.date),
          time: details.time,
          client: details.client || '',
          paymentMethod: details.paymentMethod || 'Efectivo',
          observations: details.observations || '',
          isOnline: !!details.isOnline,
          deliveryCost: parseFloat(details.deliveryCost || 0),
        },
      };
      const created = await createSaleFromCart(cartPayload);
      resetSale();
      setToastMsg(`Venta creada`);
      setToastType("success");
      setToastOpen(true);
      setConfirmCreateOpen(false);
    } catch (error) {
      setToastMsg(error?.message || 'No se pudo crear la venta');
      setToastType('info');
      setToastOpen(true);
    }
  };

  

  useEffect(() => {
    try { window.localStorage.setItem('sales_state', JSON.stringify({ step, details })); } catch {
      // ignore localStorage write errors
    }
  }, [step, details]);

  const gotoNext = () => setStep((s) => Math.min(s + 1, 4));
  const gotoPrev = () => setStep((s) => Math.max(s - 1, 1));

  const headerValid = () => {
    const isOnline = !!details.isOnline;
    const hasDate = !!details.date;
    const hasTime = !!details.time;
    const hasClient = !isOnline || !!details.client?.trim();
    const needsPhone = isOnline;
    const hasPhone = !needsPhone || !!details.phone?.trim();
    const needsAddress = details.deliveryMethod === 'Entrega a domicilio';
    const hasAddress = !needsAddress || !!details.address?.trim();
    return hasDate && hasTime && hasClient && hasPhone && hasAddress;
  };

  if (productsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-[var(--color-secondary-text)]">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-5">
      <Card size="medium" className="flex justify-center">
          <Stepper current={step} />
      </Card>
      {step === 1 && (
        <div className="transition-all duration-300">
          <SalesInfo details={details} onDetailChange={handleDetailChange} onNext={() => { if (headerValid()) gotoNext(); }} />
        </div>
      )}
      {step === 2 && (
        <div className="transition-all duration-300 flex justify-center">
          <SalesCart
            cart={cart}
            onQuantityChange={updateQuantity}
            onRemove={removeFromCart}
            onTogglePromotion={togglePromotion}
            productSearchComponent={
              <ProductSearch
                searchTerm={searchTerm}
                searchResults={searchResults}
                onSearchChange={handleSearchChange}
                onAddProduct={handleAddProductToCart}
              />
            }
            footerActions={(
              <>
                <button onClick={gotoPrev} className="px-4 py-2 rounded-md bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--color-text)] font-semibold">Anterior</button>
                <button onClick={gotoNext} disabled={cart.length === 0} className={`px-4 py-2 rounded-md font-semibold ${cart.length>0?'bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-dark)] text-[var(--color-text)]':'bg-[var(--color-secondary)]/50 text-[var(--color-secondary-text)] cursor-not-allowed'}`}>Siguiente</button>
              </>
            )}
          />
        </div>
      )}
      {step === 3 && (
        <div className="transition-all duration-300">
          <div className="flex justify-center">
            <div className="w-full max-w-[800px]">
              <SalesSummary
                subtotal={subtotal}
                total={total}
                deliveryCost={details ? parseFloat(details.deliveryCost || 0) : 0}
                isOnline={details ? details.isOnline : false}
                cart={cart}
                details={details}
                footerActions={(
                  <>
                    <button onClick={gotoPrev} className="px-4 py-2 rounded-md bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--color-text)] font-semibold">Anterior</button>
                    <button onClick={gotoNext} className="px-4 py-2 rounded-md bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-[var(--color-text)] font-semibold">Siguiente</button>
                  </>
                )}
              />
            </div>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="transition-all duration-300">
          <SalesPayment
            details={details}
            total={total}
            onDetailChange={handleDetailChange}
            onPrev={gotoPrev}
            onConfirm={() => setConfirmCreateOpen(true)}
            onCancel={() => setConfirmDiscardOpen(true)}
          />
        </div>
      )}

      
      <ConfirmModal
        isOpen={confirmCreateOpen}
        onClose={() => setConfirmCreateOpen(false)}
        title="Confirmar Venta"
        message={`Total: $${Number(total || 0).toLocaleString()}`}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={finalizeSale}
        variant="success"
      />
      <ConfirmModal
        isOpen={confirmDiscardOpen}
        onClose={() => setConfirmDiscardOpen(false)}
        title="Descartar Venta"
        message="¿Seguro que deseas descartar la venta actual?"
        confirmText="Descartar"
        cancelText="Volver"
        onConfirm={() => { resetSale(); setConfirmDiscardOpen(false); setToastMsg("Venta descartada"); setToastType("info"); setToastOpen(true); }}
        variant="danger"
      />
      <Toast open={toastOpen} message={toastMsg} type={toastType} onClose={() => setToastOpen(false)} />
    </div>
  );
};

export default Sales;
