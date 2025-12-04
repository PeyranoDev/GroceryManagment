import { useState, useCallback } from 'react';
import { salesAPI } from '../services/api';

export const useSales = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSales = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('💰 Fetching sales...');
            const response = await salesAPI.getAll();
            // Handle API response structure
            const data = response.data?.data || response.data || response;
            const items = Array.isArray(data) ? data : [];
            console.log(`✅ Loaded ${items.length} sales`);
            setSales(items);
        } catch (err) {
            console.error('❌ Error fetching sales:', err);
            setError(err.message || 'Error al cargar las ventas');
            setSales([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const createSaleFromCart = useCallback(async (cartData) => {
        try {
            setLoading(true);
            console.log('💰 Creating sale from cart...');
            
            const response = await salesAPI.createFromCart(cartData);
            const newSale = response.data?.data || response.data || response;

            setSales(prev => [newSale, ...prev]);
            console.log('✅ Sale created successfully');
            return newSale;
        } catch (err) {
            console.error('❌ Error creating sale from cart:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createSale = useCallback(async (saleData) => {
        try {
            setLoading(true);
            console.log('💰 Creating sale...');
            
            const response = await salesAPI.create(saleData);
            const newSale = response.data?.data || response.data || response;

            setSales(prev => [newSale, ...prev]);
            console.log('✅ Sale created successfully');
            return newSale;
        } catch (err) {
            console.error('❌ Error creating sale:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getSalesByDateRange = useCallback(async (startDate, endDate) => {
        try {
            console.log(`💰 Fetching sales from ${startDate} to ${endDate}...`);
            const response = await salesAPI.getByDateRange(startDate, endDate);
            const data = response.data?.data || response.data || response;
            return Array.isArray(data) ? data : [];
        } catch (err) {
            console.error('❌ Error getting sales by date range:', err);
            throw err;
        }
    }, []);

    const getSaleById = useCallback(async (id) => {
        try {
            console.log(`💰 Fetching sale ${id}...`);
            const response = await salesAPI.getById(id);
            return response.data?.data || response.data || response;
        } catch (err) {
            console.error('❌ Error getting sale by id:', err);
            throw err;
        }
    }, []);

    const updateSale = useCallback(async (id, data) => {
        try {
            console.log(`💰 Updating sale ${id}...`);
            const response = await salesAPI.update(id, data);
            const updated = response.data?.data || response.data || response;
            
            setSales(prev => prev.map(sale => 
                sale.id === id ? { ...sale, ...updated } : sale
            ));
            
            console.log('✅ Sale updated');
            return updated;
        } catch (err) {
            console.error('❌ Error updating sale:', err);
            throw err;
        }
    }, []);

    const deleteSale = useCallback(async (id) => {
        try {
            console.log(`💰 Deleting sale ${id}...`);
            await salesAPI.delete(id);
            setSales(prev => prev.filter(sale => sale.id !== id));
            console.log('✅ Sale deleted');
        } catch (err) {
            console.error('❌ Error deleting sale:', err);
            throw err;
        }
    }, []);

    return {
        sales,
        loading,
        error,
        fetchSales,
        createSaleFromCart,
        createSale,
        getSalesByDateRange,
        getSaleById,
        updateSale,
        deleteSale,
        refresh: fetchSales,
    };
};
