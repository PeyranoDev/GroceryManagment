import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dashboardAPI } from '../services/api';
import { mockDashboardStats, mockWeeklySales } from '../utils/mockData';

export const useDashboard = () => {
    const [stats, setStats] = useState(null);
    const [weeklySales, setWeeklySales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDemoMode, setIsDemoMode] = useState(false);

    useEffect(() => {
        checkDemoMode();
    }, []);

    const checkDemoMode = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            setIsDemoMode(token === 'demo-token-123');
            fetchDashboardData(token === 'demo-token-123');
        } catch (err) {
            fetchDashboardData(false);
        }
    };

    const fetchDashboardData = async (isDemo = isDemoMode) => {
        setLoading(true);
        setError(null);

        if (isDemo) {
            // Demo mode: use mock data
            setTimeout(() => {
                setStats(mockDashboardStats);
                setWeeklySales(mockWeeklySales);
                setLoading(false);
            }, 500); // Simulate network delay
            return;
        }

        try {
            const [statsResponse, weeklyResponse] = await Promise.all([
                dashboardAPI.getStats(),
                dashboardAPI.getWeeklySales(),
            ]);

            setStats(statsResponse.data || statsResponse);
            setWeeklySales(weeklyResponse.data || weeklyResponse);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        stats,
        weeklySales,
        loading,
        error,
        refresh: fetchDashboardData,
    };
};
