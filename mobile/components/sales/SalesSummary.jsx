import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../utils/colors';
import { formatCurrency, formatUSD } from '../../utils/formatters';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Truck, User, Phone, MapPin, FileText } from 'lucide-react-native';

export default function SalesSummary({ 
    cart, 
    details, 
    subtotal, 
    total, 
    totalUSD = 0,
    moneda = 1,
    cotizacionDolar = 0,
    onMonedaChange,
    onNext, 
    onPrev 
}) {
    const isUSD = moneda === 2;
    const subtotalUSD = cotizacionDolar > 0 ? (subtotal / cotizacionDolar) : 0;
    
    return (
        <ScrollView style={styles.container}>
            <Card title="Resumen de la Venta" style={styles.card}>
                {/* Selector de Moneda */}
                {cotizacionDolar > 0 && onMonedaChange && (
                    <View style={styles.currencySection}>
                        <Text style={styles.currencyLabel}>Moneda de pago:</Text>
                        <View style={styles.currencyButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.currencyButton,
                                    moneda === 1 && styles.currencyButtonActive,
                                ]}
                                onPress={() => onMonedaChange(1)}
                            >
                                <Text style={[
                                    styles.currencyButtonText,
                                    moneda === 1 && styles.currencyButtonTextActive,
                                ]}>🇦🇷 ARS</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.currencyButton,
                                    moneda === 2 && styles.currencyButtonActiveUSD,
                                ]}
                                onPress={() => onMonedaChange(2)}
                            >
                                <Text style={[
                                    styles.currencyButtonText,
                                    moneda === 2 && styles.currencyButtonTextActiveUSD,
                                ]}>🇺🇸 USD</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.exchangeRate}>
                            Cotización: ${cotizacionDolar.toFixed(2)} ARS
                        </Text>
                    </View>
                )}

                {/* Información del Cliente */}
                {details.isOnline && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Cliente</Text>
                        <View style={styles.infoRow}>
                            <User size={18} color={colors.textSecondary} />
                            <Text style={styles.infoText}>{details.client}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Phone size={18} color={colors.textSecondary} />
                            <Text style={styles.infoText}>{details.phone}</Text>
                        </View>
                        {details.deliveryMethod === 'Entrega a domicilio' && (
                            <View style={styles.infoRow}>
                                <MapPin size={18} color={colors.textSecondary} />
                                <Text style={styles.infoText}>{details.address}</Text>
                            </View>
                        )}
                        <View style={styles.infoRow}>
                            <Truck size={18} color={colors.textSecondary} />
                            <Text style={styles.infoText}>{details.deliveryMethod}</Text>
                        </View>
                    </View>
                )}

                {/* Observaciones */}
                {details.observations && (
                    <View style={styles.section}>
                        <View style={styles.infoRow}>
                            <FileText size={18} color={colors.textSecondary} />
                            <Text style={styles.infoText}>{details.observations}</Text>
                        </View>
                    </View>
                )}

                {/* Productos */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Productos ({cart.length})</Text>
                    {cart.map((item) => {
                        const itemSubtotal = item.promotionApplied && item.product.promotion
                            ? (() => {
                                const promo = item.product.promotion;
                                const promoSets = Math.floor(item.quantity / promo.quantity);
                                const remaining = item.quantity % promo.quantity;
                                return promoSets * promo.price + remaining * item.product.unitPrice;
                            })()
                            : item.quantity * item.product.unitPrice;

                        return (
                            <View key={item.product.id} style={styles.productRow}>
                                <View style={styles.productInfo}>
                                    <Text style={styles.productName}>
                                        {item.product.name}
                                        {item.promotionApplied && ' 🏷️'}
                                    </Text>
                                    <Text style={styles.productDetail}>
                                        {item.quantity} x {formatCurrency(item.product.unitPrice)}
                                    </Text>
                                </View>
                                <Text style={styles.productPrice}>{formatCurrency(itemSubtotal)}</Text>
                            </View>
                        );
                    })}
                </View>

                {/* Totales */}
                <View style={styles.totalsSection}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Subtotal:</Text>
                        <Text style={[styles.totalValue, isUSD && styles.usdText]}>
                            {isUSD ? formatUSD(subtotalUSD) : formatCurrency(subtotal)}
                        </Text>
                    </View>
                    {details.isOnline && details.deliveryCost && (
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Envío:</Text>
                            <Text style={[styles.totalValue, isUSD && styles.usdText]}>
                                {isUSD 
                                    ? formatUSD(parseFloat(details.deliveryCost) / cotizacionDolar)
                                    : formatCurrency(parseFloat(details.deliveryCost))
                                }
                            </Text>
                        </View>
                    )}
                    <View style={[styles.totalRow, styles.totalRowFinal]}>
                        <Text style={styles.totalLabelFinal}>Total:</Text>
                        <Text style={[styles.totalValueFinal, isUSD && styles.usdTextFinal]}>
                            {isUSD ? formatUSD(totalUSD) : formatCurrency(total)}
                        </Text>
                    </View>
                    {/* Equivalente en otra moneda */}
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
                    <Button variant="primary" onPress={onNext} style={{ flex: 1 }}>
                        Continuar
                    </Button>
                </View>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        marginBottom: 16,
    },
    section: {
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
    },
    infoText: {
        fontSize: 15,
        color: colors.text,
        flex: 1,
    },
    productRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 15,
        fontWeight: '500',
        color: colors.text,
        marginBottom: 4,
    },
    productDetail: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary,
    },
    totalsSection: {
        marginTop: 12,
        paddingTop: 12,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    totalRowFinal: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 2,
        borderTopColor: colors.border,
    },
    totalLabel: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    totalValue: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
    },
    totalLabelFinal: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
    },
    totalValueFinal: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
    },
    usdText: {
        color: '#22c55e',
    },
    usdTextFinal: {
        color: '#22c55e',
    },
    currencySection: {
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        alignItems: 'center',
    },
    currencyLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 10,
    },
    currencyButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    currencyButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: colors.bgSecondary,
        borderWidth: 1,
        borderColor: colors.border,
    },
    currencyButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    currencyButtonActiveUSD: {
        backgroundColor: '#22c55e',
        borderColor: '#22c55e',
    },
    currencyButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    currencyButtonTextActive: {
        color: '#fff',
    },
    currencyButtonTextActiveUSD: {
        color: '#fff',
    },
    exchangeRate: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 8,
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
        marginTop: 20,
    },
});
