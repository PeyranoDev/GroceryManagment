import { apiRequest } from '../../services/core/apiClient';

export const categoriesAPI = {
  getAll: () => apiRequest('/Categories'),
  getById: (id) => apiRequest(`/Categories/${id}`),
  create: (category) => apiRequest('/Categories', { method: 'POST', body: JSON.stringify(category) }),
  update: (id, category) => apiRequest(`/Categories/${id}`, { method: 'PUT', body: JSON.stringify(category) }),
  delete: (id) => apiRequest(`/Categories/${id}`, { method: 'DELETE' }),
};

