import { useState } from 'react';

export const useCart = () => {
    const [cart, setCart] = useState([]);

    const addProductToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [
                {
                    product,
                    quantity: 1,
                    promotionApplied: !!product.promotion
                },
                ...prev
            ];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity === '') {
            // Permite edición temporal con campo vacío
            setCart(prev =>
                prev.map(item =>
                    item.product.id === productId ? { ...item, quantity: '' } : item
                )
            );
            return;
        }

        const qty = typeof quantity === 'string' ? parseInt(quantity, 10) : quantity;

        if (typeof qty !== 'number' || Number.isNaN(qty)) {
            return;
        }
        if (qty < 0) {
            return;
        }

        setCart(prev =>
            prev.map(item =>
                item.product.id === productId ? { ...item, quantity: qty } : item
            )
        );
    };

    const togglePromotion = (productId) => {
        setCart(prev =>
            prev.map(item =>
                item.product.id === productId
                    ? { ...item, promotionApplied: !item.promotionApplied }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const calculateTotals = (deliveryCost = 0) => {
        let subtotal = 0;

        cart.forEach(item => {
            const qty = typeof item.quantity === 'number' ? item.quantity : 0;
            if (item.promotionApplied && item.product.promotion) {
                const promo = item.product.promotion;
                const promoSets = Math.floor(qty / promo.quantity);
                const remainingQty = qty % promo.quantity;
                subtotal += promoSets * promo.price + remainingQty * item.product.unitPrice;
            } else {
                subtotal += qty * item.product.unitPrice;
            }
        });

        const total = subtotal + parseFloat(deliveryCost || 0);
        return { subtotal, total };
    };

    return {
        cart,
        addProductToCart,
        removeFromCart,
        updateQuantity,
        togglePromotion,
        clearCart,
        calculateTotals,
    };
};
