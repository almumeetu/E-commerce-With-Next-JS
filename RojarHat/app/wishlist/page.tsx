'use client';

import React from 'react';
import { useCart } from '@/src/context/CartContext';
import { PRODUCTS } from '@/constants';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function WishlistPage() {
    const { wishlist, toggleWishlist, addToCart } = useCart();

    // In a real app, you might fetch these from Supabase
    // Using PRODUCTS constant as fallback/source matches the previous implementation
    const wishlistProducts = PRODUCTS.filter(p => wishlist.includes(p.id));

    return (
        <div className="bg-stone-50 min-h-screen pb-12 animate-fade-in">
            <Breadcrumbs />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

                {/* Professional Small Header */}
                <div className="bg-emerald-950 rounded-2xl p-6 md:p-8 mb-10 text-center relative overflow-hidden shadow-xl border border-emerald-800">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <Heart className="w-8 h-8 text-gold-400 mb-3" />
                        <h1 className="text-2xl font-bold text-white tracking-tight">আমার পছন্দের তালিকা</h1>
                    </div>
                </div>

                {wishlistProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {wishlistProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={() => addToCart(product)}
                                isInWishlist={true}
                                onToggleWishlist={() => toggleWishlist(product.id)}
                                onQuickView={() => { }} // Handle if needed
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-stone-100">
                        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="h-10 w-10 text-stone-300" />
                        </div>
                        <h2 className="text-xl font-semibold text-stone-800 mb-2">আপনার পছন্দের তালিকা খালি</h2>
                        <p className="text-stone-500 mb-8">আপনি এখনো কোনো পণ্য পছন্দের তালিকায় যোগ করেননি।</p>
                        <Link href="/shop" className="inline-block bg-emerald-700 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-800 transition shadow-lg">
                            কেনাকাটা শুরু করুন
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
