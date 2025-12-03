import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { colors } from '../../utils/colors';
import { useInventory } from '../../hooks/useInventory';
import InventoryList from '../../components/inventory/InventoryList';
import Input from '../../components/ui/Input';
import { Search } from 'lucide-react-native';

export default function InventoryScreen() {
    const { inventory, loading, fetchInventory, adjustStock } = useInventory();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredInventory, setFilteredInventory] = useState([]);

    useEffect(() => {
        fetchInventory();
    }, []);

    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = inventory.filter(
                item =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.barcode?.includes(searchQuery)
            );
            setFilteredInventory(filtered);
        } else {
            setFilteredInventory(inventory);
        }
    }, [searchQuery, inventory]);

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchInventory} tintColor={colors.primary} />
                }
            >
                <View style={styles.content}>
                    <Text style={styles.title}>Inventario</Text>
                    <Text style={styles.subtitle}>Gestiona productos y stock</Text>

                    <Input
                        placeholder="Buscar por nombre o código..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        icon={<Search size={20} color={colors.textSecondary} />}
                    />

                    <View style={styles.listContainer}>
                        <Text style={styles.listTitle}>
                            {filteredInventory.length} producto{filteredInventory.length !== 1 ? 's' : ''}
                        </Text>
                        <InventoryList
                            inventory={filteredInventory}
                            onAdjustStock={adjustStock}
                            loading={loading && inventory.length === 0}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    scrollView: {
        flex: 1,
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
    listContainer: {
        marginTop: 16,
    },
    listTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: 12,
    },
});
