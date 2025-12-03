import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Search } from 'lucide-react-native';
import { colors } from '../../utils/colors';
import { productsAPI } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { mockProducts } from '../../utils/mockData';

export default function ProductSearch({ onProductSelect }) {
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (search.trim()) {
            const filtered = products.filter(
                (p) =>
                    p.name.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts([]);
        }
    }, [search, products]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const isDemo = token === 'demo-token-123';

            if (isDemo) {
                setTimeout(() => {
                    setProducts(mockProducts);
                    setLoading(false);
                }, 300);
                return;
            }

            const response = await productsAPI.getAll();
            const items = response.data || response;
            setProducts(Array.isArray(items) ? items : []);
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectProduct = (product) => {
        onProductSelect(product);
        setSearch('');
        setFilteredProducts([]);
    };

    const renderProduct = ({ item }) => (
        <TouchableOpacity style={styles.productItem} onPress={() => handleSelectProduct(item)}>
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productDetails}>
                    {formatCurrency(item.unitPrice)}
                </Text>
                {item.promotion && (
                    <View style={styles.promotionBadge}>
                        <Text style={styles.promotionText}>
                            {item.promotion.quantity}x{formatCurrency(item.promotion.price)}
                        </Text>
                    </View>
                )}
            </View>
            <Text style={styles.stock}>Stock: {item.stock}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Search color={colors.textSecondary} size={20} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar producto por nombre..."
                    placeholderTextColor={colors.textSecondary}
                    value={search}
                    onChangeText={setSearch}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator color={colors.primary} />
                </View>
            )}

            {filteredProducts.length > 0 && (
                <View style={styles.resultsContainer}>
                    <FlatList
                        data={filteredProducts}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderProduct}
                        style={styles.resultsList}
                        keyboardShouldPersistTaps="handled"
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.bgInput,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: colors.text,
    },
    loadingContainer: {
        padding: 16,
        alignItems: 'center',
    },
    resultsContainer: {
        marginTop: 8,
        backgroundColor: colors.bgSecondary,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        maxHeight: 300,
    },
    resultsList: {
        maxHeight: 300,
    },
    productItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
        marginBottom: 4,
    },
    productDetails: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    promotionBadge: {
        backgroundColor: colors.success,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginTop: 4,
        alignSelf: 'flex-start',
    },
    promotionText: {
        color: colors.text,
        fontSize: 12,
        fontWeight: '600',
    },
    stock: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '500',
    },
});
