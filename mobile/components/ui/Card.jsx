import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../utils/colors';

export default function Card({ title, children, footer, style }) {
    return (
        <View style={[styles.card, style]}>
            {title && (
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                </View>
            )}
            <View style={styles.body}>{children}</View>
            {footer && <View style={styles.footer}>{footer}</View>}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.bgSecondary,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        padding: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
    },
    body: {
        padding: 16,
    },
    footer: {
        padding: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
});
