import { useEffect } from 'react';
import { useRouter, useRootNavigationState } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../utils/colors';

export default function Index() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const navigationState = useRootNavigationState();

    useEffect(() => {
        if (!navigationState?.key || loading) return;

        if (isAuthenticated) {
            router.replace('/(tabs)');
        } else {
            router.replace('/login');
        }
    }, [isAuthenticated, loading, navigationState]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );
}
