import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import { categories } from '../constants';
import { ShoppingBag } from 'lucide-react';

interface DealOfTheDayProps {
    product: Product;
    buyNow: (productId: string, quantity: number) => void;
    navigateToShop: (categoryId: string) => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-5 h-5 ${i < Math.round(rating) ? 'text-amber-400' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            ))}
        </div>
    );
};


const CountdownTimer = () => {
    const calculateTimeLeft = () => {
        const now = new Date();
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);
        const difference = +endOfDay - +now;

        let timeLeft: { [key: string]: number } = { ঘন্টা: 0, মিনিট: 0, সেকেন্ড: 0 };
        if (difference > 0) {
            timeLeft = {
                ঘন্টা: Math.floor((difference / (1000 * 60 * 60)) % 24),
                মিনিট: Math.floor((difference / 1000 / 60) % 60),
                সেকেন্ড: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    return (
        <div className="flex space-x-3 sm:space-x-4 text-center">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="bg-white text-brand-green-deep p-4 rounded-2xl shadow-xl w-24 border border-brand-yellow/30 flex flex-col items-center justify-center">
                    <div className="text-2xl sm:text-3xl font-black tabular-nums leading-none mb-1">{String(value).padStart(2, '0')}</div>
                    <div className="text-[10px] sm:text-xs uppercase font-black text-brand-green tracking-widest">{unit}</div>
                </div>
            ))}
        </div>
    );
};

export const DealOfTheDay: React.FC<DealOfTheDayProps> = ({ product, buyNow, navigateToShop }) => {
    const islamicItemCategory = categories.find(cat => cat.id === 'islamic-item');
    const dealImageUrl = islamicItemCategory?.imageUrl || product.imageUrl;

    return (
        <section className="bg-brand-green-deep py-20 relative overflow-hidden">
            {/* Decorative backgrounds */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-premium-gradient opacity-20 skew-x-12 translate-x-1/4"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl"></div>

            <div className="w-full mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="w-full h-96 lg:h-[500px] rounded-[3rem] overflow-hidden group shadow-2xl border-4 border-white/10">
                        <img src={dealImageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    </div>

                    <div className="space-y-8">
                        <div>
                            <span className="bg-brand-yellow text-brand-green-deep px-4 py-1 rounded-full text-xs font-black tracking-[0.2em] uppercase mb-4 inline-block shadow-lg">Limited Offer</span>
                            <h2 className="text-4xl font-black text-white sm:text-5xl md:text-6xl tracking-tight leading-tight">ডিল অফ দ্য ডে</h2>
                            <p className="mt-4 text-brand-yellow/80 font-medium text-lg">এই বিশেষ অফারটি দ্রুত ফুরিয়ে আসছে, এখনই সংগ্রহ করুন!</p>
                        </div>

                        <div className="bg-black/20 backdrop-blur-md p-8 rounded-[2rem] border border-white/5 inline-block">
                            <CountdownTimer />
                        </div>

                        <div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-snug">{product.name}</h3>
                            <div className="flex items-center gap-4">
                                <StarRating rating={product.rating} />
                                <span className="text-sm text-white/50 font-medium">({product.reviewCount} কাস্টমার রিভিউ)</span>
                            </div>
                        </div>

                        <div className="flex items-baseline gap-6">
                            <span className="text-5xl sm:text-6xl font-black text-brand-yellow drop-shadow-lg">৳{product.price.toLocaleString('bn-BD')}</span>
                            {product.originalPrice && (
                                <span className="text-2xl text-white/30 line-through font-medium">৳{product.originalPrice.toLocaleString('bn-BD')}</span>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <button
                                onClick={() => buyNow(product.id, 1)}
                                className="w-full sm:w-auto bg-brand-yellow text-brand-green-deep font-black py-4 px-12 rounded-2xl hover:bg-brand-yellow-vibrant transition-all duration-300 transform hover:scale-105 text-xl shadow-[0_20px_40px_-10px_rgba(251,191,36,0.4)] active:scale-95 flex items-center justify-center gap-3"
                            >
                                <ShoppingBag className="w-6 h-6" />
                                এখনই কিনুন
                            </button>
                            <button
                                onClick={() => navigateToShop(product.category)}
                                className="w-full sm:w-auto text-white/70 hover:text-white font-bold transition-colors uppercase tracking-widest text-sm flex items-center gap-2 group"
                            >
                                আরো দেখুন
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};