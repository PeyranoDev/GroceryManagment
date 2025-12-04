import { useState, useEffect } from "react";
import { useProducts } from "../../hooks/useProducts";
import { inventoryAPI } from "../../services/api";
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
import EditProductModal from "../inventory/EditProductModal";

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
    moneda: 1, // 1 = ARS, 2 = USD
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
  const [invalidStockOpen, setInvalidStockOpen] = useState(false);
  const [invalidQuantityOpen, setInvalidQuantityOpen] = useState(false);
  const [stockEditModalOpen, setStockEditModalOpen] = useState(false);
  const [stockEditItem, setStockEditItem] = useState(null);
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");

  // La hora se toma del formulario, no se actualiza automáticamente

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

  const handleAddProductToCart = async (product) => {
    try {
      const invResp = await inventoryAPI.getByProductId(product.id);
      const items = invResp?.data || invResp || [];
      const invItem = (Array.isArray(items) ? items : []).find(() => true);
      const enriched = {
        ...product,
        stock: invItem?.stock ?? product.stock ?? 0,
        unit: invItem?.unit ?? product.unit ?? 'u',
        salePrice: invItem?.salePrice ?? product.salePrice ?? product.unitPrice,
        salePriceUSD: invItem?.salePriceUSD ?? 0,
        cotizacionDolar: invItem?.cotizacionDolar ?? 0,
      };
      addProductToCart(enriched);
    } catch {
      addProductToCart(product);
    } finally {
      setSearchTerm("");
      setSearchResults([]);
    }
  };

  const { subtotal, total } = calculateTotals(
    details.isOnline ? details.deliveryCost : 0
  );

  // Obtener cotización del dólar del primer item del carrito
  const cotizacionDolar = cart.length > 0 ? (cart[0]?.product?.cotizacionDolar || 0) : 0;
  
  // Calcular total en USD
  const totalUSD = cotizacionDolar > 0 ? (total / cotizacionDolar) : 0;


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
      moneda: 1,
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
      const toIsoDate = (val) => {
        if (!val) return new Date().toISOString().slice(0,10);
        if (typeof val === 'string') {
          const s = val.trim();
          if (s.includes('/')) {
            const [dd, mm, yyyy] = s.split('/');
            if (dd && mm && yyyy) return `${yyyy}-${mm.padStart(2,'0')}-${dd.padStart(2,'0')}`;
          }
          if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
        }
        try {
          const d = new Date(val);
          if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0,10);
        } catch {}
        return new Date().toISOString().slice(0,10);
      };
      const cartPayload = {
        userId: getUserId(),
        cart: cart.map((item) => ({
          productId: item.product.id,
          salePrice: item.product.salePrice ?? item.product.unitPrice,
          salePriceUSD: item.product.salePriceUSD ?? 0,
          quantity: item.quantity,
        })),
        details: {
          date: toIsoDate(details.date),
          time: details.time,
          client: details.client || '',
          paymentMethod: details.paymentMethod || 'Efectivo',
          observations: details.observations || '',
          isOnline: !!details.isOnline,
          deliveryCost: parseFloat(details.deliveryCost || 0),
        },
        moneda: details.moneda || 1,
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

  const gotoNext = async () => {
    if (step === 2) {
      // Validar que no haya productos con cantidad 0 o menor
      const zeroQty = cart.find((it) => {
        const qty = typeof it.quantity === 'number' ? it.quantity : 0;
        return qty <= 0;
      });
      if (zeroQty) {
        setInvalidQuantityOpen(true);
        return;
      }
      
      const invalid = cart.find((it) => {
        const qty = typeof it.quantity === 'number' ? it.quantity : 0;
        const stock = it.product?.stock ?? 0;
        return qty > stock;
      });
      if (invalid) {
        setStockEditItem(invalid);
        setInvalidStockOpen(true);
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 4));
  };
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
                moneda={details.moneda || 1}
                onMonedaChange={(m) => handleDetailChange('moneda', m)}
                cotizacionDolar={cotizacionDolar}
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
            totalUSD={totalUSD}
            moneda={details.moneda}
            cotizacionDolar={cotizacionDolar}
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
        message={details.moneda === 2 && cotizacionDolar > 0
          ? `Total: US$ ${(total / cotizacionDolar).toFixed(2)}`
          : `Total: $${Number(total || 0).toLocaleString()}`
        }
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={finalizeSale}
        variant="success"
      />
      <ConfirmModal
        isOpen={invalidQuantityOpen}
        onClose={() => setInvalidQuantityOpen(false)}
        title="Cantidad inválida"
        message="Hay productos con cantidad 0. Por favor, ingrese una cantidad válida mayor a 0 o elimine el producto del carrito."
        confirmText="Entendido"
        cancelText=""
        onConfirm={() => setInvalidQuantityOpen(false)}
        variant="danger"
      />
      <ConfirmModal
        isOpen={invalidStockOpen}
        onClose={() => setInvalidStockOpen(false)}
        title="Stock insuficiente"
        message="La cantidad supera el stock disponible. Ingrese una cantidad menor o igual, o añada stock manualmente."
        confirmText="Añadir stock manualmente"
        cancelText="Cancelar"
        onConfirm={async () => {
          try {
            // preparar datos para editar inventory item
            const invResp = await inventoryAPI.getByProductId(stockEditItem.product.id);
            const items = invResp?.data || invResp || [];
            const invItem = (Array.isArray(items) ? items : []).find(() => true);
            if (!invItem) { setInvalidStockOpen(false); return; }
            setStockEditItem({ ...stockEditItem, invItem });
            setInvalidStockOpen(false);
            setStockEditModalOpen(true);
          } catch {
            setInvalidStockOpen(false);
          }
        }}
        variant="danger"
      />
      {stockEditModalOpen && stockEditItem?.invItem && (
        <EditProductModal
          isOpen={stockEditModalOpen}
          onClose={() => setStockEditModalOpen(false)}
          product={{
            id: stockEditItem.invItem.id,
            product: { name: stockEditItem.product.name },
            unit: stockEditItem.invItem.unit || 'u',
            stock: stockEditItem.invItem.stock || 0,
            salePrice: stockEditItem.invItem.salePrice || (stockEditItem.product.salePrice ?? stockEditItem.product.unitPrice) || 0,
          }}
          onSave={async (id, data) => {
            await inventoryAPI.update(id, data);
            try {
              const fresh = await inventoryAPI.getByProductId(stockEditItem.product.id);
              const arr = fresh?.data || fresh || [];
              const invUpdated = (Array.isArray(arr) ? arr : []).find(() => true);
              if (invUpdated) {
                // reconstruir carrito con nuevo stock para este producto
                const snapshot = [...cart];
                clearCart();
                snapshot.forEach((it) => {
                  const baseProd = it.product.id === stockEditItem.product.id
                    ? { ...it.product, stock: invUpdated.stock, unit: invUpdated.unit, salePrice: invUpdated.salePrice }
                    : it.product;
                  addProductToCart(baseProd);
                  updateQuantity(baseProd.id, it.quantity);
                });
              }
            } catch {}
          }}
        />
      )}
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
