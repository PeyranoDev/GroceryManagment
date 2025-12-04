import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI, handleApiError } from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Load user from storage on app start
    useEffect(() => {
        loadUserFromStorage();
    }, []);

    const loadUserFromStorage = async () => {
        try {
            const [storedUser, token] = await Promise.all([
                AsyncStorage.getItem('user'),
                AsyncStorage.getItem('userToken'),
            ]);

            if (storedUser && token) {
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Error loading user from storage:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            console.log('🔐 Attempting login for:', email);

            const response = await authAPI.login({ email, password });
            const { data } = response;

            console.log('📦 Login response:', JSON.stringify(data, null, 2));

            if (data.success && data.data) {
                const { token, expiration, user: userData } = data.data;

                // Save to AsyncStorage
                await Promise.all([
                    AsyncStorage.setItem('userToken', token),
                    AsyncStorage.setItem('user', JSON.stringify(userData)),
                    AsyncStorage.setItem('groceryId', userData.currentGroceryId?.toString() || '1'),
                ]);

                setUser(userData);
                setIsAuthenticated(true);

                console.log('✅ Login successful for:', userData.name || userData.email);
                return { success: true, user: userData };
            } else {
                throw new Error(data.message || 'Error en el inicio de sesión');
            }
        } catch (error) {
            const errorMessage = handleApiError(error);
            console.error('❌ Login error:', errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        try {
            console.log('🚪 Logging out...');
            await Promise.all([
                AsyncStorage.removeItem('userToken'),
                AsyncStorage.removeItem('user'),
                AsyncStorage.removeItem('groceryId'),
            ]);

            setUser(null);
            setIsAuthenticated(false);
            console.log('✅ Logout successful');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
