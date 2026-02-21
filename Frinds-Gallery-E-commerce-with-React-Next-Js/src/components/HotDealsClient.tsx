'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HotDealsPage } from '@/core-pages/HotDealsPage';
import { useCart } from '@/context/CartContext';
import { getProducts } from '@/services/api';
import { useEffect } from 'react';
import type { Product } from '@/types';

export default function HotDealsClient() {
  const router = useRouter();
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts).catch(() => setProducts([]));
  }, []);

  const navigateTo = (page: string) => {
    router.push(`/${page === 'home' ? '' : page}`);
  };

  const handleProductSelect = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const buyNow = (productId: string, quantity: number) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    router.push('/checkout');
  };

  const addItemToCart = (productId: string, quantity: number) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleQuickView = (product: Product) => {
    // Quick view functionality would go here
  };

  return (
    <HotDealsPage
      products={products}
      onProductSelect={handleProductSelect}
      addToCart={addItemToCart}
      buyNow={buyNow}
      wishlist={wishlist}
      toggleWishlist={toggleWishlist}
      onQuickView={handleQuickView}
      navigateTo={navigateTo as any}
    />
  );
}
