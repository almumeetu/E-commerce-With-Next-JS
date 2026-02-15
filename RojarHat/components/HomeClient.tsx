'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Clock, Calendar, Moon, Sun, MapPin, Star, ShoppingBag, Gift, Truck, Globe, Languages, Menu, X } from 'lucide-react';
import ProductCard from './ProductCard';
import CountdownTimer from './CountdownTimer';
import TestimonialSlider from './TestimonialSlider';
import QuickViewModal from './QuickViewModal';
import { Product, Category } from '@/types';
import { useCart } from '@/src/context/CartContext';

interface HomeClientProps {
    initialProducts: Product[];
    initialCategories: Category[];
}

interface IftarTime {
    sehri: string;
    iftar: string;
    date: string;
}

export default function HomeClient({ initialProducts, initialCategories }: HomeClientProps) {
    const { addToCart, wishlist, toggleWishlist } = useCart();
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [iftarTimes, setIftarTimes] = useState<IftarTime[]>([]);
    const [currentIftar, setCurrentIftar] = useState<IftarTime | null>(null);
    const [timeUntilIftar, setTimeUntilIftar] = useState<string>('');
    const [language, setLanguage] = useState<'bn' | 'en'>('bn');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Generate Ramadan Iftar times for Dhaka
    useEffect(() => {
        const generateIftarTimes = () => {
            const times: IftarTime[] = [];
            const today = new Date();
            
            for (let i = 0; i < 30; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                
                // Approximate Ramadan times for Dhaka (these should be updated with actual times)
                const dayOfMonth = date.getDate();
                const sehriTime = `${4 + Math.floor(dayOfMonth / 10)}:${String(30 + (dayOfMonth % 10)).padStart(2, '0')} AM`;
                const iftarTime = `${6 + Math.floor(dayOfMonth / 10)}:${String(15 + (dayOfMonth % 10)).padStart(2, '0')} PM`;
                
                times.push({
                    sehri: sehriTime,
                    iftar: iftarTime,
                    date: date.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long' })
                });
            }
            
            return times;
        };

        const times = generateIftarTimes();
        setIftarTimes(times);
        setCurrentIftar(times[0]);
    }, []);

    // Update countdown timer
    useEffect(() => {
        if (!currentIftar) return;

        const updateCountdown = () => {
            const now = new Date();
            const [hours, minutes] = currentIftar.iftar.split(' ');
            const [hour, minute] = hours.split(':').map(Number);
            const period = minutes;
            
            const iftarDate = new Date();
            iftarDate.setHours(period === 'PM' && hour < 12 ? hour + 12 : hour);
            iftarDate.setMinutes(minute);
            iftarDate.setSeconds(0);
            
            if (iftarDate <= now) {
                // Move to next day's iftar
                const nextDay = new Date(now);
                nextDay.setDate(now.getDate() + 1);
                const nextIftar = iftarTimes.find(t => {
                    const tDate = new Date(t.date);
                    return tDate.getDate() === nextDay.getDate();
                });
                if (nextIftar) {
                    setCurrentIftar(nextIftar);
                }
                return;
            }
            
            const diff = iftarDate.getTime() - now.getTime();
            const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
            const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);
            
            setTimeUntilIftar(`${hoursLeft}ঘ ${minutesLeft}ম ${secondsLeft}স`);
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        
        return () => clearInterval(interval);
    }, [currentIftar, iftarTimes]);

    let featuredProducts = initialProducts.filter(p => p.isPopular).slice(0, 4);
    if (featuredProducts.length === 0 && initialProducts.length > 0) {
        featuredProducts = initialProducts.slice(0, 4);
    }

    let newArrivals = initialProducts.filter(p => (p as any).isNew).slice(0, 4);
    if (newArrivals.length === 0 && initialProducts.length > 0) {
        newArrivals = initialProducts.slice(0, 4);
    }

    const offers = [
        '🕌 ১০০% হালাল এবং প্রমাণিত পণ্য',
        '🚚 ঢাকায় ২৪ ঘন্টার মধ্যে ডেলিভারি',
        '💰 ৳৫০০ এর উপর বিনামূল্যে ডেলিভারি',
        ' সকল পণ্যে সন্তুষ্টির নিশ্চয়তা',
        '📦 নিরাপদ এবং হাইজেনিক প্যাকেজিং',
        '🏪 স্থানীয় এবং আন্তর্জাতিক ব্র্যান্ড',
        '⭐ বিশ্বস্ত গ্রাহক সেবা ২৪/৭'
    ];

    const translations = {
        bn: {
            heroTitle: "রমজানের",
            heroSubtitle: "ইফতার প্রস্তুতি",
            heroDescription: "মুসলমানদের জন্য বিশেষ ইফতার প্যাকেজ - সেরা খেজুর, ইফতার সামগ্রী এবং রমজানের প্রয়োজনীয় সবকিছু এক স্থানে",
            ramadanMubarak: "রমজান মোবারক",
            todaysIftar: "আজকের ইফতার",
            iftarTime: "ইফতারের সময়",
            untilIftar: "ইফতারের অপেক্ষায়",
            schedule: "সময়সূচী",
            sehriAndIftar: "সেহরি ও ইফতারের সঠিক সময়",
            fastDelivery: "দ্রুত ডেলিভারি",
            beforeIftar: "ইফতারের আগেই পৌঁছে যাবে",
            qualityProducts: "মানের পণ্য",
            halalCertified: "১০০% হালাল ও প্রমাণিত",
            nationwideDelivery: "সর্বত্র ডেলিভারি",
            allBangladesh: "সারা বাংলাদেশে পৌঁছে দেই",
            iftarPackage: "ইফতার প্যাকেজ দেখুন",
            datesCollection: "খেজুর কালেকশন",
            categories: "ক্যাটাগরি সমূহ",
            yourNeeds: "আপনার প্রয়োজনীয় সবকিছু এক স্থানে",
            popularProducts: "জনপ্রিয় পণ্য",
            mostSold: "সবচেয়ে বেশি বিক্রি হওয়া পণ্যসমূহ",
            newArrivals: "নতুন আসা",
            recentlyAdded: "সম্প্রতি যোগ হওয়া নতুন পণ্য",
            seeAll: "সবগুলো দেখুন"
        },
        en: {
            heroTitle: "Ramadan",
            heroSubtitle: "Iftar Preparation",
            heroDescription: "Special Iftar packages for Muslims - Premium dates, Iftar items and all Ramadan essentials in one place",
            ramadanMubarak: "Ramadan Mubarak",
            todaysIftar: "Today's Iftar",
            iftarTime: "Iftar Time",
            untilIftar: "Until Iftar",
            schedule: "Schedule",
            sehriAndIftar: "Accurate Sehri & Iftar Times",
            fastDelivery: "Fast Delivery",
            beforeIftar: "Delivered before Iftar",
            qualityProducts: "Quality Products",
            halalCertified: "100% Halal & Certified",
            nationwideDelivery: "Nationwide Delivery",
            allBangladesh: "Delivered all over Bangladesh",
            iftarPackage: "View Iftar Packages",
            datesCollection: "Dates Collection",
            categories: "Categories",
            yourNeeds: "Everything you need in one place",
            popularProducts: "Popular Products",
            mostSold: "Most sold products",
            newArrivals: "New Arrivals",
            recentlyAdded: "Recently added new products",
            seeAll: "See All"
        }
    };

    const t = translations[language];

    return (
        <div className="animate-fade-in bg-gray-50 overflow-x-hidden">
            {/* Navigation Bar with Language Toggle */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">RM</span>
                                </div>
                                <span className="font-bold text-xl text-gray-900">RojarHat</span>
                            </Link>
                            
                            <div className="hidden md:flex items-center gap-6">
                                <Link href="/shop" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                                    {language === 'bn' ? 'দোকান' : 'Shop'}
                                </Link>
                                <Link href="/about" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                                    {language === 'bn' ? 'আমাদের সম্পর্কে' : 'About'}
                                </Link>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {/* Language Toggle */}
                            <button
                                onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <Globe className="w-4 h-4" />
                                <span className="text-sm font-medium">{language.toUpperCase()}</span>
                            </button>
                            
                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Ramadan Hero Section */}
            <div className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 text-white overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-700/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl"></div>
                
                {/* Islamic Pattern Overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className="h-full w-full" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 bg-amber-600/20 px-4 py-2 rounded-full border border-amber-600/30">
                                    <Moon className="w-5 h-5 text-amber-400" />
                                    <span className="text-amber-400 font-bold">{t.ramadanMubarak}</span>
                                </div>
                                
                                <h1 className="text-4xl lg:text-6xl font-black leading-tight" style={{ fontFamily: 'Hind Siliguri, Arial, sans-serif' }}>
                                    {t.heroTitle}
                                    <span className="block text-amber-400">{t.heroSubtitle}</span>
                                </h1>
                                
                                <p className="text-xl text-emerald-100 leading-relaxed" style={{ fontFamily: 'Hind Siliguri, Arial, sans-serif' }}>
                                    {t.heroDescription}
                                </p>
                            </div>

                            {/* Iftar Countdown */}
                            {currentIftar && (
                                <div className="bg-emerald-800/50 backdrop-blur-sm rounded-2xl p-6 border border-emerald-700/50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Clock className="w-6 h-6 text-amber-400" />
                                        <div>
                                            <h3 className="text-lg font-bold text-amber-400">{t.todaysIftar}</h3>
                                            <p className="text-emerald-200">{currentIftar.date}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="text-center mb-4">
                                        <div className="text-3xl font-black text-amber-400" style={{ fontFamily: 'monospace' }}>
                                            {currentIftar.iftar}
                                        </div>
                                        <div className="text-sm text-emerald-200">{t.iftarTime}</div>
                                    </div>
                                    
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white" style={{ fontFamily: 'monospace' }}>
                                            {timeUntilIftar}
                                        </div>
                                        <div className="text-sm text-emerald-200">{t.untilIftar}</div>
                                    </div>
                                </div>
                            )}

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/shop?category=iftar"
                                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-600/25"
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                    {t.iftarPackage}
                                </Link>
                                <Link
                                    href="/shop?category=dates"
                                    className="bg-emerald-700 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 border border-emerald-600"
                                >
                                    <Gift className="w-5 h-5" />
                                    {t.datesCollection}
                                </Link>
                            </div>
                        </div>

                        {/* Right Content - Ramadan Features */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-emerald-800/30 backdrop-blur-sm rounded-xl p-6 border border-emerald-700/30">
                                <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center mb-4">
                                    <Calendar className="w-6 h-6 text-amber-400" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{t.schedule}</h3>
                                <p className="text-emerald-200 text-sm">{t.sehriAndIftar}</p>
                            </div>
                            
                            <div className="bg-emerald-800/30 backdrop-blur-sm rounded-xl p-6 border border-emerald-700/30">
                                <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center mb-4">
                                    <Truck className="w-6 h-6 text-amber-400" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{t.fastDelivery}</h3>
                                <p className="text-emerald-200 text-sm">{t.beforeIftar}</p>
                            </div>
                            
                            <div className="bg-emerald-800/30 backdrop-blur-sm rounded-xl p-6 border border-emerald-700/30">
                                <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center mb-4">
                                    <Star className="w-6 h-6 text-amber-400" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{t.qualityProducts}</h3>
                                <p className="text-emerald-200 text-sm">{t.halalCertified}</p>
                            </div>
                            
                            <div className="bg-emerald-800/30 backdrop-blur-sm rounded-xl p-6 border border-emerald-700/30">
                                <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center mb-4">
                                    <MapPin className="w-6 h-6 text-amber-400" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{t.nationwideDelivery}</h3>
                                <p className="text-emerald-200 text-sm">{t.allBangladesh}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Marquee Notification Banner */}
            <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white py-1.5 sm:py-2 overflow-hidden border-b border-emerald-600 shadow-md">
                <div className="flex gap-4 whitespace-nowrap" style={{
                    animation: 'scroll 20s linear infinite',
                }}>
                    {[...offers, ...offers, ...offers].map((offer, idx) => (
                        <span key={idx} className="px-5 sm:px-6 text-xs sm:text-sm font-medium inline-block flex-shrink-0" style={{ fontFamily: 'Hind Siliguri, Arial, sans-serif' }}>
                            {offer}
                        </span>
                    ))}
                </div>
            </div>

            {/* Rest of the existing content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Categories */}
                <div className="mb-16">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Hind Siliguri, Arial, sans-serif' }}>{t.categories}</h2>
                        <p className="text-gray-600">{t.yourNeeds}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {initialCategories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/shop?category=${category.name}`}
                                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 group"
                            >
                                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                                    {category.icon}
                                </div>
                                <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300" style={{ fontFamily: 'Hind Siliguri, Arial, sans-serif' }}>
                                    {category.name}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Featured Products */}
                <div className="mb-16">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Hind Siliguri, Arial, sans-serif' }}>{t.popularProducts}</h2>
                            <p className="text-gray-600">{t.mostSold}</p>
                        </div>
                        <Link
                            href="/shop"
                            className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 transition-colors duration-300"
                        >
                            {t.seeAll}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={addToCart}
                                isInWishlist={wishlist.includes(product.id)}
                                onToggleWishlist={toggleWishlist}
                                onQuickView={setQuickViewProduct}
                            />
                        ))}
                    </div>
                </div>

                {/* New Arrivals */}
                <div className="mb-16">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Hind Siliguri, Arial, sans-serif' }}>{t.newArrivals}</h2>
                            <p className="text-gray-600">{t.recentlyAdded}</p>
                        </div>
                        <Link
                            href="/shop"
                            className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 transition-colors duration-300"
                        >
                            {t.seeAll}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {newArrivals.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={addToCart}
                                isInWishlist={wishlist.includes(product.id)}
                                onToggleWishlist={toggleWishlist}
                                onQuickView={setQuickViewProduct}
                            />
                        ))}
                    </div>
                </div>

                {/* Testimonials */}
                <TestimonialSlider />
            </div>
            {/* Quick View Modal */}
            {quickViewProduct && (
                <QuickViewModal
                    product={quickViewProduct}
                    isOpen={!!quickViewProduct}
                    onClose={() => setQuickViewProduct(null)}
                    onAddToCart={addToCart}
                />
            )}

            <style jsx>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
            `}</style>
        </div>
    );
}
