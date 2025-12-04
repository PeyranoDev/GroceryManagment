import { apiRequest } from '../../services/core/apiClient';

export const recentActivitiesAPI = {
  getAll: (count = 10, days = 30) => apiRequest(`/RecentActivities?count=${count}&days=${days}`),
  getRecent: (count = 10, days = 30) => apiRequest(`/RecentActivities?count=${count}&days=${days}`),
};

