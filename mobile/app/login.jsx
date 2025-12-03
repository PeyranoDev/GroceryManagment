import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Leaf, Eye, EyeOff, AlertTriangle } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../utils/colors';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Por favor completa todos los campos');
            return;
        }

        setLoading(true);

        try {
            const result = await login(email, password);

            if (result.success) {
                router.replace('/(tabs)');
            } else {
                setError(result.error || 'Credenciales incorrectas');
            }
        } catch (err) {
            setError('Error al iniciar sesión. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.logoContainer}>
                    <View style={styles.logoCircle}>
                        <Leaf color={colors.primary} size={48} />
                    </View>
                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Bienvenido a</Text>
                    <Text style={styles.brandName}>VerduSoft</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Dirección de correo</Text>
                        <TextInput
                            style={[styles.input, error && styles.inputError]}
                            placeholder="correo@ejemplo.com"
                            placeholderTextColor={colors.textSecondary}
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                setError('');
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!loading}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Contraseña</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={[styles.input, styles.passwordInput, error && styles.inputError]}
                                placeholder="Ingresa tu contraseña"
                                placeholderTextColor={colors.textSecondary}
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    setError('');
                                }}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!loading}
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff color={colors.textSecondary} size={20} />
                                ) : (
                                    <Eye color={colors.textSecondary} size={20} />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {error ? (
                        <View style={styles.errorContainer}>
                            <AlertTriangle color={colors.error} size={16} />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading || !email.trim() || !password.trim()}
                    >
                        {loading ? (
                            <ActivityIndicator color={colors.text} />
                        ) : (
                            <Text style={styles.buttonText}>Iniciar Sesión</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.bgSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 20,
        color: colors.text,
        marginBottom: 4,
    },
    brandName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        backgroundColor: colors.bgInput,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
        color: colors.text,
    },
    inputError: {
        borderColor: colors.error,
        borderWidth: 2,
    },
    passwordContainer: {
        position: 'relative',
    },
    passwordInput: {
        paddingRight: 50,
    },
    eyeIcon: {
        position: 'absolute',
        right: 14,
        top: 14,
        padding: 4,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.error,
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        gap: 8,
    },
    errorText: {
        color: colors.text,
        fontSize: 14,
        flex: 1,
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    buttonDisabled: {
        backgroundColor: colors.primaryDark,
        opacity: 0.7,
    },
    buttonText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
});
