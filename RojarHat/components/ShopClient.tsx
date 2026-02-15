'use client';

import { useState, useMemo } from 'react';
import { Product, Category } from '@/types';
import ProductCard from './ProductCard';
import { useCart } from '@/src/context/CartContext';
import { Search, Filter, X } from 'lucide-react';

export default function ShopClient({ initialProducts, categories, initialCategory, initialSearch }: { initialProducts: Product[], categories: Category[], initialCategory?: string, initialSearch?: string }) {
    const { addToCart, wishlist, toggleWishlist } = useCart();
    const [searchTerm, setSearchTerm] = useState(initialSearch || '');
    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
    const [priceRange, setPriceRange] = useState<{min: number, max: number}>({ min: 0, max: 10000 });
    const [showFilters, setShowFilters] = useState(false);

    // Calculate max price from products for default range logic if needed, 
    // but for now we default max to 10000 or allow user to change it.
    const maxProductPrice = useMemo(() => {
        if (initialProducts.length === 0) return 10000;
        const max = Math.max(...initialProducts.map(p => p.price));
        return Math.ceil(max / 500) * 500; // Round up to nearest 500
    }, [initialProducts]);

    const filteredProducts = initialProducts.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesPrice = p.price >= priceRange.min && p.price <= priceRange.max;
        return matchesSearch && matchesCategory && matchesPrice;
    });

    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-emerald-950 mb-2">আমাদের সংগ্রহশালা</h1>
                        <p className="text-stone-500">সেরা মানের পণ্য, আপনার জন্য</p>
                    </div>
                    
                    <button 
                        className="lg:hidden flex items-center justify-center gap-2 bg-white px-4 py-3 rounded-xl border border-stone-200 shadow-sm font-bold text-stone-700"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter size={18} /> ফিল্টার ও ক্যাটাগরি
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Sidebar Filters */}
                    <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm sticky top-24">
                            <div className="flex justify-between items-center mb-6 lg:hidden">
                                <h3 className="font-bold text-lg">ফিল্টার</h3>
                                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-stone-100 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Search */}
                            <div className="mb-8">
                                <label className="block text-sm font-bold text-stone-700 mb-2">অনুসন্ধান</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="পণ্য খুঁজুন..."
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="mb-8">
                                <label className="block text-sm font-bold text-stone-700 mb-3">ক্যাটাগরি</label>
                                <div className="space-y-1">
                                    <button
                                        onClick={() => setSelectedCategory('all')}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                                            selectedCategory === 'all' 
                                            ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-100' 
                                            : 'text-stone-600 hover:bg-stone-50 border border-transparent'
                                        }`}
                                    >
                                        <span className="text-lg">🛍️</span> সব পণ্য
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                                                selectedCategory === cat.id 
                                                ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-100' 
                                                : 'text-stone-600 hover:bg-stone-50 border border-transparent'
                                            }`}
                                        >
                                            <span className="text-lg">{cat.icon}</span> {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-sm font-bold text-stone-700">মূল্য পরিসীমা</label>
                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                                        ৳{priceRange.min} - ৳{priceRange.max}
                                    </span>
                                </div>
                                
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="10000" 
                                    step="100"
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                                    className="w-full accent-emerald-600 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex items-center gap-2 mt-4">
                                    <div className="relative w-full">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs">৳</span>
                                        <input 
                                            type="number" 
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
                                            className="w-full pl-6 pr-2 py-2 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-emerald-500"
                                            placeholder="Min"
                                        />
                                    </div>
                                    <span className="text-stone-400">-</span>
                                    <div className="relative w-full">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs">৳</span>
                                        <input 
                                            type="number" 
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                                            className="w-full pl-6 pr-2 py-2 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-emerald-500"
                                            placeholder="Max"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="lg:w-3/4">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                {filteredProducts.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onAddToCart={addToCart}
                                        isInWishlist={wishlist.includes(product.id)}
                                        onToggleWishlist={toggleWishlist}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-[40px] border border-stone-200">
                                <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
                                    <Search size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-stone-800 mb-2">দুঃখিত, কোনো পণ্য পাওয়া যায়নি</h3>
                                <p className="text-stone-500">আপনার ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন</p>
                                <button 
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory('all');
                                        setPriceRange({ min: 0, max: 10000 });
                                    }}
                                    className="mt-6 text-emerald-600 font-bold hover:underline"
                                >
                                    সব ফিল্টার রিসেট করুন
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
