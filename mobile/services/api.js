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
    async (requestConfig) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const groceryId = await AsyncStorage.getItem('groceryId') || config.DEFAULT_GROCERY_ID;

            if (token) {
                requestConfig.headers.Authorization = `Bearer ${token}`;
            }

            requestConfig.headers.GroceryId = groceryId;

            // Debug log for requests
            console.log(`🌐 ${requestConfig.method?.toUpperCase()} ${requestConfig.baseURL}${requestConfig.url}`);
        } catch (error) {
            console.error('Error getting auth data:', error);
        }

        return requestConfig;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => {
        console.log(`✅ Response: ${response.status}`);
        return response;
    },
    (error) => {
        console.error(`❌ API Error: ${error.response?.status || error.message}`);
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
    register: (userData) => apiClient.post('/Auth/register', userData),
};

// Categories API
export const categoriesAPI = {
    getAll: () => apiClient.get('/Categories'),
    getById: (id) => apiClient.get(`/Categories/${id}`),
    create: (data) => apiClient.post('/Categories', data),
    update: (id, data) => apiClient.put(`/Categories/${id}`, data),
    delete: (id) => apiClient.delete(`/Categories/${id}`),
};

// Products API
export const productsAPI = {
    getAll: () => apiClient.get('/Products'),
    getById: (id) => apiClient.get(`/Products/${id}`),
    getByCategory: (categoryId) => apiClient.get(`/Products/category/${categoryId}`),
    create: (data) => apiClient.post('/Products', data),
    update: (id, data) => apiClient.put(`/Products/${id}`, data),
    delete: (id) => apiClient.delete(`/Products/${id}`),
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
    create: (data) => apiClient.post('/Inventory', data),
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
    create: (data) => apiClient.post('/Sales', data),
    update: (id, data) => apiClient.put(`/Sales/${id}`, data),
    delete: (id) => apiClient.delete(`/Sales/${id}`),
    generateWhatsApp: (id, details) => apiClient.post(`/Sales/${id}/whatsapp`, details),
};

// Purchases API
export const purchasesAPI = {
    getAll: () => apiClient.get('/Purchases'),
    getById: (id) => apiClient.get(`/Purchases/${id}`),
    create: (data) => apiClient.post('/Purchases', data),
    update: (id, data) => apiClient.put(`/Purchases/${id}`, data),
    delete: (id) => apiClient.delete(`/Purchases/${id}`),
};

// Dashboard API
export const dashboardAPI = {
    getStats: () => apiClient.get('/Dashboard/stats'),
    getWeeklySales: () => apiClient.get('/Dashboard/weekly-sales'),
};

// Reports API
export const reportsAPI = {
    getSalesReport: (startDate, endDate) => {
        const params = new URLSearchParams({ startDate, endDate }).toString();
        return apiClient.get(`/Reports/sales?${params}`);
    },
    getInventoryReport: () => apiClient.get('/Reports/inventory'),
    getProfitReport: (startDate, endDate) => {
        const params = new URLSearchParams({ startDate, endDate }).toString();
        return apiClient.get(`/Reports/profit?${params}`);
    },
};

// Recent Activities API
export const recentActivitiesAPI = {
    getRecent: (count = 10) => apiClient.get(`/RecentActivities/recent?count=${count}`),
};

// Users API
export const usersAPI = {
    getAll: () => apiClient.get('/Users'),
    getById: (id) => apiClient.get(`/Users/${id}`),
    update: (id, data) => apiClient.put(`/Users/${id}`, data),
    delete: (id) => apiClient.delete(`/Users/${id}`),
};

// Exchange Rate API
export const exchangeRateAPI = {
    getCurrent: () => apiClient.get('/ExchangeRate/current'),
    getHistory: (days = 30) => apiClient.get(`/ExchangeRate/history?days=${days}`),
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

    if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        return Object.values(errors).flat().join(', ');
    }

    return error.message || 'Error desconocido';
};
