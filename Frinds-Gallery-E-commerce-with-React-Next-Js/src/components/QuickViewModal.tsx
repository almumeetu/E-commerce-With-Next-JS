import React, { useState } from 'react';
import Image from 'next/image';
import type { Product } from '../types';
import { HeartIcon, XMarkIcon, PlusIcon, MinusIcon } from './icons';

interface QuickViewModalProps {
    product: Product;
    onClose: () => void;
    addToCart: (productId: string, quantity: number) => void;
    buyNow: (productId: string, quantity: number) => void;
    wishlist: string[];
    toggleWishlist: (productId: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose, addToCart, buyNow, wishlist, toggleWishlist }) => {
    const [quantity, setQuantity] = useState(1);
    const isInWishlist = wishlist.includes(product.id);

    const discount = product.originalPrice && product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className="fixed inset-0 bg-brand-green-deep/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="quick-view-title">
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col sm:flex-row group" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-brand-green bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-lg z-50 transition-all hover:rotate-90 active:scale-90" aria-label="Close modal">
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Image Section */}
                        <div className="relative aspect-square lg:aspect-auto h-full min-h-[400px] bg-slate-50 overflow-hidden">
                            <Image src={product.imageUrl} alt={product.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" sizes="(max-width: 1024px) 100vw, 50vw" priority />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                            {discount > 0 && (
                                <div className="absolute top-8 left-8 bg-red-500 text-white font-black px-4 py-1.5 rounded-full shadow-xl">
                                    -{discount}%
                                </div>
                            )}
                        </div>

                        {/* Content Section */}
                        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                            <div className="mb-8">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-green mb-3 block">{product.category}</span>
                                <h2 id="quick-view-title" className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">{product.name}</h2>
                                <div className="flex items-center gap-4">
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">SKU: {product.sku}</p>
                                    <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                    {product.stock > 0 ? (
                                        <span className="text-xs font-black uppercase tracking-widest text-brand-green flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
                                            ইন-স্টক
                                        </span>
                                    ) : (
                                        <span className="text-xs font-black uppercase tracking-widest text-red-500">স্টক আউট</span>
                                    )}
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-4 mb-8">
                                <p className="text-4xl lg:text-5xl font-black text-brand-green-deep">৳{product.price.toLocaleString('bn-BD')}</p>
                                {product.originalPrice && (
                                    <p className="text-2xl text-slate-300 line-through font-bold">৳{product.originalPrice.toLocaleString('bn-BD')}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="mb-10 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <p className="text-slate-600 font-medium leading-relaxed">
                                    প্রিমিয়াম কোয়ালিটির এই {product.name} পণ্যটি আপনার কালেকশনে যোগ করুন। এটি ক্যাজুয়াল বা যেকোনো পার্টিতে পরার জন্য উপযুক্ত। আমাদের প্রতিটি পণ্য সর্বোচ্চ মানের নিশ্চয়তা দেয়।
                                </p>
                            </div>

                            {/* Quantity & Actions */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center bg-slate-100 p-2 rounded-2xl">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        disabled={quantity <= 1}
                                        className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-brand-green transition-colors disabled:opacity-20"
                                    >
                                        <MinusIcon className="w-6 h-6" />
                                    </button>
                                    <span className="text-xl font-black text-slate-800 w-12 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                        disabled={quantity >= product.stock}
                                        className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-brand-green transition-colors disabled:opacity-20"
                                    >
                                        <PlusIcon className="w-6 h-6" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => { addToCart(product.id, quantity); onClose(); }}
                                    disabled={product.stock === 0}
                                    className="flex-grow bg-brand-yellow text-brand-green-deep py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-white hover:ring-2 hover:ring-brand-yellow transition-all active:scale-95 disabled:opacity-50"
                                >
                                    কার্টে যোগ করুন
                                </button>

                                <button
                                    onClick={() => toggleWishlist(product.id)}
                                    className={`w-16 h-16 flex items-center justify-center rounded-2xl border-2 transition-all active:scale-90 ${isInWishlist ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-slate-100 text-slate-400 hover:border-brand-green hover:text-brand-green'}`}
                                >
                                    <HeartIcon className={`w-8 h-8 ${isInWishlist ? 'fill-current' : ''}`} isFilled={isInWishlist} />
                                </button>
                            </div>

                            <button
                                onClick={() => { buyNow(product.id, quantity); onClose(); }}
                                disabled={product.stock === 0}
                                className="mt-4 w-full bg-brand-green-deep text-brand-yellow py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-brand-green hover:text-white transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 group/buy"
                            >
                                এখনই কিনুন
                                <svg className="w-5 h-5 transition-transform group-hover/buy:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};