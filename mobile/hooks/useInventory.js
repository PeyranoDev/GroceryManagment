import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { inventoryAPI } from '../services/api';
import { mockInventory } from '../utils/mockData';

export const useInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isDemoMode, setIsDemoMode] = useState(false);

    useEffect(() => {
        checkDemoMode();
    }, []);

    const checkDemoMode = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            setIsDemoMode(token === 'demo-token-123');
        } catch (err) {
            setIsDemoMode(false);
        }
    };

    const fetchInventory = useCallback(async () => {
        setLoading(true);
        setError(null);

        const isDemo = await AsyncStorage.getItem('userToken') === 'demo-token-123';

        if (isDemo) {
            // Demo mode: use mock data
            setTimeout(() => {
                setInventory(mockInventory);
                setLoading(false);
            }, 500);
            return;
        }

        try {
            const response = await inventoryAPI.getAll();
            const items = response.data || response;
            setInventory(Array.isArray(items) ? items : []);
        } catch (err) {
            console.error('Error fetching inventory:', err);
            setError(err.message);
            setInventory([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const getLowStock = async (threshold = 10) => {
        const isDemo = await AsyncStorage.getItem('userToken') === 'demo-token-123';

        if (isDemo) {
            return mockInventory.filter(item => item.stock > 0 && item.stock < threshold);
        }

        try {
            const response = await inventoryAPI.getLowStock(threshold);
            return response.data || response;
        } catch (err) {
            console.error('Error fetching low stock:', err);
            throw err;
        }
    };

    const adjustStock = async (id, newStock) => {
        const isDemo = await AsyncStorage.getItem('userToken') === 'demo-token-123';

        if (isDemo) {
            // Demo mode: update local state only
            setInventory(prev => prev.map(item => item.id === id ? { ...item, stock: newStock } : item));
            return { id, stock: newStock };
        }

        try {
            const response = await inventoryAPI.adjustStock(id, newStock);
            const updated = response.data || response;
            setInventory(prev => prev.map(item => item.id === id ? updated : item));
            return updated;
        } catch (err) {
            console.error('Error adjusting stock:', err);
            throw err;
        }
    };

    return {
        inventory,
        loading,
        error,
        fetchInventory,
        getLowStock,
        adjustStock,
        refresh: fetchInventory,
    };
};
