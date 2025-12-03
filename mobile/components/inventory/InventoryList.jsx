import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { colors } from '../../utils/colors';
import { formatCurrency } from '../../utils/formatters';
import { Package, AlertCircle, Edit2, Check, X } from 'lucide-react-native';

export default function InventoryList({ inventory, onAdjustStock, loading }) {
    const [editingId, setEditingId] = useState(null);
    const [newStock, setNewStock] = useState('');

    const handleStartEdit = (item) => {
        setEditingId(item.id);
        setNewStock(item.stock.toString());
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setNewStock('');
    };

    const handleSaveStock = async (item) => {
        const stock = parseInt(newStock, 10);
        if (isNaN(stock) || stock < 0) {
            Alert.alert('Error', 'Ingresa un stock válido (número mayor o igual a 0)');
            return;
        }

        try {
            await onAdjustStock(item.id, stock);
            setEditingId(null);
            setNewStock('');
            Alert.alert('Éxito', `Stock de "${item.name}" actualizado a ${stock}`);
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar el stock. Intenta nuevamente.');
        }
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { label: 'Sin Stock', color: colors.error };
        if (stock < 10) return { label: 'Bajo Stock', color: colors.warning };
        return { label: 'En Stock', color: colors.success };
    };

    const renderItem = ({ item }) => {
        const stockStatus = getStockStatus(item.stock);
        const isEditing = editingId === item.id;

        return (
            <View style={styles.item}>
                <View style={styles.itemHeader}>
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        {item.barcode && (
                            <Text style={styles.itemBarcode}>Código: {item.barcode}</Text>
                        )}
                        <Text style={styles.itemPrice}>{formatCurrency(item.unitPrice)}</Text>
                    </View>

                    <View style={[styles.stockBadge, { backgroundColor: stockStatus.color }]}>
                        <Package size={16} color={colors.text} />
                        <Text style={styles.stockBadgeText}>{stockStatus.label}</Text>
                    </View>
                </View>

                {item.promotion && (
                    <View style={styles.promotionInfo}>
                        <Text style={styles.promotionText}>
                            Promoción: {item.promotion.quantity}x{formatCurrency(item.promotion.price)}
                        </Text>
                    </View>
                )}

                <View style={styles.stockSection}>
                    {isEditing ? (
                        <View style={styles.editContainer}>
                            <TextInput
                                style={styles.stockInput}
                                value={newStock}
                                onChangeText={setNewStock}
                                keyboardType="numeric"
                                placeholder="Nuevo stock"
                                placeholderTextColor={colors.textSecondary}
                                autoFocus
                            />
                            <TouchableOpacity
                                style={[styles.actionButton, styles.saveButton]}
                                onPress={() => handleSaveStock(item)}
                            >
                                <Check size={20} color={colors.text} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.cancelButton]}
                                onPress={handleCancelEdit}
                            >
                                <X size={20} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.stockDisplay}>
                            <Text style={styles.stockLabel}>Stock actual:</Text>
                            <Text style={styles.stockValue}>{item.stock}</Text>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => handleStartEdit(item)}
                            >
                                <Edit2 size={18} color={colors.primary} />
                                <Text style={styles.editButtonText}>Ajustar</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Cargando inventario...</Text>
            </View>
        );
    }

    if (inventory.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Package size={48} color={colors.textSecondary} />
                <Text style={styles.emptyText}>No hay productos en el inventario</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={inventory}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
        />
    );
}

const styles = StyleSheet.create({
    listContent: {
        paddingBottom: 16,
    },
    item: {
        backgroundColor: colors.bgSecondary,
        borderRadius: 12,
        padding: 16,
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
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    itemBarcode: {
        fontSize: 13,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 16,
        color: colors.primary,
        fontWeight: '500',
    },
    stockBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    stockBadgeText: {
        color: colors.text,
        fontSize: 12,
        fontWeight: '600',
    },
    promotionInfo: {
        backgroundColor: colors.success,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        marginBottom: 12,
        alignSelf: 'flex-start',
    },
    promotionText: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '600',
    },
    stockSection: {
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 12,
    },
    stockDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    stockLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    stockValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        flex: 1,
        marginLeft: 8,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.bgInput,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
    },
    editButtonText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    editContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stockInput: {
        flex: 1,
        backgroundColor: colors.bgInput,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: colors.text,
    },
    actionButton: {
        width: 44,
        height: 44,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: colors.success,
    },
    cancelButton: {
        backgroundColor: colors.error,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    loadingText: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyText: {
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: 16,
        textAlign: 'center',
    },
});
