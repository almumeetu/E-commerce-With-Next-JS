'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShopPage } from '@/core-pages/ShopPage';
import { useCart } from '@/context/CartContext';
import type { Product, Category } from '@/types';

interface ShopClientProps {
  products: Product[];
  categories: Category[];
}

export default function ShopClient({ products, categories }: ShopClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { wishlist, toggleWishlist, addToCart } = useCart();

  const navigateTo = (page: string) => {
    router.push(`/${page === 'home' ? '' : page}`);
  };

  const navigateToShop = (categoryId?: string) => {
    router.push(`/shop${categoryId ? `?category=${categoryId}` : ''}`);
  };

  const handleProductSelect = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const buyNow = (productId: string, quantity: number) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    for (let index = 0; index < quantity; index += 1) {
      addToCart(product);
    }

    router.push('/checkout');
  };

  const addItemToCart = (productId: string, quantity: number) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    for (let index = 0; index < quantity; index += 1) {
      addToCart(product);
    }
  };

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <ShopPage
      products={products}
      categories={categories}
      onProductSelect={handleProductSelect}
      addToCart={addItemToCart}
      buyNow={buyNow}
      wishlist={wishlist}
      toggleWishlist={toggleWishlist}
      onQuickView={(p) => setQuickViewProduct(p)}
      navigateTo={navigateTo as any}
      navigateToShop={navigateToShop}
    />
  );
}
