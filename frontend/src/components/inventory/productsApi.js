import { apiRequest } from '../../services/core/apiClient';

export const productsAPI = {
  getAll: () => apiRequest('/Products'),
  getById: (id) => apiRequest(`/Products/${id}`),
  create: (product) => apiRequest('/Products', { method: 'POST', body: JSON.stringify(product) }),
  update: (id, product) => apiRequest(`/Products/${id}`, { method: 'PUT', body: JSON.stringify(product) }),
  delete: (id) => apiRequest(`/Products/${id}`, { method: 'DELETE' }),
};

