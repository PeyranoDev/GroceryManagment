import { useState } from 'react';

// API Service para conectar con el backend
const API_BASE_URL = 'http://localhost:5277/api'; // Ajusta el puerto según tu configuración

// Headers base para todas las peticiones
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'GroceryId': '1', // Por ahora usaremos un ID fijo, luego se puede hacer dinámico
});

// Función para hacer peticiones HTTP
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

// Servicios de Products
export const productsAPI = {
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

// Servicios de Inventory
export const inventoryAPI = {
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

// Servicios de Sales
export const salesAPI = {
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
  generateWhatsApp: (id, details) => apiRequest(`/Sales/${id}/whatsapp`, {
    method: 'POST',
    body: JSON.stringify(details),
  }),
  delete: (id) => apiRequest(`/Sales/${id}`, {
    method: 'DELETE',
  }),
};

// Servicios de Dashboard
export const dashboardAPI = {
  getStats: () => apiRequest('/Dashboard/stats'),
  getWeeklySales: () => apiRequest('/Dashboard/weekly-sales'),
};

// Servicios de Recent Activities
export const recentActivitiesAPI = {
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

// Servicios de Purchases
export const purchasesAPI = {
  getAll: () => apiRequest('/Purchases'),
  getById: (id) => apiRequest(`/Purchases/${id}`),
  getBySupplier: (supplier) => apiRequest(`/Purchases/supplier/${supplier}`),
  getByDateRange: (startDate, endDate) => {
    const params = new URLSearchParams({ startDate, endDate }).toString();
    return apiRequest(`/Purchases/date-range?${params}`);
  },
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

// Servicios de Reports
export const reportsAPI = {
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

// Servicios de Categories
export const categoriesAPI = {
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

// Función de utilidad para manejar errores de API
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  // Puedes personalizar el manejo de errores aquí
  if (error.message.includes('Failed to fetch')) {
    return 'Error de conexión. Verifica que el servidor esté ejecutándose.';
  }
  
  return error.message || 'Error desconocido';
};

// Hook personalizado para gestionar el estado de carga
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
