import { useState, useEffect } from 'react';
import { inventoryAPI } from '../components/inventory/inventoryApi';

export const useInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInventory = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = Object.keys(filters).length > 0 
        ? await inventoryAPI.getFiltered(filters)
        : await inventoryAPI.getAll();
      
      const items = response.data || response;
      setInventory(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError(err.message);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId, newStock) => {
    try {
      const response = await inventoryAPI.adjustStock(productId, newStock);
      const updatedItem = response.data || response;
      
      setInventory(prev => 
        prev.map(item => 
          item.id === productId 
            ? { ...item, stock: newStock, lastUpdated: new Date().toISOString() }
            : item
        )
      );
      
      return updatedItem;
    } catch (err) {
      console.error('Error updating stock:', err);
      throw err;
    }
  };

  const getStockStatus = async (productId) => {
    try {
      const response = await inventoryAPI.getStockStatus(productId);
      return response.data || response;
    } catch (err) {
      console.error('Error getting stock status:', err);
      throw err;
    }
  };

  const getLowStockItems = async (threshold = 10) => {
    try {
      const response = await inventoryAPI.getLowStock(threshold);
      return response.data || response;
    } catch (err) {
      console.error('Error getting low stock items:', err);
      throw err;
    }
  };

  const getOutOfStockItems = async () => {
    try {
      const response = await inventoryAPI.getOutOfStock();
      return response.data || response;
    } catch (err) {
      console.error('Error getting out of stock items:', err);
      throw err;
    }
  };

  const createItem = async (item) => {
    try {
      const response = await inventoryAPI.create(item);
      const newItem = response.data || response;
      setInventory(prev => {
        const exists = prev.some(i => i.id === newItem.id);
        return exists
          ? prev.map(i => (i.id === newItem.id ? newItem : i))
          : [...prev, newItem];
      });
      return newItem;
    } catch (err) {
      console.error('Error creating inventory item:', err);
      throw err;
    }
  };

  const updateItem = async (id, item) => {
    try {
      const response = await inventoryAPI.update(id, item);
      const updated = response.data || response;
      setInventory(prev => prev.map(i => i.id === id ? { ...i, ...item, lastUpdated: new Date().toISOString() } : i));
      return updated;
    } catch (err) {
      console.error('Error updating inventory item:', err);
      throw err;
    }
  };

  const deleteItem = async (id) => {
    try {
      await inventoryAPI.delete(id);
      setInventory(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error('Error deleting inventory item:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return {
    inventory,
    loading,
    error,
    fetchInventory,
    updateStock,
    updateItem,
    deleteItem,
    getStockStatus,
    getLowStockItems,
    getOutOfStockItems,
    refresh: () => fetchInventory(),
    createItem
  };
};
