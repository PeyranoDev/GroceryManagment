import { useState, useEffect } from 'react';
import { dashboardAPI, recentActivitiesAPI, inventoryAPI } from '../services/api';

// Hook para datos del dashboard
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
      // Ejecutar todas las llamadas en paralelo
      const [statsResponse, weeklySalesResponse, activitiesResponse] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getWeeklySales(),
        recentActivitiesAPI.getRecent(4)
      ]);

      // Extraer data de las respuestas (considerando la estructura ApiResponse)
      setStats(statsResponse.data || statsResponse);
      setWeeklySales(weeklySalesResponse.data || weeklySalesResponse);
      setRecentActivities(activitiesResponse.data || activitiesResponse);
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

// Hook para inventario con bajo stock (para dashboard)
export const useLowStockCount = () => {
  const [lowStockCount, setLowStockCount] = useState(0);
  
  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const response = await inventoryAPI.getLowStock(10);
        const items = response.data || response;
        setLowStockCount(Array.isArray(items) ? items.length : 0);
      } catch (error) {
        console.error('Error fetching low stock count:', error);
        setLowStockCount(0);
      }
    };

    fetchLowStock();
  }, []);

  return lowStockCount;
};
