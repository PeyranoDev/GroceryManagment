import { useMemo, useState, useEffect } from "react";
import { mockSaleProducts } from "../../data/products";
import SalesHeader from "./SalesHeader";
import ProductSearch from "./ProductSearch";
import SalesSummary from "./SalesSummary";
import SalesActions from "./SalesActions";
import WhatsAppMessage from "./WhatsAppMessage";
import SalesCart from "./SalesCart";

const Sales = () => {
  // Función para obtener la hora actual en formato 24 horas (HH:mm)
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [details, setDetails] = useState({
    date: new Date().toISOString().slice(0, 10),
    time: getCurrentTime(),
    client: "",
    paymentMethod: "Efectivo",
    observations: "",
    isOnline: false,
    deliveryCost: 5000,
  });
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  // Actualizar la hora automáticamente cada minuto
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
    if (term.trim())
      setSearchResults(
        mockSaleProducts.filter((p) =>
          p.name.toLowerCase().includes(term.toLowerCase())
        )
      );
    else setSearchResults([]);
  };

  const addProductToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing)
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      return [
        ...prev,
        { product, quantity: 1, promotionApplied: !!product.promotion },
      ];
    });
    setSearchTerm("");
    setSearchResults([]);
  };

  const removeFromCart = (productId) =>
    setCart((prev) => prev.filter((item) => item.product.id !== productId));

  const updateQuantity = (productId, quantity) =>
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: quantity > 0 ? quantity : 1 }
          : item
      )
    );

  const togglePromotion = (productId) =>
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, promotionApplied: !item.promotionApplied }
          : item
      )
    );

  const { subtotal, total } = useMemo(() => {
    let sub = 0;
    cart.forEach((item) => {
      if (item.promotionApplied && item.product.promotion) {
        const promo = item.product.promotion;
        const promoSets = Math.floor(item.quantity / promo.quantity);
        const remainingQty = item.quantity % promo.quantity;
        sub += promoSets * promo.price + remainingQty * item.product.unitPrice;
      } else {
        sub += item.quantity * item.product.unitPrice;
      }
    });
    const deliveryCost = details.isOnline
      ? parseFloat(details.deliveryCost || 0)
      : 0;
    return { subtotal: sub, total: sub + deliveryCost };
  }, [cart, details.isOnline, details.deliveryCost]);

  const resetSale = () => {
    setCart([]);
    setDetails({
      date: new Date().toISOString().slice(0, 10),
      time: getCurrentTime(),
      client: "",
      paymentMethod: "Efectivo",
      observations: "",
      isOnline: false,
      deliveryCost: 0,
    });
  };

  const finalizeSale = () => {
    console.log("Finalizando Venta:", { details, cart, total });
    alert(
      `Venta ${
        details.isOnline ? "online" : "presencial"
      } finalizada. Revisa la consola.`
    );
    resetSale();
  };

  const generateSaleMessage = () => {
    setShowWhatsAppModal(true);
  };

  return (
    <div className="space-y-6">
      <SalesHeader details={details} onDetailChange={handleDetailChange} />

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
            onAddProduct={addProductToCart}
          />
        }
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <SalesSummary
          subtotal={subtotal}
          total={total}
          deliveryCost={details ? parseFloat(details.deliveryCost || 0) : 0}
          isOnline={details ? details.isOnline : false}
        />
        <SalesActions
          cart={cart}
          details={details}
          onSave={finalizeSale}
          onClear={resetSale}
          onShowWhatsApp={generateSaleMessage}
          isLoading={false}
        />
      </div>

      {/* Modal de WhatsApp */}
      {showWhatsAppModal && (
        <WhatsAppMessage
          cart={cart}
          details={details}
          total={total}
          deliveryCost={details ? parseFloat(details.deliveryCost || 0) : 0}
          isOpen={showWhatsAppModal}
          onClose={() => setShowWhatsAppModal(false)}
        />
      )}
    </div>
  );
};

export default Sales;
