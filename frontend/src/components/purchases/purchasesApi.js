import { apiRequest } from '../../services/core/apiClient';

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
  create: (purchase) => apiRequest('/Purchases', { method: 'POST', body: JSON.stringify(purchase) }),
  update: (id, purchase) => apiRequest(`/Purchases/${id}`, { method: 'PUT', body: JSON.stringify(purchase) }),
  delete: (id) => apiRequest(`/Purchases/${id}`, { method: 'DELETE' }),
};

