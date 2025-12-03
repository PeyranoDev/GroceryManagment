import { Tabs } from 'expo-router';
import { BarChart3, ShoppingCart, Package, User } from 'lucide-react-native';
import { colors } from '../../utils/colors';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false, // Ocultar header
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: colors.bgSecondary,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                    height: 80,
                    paddingBottom: 25,
                    paddingTop: 8,
                    position: 'absolute',
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    marginBottom: 4,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <BarChart3 color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="sales"
                options={{
                    title: 'Caja',
                    tabBarIcon: ({ color, size }) => (
                        <ShoppingCart color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="inventory"
                options={{
                    title: 'Inventario',
                    tabBarIcon: ({ color, size }) => (
                        <Package color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color, size }) => (
                        <User color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}
