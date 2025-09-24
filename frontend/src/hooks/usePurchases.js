import { useState, useEffect } from 'react';
import { purchasesAPI, recentActivitiesAPI } from '../services/api';

export const usePurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPurchases = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await purchasesAPI.getAll();
      const items = response.data || response;
      setPurchases(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Error fetching purchases:', err);
      setError(err.message);
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const createPurchase = async (purchaseData) => {
    try {
      setLoading(true);
      const response = await purchasesAPI.create(purchaseData);
      const newPurchase = response.data || response;
      
      await recentActivitiesAPI.create({
        type: 'Compra',
        description: `Compra de "${purchaseData.supplier}" registrada`,
        userId: 1
      });
      
      setPurchases(prev => [newPurchase, ...prev]);
      return newPurchase;
    } catch (err) {
      console.error('Error creating purchase:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePurchase = async (id, purchaseData) => {
    try {
      const response = await purchasesAPI.update(id, purchaseData);
      const updatedPurchase = response.data || response;
      setPurchases(prev => 
        prev.map(purchase => 
          purchase.id === id ? updatedPurchase : purchase
        )
      );
      return updatedPurchase;
    } catch (err) {
      console.error('Error updating purchase:', err);
      throw err;
    }
  };

  const deletePurchase = async (id) => {
    try {
      await purchasesAPI.delete(id);
      setPurchases(prev => prev.filter(purchase => purchase.id !== id));
    } catch (err) {
      console.error('Error deleting purchase:', err);
      throw err;
    }
  };

  const getPurchasesBySupplier = async (supplier) => {
    try {
      const response = await purchasesAPI.getBySupplier(supplier);
      return response.data || response;
    } catch (err) {
      console.error('Error getting purchases by supplier:', err);
      throw err;
    }
  };

  const getPurchasesByDateRange = async (startDate, endDate) => {
    try {
      const response = await purchasesAPI.getByDateRange(startDate, endDate);
      return response.data || response;
    } catch (err) {
      console.error('Error getting purchases by date range:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return {
    purchases,
    loading,
    error,
    fetchPurchases,
    createPurchase,
    updatePurchase,
    deletePurchase,
    getPurchasesBySupplier,
    getPurchasesByDateRange,
    refresh: fetchPurchases
  };
};
