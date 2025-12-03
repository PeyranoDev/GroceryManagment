import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut, User as UserIcon } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../utils/colors';

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro que deseas salir?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Salir',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('/login');
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <UserIcon color={colors.primary} size={48} />
                    </View>
                    <Text style={styles.name}>{user?.name || 'Usuario'}</Text>
                    <Text style={styles.email}>{user?.email || ''}</Text>
                    {user?.currentRole && (
                        <View style={styles.roleBadge}>
                            <Text style={styles.roleText}>
                                {user.currentRole === 1 ? 'Staff' : user.currentRole === 2 ? 'Admin' : 'SuperAdmin'}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.cardTitle}>Información de la cuenta</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Email</Text>
                        <Text style={styles.infoValue}>{user?.email || 'No disponible'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Nombre</Text>
                        <Text style={styles.infoValue}>{user?.name || 'No disponible'}</Text>
                    </View>
                    {user?.currentGroceryId && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Grocery ID</Text>
                            <Text style={styles.infoValue}>{user.currentGroceryId}</Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <LogOut color={colors.text} size={20} />
                    <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                </TouchableOpacity>

                <Text style={styles.version}>Versión 1.0.0</Text>
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
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.bgSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 3,
        borderColor: colors.primary,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 12,
    },
    roleBadge: {
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
    },
    roleText: {
        color: colors.text,
        fontSize: 12,
        fontWeight: '600',
    },
    infoCard: {
        backgroundColor: colors.bgSecondary,
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 24,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    infoLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    infoValue: {
        fontSize: 14,
        color: colors.text,
        fontWeight: '500',
    },
    logoutButton: {
        backgroundColor: colors.error,
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    logoutButtonText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    version: {
        textAlign: 'center',
        color: colors.textSecondary,
        fontSize: 12,
        marginTop: 24,
    },
});
