import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { TrendingUp, DollarSign, Package, ShoppingCart } from 'lucide-react-native';
import { colors } from '../../utils/colors';
import { formatCurrency } from '../../utils/formatters';
import { useDashboard } from '../../hooks/useDashboard';
import { useInventory } from '../../hooks/useInventory';
import KPICard from '../../components/dashboard/KPICard';

export default function DashboardScreen() {
    const { stats, loading, error, refresh } = useDashboard();
    const { getLowStock } = useInventory();
    const [lowStockCount, setLowStockCount] = React.useState(0);

    useEffect(() => {
        const fetchLowStock = async () => {
            try {
                const lowStockItems = await getLowStock(10);
                setLowStockCount(lowStockItems?.length || 0);
            } catch (err) {
                console.error('Error fetching low stock:', err);
            }
        };
        fetchLowStock();
    }, []);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />
            }
        >
            <View style={styles.content}>
                <Text style={styles.title}>Dashboard</Text>
                <Text style={styles.subtitle}>Bienvenido a Grocery Staff</Text>

                {error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Error al cargar datos: {error}</Text>
                    </View>
                ) : (
                    <View style={styles.kpiGrid}>
                        <View style={styles.kpiRow}>
                            <KPICard
                                title="Ventas de Hoy"
                                value={stats?.todaySales?.toString() || '0'}
                                icon={<ShoppingCart color={colors.primary} size={28} />}
                                isLoading={loading}
                            />
                        </View>

                        <View style={styles.kpiRow}>
                            <KPICard
                                title="Ingresos del Mes"
                                value={formatCurrency(stats?.monthlyRevenue || 0)}
                                icon={<DollarSign color={colors.success} size={28} />}
                                isLoading={loading}
                            />
                        </View>

                        <View style={styles.kpiRow}>
                            <KPICard
                                title="Bajo Stock"
                                value={lowStockCount.toString()}
                                icon={<Package color={colors.warning} size={28} />}
                                isLoading={loading}
                            />
                        </View>

                        <View style={styles.kpiRow}>
                            <KPICard
                                title="Ticket Promedio"
                                value={formatCurrency(stats?.averageTicket || 0)}
                                icon={<TrendingUp color={colors.secondary} size={28} />}
                                isLoading={loading}
                            />
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    contentContainer: {
        paddingBottom: 100,
    },
    content: {
        padding: 20,
        paddingTop: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 24,
    },
    kpiGrid: {
        gap: 16,
    },
    kpiRow: {
        marginBottom: 4,
    },
    errorContainer: {
        backgroundColor: colors.error,
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    errorText: {
        color: colors.text,
        fontSize: 14,
    },
});
