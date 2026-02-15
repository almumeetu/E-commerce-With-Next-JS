'use client';

import { useState } from 'react';
import Navbar from './Navbar';
import MiniCart from './MiniCart';
import { useCart } from '@/src/context/CartContext';

export default function NavbarWrapper() {
    const [showMiniCart, setShowMiniCart] = useState(false);
    const { cart, updateQuantity, removeFromCart } = useCart();

    return (
        <>
            <Navbar onCartClick={() => setShowMiniCart(true)} />
            <MiniCart
                isOpen={showMiniCart}
                onClose={() => setShowMiniCart(false)}
                cart={cart}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
            />
        </>
    );
}
