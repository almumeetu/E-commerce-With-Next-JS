'use client';

import React from 'react';
import { HomePage } from '@/core-pages/HomePage';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import type { Product, Category } from '@/types';

interface HomeClientProps {
  products: Product[];
  categories: Category[];
}

export default function HomeClient({ products, categories }: HomeClientProps) {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const router = useRouter();

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

  const [quickViewProduct, setQuickViewProduct] = React.useState<Product | null>(null);

  return (
    <HomePage
      products={products}
      categories={categories}
      navigateTo={navigateTo as any}
      navigateToShop={navigateToShop}
      onProductSelect={handleProductSelect}
      wishlist={wishlist}
      toggleWishlist={toggleWishlist}
      addToCart={addItemToCart}
      buyNow={buyNow}
      onQuickView={(p) => setQuickViewProduct(p)}
    />
  );
}
