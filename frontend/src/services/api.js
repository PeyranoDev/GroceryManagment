import { useState } from 'react';
import {
  mockProductsAPI,
  mockInventoryAPI,
  mockSalesAPI,
  mockDashboardAPI,
  mockRecentActivitiesAPI,
  mockPurchasesAPI,
  mockReportsAPI,
  mockCategoriesAPI,
  mockUsersAPI
} from './mockApi.js';

// Set to false to use real API
const DEMO_MODE = true;

// Get API URL from runtime environment (injected via env.js) or build-time env
const getApiUrl = () => {
  // 1. Runtime environment (from env.js injected by entrypoint.sh in production)
  if (typeof window !== 'undefined' && window.__APP_ENV__?.API_URL) {
    return window.__APP_ENV__.API_URL;
  }
  
  // 2. Build-time environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // 3. Default for local development
  return 'http://localhost:5001';
};

const normalizeApiUrl = (url) => {
  if (!url || typeof url !== 'string') return 'http://localhost:5001/api';
  const trimmed = url.replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const API_BASE_URL = normalizeApiUrl(getApiUrl());

console.log('API Base URL:', API_BASE_URL);

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'GroceryId': '1', 
});

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error de red' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

export const productsAPI = DEMO_MODE ? mockProductsAPI : {
  getAll: () => apiRequest('/Products'),
  getById: (id) => apiRequest(`/Products/${id}`),
  create: (product) => apiRequest('/Products', {
    method: 'POST',
    body: JSON.stringify(product),
  }),
  update: (id, product) => apiRequest(`/Products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  }),
  delete: (id) => apiRequest(`/Products/${id}`, {
    method: 'DELETE',
  }),
};

export const inventoryAPI = DEMO_MODE ? mockInventoryAPI : {
  getAll: () => apiRequest('/Inventory'),
  getFiltered: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/Inventory/filtered?${queryString}`);
  },
  getById: (id) => apiRequest(`/Inventory/${id}`),
  getStockStatus: (id) => apiRequest(`/Inventory/${id}/status`),
  adjustStock: (id, newStock) => apiRequest(`/Inventory/${id}/adjust-stock`, {
    method: 'POST',
    body: JSON.stringify({ newStock }),
  }),
  getLowStock: (threshold = 10) => apiRequest(`/Inventory/low-stock?threshold=${threshold}`),
  getOutOfStock: () => apiRequest('/Inventory/out-of-stock'),
  create: (item) => apiRequest('/Inventory', {
    method: 'POST',
    body: JSON.stringify(item),
  }),
  update: (id, item) => apiRequest(`/Inventory/${id}`, {
    method: 'PUT',
    body: JSON.stringify(item),
  }),
  delete: (id) => apiRequest(`/Inventory/${id}`, {
    method: 'DELETE',
  }),
};

export const salesAPI = DEMO_MODE ? mockSalesAPI : {
  getAll: () => apiRequest('/Sales'),
  getById: (id) => apiRequest(`/Sales/${id}`),
  getByDateRange: (startDate, endDate) => {
    const params = new URLSearchParams({ startDate, endDate }).toString();
    return apiRequest(`/Sales/date-range?${params}`);
  },
  getByUserId: (userId) => apiRequest(`/Sales/user/${userId}`),
  create: (sale) => apiRequest('/Sales', {
    method: 'POST',
    body: JSON.stringify(sale),
  }),
  createFromCart: (cartData) => apiRequest('/Sales/cart', {
    method: 'POST',
    body: JSON.stringify(cartData),
  }),
  updateOrderStatus: (id, newStatus) => apiRequest(`/Sales/${id}/order-status`, {
    method: 'POST',
    body: JSON.stringify({ status: newStatus }),
  }),
  addPayment: (id, payment) => apiRequest(`/Sales/${id}/payments`, {
    method: 'POST',
    body: JSON.stringify(payment),
  }),
  updatePaymentStatus: (id, status) => apiRequest(`/Sales/${id}/payment-status`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  }),
  generateWhatsApp: (id, details) => apiRequest(`/Sales/${id}/whatsapp`, {
    method: 'POST',
    body: JSON.stringify(details),
  }),
  delete: (id) => apiRequest(`/Sales/${id}`, {
    method: 'DELETE',
  }),
};

export const dashboardAPI = DEMO_MODE ? mockDashboardAPI : {
  getStats: () => apiRequest('/Dashboard/stats'),
  getWeeklySales: () => apiRequest('/Dashboard/weekly-sales'),
};

export const recentActivitiesAPI = DEMO_MODE ? mockRecentActivitiesAPI : {
  getAll: () => apiRequest('/RecentActivities'),
  getRecent: (count = 10) => apiRequest(`/RecentActivities/recent?count=${count}`),
  getById: (id) => apiRequest(`/RecentActivities/${id}`),
  create: (activity) => apiRequest('/RecentActivities', {
    method: 'POST',
    body: JSON.stringify(activity),
  }),
  delete: (id) => apiRequest(`/RecentActivities/${id}`, {
    method: 'DELETE',
  }),
};

export const purchasesAPI = DEMO_MODE ? mockPurchasesAPI : {
  getAll: () => apiRequest('/Purchases'),
  getById: (id) => apiRequest(`/Purchases/${id}`),
  getBySupplier: (supplier) => apiRequest(`/Purchases/supplier/${supplier}`),
  getByDateRange: (startDate, endDate) => {
    const params = new URLSearchParams({ startDate, endDate }).toString();
    return apiRequest(`/Purchases/date-range?${params}`);
  },
  getLatest: () => apiRequest('/Purchases/latest'),
  getByDate: (date) => apiRequest(`/Purchases/date/${date}`),
  create: (purchase) => apiRequest('/Purchases', {
    method: 'POST',
    body: JSON.stringify(purchase),
  }),
  update: (id, purchase) => apiRequest(`/Purchases/${id}`, {
    method: 'PUT',
    body: JSON.stringify(purchase),
  }),
  delete: (id) => apiRequest(`/Purchases/${id}`, {
    method: 'DELETE',
  }),
};

export const reportsAPI = DEMO_MODE ? mockReportsAPI : {
  getFilteredReports: (filters) => apiRequest('/Reports', {
    method: 'POST',
    body: JSON.stringify(filters),
  }),
  getSalesSummary: () => apiRequest('/Reports/sales-summary'),
  getTotalSales: (startDate, endDate) => {
    const params = new URLSearchParams({ startDate, endDate }).toString();
    return apiRequest(`/Reports/total-sales?${params}`);
  },
  getTotalPurchases: (startDate, endDate) => {
    const params = new URLSearchParams({ startDate, endDate }).toString();
    return apiRequest(`/Reports/total-purchases?${params}`);
  },
};

export const categoriesAPI = DEMO_MODE ? mockCategoriesAPI : {
  getAll: () => apiRequest('/Categories'),
  getById: (id) => apiRequest(`/Categories/${id}`),
  create: (category) => apiRequest('/Categories', {
    method: 'POST',
    body: JSON.stringify(category),
  }),
  update: (id, category) => apiRequest(`/Categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(category),
  }),
  delete: (id) => apiRequest(`/Categories/${id}`, {
    method: 'DELETE',
  }),
};

export const usersAPI = DEMO_MODE ? mockUsersAPI : {
  getAll: () => apiRequest('/Users'),
  getById: (id) => apiRequest(`/Users/${id}`),
  create: (user) => apiRequest('/Users', { method: 'POST', body: JSON.stringify(user) }),
  update: (id, user) => apiRequest(`/Users/${id}`, { method: 'PUT', body: JSON.stringify(user) }),
  delete: (id) => apiRequest(`/Users/${id}`, { method: 'DELETE' }),
};

export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.message.includes('Failed to fetch')) {
    return 'Error de conexión. Verifica que el servidor esté ejecutándose.';
  }
  
  return error.message || 'Error desconocido';
};

export const useApiState = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const execute = async (apiCall) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { loading, error, execute };
};
