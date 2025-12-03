import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { salesAPI } from '../services/api';

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

    const createSaleFromCart = async (cartData) => {
        try {
            setLoading(true);

            const token = await AsyncStorage.getItem('userToken');
            const isDemo = token === 'demo-token-123';

            if (isDemo) {
                // Demo mode: simulate sale creation
                await new Promise(resolve => setTimeout(resolve, 1000));
                const mockSale = {
                    id: Date.now(),
                    ...cartData,
                    createdAt: new Date().toISOString(),
                    orderStatus: 'Pendiente',
                    paymentStatus: 'Pendiente',
                };
                setSales(prev => [mockSale, ...prev]);
                return mockSale;
            }

            const response = await salesAPI.createFromCart(cartData);
            const newSale = response.data || response;

            setSales(prev => [newSale, ...prev]);
            return newSale;
        } catch (err) {
            console.error('Error creating sale from cart:', err);
            throw err;
        } finally {
            setLoading(false);
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

    return {
        sales,
        loading,
        error,
        fetchSales,
        createSaleFromCart,
        getSalesByDateRange,
        refresh: fetchSales,
    };
};
