'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductDetailPage } from '@/core-pages/ProductDetailPage';
import { useCart } from '@/context/CartContext';
import type { Product, Category } from '@/types';

interface ProductDetailsClientProps {
  product: Product;
  allProducts: Product[];
  categories: Category[];
}

export default function ProductDetailsClient({ product, allProducts, categories }: ProductDetailsClientProps) {
  const router = useRouter();
  const { wishlist, toggleWishlist, addToCart } = useCart();

  const navigateTo = (page: string) => {
    router.push(`/${page === 'home' ? '' : page}`);
  };

  const navigateToShop = (categoryId: string) => {
    router.push(`/shop?category=${categoryId}`);
  };

  const handleProductSelect = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const buyNow = (productId: string, quantity: number) => {
    const selectedProduct = allProducts.find((item) => item.id === productId);
    if (!selectedProduct) return;

    for (let index = 0; index < quantity; index += 1) {
      addToCart(selectedProduct);
    }

    router.push('/checkout');
  };

  const addItemToCart = (productId: string, quantity: number) => {
    const selectedProduct = allProducts.find((item) => item.id === productId);
    if (!selectedProduct) return;

    for (let index = 0; index < quantity; index += 1) {
      addToCart(selectedProduct);
    }
  };

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <ProductDetailPage
      product={product}
      allProducts={allProducts}
      categories={categories}
      addToCart={addItemToCart}
      buyNow={buyNow}
      wishlist={wishlist}
      toggleWishlist={toggleWishlist}
      onProductSelect={handleProductSelect}
      onQuickView={(p) => setQuickViewProduct(p)}
      navigateTo={navigateTo as any}
      navigateToShop={navigateToShop}
    />
  );
}
