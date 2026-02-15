'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types';

interface CartContextType {
    cart: CartItem[];
    wishlist: (string | number)[];
    addToCart: (product: Product) => void;
    updateQuantity: (productId: string | number, amount: number) => void;
    setQuantity: (productId: string | number, quantity: number) => void;
    removeFromCart: (productId: string | number) => void;
    clearCart: () => void;
    toggleWishlist: (productId: string | number) => void;
    cartCount: number;
    cartTotal: number;
    wishlistCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [wishlist, setWishlist] = useState<(string | number)[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from local storage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart');
            }
        }
        if (savedWishlist) {
            try {
                setWishlist(JSON.parse(savedWishlist));
            } catch (e) {
                console.error('Failed to parse wishlist');
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('cart', JSON.stringify(cart));
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    }, [cart, wishlist, isLoaded]);

    const addToCart = (product: Product) => {
        setCart((prevCart: CartItem[]) => {
            const existingItem = prevCart.find((item: CartItem) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item: CartItem) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: string | number, amount: number) => {
        setCart((prevCart: CartItem[]) =>
            prevCart.map((item: CartItem) => {
                if (item.id === productId) {
                    const newQuantity = item.quantity + amount;
                    return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
                }
                return item;
            })
        );
    };

    const setQuantity = (productId: string | number, quantity: number) => {
        if (quantity < 1) return;
        setCart((prevCart: CartItem[]) =>
            prevCart.map((item: CartItem) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const removeFromCart = (productId: string | number) => {
        setCart((prevCart: CartItem[]) => prevCart.filter((item: CartItem) => item.id !== productId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const toggleWishlist = (productId: string | number) => {
        setWishlist((prev: (string | number)[]) => {
            if (prev.includes(productId)) {
                return prev.filter((id: string | number) => id !== productId);
            } else {
                return [...prev, productId];
            }
        });
    };

    const cartCount = cart.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
    const cartTotal = cart.reduce((acc: number, item: CartItem) => acc + (item.price * item.quantity), 0);
    const wishlistCount = wishlist.length;

    return (
        <CartContext.Provider value={{
            cart,
            wishlist,
            addToCart,
            updateQuantity,
            setQuantity,
            removeFromCart,
            clearCart,
            toggleWishlist,
            cartCount,
            cartTotal,
            wishlistCount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
