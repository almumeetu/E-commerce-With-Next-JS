import React from 'react';
import ProductCard from './ProductCard';
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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {products.map(product => (
                <ProductCard
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