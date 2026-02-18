'use client';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Clock, MapPin, Star, ShoppingBag, Truck, Globe, Languages, Menu, X } from 'lucide-react';
import ProductCard from './ProductCard';
import TestimonialSlider from './TestimonialSlider';
import { QuickViewModal } from './QuickViewModal';
import { Product, Category } from '../types'; // Removed @ alias
import { useCart } from '../src/context/CartContext';

interface HomeClientProps {
    initialProducts: Product[];
    initialCategories: Category[];
}



export default function HomeClient({ initialProducts, initialCategories }: HomeClientProps) {
    const { addToCart, wishlist, toggleWishlist } = useCart();
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [language, setLanguage] = useState<'bn' | 'en'>('bn');
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    const featuredProducts = initialProducts.filter(p => p.isPopular).slice(0, 4);
    const newArrivals = initialProducts.filter(p => (p as any).isNew).slice(0, 4);


    const offers = [
        '✨ ১০০% প্রিমিয়াম ও অরিজিনাল পণ্য',
        '🚚 সারা বাংলাদেশে দ্রুত ডেলিভারি',
        '💰 বিশেষ অফারে সাশ্রয়ী মূল্য',
        '👗 সর্বোচ্চ গুণগত মানের নিশ্চয়তা',
        '📦 নিরাপদ এবং গ্ল্যামারাস প্যাকেজিং',
        '🌟 ফ্যাশনেবল এবং ট্রেন্ডি কালেকশন',
        '⭐ বিশ্বস্ত গ্রাহক সেবা ২৪/৭'
    ];

    const translations = {
        bn: {
            heroTitle: "আধুনিক ও আভিজাত্য",
            heroSubtitle: "ফ্যাশন কালেকশন",
            heroDescription: "ফ্রেন্ডস গ্যালারি নিয়ে এলো সাশ্রয়ী মূল্যে সেরা মানের ফ্যাশন পণ্য। আমাদের প্রিমিয়াম লং খিমার, হিজাব এবং থ্রি-পিস কালেকশন আপনার সৌন্দর্যকে করবে আরও উজ্জ্বল।",
            featured: "বিশেষ কালেকশন",
            exclusiveStyles: "এক্সক্লুসিভ স্টাইল",
            standardQuality: "সেরা মানের পণ্য",
            fastDelivery: "দ্রুত ডেলিভারি",
            allOverBD: "সারাদেশে পৌঁছে দেই",
            qualityProducts: "গুণগত মান",
            trustedShop: "বিশ্বস্ত শপ",
            latestTrends: "লেটেস্ট ট্রেন্ড",
            visitShop: "শপ ভিজিট করুন",
            viewCollection: "কালেকশন দেখুন",
            categories: "ক্যাটাগরি সমূহ",
            yourNeeds: "আপনার পছন্দের সব স্টাইলিশ পণ্য এক স্থানে",
            popularProducts: "জনপ্রিয় পণ্য",
            mostSold: "সেরা বিক্রিত পণ্যসমূহ",
            newArrivals: "নতুন কালেকশন",
            recentlyAdded: "আমাদের গ্যালারিতে নতুন আসা পণ্যসমূহ",
            seeAll: "সবগুলো দেখুন"
        },
        en: {
            heroTitle: "Modern & Elegant",
            heroSubtitle: "Fashion Collection",
            heroDescription: "Friends Gallery brings the best quality fashion products at affordable prices. Our premium long khimar, hijab, and three-piece collections will enhance your beauty.",
            featured: "Featured Collection",
            exclusiveStyles: "Exclusive Styles",
            standardQuality: "Top Quality Products",
            fastDelivery: "Fast Delivery",
            allOverBD: "Nationwide Delivery",
            qualityProducts: "Premium Quality",
            trustedShop: "Trusted Shop",
            latestTrends: "Latest Trends",
            visitShop: "Visit Shop",
            viewCollection: "View Collection",
            categories: "Categories",
            yourNeeds: "All your favorite stylish products in one place",
            popularProducts: "Popular Products",
            mostSold: "Best selling products",
            newArrivals: "New Arrivals",
            recentlyAdded: "Newly added items in our gallery",
            seeAll: "See All"
        }
    };

    const t = translations[language];

    return (
        <div className="animate-fade-in bg-white overflow-x-hidden">
            {/* Navigation Bar with Language Toggle */}
            <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 md:h-20">
                        <div className="flex items-center gap-10">
                            <Link to="/" className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl flex items-center justify-center shadow-lg transform transition hover:scale-105">
                                    <span className="text-white font-bold text-lg">FG</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-black text-xl tracking-tight text-gray-900 leading-none">FRIENDS</span>
                                    <span className="font-bold text-xs tracking-widest text-emerald-600 uppercase">GALLERY</span>
                                </div>
                            </Link>

                            <div className="hidden lg:flex items-center gap-8">
                                <Link to="/shop" className="text-gray-600 hover:text-emerald-600 font-semibold transition-all">
                                    {language === 'bn' ? 'শপ' : 'Shop'}
                                </Link>
                                <Link to="/about" className="text-gray-600 hover:text-emerald-600 font-semibold transition-all">
                                    {language === 'bn' ? 'সম্পর্কে' : 'About'}
                                </Link>
                                <Link to="/contact" className="text-gray-600 hover:text-emerald-600 font-semibold transition-all">
                                    {language === 'bn' ? 'যোগাযোগ' : 'Contact'}
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-5">
                            {/* Language Toggle */}
                            <button
                                onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 transition-all text-gray-700"
                            >
                                <Globe className="w-4 h-4" />
                                <span className="text-xs font-bold tracking-tighter">{language.toUpperCase()}</span>
                            </button>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Premium Hero Section */}
            <div className="relative bg-white overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-32">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[100px] opacity-70"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-rose-50 rounded-full blur-[100px] opacity-70"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        {/* Left Content */}
                        <div className="lg:col-span-7 space-y-10">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-gray-100 shadow-sm transition hover:shadow-md cursor-default">
                                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                                    <span className="text-gray-800 font-bold text-sm tracking-wide">{t.exclusiveStyles}</span>
                                </div>

                                <h1 className="text-5xl lg:text-8xl font-black text-gray-900 leading-tight tracking-tight" style={{ fontFamily: 'Hind Siliguri, Arial, sans-serif' }}>
                                    {t.heroTitle}
                                    <span className="block bg-gradient-to-r from-emerald-600 to-rose-500 bg-clip-text text-transparent">{t.heroSubtitle}</span>
                                </h1>

                                <p className="text-xl text-gray-600 leading-relaxed max-w-xl" style={{ fontFamily: 'Hind Siliguri, Arial, sans-serif' }}>
                                    {t.heroDescription}
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-5">
                                <Link
                                    to="/shop"
                                    className="bg-gray-900 hover:bg-emerald-700 text-white px-10 py-5 rounded-2xl font-black transition-all duration-500 flex items-center justify-center gap-3 shadow-2xl hover:shadow-emerald-500/30 group"
                                >
                                    <ShoppingBag className="w-5 h-5 group-hover:animate-bounce" />
                                    {t.visitShop}
                                </Link>
                                <Link
                                    to="/about"
                                    className="bg-white hover:bg-gray-50 text-gray-900 px-10 py-5 rounded-2xl font-black transition-all duration-300 flex items-center justify-center gap-3 border-2 border-gray-100 group"
                                >
                                    <Star className="w-5 h-5 text-emerald-600 group-hover:rotate-12 transition-transform" />
                                    {t.viewCollection}
                                </Link>
                            </div>

                            {/* Stats/Badges */}
                            <div className="flex flex-wrap gap-10 pt-4 border-t border-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                        <Truck className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 leading-none mb-1">২৪/৭</h4>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{t.fastDelivery}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center">
                                        <Star className="w-6 h-6 text-rose-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 leading-none mb-1">১০০%</h4>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{t.standardQuality}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Visual Showcase */}
                        <div className="lg:col-span-5 relative group">
                            <div className="relative aspect-[4/5] overflow-hidden rounded-[40px] shadow-3xl transform transition duration-700 group-hover:scale-[1.02]">
                                <img
                                    src="/images/products/lehengga-1.webp"
                                    alt="Fashion Showcase"
                                    className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                <div className="absolute bottom-10 left-10 text-white space-y-2">
                                    <div className="bg-rose-500 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest inline-block shadow-lg">New Arrival</div>
                                    <h3 className="text-3xl font-black">Premium Khimar</h3>
                                    <p className="text-white/80 font-bold">Starting from ৳৯৯০</p>
                                </div>
                            </div>

                            {/* Floating Element 1 */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/40 backdrop-blur-xl rounded-full border border-white/50 p-6 shadow-2xl animate-float hidden lg:block">
                                <div className="w-full h-full rounded-full bg-emerald-600 flex flex-col items-center justify-center text-white text-center p-2">
                                    <span className="text-2xl font-black leading-none">৳ ১৫০</span>
                                    <span className="text-[10px] font-bold uppercase tracking-tight">Best Gift</span>
                                </div>
                            </div>

                            {/* Floating Element 2 */}
                            <div className="absolute -bottom-6 -left-12 bg-white backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-gray-100 hidden lg:block animate-slide-up delay-700">
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                                                <img src={`/images/products/lehengga-${i + 1}.webp`} alt="User" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-900 leading-none mb-1">৫০০+ রিভিউস</p>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <Star key={i} className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrolling Notification Banner */}
            <div className="bg-gray-900 py-4 overflow-hidden shadow-xl border-y border-white/5">
                <div className="flex gap-20 whitespace-nowrap" style={{
                    animation: 'scroll 40s linear infinite',
                }}>
                    {[...offers, ...offers].map((offer, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
                            <span className="text-white text-sm font-black tracking-wide" style={{ fontFamily: 'Hind Siliguri, Arial, sans-serif' }}>
                                {offer}
                            </span>
                        </div>
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
                                to={`/shop?category=${category.name}`}
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
                            to="/shop"
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
                            to="/shop"
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

            <style>{`
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
