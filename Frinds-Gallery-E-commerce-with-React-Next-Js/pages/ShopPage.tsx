import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductsGrid } from '../components/ProductsGrid';
import { SidebarFilters } from '../components/SidebarFilters';
import { Breadcrumbs } from '../components/Breadcrumbs';
import type { Product, Category } from '../types';
import type { Page } from '../App';

interface ShopPageProps {
    products: Product[];
    categories: Category[];
    initialCategory?: string;
    onProductSelect: (product: Product) => void;
    addToCart: (productId: string, quantity: number) => void;
    buyNow: (productId: string, quantity: number) => void;
    wishlist: string[];
    toggleWishlist: (productId: string) => void;
    onQuickView: (product: Product) => void;
    navigateTo: (page: Page) => void;
    navigateToShop: (categoryId?: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ products, categories, initialCategory, onProductSelect, addToCart, buyNow, wishlist, toggleWishlist, onQuickView, navigateTo, navigateToShop }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    // Default to 'all' if no category param, or fallback to initialCategory if provided (though URL should take precedence)
    const selectedCategory = searchParams.get('category') || initialCategory || 'all';

    const setSelectedCategory = (category: string) => {
        setSearchParams({ category });
    };

    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const [availability, setAvailability] = useState('all'); // 'all', 'inStock', 'outOfStock'
    const [sortOrder, setSortOrder] = useState('default');

    const filteredProducts = products
        .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
        .filter(p => p.price >= priceRange.min && p.price <= priceRange.max)
        .filter(p => {
            if (availability === 'inStock') return p.stock > 0;
            if (availability === 'outOfStock') return p.stock === 0;
            return true;
        })
        .sort((a, b) => {
            if (sortOrder === 'price-asc') return a.price - b.price;
            if (sortOrder === 'price-desc') return b.price - a.price;
            if (sortOrder === 'rating') return b.rating - a.rating;
            return 0; // default order
        });

    const currentCategoryName = categories.find(c => c.id === selectedCategory)?.name || 'সকল পণ্য';

    return (
        <div className="bg-brand-cream">
            <div className="w-full mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 py-8">
                <Breadcrumbs items={[{ label: 'হোম', onClick: () => navigateTo('home') }, { label: 'শপ', onClick: () => navigateToShop('all') }, { label: currentCategoryName }]} />

                <div className="lg:grid lg:grid-cols-4 lg:gap-8 mt-6">
                    <aside className="hidden lg:block">
                        <SidebarFilters
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}
                            availability={availability}
                            setAvailability={setAvailability}
                            categories={categories}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                        />
                    </aside>

                    <main className="lg:col-span-3">
                        <div className="bg-white p-4 rounded-xl mb-6 border border-slate-200">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <h1 className="text-2xl font-bold text-slate-900">
                                    {currentCategoryName}
                                </h1>
                                <div className="flex items-center gap-3">
                                    <label htmlFor="sort" className="text-sm font-bold text-slate-700 hidden sm:block">সর্ট করুন:</label>
                                    <div className="relative group">
                                        <select
                                            id="sort"
                                            value={sortOrder}
                                            onChange={(e) => setSortOrder(e.target.value)}
                                            className="appearance-none bg-white pl-4 pr-10 py-2.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all cursor-pointer shadow-sm hover:border-slate-300"
                                        >
                                            <option value="default">ডিফল্ট</option>
                                            <option value="rating">জনপ্রিয়তা</option>
                                            <option value="price-asc">মূল্য: কম থেকে বেশি</option>
                                            <option value="price-desc">মূল্য: বেশি থেকে কম</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-brand-green transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Category filter buttons for mobile/tablet */}
                        <div className="pb-4 mb-6 overflow-x-auto lg:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            <div className="flex space-x-2">
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`flex-shrink-0 px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 ${selectedCategory === category.id
                                            ? 'bg-brand-green text-white shadow'
                                            : 'bg-white text-slate-700 hover:bg-green-50 border border-slate-300'
                                            }`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <ProductsGrid products={filteredProducts} onProductSelect={onProductSelect} addToCart={addToCart} buyNow={buyNow} wishlist={wishlist} toggleWishlist={toggleWishlist} onQuickView={onQuickView} />

                        {/* Pagination */}
                        <div className="mt-10 flex justify-center items-center space-x-2">
                            <button className="px-4 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all" disabled>&laquo;</button>
                            <button className="px-4 py-2 text-sm font-medium text-white bg-brand-green border border-brand-green rounded-lg transition-all">1</button>
                            <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all">2</button>
                            <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all">3</button>
                            <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">&raquo;</button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};