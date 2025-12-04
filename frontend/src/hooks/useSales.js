import { useState, useCallback } from 'react';
import { salesAPI, recentActivitiesAPI } from '../services/api';

export const useSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await salesAPI.getAll();
      const items = response.data || response;
      setSales(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Error fetching sales:', err);
      setError(err.message);
      setSales([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSale = async (saleData) => {
    try {
      const response = await salesAPI.create(saleData);
      const newSale = response.data || response;
      setSales(prev => [newSale, ...prev]);
      return newSale;
    } catch (err) {
      console.error('Error creating sale:', err);
      throw err;
    }
  };

  const createSaleFromCart = async (cartData) => {
    try {
      setLoading(true);
      
      const response = await salesAPI.createFromCart(cartData);
      const newSale = response.data || response;
      
      if (recentActivitiesAPI && typeof recentActivitiesAPI.create === 'function') {
        await recentActivitiesAPI.create({
          type: 'Venta',
          description: `Venta #${newSale.id} creada (${newSale.orderStatus}/${newSale.paymentStatus})`,
          userId: cartData.userId
        });
      }
      
      setSales(prev => [newSale, ...prev]);
      return newSale;
    } catch (err) {
      console.error('Error creating sale from cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addPayment = async (saleId, payment) => {
    try {
      const response = await salesAPI.addPayment(saleId, payment);
      const result = response.data || response;
      setSales(prev => prev.map(s => s.id === saleId ? result.sale : s));
      await recentActivitiesAPI.create({
        type: 'Caja',
        description: `Pago registrado en venta #${saleId}: $${payment.amount}`,
        userId: payment.userId || 1,
      });
      return result;
    } catch (err) {
      console.error('Error adding payment:', err);
      throw err;
    }
  };

  const updateOrderStatus = async (saleId, status) => {
    try {
      const response = await salesAPI.updateOrderStatus(saleId, status);
      const updated = response.data || response;
      setSales(prev => prev.map(s => s.id === saleId ? updated : s));
      await recentActivitiesAPI.create({
        type: 'Pedido',
        description: `Estado del pedido #${saleId} cambiado a ${status}`,
        userId: 1,
      });
      return updated;
    } catch (err) {
      console.error('Error updating order status:', err);
      throw err;
    }
  };

  const updatePaymentStatus = async (saleId, status) => {
    try {
      const response = await salesAPI.updatePaymentStatus(saleId, status);
      const updated = response.data || response;
      setSales(prev => prev.map(s => s.id === saleId ? updated : s));
      await recentActivitiesAPI.create({
        type: 'Caja',
        description: `Estado de pago #${saleId} cambiado a ${status}`,
        userId: 1,
      });
      return updated;
    } catch (err) {
      console.error('Error updating payment status:', err);
      throw err;
    }
  };

  const generateWhatsAppMessage = async (saleId, details) => {
    try {
      const response = await salesAPI.generateWhatsApp(saleId, details);
      return response.data || response;
    } catch (err) {
      console.error('Error generating WhatsApp message:', err);
      throw err;
    }
  };

  const getSalesByDateRange = async (startDate, endDate) => {
    try {
      const response = await salesAPI.getByDateRange(startDate, endDate);
      return response.data || response;
    } catch (err) {
      console.error('Error getting sales by date range:', err);
      throw err;
    }
  };

  const deleteSale = async (id) => {
    try {
      await salesAPI.delete(id);
      setSales(prev => prev.filter(sale => sale.id !== id));
    } catch (err) {
      console.error('Error deleting sale:', err);
      throw err;
    }
  };

  return {
    sales,
    loading,
    error,
    fetchSales,
    createSale,
    createSaleFromCart,
    addPayment,
    updateOrderStatus,
    updatePaymentStatus,
    generateWhatsAppMessage,
    getSalesByDateRange,
    deleteSale,
    refresh: fetchSales
  };
};

export const useCart = () => {
  const [cart, setCart] = useState([]);

  const addProductToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        { 
          product, 
          quantity: 1, 
          promotionApplied: !!product.promotion 
        },
        ...prev
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity === "") {
      // Permite edición temporal con campo vacío
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity: "" } : item
        )
      );
      return;
    }

    if (typeof quantity !== 'number' || Number.isNaN(quantity)) {
      return;
    }
    if (quantity < 0) {
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const togglePromotion = (productId) => {
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, promotionApplied: !item.promotionApplied }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateTotals = (deliveryCost = 0) => {
    let subtotal = 0;

    cart.forEach((item) => {
      const qty = typeof item.quantity === "number" ? item.quantity : 0;
      const unitPrice = (item.product?.salePrice ?? item.product?.unitPrice ?? 0);
      if (item.promotionApplied && item.product.promotion) {
        const promo = item.product.promotion;
        const promoSets = Math.floor(qty / promo.quantity);
        const remainingQty = qty % promo.quantity;
        subtotal += promoSets * promo.price + remainingQty * unitPrice;
      } else {
        subtotal += qty * unitPrice;
      }
    });

    const total = subtotal + parseFloat(deliveryCost || 0);
    return { subtotal, total };
  };

  return {
    cart,
    addProductToCart,
    removeFromCart,
    updateQuantity,
    togglePromotion,
    clearCart,
    calculateTotals
  };
};
