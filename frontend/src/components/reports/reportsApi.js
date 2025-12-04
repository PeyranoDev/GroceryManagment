import { apiRequest } from '../../services/core/apiClient';

export const reportsAPI = {
  getFilteredReports: (filters) => apiRequest('/Reports', { method: 'POST', body: JSON.stringify(filters) }),
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

