import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors } from '../../utils/colors';

export default function Input({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    icon,
    secureTextEntry,
    keyboardType = 'default',
    multiline = false,
    editable = true,
    style,
}) {
    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputContainer, error && styles.inputContainerError]}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <TextInput
                    style={[styles.input, icon && styles.inputWithIcon, multiline && styles.inputMultiline]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    multiline={multiline}
                    editable={editable}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 8,
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.bgInput,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
    },
    inputContainerError: {
        borderColor: colors.error,
        borderWidth: 2,
    },
    iconContainer: {
        paddingLeft: 14,
    },
    input: {
        flex: 1,
        padding: 14,
        fontSize: 16,
        color: colors.text,
    },
    inputWithIcon: {
        paddingLeft: 8,
    },
    inputMultiline: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    errorText: {
        color: colors.error,
        fontSize: 12,
        marginTop: 4,
    },
});
