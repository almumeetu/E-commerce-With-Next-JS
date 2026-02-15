'use client';

import { useState } from 'react';
import { useCart } from '@/src/context/CartContext';
import { placeOrder } from '@/src/lib/actions/orders';
import { ShoppingBag, ChevronLeft, CheckCircle, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [orderDetails, setOrderDetails] = useState<any>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            address: formData.get('address'),
        };

        const res = await placeOrder(data, cart, cartTotal + 60);
        setLoading(false);

        if (res.success) {
            setSuccess(true);
            setOrderDetails({ ...data, orderId: (res as any).orderId });
            clearCart();
        } else {
            alert('অর্ডার সফল হয়নি: ' + res.error);
        }
    }

    if (success) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-stone-50 flex items-center justify-center">
                <div className="bg-white p-12 md:p-20 rounded-[60px] border border-stone-200 shadow-2xl max-w-2xl text-center relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-4 bg-emerald-600" />
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-600">
                        <CheckCircle size={48} />
                    </div>
                    <h1 className="text-4xl font-black text-emerald-950 mb-4">অর্ডার সফল হয়েছে!</h1>
                    <p className="text-stone-500 mb-10 text-lg">
                        ধন্যবাদ <strong>{orderDetails?.name}</strong>! আপনার অর্ডারটি আমরা পেয়েছি। আমাদের একজন প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।
                    </p>
                    <div className="bg-stone-50 p-8 rounded-3xl mb-10 text-left border border-stone-100">
                        <div className="flex justify-between mb-2">
                            <span className="text-stone-500 font-bold">অর্ডার আইডি</span>
                            <span className="text-emerald-800 font-black font-mono">#{orderDetails?.orderId?.slice(0, 8)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-stone-500 font-bold">ডেলিভারি ঠিকানা</span>
                            <span className="text-stone-800 font-bold max-w-[200px] text-right">{orderDetails?.address}</span>
                        </div>
                    </div>
                    <Link href="/" className="inline-block bg-emerald-900 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-emerald-950 transition-all shadow-xl shadow-emerald-900/20">
                        হোম পেজে ফিরুন
                    </Link>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center">
                <p className="text-stone-500 font-bold">আপনার ব্যাগ খালি। চেকআউট করা সম্ভব নয়।</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 bg-stone-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col lg:flex-row gap-16">

                    {/* Checkout Form */}
                    <div className="lg:w-3/5">
                        <div className="mb-10">
                            <Link href="/cart" className="flex items-center gap-2 text-stone-400 hover:text-emerald-700 font-bold transition mb-6">
                                <ChevronLeft size={20} /> ব্যাগে ফিরে চলুন
                            </Link>
                            <h1 className="text-4xl lg:text-5xl font-black text-emerald-950 mb-4 tracking-tight">অর্ডার সম্পন্ন করুন</h1>
                            <p className="text-stone-500 text-lg">আপনার সঠিক তথ্য প্রদান করে অর্ডারটি কন্ফার্ম করুন।</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="bg-white p-10 rounded-[40px] border border-stone-200 shadow-sm space-y-6">
                                <h3 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-3">
                                    <Truck size={24} className="text-emerald-700" /> ডেলিভারি তথ্য
                                </h3>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-stone-700 ml-1">আপনার নাম</label>
                                    <input name="name" required placeholder="পুরো নাম লিখুন" className="w-full px-6 py-4 rounded-2xl border border-stone-200 focus:border-emerald-500 outline-none transition-all text-lg" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-stone-700 ml-1">মোবাইল নম্বর</label>
                                    <input name="phone" required placeholder="সঠিক নম্বর দিন যাতে আমরা যোগাযোগ করতে পারি" className="w-full px-6 py-4 rounded-2xl border border-stone-200 focus:border-emerald-500 outline-none transition-all text-lg" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-stone-700 ml-1">ডেলিভারি ঠিকানা</label>
                                    <textarea name="address" required rows={3} placeholder="বাসা নং, রোড নং, এলাকা এবং শহর লিখুন" className="w-full px-6 py-4 rounded-2xl border border-stone-200 focus:border-emerald-500 outline-none transition-all text-lg" />
                                </div>
                            </div>

                            <div className="bg-white p-10 rounded-[40px] border border-stone-200 shadow-sm">
                                <h3 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-3">
                                    <ShieldCheck size={24} className="text-emerald-700" /> পেমেন্ট মেথড
                                </h3>
                                <div className="p-6 rounded-2xl border-2 border-emerald-900 bg-emerald-50 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-6 h-6 rounded-full border-[6px] border-emerald-900 bg-white" />
                                        <span className="font-black text-emerald-950 text-lg">ক্যাশ অন ডেলিভারি</span>
                                    </div>
                                    <span className="bg-emerald-900 text-white text-[10px] font-bold px-3 py-1 rounded-full">সর্বোত্তম পছন্দ</span>
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full bg-emerald-900 text-white py-6 rounded-3xl font-black text-2xl hover:bg-emerald-950 transition-all shadow-2xl shadow-emerald-900/40 disabled:opacity-50 flex items-center justify-center gap-4"
                            >
                                {loading ? 'অর্ডার হচ্ছে...' : 'অর্ডার কন্ফার্ম করুন'}
                            </button>
                        </form>
                    </div>

                    {/* Cart Sidebar */}
                    <div className="lg:w-2/5">
                        <div className="bg-stone-900 text-white p-10 rounded-[48px] shadow-2xl sticky top-32">
                            <h3 className="text-2xl font-bold mb-10 flex items-center gap-3">
                                আপনার অর্ডার
                                <div className="h-px flex-grow bg-white/10" />
                            </h3>

                            <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="text-sm font-bold line-clamp-1">{item.name}</h4>
                                            <p className="text-stone-400 text-xs">পরিমাণ: {item.quantity}</p>
                                        </div>
                                        <span className="font-bold">৳ {item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-10 border-t border-white/10">
                                <div className="flex justify-between items-center text-stone-400">
                                    <span>সাবটোটাল</span>
                                    <span className="font-bold">৳ {cartTotal}</span>
                                </div>
                                <div className="flex justify-between items-center text-stone-400">
                                    <span>ডেলিভারি চার্জ</span>
                                    <span className="font-bold">৳ 60</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 text-2xl border-t border-white/20">
                                    <span className="font-bold">মোট</span>
                                    <span className="font-black text-gold-400">৳ {cartTotal + 60}</span>
                                </div>
                            </div>

                            <div className="mt-12 p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                                <p className="text-xs text-stone-400 leading-relaxed">
                                    অর্ডার কন্ফার্ম করার মাধ্যমে আপনি আমাদের শর্তাবলীর সাথে একমত হচ্ছেন।
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
