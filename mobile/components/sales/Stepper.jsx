import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../utils/colors'; // Asegúrate que esta ruta sea correcta
import { Check } from 'lucide-react-native';

export default function Stepper({ currentStep }) {
    const steps = [
        { number: 1, label: 'Información' },
        { number: 2, label: 'Productos' },
        { number: 3, label: 'Resumen' },
        { number: 4, label: 'Pago' },
    ];

    return (
        <View style={styles.container}>
            {steps.map((step, index) => {
                const isLastStep = index === steps.length - 1;
                const isCompleted = currentStep > step.number;
                const isActive = currentStep === step.number;

                return (
                    <React.Fragment key={step.number}>
                        <View style={styles.stepItem}>
                            <View
                                style={[
                                    styles.stepCircle,
                                    isCompleted && styles.stepCircleCompleted,
                                    isActive && styles.stepCircleActive,
                                ]}
                            >
                                {isCompleted ? (
                                    <Check size={18} color={colors.text} />
                                ) : (
                                    <Text
                                        style={[
                                            styles.stepNumber,
                                            isActive && styles.stepNumberActive,
                                        ]}
                                    >
                                        {step.number}
                                    </Text>
                                )}
                            </View>
                            <Text
                                style={[
                                    styles.stepLabel,
                                    isActive && styles.stepLabelActive,
                                ]}
                            >
                                {step.label}
                            </Text>
                        </View>

                        {!isLastStep && (
                            <View
                                style={[
                                    styles.stepLine,
                                    currentStep > step.number && styles.stepLineCompleted,
                                ]}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 24,
        paddingHorizontal: 16,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: '100%',
    },
    stepItem: {
        alignItems: 'center',
    },
    stepCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.bgSecondary,
        borderWidth: 2,
        borderColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        zIndex: 10,
    },
    stepCircleActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primary,
        borderWidth: 3,
    },
    stepCircleCompleted: {
        borderColor: colors.success,
        backgroundColor: colors.success,
    },
    stepNumber: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textSecondary,
    },
    stepNumberActive: {
        color: colors.text,
        fontSize: 18,
    },
    stepLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '500',
        textAlign: 'center',
        position: 'absolute',
        top: 54,
        width: 100,
    },
    stepLabelActive: {
        color: colors.primary,
        fontWeight: '700',
        fontSize: 13,
    },
    stepLine: {
        flex: 1,
        height: 2,
        backgroundColor: colors.border,
        marginHorizontal: 4,
        marginTop: 21,
    },
    stepLineCompleted: {
        backgroundColor: colors.success,
    },
});