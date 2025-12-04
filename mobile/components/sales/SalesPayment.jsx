import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../../utils/colors';
import { formatCurrency, formatUSD } from '../../utils/formatters';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Banknote, CreditCard, Smartphone } from 'lucide-react-native';

export default function SalesPayment({ 
    details, 
    total, 
    totalUSD = 0,
    moneda = 1,
    cotizacionDolar = 0,
    isOnline, 
    onDetailChange, 
    onFinish, 
    onPrev, 
    loading 
}) {
    const isUSD = moneda === 2;
    const paymentMethods = [
        { id: 'Efectivo', label: 'Efectivo', icon: Banknote },
        { id: 'Tarjeta', label: 'Tarjeta', icon: CreditCard },
        { id: 'Transferencia', label: 'Transferencia', icon: Smartphone },
    ];

    const handleFinish = () => {
        const totalDisplay = isUSD ? formatUSD(totalUSD) : formatCurrency(total);
        Alert.alert(
            'Confirmar Venta',
            `¿Confirmar venta de ${totalDisplay}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Confirmar',
                    style: 'default',
                    onPress: onFinish,
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Card title="Método de Pago" style={styles.card}>
                {isOnline ? (
                    <>
                        <Text style={styles.info}>
                            Para ventas online, el pago se registrará cuando se complete la orden.
                        </Text>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>Estado: Pendiente de Pago</Text>
                        </View>
                    </>
                ) : (
                    <>
                        <Text style={styles.subtitle}>Selecciona el método de pago:</Text>
                        <View style={styles.methodsGrid}>
                            {paymentMethods.map((method) => {
                                const Icon = method.icon;
                                const isSelected = details.paymentMethod === method.id;

                                return (
                                    <TouchableOpacity
                                        key={method.id}
                                        style={[
                                            styles.methodCard,
                                            isSelected && styles.methodCardSelected,
                                        ]}
                                        onPress={() => onDetailChange('paymentMethod', method.id)}
                                    >
                                        <Icon
                                            size={32}
                                            color={isSelected ? colors.primary : colors.textSecondary}
                                        />
                                        <Text
                                            style={[
                                                styles.methodLabel,
                                                isSelected && styles.methodLabelSelected,
                                            ]}
                                        >
                                            {method.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </>
                )}

                {/* Total Final */}
                <View style={styles.totalSection}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>{isOnline ? 'Total a Cobrar:' : 'Total a Pagar:'}</Text>
                        <Text style={[styles.totalValue, isUSD && styles.usdText]}>
                            {isUSD ? formatUSD(totalUSD) : formatCurrency(total)}
                        </Text>
                    </View>
                    {cotizacionDolar > 0 && (
                        <View style={styles.equivalentRow}>
                            <Text style={styles.equivalentText}>
                                {isUSD 
                                    ? `Equivalente: ${formatCurrency(total)}`
                                    : `Equivalente: ${formatUSD(totalUSD)}`
                                }
                            </Text>
                        </View>
                    )}
                </View>

                {/* Botones */}
                <View style={styles.actions}>
                    <Button variant="secondary" onPress={onPrev} style={{ flex: 1, marginRight: 8 }}>
                        Atrás
                    </Button>
                    <Button
                        variant="primary"
                        onPress={handleFinish}
                        loading={loading}
                        style={{ flex: 2 }}
                    >
                        Finalizar Venta
                    </Button>
                </View>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        marginBottom: 16,
    },
    info: {
        fontSize: 15,
        color: colors.textSecondary,
        marginBottom: 16,
        textAlign: 'center',
    },
    statusBadge: {
        backgroundColor: colors.warning,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    statusText: {
        color: colors.text,
        fontSize: 15,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 16,
    },
    methodsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    methodCard: {
        flex: 1,
        backgroundColor: colors.bgSecondary,
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    methodCardSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.bgInput,
    },
    methodLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textSecondary,
        textAlign: 'center',
    },
    methodLabelSelected: {
        color: colors.primary,
        fontWeight: '600',
    },
    totalSection: {
        backgroundColor: colors.bgInput,
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
    },
    totalValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary,
    },
    usdText: {
        color: '#22c55e',
    },
    equivalentRow: {
        alignItems: 'center',
        marginTop: 8,
    },
    equivalentText: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    actions: {
        flexDirection: 'row',
    },
});
