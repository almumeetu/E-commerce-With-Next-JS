'use client';

import React from 'react';
import { WishlistPage as WishlistPageCore } from '@/core-pages/WishlistPage';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { getProducts } from '@/services/api';
import { useEffect, useState } from 'react';
import type { Product } from '@/types';

export default function WishlistClient() {
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

  // Wrapper function to adapt addToCart type for WishlistPageCore
  const handleAddToCart = (productId: string, quantity: number) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleQuickView = (product: Product) => {
    // Quick view functionality would go here
  };

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <WishlistPageCore
      products={wishlistProducts}
      wishlistProductIds={wishlist}
      onProductSelect={handleProductSelect}
      addToCart={handleAddToCart}
      buyNow={buyNow}
      toggleWishlist={toggleWishlist}
      navigateTo={navigateTo}
      onQuickView={handleQuickView}
    />
  );
}
