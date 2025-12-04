import { apiRequest } from '../../services/core/apiClient';

export const inventoryAPI = {
  getAll: () => apiRequest('/Inventory'),
  getFiltered: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/Inventory/filtered?${queryString}`);
  },
  getById: (id) => apiRequest(`/Inventory/${id}`),
  getByProductId: (productId) => apiRequest(`/Inventory/product/${productId}`),
  getStockStatus: (id) => apiRequest(`/Inventory/${id}/status`),
  adjustStock: (id, newStock) => apiRequest(`/Inventory/${id}/adjust-stock`, { method: 'POST', body: JSON.stringify({ newStock }) }),
  getLowStock: (threshold = 10) => apiRequest(`/Inventory/low-stock?threshold=${threshold}`),
  getOutOfStock: () => apiRequest('/Inventory/out-of-stock'),
  create: (item) => apiRequest('/Inventory', { method: 'POST', body: JSON.stringify(item) }),
  update: (id, item) => apiRequest(`/Inventory/${id}`, { method: 'PUT', body: JSON.stringify(item) }),
  delete: (id) => apiRequest(`/Inventory/${id}`, { method: 'DELETE' }),
};

