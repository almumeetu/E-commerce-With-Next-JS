import React from 'react';
import { HeroGallery } from '../components/HeroGallery';
import { DiscountMarquee } from '../components/DiscountMarquee';
import { ProductsGrid } from '../components/ProductsGrid';
import { ProductCarousel } from '../components/ProductCarousel';
import { FeatureCards } from '../components/FeatureCards';
import { TopCategories } from '../components/TopCategories';
import { DealOfTheDay } from '../components/DealOfTheDay';
import { ReviewsSection } from '../components/ReviewsSection';
import { OrderTrackingWidget } from '../components/OrderTrackingWidget';
import type { Page } from '../App';
import type { Product, Category } from '../types';

interface HomePageProps {
    products: Product[];
    categories?: Category[];
    navigateTo: (page: Page) => void;
    navigateToShop: (categoryId: string) => void;
    onProductSelect: (product: Product) => void;
    wishlist: string[];
    toggleWishlist: (productId: string) => void;
    addToCart: (productId: string, quantity: number) => void;
    buyNow: (productId: string, quantity: number) => void;
    onQuickView: (product: Product) => void;
}

const StyleGuide = () => (
    <section className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="relative rounded-[3rem] overflow-hidden h-[450px] group shadow-2xl border-4 border-white">
                <img src="/images/banner/banner-2.webp" alt="Casual Wear" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green-deep/90 via-brand-green-deep/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 text-white p-10 sm:p-12">
                    <span className="bg-brand-yellow text-brand-green-deep px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 inline-block">Trending</span>
                    <h3 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">আরামদায়ক থ্রি-পিস</h3>
                    <p className="text-lg text-white/70 font-medium mb-8">প্রতিদিনের ব্যবহারের জন্য আমাদের সেরা কালেকশন</p>
                    <button className="bg-white text-brand-green-deep font-black px-10 py-4 rounded-2xl text-sm hover:bg-brand-yellow transition-all duration-300 shadow-xl active:scale-95">সংগ্রহ দেখুন</button>
                </div>
            </div>
            <div className="relative rounded-[3rem] overflow-hidden h-[450px] group shadow-2xl border-4 border-white">
                <img src="/images/banner/banner-3.webp" alt="Hijab Collection" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green-deep/90 via-brand-green-deep/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 text-white p-10 sm:p-12">
                    <span className="bg-brand-yellow text-brand-green-deep px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 inline-block">New arrival</span>
                    <h3 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">গর্জিয়াস হিজাব</h3>
                    <p className="text-lg text-white/70 font-medium mb-8">যেকোনো অনুষ্ঠানের জন্য মার্জিত ডিজাইন</p>
                    <button className="bg-white text-brand-green-deep font-black px-10 py-4 rounded-2xl text-sm hover:bg-brand-yellow transition-all duration-300 shadow-xl active:scale-95">সংগ্রহ দেখুন</button>
                </div>
            </div>
        </div>
    </section>
);


export const HomePage: React.FC<HomePageProps> = ({ products, categories = [], navigateTo, navigateToShop, onProductSelect, wishlist, toggleWishlist, addToCart, buyNow, onQuickView }) => {
    const hotDeals = products.filter(p => p.originalPrice).sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4);
    const newArrivals = [...products].sort((a, b) => (a.id > b.id ? -1 : 1)).slice(0, 8);
    const dealProduct = products.find(p => p.id === 'prod_4') || products[3];

    return (
        <div className="space-y-24 md:space-y-40 pb-20 bg-brand-cream">
            <HeroGallery navigateTo={navigateTo} />

            <DiscountMarquee />

            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <FeatureCards />
            </div>

            <ProductCarousel
                title="নতুন কালেকশন"
                products={newArrivals}
                onProductSelect={onProductSelect}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
                addToCart={addToCart}
                buyNow={buyNow}
                onQuickView={onQuickView}
                viewAllLink={() => navigateToShop('all')}
            />

            <TopCategories
                categories={categories}
                navigateToShop={navigateToShop}
            />

            <section className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-green-deep tracking-tight">হট ডিল</h2>
                        <div className="h-1 w-20 bg-brand-yellow mt-2 rounded-full"></div>
                    </div>
                    <button onClick={() => navigateTo('hotDeals')} className="group flex items-center gap-2 text-sm font-black text-brand-green hover:text-brand-green-deep transition-colors uppercase tracking-widest">
                        সব দেখুন
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </button>
                </div>
                <div className="bg-white p-6 sm:p-10 rounded-[3rem] shadow-2xl border border-slate-100">
                    <ProductsGrid
                        products={hotDeals}
                        onProductSelect={onProductSelect}
                        wishlist={wishlist}
                        toggleWishlist={toggleWishlist}
                        addToCart={addToCart}
                        buyNow={buyNow}
                        onQuickView={onQuickView}
                    />
                </div>
            </section>

            {dealProduct && (
                <DealOfTheDay
                    product={dealProduct}
                    buyNow={buyNow}
                    navigateToShop={navigateToShop}
                />
            )}

            <StyleGuide />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 bg-brand-green-deep p-10 sm:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow opacity-10 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                    <OrderTrackingWidget />
                </div>
            </div>

            <ReviewsSection />

        </div>
    );
};