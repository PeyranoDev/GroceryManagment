import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../utils/colors';
import { formatCurrency } from '../../utils/formatters';

export default function KPICard({ title, value, icon, trend, isLoading }) {
    return (
        <View style={styles.card}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                {isLoading ? (
                    <Text style={styles.value}>Cargando...</Text>
                ) : (
                    <>
                        <Text style={styles.value}>{value}</Text>
                        {trend && <Text style={[styles.trend, trend > 0 && styles.trendPositive]}>{trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%</Text>}
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.bgSecondary,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    value: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    trend: {
        fontSize: 12,
        color: colors.error,
        marginTop: 4,
    },
    trendPositive: {
        color: colors.success,
    },
});
