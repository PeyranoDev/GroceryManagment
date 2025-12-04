import { useState, useCallback } from 'react';
import { inventoryAPI } from '../services/api';

export const useInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchInventory = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            console.log('📦 Fetching inventory...');
            const response = await inventoryAPI.getAll();
            // Handle API response structure
            const data = response.data?.data || response.data || response;
            const items = Array.isArray(data) ? data : [];
            console.log(`✅ Loaded ${items.length} inventory items`);
            setInventory(items);
        } catch (err) {
            console.error('❌ Error fetching inventory:', err);
            setError(err.message || 'Error al cargar el inventario');
            setInventory([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const getLowStock = useCallback(async (threshold = 10) => {
        try {
            console.log(`📦 Fetching low stock items (threshold: ${threshold})...`);
            const response = await inventoryAPI.getLowStock(threshold);
            const data = response.data?.data || response.data || response;
            return Array.isArray(data) ? data : [];
        } catch (err) {
            console.error('❌ Error fetching low stock:', err);
            throw err;
        }
    }, []);

    const getOutOfStock = useCallback(async () => {
        try {
            console.log('📦 Fetching out of stock items...');
            const response = await inventoryAPI.getOutOfStock();
            const data = response.data?.data || response.data || response;
            return Array.isArray(data) ? data : [];
        } catch (err) {
            console.error('❌ Error fetching out of stock:', err);
            throw err;
        }
    }, []);

    const adjustStock = useCallback(async (id, newStock) => {
        try {
            console.log(`📦 Adjusting stock for item ${id} to ${newStock}...`);
            const response = await inventoryAPI.adjustStock(id, newStock);
            const updated = response.data?.data || response.data || response;
            
            // Update local state
            setInventory(prev => prev.map(item => 
                item.id === id ? { ...item, ...updated, stock: newStock } : item
            ));
            
            console.log('✅ Stock adjusted successfully');
            return updated;
        } catch (err) {
            console.error('❌ Error adjusting stock:', err);
            throw err;
        }
    }, []);

    const updateInventoryItem = useCallback(async (id, data) => {
        try {
            console.log(`📦 Updating inventory item ${id}...`);
            const response = await inventoryAPI.update(id, data);
            const updated = response.data?.data || response.data || response;
            
            setInventory(prev => prev.map(item => 
                item.id === id ? { ...item, ...updated } : item
            ));
            
            console.log('✅ Inventory item updated');
            return updated;
        } catch (err) {
            console.error('❌ Error updating inventory:', err);
            throw err;
        }
    }, []);

    return {
        inventory,
        loading,
        error,
        fetchInventory,
        getLowStock,
        getOutOfStock,
        adjustStock,
        updateInventoryItem,
        refresh: fetchInventory,
    };
};
