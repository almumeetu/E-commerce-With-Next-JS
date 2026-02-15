import React, { useRef, useState, useEffect } from 'react';
import { MobileProductCard } from './MobileProductCard';
import type { Product } from '../types';

interface ProductCarouselProps {
  title: string;
  products: Product[];
  onProductSelect: (product: Product) => void;
  viewAllLink?: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  addToCart: (productId: string, quantity: number) => void;
  buyNow: (productId: string, quantity: number) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({ title, products, onProductSelect, viewAllLink, wishlist, toggleWishlist, addToCart, buyNow, onQuickView }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const timer = setTimeout(() => checkScrollability(), 100);
    container.addEventListener('scroll', checkScrollability);
    window.addEventListener('resize', checkScrollability);

    return () => {
      clearTimeout(timer);
      if (container) {
        container.removeEventListener('scroll', checkScrollability);
      }
      window.removeEventListener('resize', checkScrollability);
    };
  }, [products]);


  return (
    <section className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 px-4 sm:px-6 lg:px-8 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-green-deep tracking-tight">{title}</h2>
          <div className="h-1 w-20 bg-brand-yellow mt-2 rounded-full"></div>
        </div>
        {viewAllLink && (
          <button onClick={viewAllLink} className="group flex items-center gap-2 text-sm font-black text-brand-green hover:text-brand-green-deep transition-colors uppercase tracking-widest">
            সব দেখুন
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
        )}
      </div>
      <div className="relative group/carousel">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth space-x-6 sm:space-x-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product.id} className="snap-start flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[380px]">
              <MobileProductCard
                product={product}
                onProductSelect={onProductSelect}
                addToCart={addToCart}
                buyNow={buyNow}
                isInWishlist={wishlist.includes(product.id)}
                toggleWishlist={toggleWishlist}
                onQuickView={onQuickView}
              />
            </div>
          ))}
        </div>
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white text-brand-green-deep rounded-2xl p-4 shadow-2xl z-20 border border-slate-100 hover:bg-brand-yellow transition-all duration-300 transform -translate-x-full group-hover/carousel:translate-x-0 opacity-0 group-hover/carousel:opacity-100"
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-brand-green-deep rounded-2xl p-4 shadow-2xl z-20 border border-slate-100 hover:bg-brand-yellow transition-all duration-300 transform translate-x-full group-hover/carousel:translate-x-0 opacity-0 group-hover/carousel:opacity-100"
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        )}
      </div>
    </section>
  );
};