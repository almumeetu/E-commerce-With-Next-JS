'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { useCart } from '@/src/context/CartContext';
import { ShoppingBag, ShoppingCart, Heart, Plus, Minus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProductDetailsClient({ product }: { product: any }) {
    const { addToCart, wishlist, toggleWishlist } = useCart();
    const [quantity, setQuantity] = useState(1);
    const router = useRouter();

    const handleBuyNow = () => {
        addToCart({ ...product, quantity });
        router.push('/checkout');
    };

    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/shop" className="inline-flex items-center gap-2 text-stone-500 hover:text-emerald-700 font-bold mb-8 transition">
                    <ArrowLeft size={20} /> কেনাকাটা চালিয়ে যান
                </Link>

                <div className="bg-white rounded-[40px] shadow-sm border border-stone-200 overflow-hidden">
                    <div className="flex flex-col lg:flex-row">

                        {/* Image Section */}
                        <div className="lg:w-1/2 p-8 lg:p-12 bg-stone-50">
                            <div className="aspect-square rounded-[32px] overflow-hidden bg-white shadow-inner flex items-center justify-center">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col">
                            <div className="mb-auto">
                                <span className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-3 block">{product.category}</span>
                                <h1 className="text-3xl lg:text-5xl font-black text-stone-950 mb-6 leading-tight">{product.name}</h1>

                                <div className="flex items-center gap-6 mb-8">
                                    <span className="text-4xl font-black text-emerald-800">৳ {product.price}</span>
                                    <div className="h-10 w-px bg-stone-200" />
                                    <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        স্টক আছে ({product.stock} {product.unit || 'টি'})
                                    </div>
                                </div>

                                <p className="text-stone-600 text-lg leading-relaxed mb-10">
                                    {product.description || 'এই প্রিমিয়াম পণ্যটি আপনার রমজানের প্রতিটি মুহূর্তকে করবে আরও আনন্দদায়ক এবং অর্থবহ।'}
                                </p>

                                {/* Quantity & Actions */}
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <div className="flex items-center bg-stone-100 p-2 rounded-2xl border border-stone-200">
                                        <button
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white transition shadow-sm text-stone-600"
                                        >
                                            <Minus size={20} />
                                        </button>
                                        <span className="w-12 text-center font-black text-xl text-stone-800">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(q => q + 1)}
                                            className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white transition shadow-sm text-stone-600"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => toggleWishlist(product.id)}
                                        className={`w-16 h-16 flex items-center justify-center rounded-2xl border-2 transition-all ${wishlist.includes(product.id)
                                            ? 'bg-rose-50 border-rose-200 text-rose-500'
                                            : 'border-stone-200 text-stone-400 hover:border-rose-300 hover:text-rose-400'
                                            }`}
                                    >
                                        <Heart size={28} fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
                                <button
                                    onClick={() => addToCart({ ...product, quantity })}
                                    className="flex items-center justify-center gap-3 bg-white border-4 border-emerald-900 text-emerald-900 py-5 rounded-[24px] font-black text-lg hover:bg-emerald-50 transition-all shadow-xl shadow-emerald-900/5 group"
                                >
                                    <ShoppingCart size={24} className="group-hover:-translate-y-1 transition-transform" /> কার্টে যোগ করুন
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="flex items-center justify-center gap-3 bg-emerald-900 text-white py-5 rounded-[24px] font-black text-lg hover:bg-emerald-950 transition-all shadow-xl shadow-emerald-900/20 group"
                                >
                                    <ShoppingBag size={24} className="group-hover:-translate-y-1 transition-transform" /> এখনই কিনুন
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* trust badges */}
                <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: '১০০% ভেজালমুক্ত', icon: '✅' },
                        { title: 'দ্রুত ডেলিভারি', icon: '🚚' },
                        { title: 'সহজ রিটার্ন', icon: '🔄' },
                        { title: '২৪/৭ কাস্টমার সাপোর্ট', icon: '📞' }
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-stone-200 text-center flex items-center gap-4 justify-center">
                            <span className="text-2xl">{item.icon}</span>
                            <span className="font-bold text-stone-800 text-sm">{item.title}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
