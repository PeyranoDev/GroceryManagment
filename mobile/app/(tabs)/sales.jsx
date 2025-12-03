import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../utils/colors';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';
import { useSales } from '../../hooks/useSales';
import { useAuth } from '../../contexts/AuthContext';
import Stepper from '../../components/sales/Stepper';
import SalesInfo from '../../components/sales/SalesInfo';
import ProductSearch from '../../components/sales/ProductSearch';
import SalesCart from '../../components/sales/SalesCart';
import SalesSummary from '../../components/sales/SalesSummary';
import SalesPayment from '../../components/sales/SalesPayment';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function SalesScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const {
        cart,
        addProductToCart,
        removeFromCart,
        updateQuantity,
        togglePromotion,
        clearCart,
        calculateTotals,
    } = useCart();

    const { createSaleFromCart, loading } = useSales();

    const [step, setStep] = useState(1);
    const [details, setDetails] = useState({
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toTimeString().slice(0, 5),
        client: '',
        phone: '',
        address: '',
        paymentMethod: 'Efectivo',
        observations: '',
        isOnline: false,
        deliveryMethod: 'Retiro en tienda',
        deliveryCost: '0',
    });

    const { subtotal, total } = calculateTotals(
        details.isOnline && details.deliveryCost ? parseFloat(details.deliveryCost) : 0
    );

    const handleDetailChange = (key, value) => {
        setDetails(prev => ({ ...prev, [key]: value }));
    };

    const handleProductSelect = (product) => {
        if (product.stock <= 0) {
            Alert.alert('Sin Stock', `El producto "${product.name}" no tiene stock disponible.`);
            return;
        }
        addProductToCart(product);
    };

    const resetSale = () => {
        clearCart();
        setDetails({
            date: new Date().toISOString().slice(0, 10),
            time: new Date().toTimeString().slice(0, 5),
            client: '',
            phone: '',
            address: '',
            paymentMethod: 'Efectivo',
            observations: '',
            isOnline: false,
            deliveryMethod: 'Retiro en tienda',
            deliveryCost: '0',
        });
        setStep(1);
    };

    const handleFinish = async () => {
        if (cart.length === 0) {
            Alert.alert('Carrito vacío', 'Agrega productos antes de finalizar la venta.');
            return;
        }

        // Validar cantidades
        const invalidItems = cart.filter(
            item => typeof item.quantity !== 'number' || item.quantity <= 0
        );
        if (invalidItems.length > 0) {
            Alert.alert('Error', 'Algunos productos tienen cantidades inválidas.');
            return;
        }

        // Validar stock
        const outOfStock = cart.filter(
            item => item.quantity > item.product.stock
        );
        if (outOfStock.length > 0) {
            Alert.alert(
                'Stock Insuficiente',
                `Los siguientes productos no tienen stock suficiente:\n${outOfStock
                    .map(item => `- ${item.product.name} (disponible: ${item.product.stock})`)
                    .join('\n')}`
            );
            return;
        }

        try {
            const isOnline = !!details.isOnline;
            const cartData = {
                userId: user?.id || 1,
                items: cart.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    unitPrice: item.product.unitPrice,
                    promotionApplied: item.promotionApplied,
                })),
                subtotal,
                total,
                deliveryCost: parseFloat(details.deliveryCost || 0),
                customerName: details.client || '',
                customerPhone: details.phone || '',
                deliveryAddress: details.address || '',
                paymentMethod: details.paymentMethod || 'Efectivo',
                type: isOnline
                    ? (details.deliveryMethod === 'Entrega a domicilio' ? 'OnlineDelivery' : 'OnlinePickup')
                    : 'Presencial',
                orderStatus: isOnline ? 'Created' : 'Delivered',
                paymentStatus: isOnline ? 'Pending' : 'Paid',
                payments: isOnline ? [] : [{ method: details.paymentMethod, amount: total }],
            };

            const created = await createSaleFromCart(cartData);

            Alert.alert(
                '¡Venta Exitosa!',
                `Venta #${created?.id || ''} creada\nTotal: ${formatCurrency(total)}`,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            resetSale();
                        },
                    },
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'No se pudo procesar la venta. Intenta nuevamente.');
            console.error('Error creating sale:', error);
        }
    };

    const gotoNext = () => setStep(s => Math.min(s + 1, 4));
    const gotoPrev = () => setStep(s => Math.max(s - 1, 1));

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                <View style={styles.content}>
                    {/* Stepper */}
                    <Card style={styles.stepperCard}>
                        <Stepper currentStep={step} />
                    </Card>

                    {/* Step 1: Información */}
                    {step === 1 && (
                        <SalesInfo
                            details={details}
                            onDetailChange={handleDetailChange}
                            onNext={gotoNext}
                        />
                    )}

                    {/* Step 2: Productos */}
                    {step === 2 && (
                        <View>
                            <ProductSearch onProductSelect={handleProductSelect} />
                            <Card title={`Carrito (${cart.length} productos)`} style={styles.cartCard}>
                                {cart.length === 0 ? (
                                    <View style={styles.emptyCart}>
                                        <Button variant="secondary" onPress={gotoPrev}>
                                            Volver a Información
                                        </Button>
                                    </View>
                                ) : (
                                    <>
                                        <SalesCart
                                            cart={cart}
                                            onRemove={removeFromCart}
                                            onUpdateQuantity={updateQuantity}
                                            onTogglePromotion={togglePromotion}
                                        />
                                        <View style={styles.stepActions}>
                                            <Button variant="secondary" onPress={gotoPrev} style={{ flex: 1, marginRight: 8 }}>
                                                Atrás
                                            </Button>
                                            <Button variant="primary" onPress={gotoNext} style={{ flex: 1 }}>
                                                Continuar
                                            </Button>
                                        </View>
                                    </>
                                )}
                            </Card>
                        </View>
                    )}

                    {/* Step 3: Resumen */}
                    {step === 3 && (
                        <SalesSummary
                            cart={cart}
                            details={details}
                            subtotal={subtotal}
                            total={total}
                            onNext={gotoNext}
                            onPrev={gotoPrev}
                        />
                    )}

                    {/* Step 4: Pago */}
                    {step === 4 && (
                        <SalesPayment
                            details={details}
                            total={total}
                            isOnline={details.isOnline}
                            onDetailChange={handleDetailChange}
                            onFinish={handleFinish}
                            onPrev={gotoPrev}
                            loading={loading}
                        />
                    )}
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
    stepperCard: {
        marginBottom: 20,
    },
    cartCard: {
        marginTop: 16,
    },
    emptyCart: {
        padding: 20,
        alignItems: 'center',
    },
    stepActions: {
        flexDirection: 'row',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
});
