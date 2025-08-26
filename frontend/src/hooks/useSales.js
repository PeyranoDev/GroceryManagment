import { useState, useEffect } from 'react';
import { salesAPI, recentActivitiesAPI } from '../services/api';

export const useSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSales = async () => {
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
  };

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
      
      await recentActivitiesAPI.create({
        type: 'Venta',
        description: `Venta #${newSale.id} finalizada`,
        userId: cartData.userId
      });
      
      setSales(prev => [newSale, ...prev]);
      return newSale;
    } catch (err) {
      console.error('Error creating sale from cart:', err);
      throw err;
    } finally {
      setLoading(false);
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
        ...prev,
        { 
          product, 
          quantity: 1, 
          promotionApplied: !!product.promotion 
        }
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
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
    
    cart.forEach(item => {
      if (item.promotionApplied && item.product.promotion) {
        const promo = item.product.promotion;
        const promoSets = Math.floor(item.quantity / promo.quantity);
        const remainingQty = item.quantity % promo.quantity;
        subtotal += (promoSets * promo.price) + (remainingQty * item.product.unitPrice);
      } else {
        subtotal += item.quantity * item.product.unitPrice;
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
