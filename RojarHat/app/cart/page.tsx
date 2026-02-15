'use client';

import { useCart } from '@/src/context/CartContext';
import Link from 'next/link';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ArrowRight } from 'lucide-react';

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-stone-50 flex items-center justify-center">
                <div className="text-center bg-white p-12 md:p-20 rounded-[48px] border border-stone-200 shadow-xl max-w-lg mx-4">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <ShoppingBag size={48} className="text-emerald-700" />
                    </div>
                    <h1 className="text-3xl font-black text-emerald-950 mb-4">আপনার ব্যাগ খালি</h1>
                    <p className="text-stone-500 mb-10 leading-relaxed">
                        দেখে মনে হচ্ছে আপনি এখনও কোনো পণ্য যোগ করেননি। চলুন কিছু কেনাকাটা করি!
                    </p>
                    <Link href="/shop" className="inline-flex items-center gap-2 bg-emerald-900 text-white px-10 py-5 rounded-2xl font-black hover:bg-emerald-950 transition-all shadow-xl shadow-emerald-900/20 group">
                        কেনাকাটা শুরু করুন <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        );
    }

    const deliveryCharge = 60;

    return (
        <div className="min-h-screen pt-32 pb-20 bg-stone-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Cart Items List */}
                    <div className="lg:w-2/3 space-y-8">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-4xl font-black text-emerald-950">আপনার ব্যাগ</h1>
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">{cart.length} টি পণ্য</span>
                        </div>

                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="bg-white p-6 rounded-[32px] border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center gap-6 hover:shadow-md transition-shadow">
                                    <div className="w-32 h-32 rounded-2xl overflow-hidden bg-stone-50 border border-stone-100 shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>

                                    <div className="flex-grow text-center sm:text-left">
                                        <h3 className="text-xl font-bold text-stone-900 mb-2">{item.name}</h3>
                                        <p className="text-emerald-700 font-black text-lg mb-4">৳ {item.price}</p>

                                        <div className="flex items-center justify-center sm:justify-start gap-4">
                                            <div className="flex items-center bg-stone-50 p-1.5 rounded-xl border border-stone-200">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white text-stone-600 transition disabled:opacity-30" disabled={item.quantity <= 1}>
                                                    <Minus size={18} />
                                                </button>
                                                <span className="w-10 text-center font-black text-stone-800">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white text-stone-600 transition">
                                                    <Plus size={18} />
                                                </button>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition">
                                                <Trash2 size={24} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">মোট</p>
                                        <p className="text-2xl font-black text-emerald-900">৳ {item.price * item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link href="/shop" className="inline-flex items-center gap-2 text-stone-500 hover:text-emerald-700 font-bold transition">
                            <ArrowLeft size={20} /> কেনাকাটা চালিয়ে যান
                        </Link>
                    </div>

                    {/* Pricing Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-emerald-950 text-white rounded-[40px] p-10 shadow-2xl sticky top-32">
                            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                অর্ডার সামারি
                                <div className="h-px flex-grow bg-white/20" />
                            </h3>

                            <div className="space-y-6 mb-10">
                                <div className="flex justify-between items-center text-emerald-200">
                                    <span className="text-lg">সাবটোটাল</span>
                                    <span className="text-xl font-bold text-white">৳ {cartTotal}</span>
                                </div>
                                <div className="flex justify-between items-center text-emerald-200">
                                    <span className="text-lg">ডেলিভারি চার্জ</span>
                                    <span className="text-xl font-bold text-white">৳ {deliveryCharge}</span>
                                </div>
                                <div className="h-px bg-white/10" />
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-xl font-bold">মোট পরিমাণ</span>
                                    <span className="text-4xl font-black text-gold-400">৳ {cartTotal + deliveryCharge}</span>
                                </div>
                            </div>

                            <Link href="/checkout" className="block w-full bg-gold-500 text-emerald-950 text-center py-5 rounded-2xl font-black text-lg hover:bg-gold-400 transition-all shadow-xl shadow-gold-500/10 group">
                                চেকআউট-এ চলুন <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <p className="text-center text-xs text-emerald-400 mt-6 font-medium">
                                নিরাপদ এবং নিশ্চিন্তে কেনাকাটা করুন রোজারহাট-এ। পেমেন্ট গেটওয়েতে সকল কার্ড এবং মোবাইল ব্যাংকিং গ্রহণযোগ্য।
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
