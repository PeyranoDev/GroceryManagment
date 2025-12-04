import { useState, useCallback } from 'react';
import { purchasesAPI } from '../services/api';

export const usePurchases = () => {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPurchases = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('🛒 Fetching purchases...');
            const response = await purchasesAPI.getAll();
            // Handle API response structure
            const data = response.data?.data || response.data || response;
            const items = Array.isArray(data) ? data : [];
            console.log(`✅ Loaded ${items.length} purchases`);
            setPurchases(items);
        } catch (err) {
            console.error('❌ Error fetching purchases:', err);
            setError(err.message || 'Error al cargar las compras');
            setPurchases([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const createPurchase = useCallback(async (purchaseData) => {
        try {
            setLoading(true);
            console.log('🛒 Creating purchase...');
            
            const response = await purchasesAPI.create(purchaseData);
            const newPurchase = response.data?.data || response.data || response;

            setPurchases(prev => [newPurchase, ...prev]);
            console.log('✅ Purchase created successfully');
            return newPurchase;
        } catch (err) {
            console.error('❌ Error creating purchase:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getPurchaseById = useCallback(async (id) => {
        try {
            console.log(`🛒 Fetching purchase ${id}...`);
            const response = await purchasesAPI.getById(id);
            return response.data?.data || response.data || response;
        } catch (err) {
            console.error('❌ Error getting purchase by id:', err);
            throw err;
        }
    }, []);

    const updatePurchase = useCallback(async (id, data) => {
        try {
            console.log(`🛒 Updating purchase ${id}...`);
            const response = await purchasesAPI.update(id, data);
            const updated = response.data?.data || response.data || response;
            
            setPurchases(prev => prev.map(purchase => 
                purchase.id === id ? { ...purchase, ...updated } : purchase
            ));
            
            console.log('✅ Purchase updated');
            return updated;
        } catch (err) {
            console.error('❌ Error updating purchase:', err);
            throw err;
        }
    }, []);

    const deletePurchase = useCallback(async (id) => {
        try {
            console.log(`🛒 Deleting purchase ${id}...`);
            await purchasesAPI.delete(id);
            setPurchases(prev => prev.filter(purchase => purchase.id !== id));
            console.log('✅ Purchase deleted');
        } catch (err) {
            console.error('❌ Error deleting purchase:', err);
            throw err;
        }
    }, []);

    return {
        purchases,
        loading,
        error,
        fetchPurchases,
        createPurchase,
        getPurchaseById,
        updatePurchase,
        deletePurchase,
        refresh: fetchPurchases,
    };
};
