import React from 'react';
import { ProductsGrid } from '../components/ProductsGrid';
import { Breadcrumbs } from '../components/Breadcrumbs';
import type { Product } from '../types';
import type { Page } from '../types';
import { HeartIcon } from '../components/icons';

interface WishlistPageProps {
    products: Product[];
    wishlistProductIds: string[];
    onProductSelect: (product: Product) => void;
    addToCart: (productId: string, quantity: number) => void;
    buyNow: (productId: string, quantity: number) => void;
    toggleWishlist: (productId: string) => void;
    navigateTo: (page: Page) => void;
    onQuickView: (product: Product) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ products, wishlistProductIds, onProductSelect, addToCart, buyNow, toggleWishlist, navigateTo, onQuickView }) => {
    const wishlistProducts = products.filter(p => wishlistProductIds.includes(p.id));

    return (
        <div className="bg-white">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                <Breadcrumbs items={[{ label: 'হোম', onClick: () => navigateTo('home') }, { label: 'আমার পছন্দের তালিকা' }]} />
                
                <div className="mt-6">
                    <h1 className="text-3xl font-bold text-gray-900">আমার পছন্দের তালিকা</h1>

                    {wishlistProducts.length > 0 ? (
                        <div className="mt-8">
                            <ProductsGrid 
                                products={wishlistProducts} 
                                onProductSelect={onProductSelect} 
                                addToCart={addToCart}
                                buyNow={buyNow}
                                wishlist={wishlistProductIds}
                                toggleWishlist={toggleWishlist}
                                onQuickView={onQuickView}
                            />
                        </div>
                    ) : (
                        <div className="mt-12 text-center">
                            <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h2 className="mt-2 text-xl font-semibold text-gray-800">আপনার পছন্দের তালিকা খালি</h2>
                            <p className="mt-1 text-gray-500">পণ্য ব্রাউজ করুন এবং আপনার পছন্দের পণ্য যোগ করুন।</p>
                            <button
                                onClick={() => navigateTo('shop')}
                                className="mt-6 bg-brand-green text-white py-2 px-6 rounded-md font-semibold hover:bg-brand-green-dark"
                            >
                                এখনই শপ করুন
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};