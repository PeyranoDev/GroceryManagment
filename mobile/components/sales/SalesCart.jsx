import React from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { Trash2, Tag } from 'lucide-react-native';
import { colors } from '../../utils/colors';
import { formatCurrency } from '../../utils/formatters';

export default function SalesCart({ cart, onRemove, onUpdateQuantity, onTogglePromotion }) {
    const handleQuantityChange = (productId, value) => {
        if (value === '') {
            onUpdateQuantity(productId, '');
            return;
        }

        const quantity = parseInt(value, 10);
        if (!isNaN(quantity) && quantity >= 0) {
            onUpdateQuantity(productId, quantity);
        }
    };

    const handleRemove = (productId, productName) => {
        Alert.alert(
            'Eliminar Producto',
            `¿Deseas eliminar "${productName}" del carrito?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', style: 'destructive', onPress: () => onRemove(productId) },
            ]
        );
    };

    const renderCartItem = ({ item }) => {
        const product = item.product;
        const unitPrice = (product.salePrice ?? product.unitPrice ?? 0);
        const subtotal = item.promotionApplied && product.promotion
            ? (() => {
                const promo = product.promotion;
                const promoSets = Math.floor(item.quantity / promo.quantity);
                const remaining = item.quantity % promo.quantity;
                return promoSets * promo.price + remaining * unitPrice;
            })()
            : item.quantity * unitPrice;

        return (
            <View style={styles.cartItem}>
                <View style={styles.itemHeader}>
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{product.name}</Text>
                        <Text style={styles.itemPrice}>{formatCurrency(unitPrice)}/u</Text>
                        {product.promotion && (
                            <TouchableOpacity
                                style={[styles.promotionBadge, item.promotionApplied && styles.promotionBadgeActive]}
                                onPress={() => onTogglePromotion(product.id)}
                            >
                                <Tag size={14} color={colors.text} />
                                <Text style={styles.promotionText}>
                                    {product.promotion.quantity}x{formatCurrency(product.promotion.price)}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity onPress={() => handleRemove(product.id, product.name)}>
                        <Trash2 size={20} color={colors.error} />
                    </TouchableOpacity>
                </View>

                <View style={styles.itemActions}>
                    <View style={styles.quantityContainer}>
                        <Text style={styles.quantityLabel}>Cantidad:</Text>
                        <TextInput
                            style={styles.quantityInput}
                            value={item.quantity.toString()}
                            onChangeText={(value) => handleQuantityChange(product.id, value)}
                            keyboardType="numeric"
                        />
                    </View>
                    <Text style={styles.subtotal}>{formatCurrency(subtotal)}</Text>
                </View>
            </View>
        );
    };

    if (cart.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>El carrito está vacío</Text>
                <Text style={styles.emptySubtext}>Busca y agrega productos para comenzar</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={cart}
            keyExtractor={(item) => item.product.id.toString()}
            renderItem={renderCartItem}
            style={styles.list}
            contentContainerStyle={styles.listContent}
        />
    );
}

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 16,
    },
    cartItem: {
        backgroundColor: colors.bgSecondary,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    promotionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.bgInput,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
        alignSelf: 'flex-start',
    },
    promotionBadgeActive: {
        backgroundColor: colors.success,
        borderColor: colors.success,
    },
    promotionText: {
        color: colors.text,
        fontSize: 12,
        fontWeight: '600',
    },
    itemActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginRight: 8,
    },
    quantityInput: {
        backgroundColor: colors.bgInput,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        fontSize: 16,
        color: colors.text,
        width: 70,
        textAlign: 'center',
    },
    subtotal: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyText: {
        fontSize: 18,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});
