import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../constants/config';

// Create axios instance
const apiClient = axios.create({
    baseURL: config.API_BASE_URL,
    timeout: config.REQUEST_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const groceryId = await AsyncStorage.getItem('groceryId') || config.DEFAULT_GROCERY_ID;

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            config.headers.GroceryId = groceryId;
        } catch (error) {
            console.error('Error getting auth data:', error);
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            AsyncStorage.removeItem('userToken');
            AsyncStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => apiClient.post('/Auth/login', credentials),
};

// Products API
export const productsAPI = {
    getAll: () => apiClient.get('/Products'),
    getById: (id) => apiClient.get(`/Products/${id}`),
};

// Inventory API
export const inventoryAPI = {
    getAll: () => apiClient.get('/Inventory'),
    getFiltered: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return apiClient.get(`/Inventory/filtered?${queryString}`);
    },
    getById: (id) => apiClient.get(`/Inventory/${id}`),
    getLowStock: (threshold = 10) => apiClient.get(`/Inventory/low-stock?threshold=${threshold}`),
    getOutOfStock: () => apiClient.get('/Inventory/out-of-stock'),
    adjustStock: (id, newStock) => apiClient.post(`/Inventory/${id}/adjust-stock`, { newStock }),
    update: (id, data) => apiClient.put(`/Inventory/${id}`, data),
};

// Sales API
export const salesAPI = {
    getAll: () => apiClient.get('/Sales'),
    getById: (id) => apiClient.get(`/Sales/${id}`),
    getByDateRange: (startDate, endDate) => {
        const params = new URLSearchParams({ startDate, endDate }).toString();
        return apiClient.get(`/Sales/date-range?${params}`);
    },
    createFromCart: (cartData) => apiClient.post('/Sales/cart', cartData),
    generateWhatsApp: (id, details) => apiClient.post(`/Sales/${id}/whatsapp`, details),
};

// Dashboard API
export const dashboardAPI = {
    getStats: () => apiClient.get('/Dashboard/stats'),
    getWeeklySales: () => apiClient.get('/Dashboard/weekly-sales'),
};

// Exchange Rate API
export const exchangeRateAPI = {
    getCurrent: () => apiClient.get('/ExchangeRate/current'),
};

// Recent Activities API
export const recentActivitiesAPI = {
    getRecent: (count = 10) => apiClient.get(`/RecentActivities/recent?${count}`),
};

// Error handler helper
export const handleApiError = (error) => {
    console.error('API Error:', error);

    if (error.message?.includes('Network Error') || error.code === 'ECONNABORTED') {
        return 'Error de conexión. Verifica tu red e intenta nuevamente.';
    }

    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    return error.message || 'Error desconocido';
};
