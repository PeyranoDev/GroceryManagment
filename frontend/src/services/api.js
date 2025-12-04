// All data must come from backend API; no mock imports or toggles

const getToken = () => localStorage.getItem('auth_token');

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
  
  // 3. Default for local development (docker-compose.dev)
  return 'http://localhost:5001';
};

const normalizeApiUrl = (url) => {
  if (!url || typeof url !== 'string') return 'http://localhost:5001/api';
  const trimmed = url.replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const API_BASE_URL = normalizeApiUrl(getApiUrl());

console.log('API Base URL:', API_BASE_URL);

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      const u = JSON.parse(storedUser);
      const groceryId = u?.currentGroceryId ?? u?.groceryId;
      if (groceryId != null) headers['X-Grocery-Id'] = String(groceryId);
    }
  } catch {}

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// API Response mapper - extracts data from ApiResponse wrapper or throws error
const mapApiResponse = (response) => {
  if (response && typeof response === 'object' && 'success' in response) {
    if (!response.success) {
      throw new Error(response.detail || 'Error en la operación');
    }
    return response.data;
  }
  // Fallback for non-wrapped responses
  return response;
};

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      let detail = '';
      try {
        const et = await response.text();
        detail = et || '';
      } catch {}
      let msg = '';
      try {
        const ej = await response.json();
        msg = ej?.detail || ej?.message || '';
      } catch {}
      const fallback = response.status === 403 ? 'No autorizado' : (response.statusText || 'Error de red');
      throw new Error(msg || detail || fallback);
    }

    const json = await response.json();
    return mapApiResponse(json);
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

const authRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Error de red' }));
    throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
  }

  const json = await response.json();
  return mapApiResponse(json);
};

export const authAPI = {
  login: (credentials) => authRequest('/Auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (userData) => authRequest('/Auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  impersonate: (userId) => apiRequest(`/Auth/impersonate/${userId}`, { method: 'POST' }),
};

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

export const inventoryAPI = {
  getAll: () => apiRequest('/Inventory'),
  getFiltered: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/Inventory/filtered?${queryString}`);
  },
  getById: (id) => apiRequest(`/Inventory/${id}`),
  getByProductId: (productId) => apiRequest(`/Inventory/product/${productId}`),
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

export const dashboardAPI = {
  getData: (activitiesCount = 4, activitiesDays = 30) => 
    apiRequest(`/Dashboard?activitiesCount=${activitiesCount}&activitiesDays=${activitiesDays}`),
  getStats: () => apiRequest('/Dashboard/stats'),
  getWeeklySales: () => apiRequest('/Dashboard/weekly-sales'),
};

export const recentActivitiesAPI = {
  // New endpoint: GET /api/recentactivities?count=10&days=30
  getAll: (count = 10, days = 30) => apiRequest(`/RecentActivities?count=${count}&days=${days}`),
  getRecent: (count = 10, days = 30) => apiRequest(`/RecentActivities?count=${count}&days=${days}`),
};

export const purchasesAPI = {
  getAll: () => apiRequest('/Purchases'),
  getById: (id) => apiRequest(`/Purchases/${id}`),
  getBySupplier: (supplier) => apiRequest(`/Purchases/supplier/${supplier}`),
  getByDateRange: (startDate, endDate) => {
    const params = new URLSearchParams({ startDate, endDate }).toString();
    return apiRequest(`/Purchases/date-range?${params}`);
  },
  getLatest: () => apiRequest('/Purchases/latest'),
  getByDate: (date) => apiRequest(`/Purchases/date/${date}`),
  deleteItem: (purchaseId, itemId) => apiRequest(`/Purchases/${purchaseId}/items/${itemId}`, { method: 'DELETE' }),
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

export const usersAPI = {
  getAll: () => {
    try {
      const storedUser = localStorage.getItem('auth_user');
      const u = storedUser ? JSON.parse(storedUser) : null;
      const isSuper = u?.currentRole === 'SuperAdmin';
      const endpoint = isSuper ? '/Users/grocery/all' : '/Users/grocery';
      return apiRequest(endpoint);
    } catch {
      return apiRequest('/Users/grocery');
    }
  },
  getById: (id) => apiRequest(`/Users/${id}`),
  create: (user) => apiRequest('/Users', { method: 'POST', body: JSON.stringify(user) }),
  update: (id, user) => apiRequest(`/Users/${id}`, { method: 'PUT', body: JSON.stringify(user) }),
  delete: (id) => apiRequest(`/Users/${id}`, { method: 'DELETE' }),
  setSuperAdmin: (id, isSuperAdmin) => apiRequest(`/Users/${id}/super-admin`, { method: 'PATCH', body: JSON.stringify({ isSuperAdmin }) }),
  setRole: (id, role) => {
    const map = { staff: 1, admin: 2, superadmin: 3 };
    const input = String(role).toLowerCase();
    const numeric = map[input] ?? (typeof role === 'number' ? role : undefined);
    const payload = { role: numeric };
    return apiRequest(`/Users/${id}/role`, { method: 'PATCH', body: JSON.stringify(payload) });
  },
  activate: (id) => apiRequest(`/Users/${id}/activate`, { method: 'PATCH' }),
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
