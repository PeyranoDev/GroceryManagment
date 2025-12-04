import { useState, useEffect } from 'react';
import { dashboardAPI } from '../components/dashboard/dashboardApi';

export const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [weeklySales, setWeeklySales] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Single API call for all dashboard data
      const data = await dashboardAPI.getData(4, 30);

      setStats(data.stats);
      setWeeklySales(data.weeklySales);
      setRecentActivities(data.recentActivities);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    weeklySales,
    recentActivities,
    loading,
    error,
    refresh: fetchDashboardData
  };
};
