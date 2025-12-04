import { apiRequest } from '../../services/core/apiClient';

export const dashboardAPI = {
  getData: (activitiesCount = 4, activitiesDays = 30) => 
    apiRequest(`/Dashboard?activitiesCount=${activitiesCount}&activitiesDays=${activitiesDays}`),
  getStats: () => apiRequest('/Dashboard/stats'),
  getWeeklySales: () => apiRequest('/Dashboard/weekly-sales'),
};

