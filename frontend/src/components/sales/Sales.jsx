import { useState, useEffect } from "react";
import { useProducts } from "../../hooks/useProducts";
import { useSales, useCart } from "../../hooks/useSales";
import SalesHeader from "./SalesHeader";
import ProductSearch from "./ProductSearch";
import SalesSummary from "./SalesSummary";
import SalesActions from "./SalesActions";
import WhatsAppMessage from "./WhatsappMessage";
import SalesCart from "./SalesCart";

const Sales = () => {
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const { products, loading: productsLoading, searchProducts } = useProducts();
  const { createSaleFromCart, generateWhatsAppMessage, loading: salesLoading } = useSales();
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
    deliveryCost: 5000,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [lastSaleId, setLastSaleId] = useState(null);

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
      deliveryCost: 5000,
    });
    setLastSaleId(null);
  };

  const finalizeSale = async () => {
    if (cart.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    try {
      const cartData = {
        userId: 1, // ID temporal, deberías usar el usuario actual
        cart: cart,
        details: details
      };

      const newSale = await createSaleFromCart(cartData);
      setLastSaleId(newSale.id);
      
      alert(
        `Venta ${
          details.isOnline ? "online" : "presencial"
        } #${newSale.id} finalizada exitosamente.`
      );
      
      resetSale();
    } catch (error) {
      alert(`Error al finalizar la venta: ${error.message}`);
    }
  };

  const generateSaleMessage = () => {
    if (lastSaleId) {
      setShowWhatsAppModal(true);
    } else {
      alert("Primero debes finalizar una venta para generar el mensaje de WhatsApp");
    }
  };

  if (productsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-400">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-5">
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
            onAddProduct={handleAddProductToCart}
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
          isLoading={salesLoading}
        />
      </div>

      {/* Modal de WhatsApp */}
      {showWhatsAppModal && lastSaleId && (
        <WhatsAppMessage
          saleId={lastSaleId}
          cart={cart}
          details={details}
          total={total}
          deliveryCost={details ? parseFloat(details.deliveryCost || 0) : 0}
          isOpen={showWhatsAppModal}
          onClose={() => setShowWhatsAppModal(false)}
          generateWhatsAppMessage={generateWhatsAppMessage}
        />
      )}
    </div>
  );
};

export default Sales;
