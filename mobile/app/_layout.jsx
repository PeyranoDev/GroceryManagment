import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout() {
    return (
        <AuthProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#302e2b' },
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="login" />
                <Stack.Screen name="(tabs)" />
            </Stack>
        </AuthProvider>
    );
}
