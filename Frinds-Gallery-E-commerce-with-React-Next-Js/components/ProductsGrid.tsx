import React from 'react';
import { MobileProductCard } from './MobileProductCard';
import type { Product } from '../types';

interface ProductsGridProps {
    products: Product[];
    onProductSelect: (product: Product) => void;
    addToCart: (productId: string, quantity: number) => void;
    buyNow: (productId: string, quantity: number) => void;
    wishlist: string[];
    toggleWishlist: (productId: string) => void;
    onQuickView: (product: Product) => void;
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({ products, onProductSelect, addToCart, buyNow, wishlist, toggleWishlist, onQuickView }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
                <MobileProductCard
                    key={product.id}
                    product={product}
                    onProductSelect={onProductSelect}
                    addToCart={addToCart}
                    buyNow={buyNow}
                    isInWishlist={wishlist.includes(product.id)}
                    toggleWishlist={toggleWishlist}
                    onQuickView={onQuickView}
                />
            ))}
        </div>
    );
};