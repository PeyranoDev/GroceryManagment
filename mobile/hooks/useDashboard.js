import { useState, useEffect, useCallback } from 'react';
import { dashboardAPI } from '../services/api';

export const useDashboard = () => {
    const [stats, setStats] = useState(null);
    const [weeklySales, setWeeklySales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            console.log('📊 Fetching dashboard data...');
            const [statsResponse, weeklyResponse] = await Promise.all([
                dashboardAPI.getStats(),
                dashboardAPI.getWeeklySales(),
            ]);

            // Handle API response structure - the data might be wrapped
            const statsData = statsResponse.data?.data || statsResponse.data || statsResponse;
            const weeklyData = weeklyResponse.data?.data || weeklyResponse.data || weeklyResponse;

            console.log('✅ Dashboard stats loaded');
            setStats(statsData);
            setWeeklySales(Array.isArray(weeklyData) ? weeklyData : []);
        } catch (err) {
            console.error('❌ Error fetching dashboard data:', err);
            setError(err.message || 'Error al cargar el dashboard');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        stats,
        weeklySales,
        loading,
        error,
        refresh: fetchDashboardData,
    };
};
