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
import type { Page } from '../types';
import type { Product, Category } from '../types';
import { useSiteContent } from '../context/SiteContentContext';

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



export const HomePage: React.FC<HomePageProps> = ({ products, categories = [], navigateTo, navigateToShop, onProductSelect, wishlist, toggleWishlist, addToCart, buyNow, onQuickView }) => {
    const { content } = useSiteContent();
    const hotDeals = products.filter(p => p.originalPrice).sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4);
    const newArrivals = [...products].sort((a, b) => (a.id > b.id ? -1 : 1)).slice(0, 8);
    
    // Find deal product based on content context, fallback to first product with discount
    const dealProduct = products.find(p => p.id === content.dealOfTheDay.productId) || 
                       products.find(p => p.originalPrice && p.price < p.originalPrice) || 
                       products[0];

    return (
        <div className="space-y-16 sm:space-y-20 md:space-y-24 lg:space-y-32 xl:space-y-40 pb-16 sm:pb-20 lg:pb-24 bg-brand-cream main-content-mobile">
            <HeroGallery navigateTo={navigateTo} />

            <DiscountMarquee />

            <div className="max-w-8xl mx-auto responsive-padding-x">
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

            <section className="w-full max-w-8xl mx-auto responsive-padding-x">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-green-deep tracking-tight">হট ডিল</h2>
                        <div className="h-1 w-16 sm:w-20 bg-brand-yellow mt-2 rounded-full"></div>
                    </div>
                    <button onClick={() => navigateTo('hotDeals')} className="group flex items-center gap-2 text-sm font-black text-brand-green hover:text-brand-green-deep transition-colors uppercase tracking-widest active:scale-95">
                        সব দেখুন
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </button>
                </div>
                <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] shadow-2xl border border-slate-100">
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

            <div className="max-w-5xl mx-auto responsive-padding-x">
                <div className="bg-brand-green-deep p-6 sm:p-8 md:p-12 lg:p-16 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-brand-yellow opacity-10 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <OrderTrackingWidget />
                    </div>
                </div>
            </div>

            <ReviewsSection />

        </div>
    );
};