import React from 'react';
import { ProductsGrid } from '../components/ProductsGrid';
import { Breadcrumbs } from '../components/Breadcrumbs';
import type { Product } from '../types';
import type { Page } from '../App';

interface HotDealsPageProps {
    products: Product[];
    onProductSelect: (product: Product) => void;
    addToCart: (productId: string, quantity: number) => void;
    buyNow: (productId: string, quantity: number) => void;
    wishlist: string[];
    toggleWishlist: (productId: string) => void;
    onQuickView: (product: Product) => void;
    navigateTo: (page: Page) => void;
}

export const HotDealsPage: React.FC<HotDealsPageProps> = ({ products, onProductSelect, addToCart, buyNow, wishlist, toggleWishlist, onQuickView, navigateTo }) => {
    const hotDealsProducts = products.filter(p => p.originalPrice && p.originalPrice > p.price);

    return (
        <div className="bg-white">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                <Breadcrumbs items={[{ label: 'হোম', onClick: () => navigateTo('home') }, { label: 'হট ডিল' }]} />
                
                <div className="mt-6">
                    <h1 className="text-3xl font-bold text-gray-900">হট ডিলস</h1>
                    <p className="mt-2 text-gray-600">সেরা ডিসকাউন্টে আপনার পছন্দের পণ্য কিনুন।</p>

                    {hotDealsProducts.length > 0 ? (
                        <div className="mt-8">
                            <ProductsGrid 
                                products={hotDealsProducts} 
                                onProductSelect={onProductSelect} 
                                addToCart={addToCart}
                                buyNow={buyNow}
                                wishlist={wishlist}
                                toggleWishlist={toggleWishlist}
                                onQuickView={onQuickView}
                            />
                        </div>
                    ) : (
                        <div className="mt-12 text-center">
                           <p>দুঃখিত, এই মুহূর্তে কোনো হট ডিল নেই।</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
