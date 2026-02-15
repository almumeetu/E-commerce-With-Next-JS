import React, { useRef, useState, useEffect } from 'react';

interface Brand {
    name: string;
    logoUrl: string;
}

interface BrandLogosProps {
    brands: Brand[];
}

export const BrandLogos: React.FC<BrandLogosProps> = ({ brands }) => {
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
    }, [brands]);

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-black text-brand-green-deep tracking-tight">আমাদের ব্র্যান্ডসমূহ</h2>
                    <div className="h-1.5 w-24 bg-brand-yellow mt-3 rounded-full"></div>
                </div>
            </div>
            <div className="relative p-10 bg-white rounded-[3rem] shadow-2xl border border-slate-100 group/brands">
                <div
                    ref={scrollContainerRef}
                    className="flex items-center overflow-x-auto scroll-smooth space-x-16 py-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {brands.map((brand, index) => (
                        <div key={`${brand.name}-${index}`} className="flex-shrink-0 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 transform hover:scale-110">
                            <img
                                src={brand.logoUrl}
                                alt={brand.name}
                                className="h-12 sm:h-16 object-contain"
                            />
                        </div>
                    ))}
                </div>
                {canScrollLeft && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white text-brand-green-deep rounded-2xl p-4 shadow-2xl z-20 border border-slate-100 hover:bg-brand-yellow transition-all duration-300 transform -translate-x-full group-hover/brands:translate-x-0 opacity-0 group-hover/brands:opacity-100"
                        aria-label="Scroll left"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                )}
                {canScrollRight && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white text-brand-green-deep rounded-2xl p-4 shadow-2xl z-20 border border-slate-100 hover:bg-brand-yellow transition-all duration-300 transform translate-x-full group-hover/brands:translate-x-0 opacity-0 group-hover/brands:opacity-100"
                        aria-label="Scroll right"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                )}
            </div>
        </div>
    );
};