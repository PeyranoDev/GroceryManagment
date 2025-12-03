import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { colors } from '../../utils/colors';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { User, Phone, MapPin, Truck } from 'lucide-react-native';

export default function SalesInfo({ details, onDetailChange, onNext }) {
    const isOnline = details.isOnline;
    const needsAddress = details.deliveryMethod === 'Entrega a domicilio';

    const isValid = () => {
        if (!details.date || !details.time) return false;
        if (isOnline) {
            if (!details.client?.trim()) return false;
            if (!details.phone?.trim()) return false;
            if (needsAddress && !details.address?.trim()) return false;
        }
        return true;
    };

    return (
        <View style={styles.container}>
            <Card title="Información de la Venta">
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tipo de Venta</Text>
                    <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>Venta Online</Text>
                        <Switch
                            value={isOnline}
                            onValueChange={(value) => onDetailChange('isOnline', value)}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={colors.text}
                        />
                    </View>
                </View>

                {isOnline && (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Método de Entrega</Text>
                            <View style={styles.radioGroup}>
                                <Button
                                    variant={details.deliveryMethod === 'Entrega a domicilio' ? 'primary' : 'secondary'}
                                    onPress={() => onDetailChange('deliveryMethod', 'Entrega a domicilio')}
                                    style={styles.radioButton}
                                >
                                    <Truck size={18} color={details.deliveryMethod === 'Entrega a domicilio' ? colors.text : colors.primary} />
                                    <Text>  Entrega</Text>
                                </Button>
                                <Button
                                    variant={details.deliveryMethod === 'Retiro en tienda' ? 'primary' : 'secondary'}
                                    onPress={() => onDetailChange('deliveryMethod', 'Retiro en tienda')}
                                    style={styles.radioButton}
                                >
                                    Retiro
                                </Button>
                            </View>
                        </View>

                        <Input
                            label="Cliente *"
                            value={details.client}
                            onChangeText={(value) => onDetailChange('client', value)}
                            placeholder="Nombre del cliente"
                            icon={<User size={20} color={colors.textSecondary} />}
                        />

                        <Input
                            label="Teléfono *"
                            value={details.phone}
                            onChangeText={(value) => onDetailChange('phone', value)}
                            placeholder="+54 9 11 1234-5678"
                            keyboardType="phone-pad"
                            icon={<Phone size={20} color={colors.textSecondary} />}
                        />

                        {needsAddress && (
                            <>
                                <Input
                                    label="Dirección *"
                                    value={details.address}
                                    onChangeText={(value) => onDetailChange('address', value)}
                                    placeholder="Calle y número"
                                    icon={<MapPin size={20} color={colors.textSecondary} />}
                                />

                                <Input
                                    label="Costo de Envío"
                                    value={details.deliveryCost}
                                    onChangeText={(value) => onDetailChange('deliveryCost', value)}
                                    placeholder="0"
                                    keyboardType="numeric"
                                />
                            </>
                        )}
                    </>
                )}

                <Input
                    label="Observaciones"
                    value={details.observations}
                    onChangeText={(value) => onDetailChange('observations', value)}
                    placeholder="Notas adicionales..."
                    multiline
                />

                <Button
                    variant="primary"
                    onPress={onNext}
                    disabled={!isValid()}
                    style={styles.nextButton}
                >
                    Continuar
                </Button>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 12,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.bgInput,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    switchLabel: {
        fontSize: 16,
        color: colors.text,
    },
    radioGroup: {
        flexDirection: 'row',
        gap: 8,
    },
    radioButton: {
        flex: 1,
    },
    nextButton: {
        marginTop: 16,
    },
});
