'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckoutPage } from '@/core-pages/CheckoutPage';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import type { Product, OrderItem } from '@/types';
import * as api from '@/services/api';

interface CheckoutClientProps {
  products: Product[];
}

export default function CheckoutClient({ products }: CheckoutClientProps) {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();

  const navigateTo = (page: string) => {
    router.push(`/${page === 'home' ? '' : page}`);
  };

  const handlePlaceOrder = async (orderData: { customerName: string; phone?: string; totalAmount: number; shippingAddress: string; items: OrderItem[], isIncomplete?: boolean }) => {
    try {
      const newOrder = await api.createOrder(orderData, user);
      
      if (orderData.isIncomplete) {
        return;
      }

      clearCart();
      // Store order details in a way that OrderSuccessPage can access it (e.g., query params or a global state/context)
      // For simplicity, let's use router.push with search params or just navigate
      router.push('/order-success');
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("অর্ডার করতে সমস্যা হয়েছে।");
    }
  };

  return (
    <CheckoutPage
      cart={cart}
      products={products}
      updateCartQuantity={updateQuantity}
      removeFromCart={removeFromCart}
      onPlaceOrder={handlePlaceOrder}
      navigateTo={navigateTo as any}
      currentUser={user}
    />
  );
}
