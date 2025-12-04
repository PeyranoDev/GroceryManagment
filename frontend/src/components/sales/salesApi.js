import { apiRequest } from '../../services/core/apiClient';

export const salesAPI = {
  getAll: () => apiRequest('/Sales'),
  getById: (id) => apiRequest(`/Sales/${id}`),
  getByDateRange: (startDate, endDate) => {
    const params = new URLSearchParams({ startDate, endDate }).toString();
    return apiRequest(`/Sales/date-range?${params}`);
  },
  getByUserId: (userId) => apiRequest(`/Sales/user/${userId}`),
  create: (sale) => apiRequest('/Sales', { method: 'POST', body: JSON.stringify(sale) }),
  createFromCart: (cartData) => apiRequest('/Sales/cart', { method: 'POST', body: JSON.stringify(cartData) }),
  updateOrderStatus: (id, newStatus) => apiRequest(`/Sales/${id}/order-status`, { method: 'POST', body: JSON.stringify({ status: newStatus }) }),
  addPayment: (id, payment) => apiRequest(`/Sales/${id}/payments`, { method: 'POST', body: JSON.stringify(payment) }),
  updatePaymentStatus: (id, status) => apiRequest(`/Sales/${id}/payment-status`, { method: 'POST', body: JSON.stringify({ status }) }),
  generateWhatsApp: (id, details) => apiRequest(`/Sales/${id}/whatsapp`, { method: 'POST', body: JSON.stringify(details) }),
  delete: (id) => apiRequest(`/Sales/${id}`, { method: 'DELETE' }),
};

