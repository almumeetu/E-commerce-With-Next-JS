import React from 'react';
import type { Page } from '../App';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { useSiteContent } from '../context/SiteContentContext';

interface HeroGalleryProps {
    navigateTo: (page: Page) => void;
}

export const HeroGallery: React.FC<HeroGalleryProps> = ({ navigateTo }) => {
    const { content } = useSiteContent();
    const slides = content.heroSlides;

    return (
        <div className="w-full">
            <Swiper
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                spaceBetween={0}
                slidesPerView={1}
                effect={'fade'}
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                className="h-[350px] sm:h-[450px] md:h-[550px] lg:h-[650px] xl:h-[750px] w-full overflow-hidden shadow-2xl"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id} className="relative w-full h-full">
                        <div className="absolute inset-0">
                            <img
                                className="w-full h-full object-cover object-center"
                                src={slide.image}
                                alt="Fashion banner"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-green-deep/80 via-brand-green-deep/30 to-transparent"></div>
                        </div>

                        {/* Decorative floating shapes */}
                        <div className="absolute top-10 right-10 w-32 h-32 bg-brand-yellow/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-brand-green/10 rounded-full blur-3xl"></div>

                        <div className="relative w-full h-full flex items-center justify-start text-left px-4 sm:px-12 md:px-24">
                            <div className="max-w-xl">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-yellow/20 border border-brand-yellow/30 text-brand-yellow font-bold text-xs sm:text-sm uppercase tracking-[0.2em] mb-3 sm:mb-6 animate-fade-in">
                                    <span className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse"></span>
                                    {slide.subtitle}
                                </div>
                                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.2] mb-3 sm:mb-6 drop-shadow-lg">
                                    {slide.title} <span className="text-brand-yellow italic">{slide.titleHighlight}</span>
                                </h1>
                                <p className="max-w-md text-sm sm:text-lg md:text-xl text-white/90 leading-relaxed mb-6 sm:mb-10 font-medium drop-shadow-md line-clamp-2 sm:line-clamp-none">
                                    {slide.description}
                                </p>
                                <div className="flex flex-wrap gap-3 sm:gap-4">
                                    <button
                                        onClick={() => navigateTo(slide.primaryLink as Page || 'shop')}
                                        className="group relative px-5 sm:px-10 py-3 sm:py-5 rounded-xl sm:rounded-2xl bg-brand-yellow text-brand-green-deep font-black text-xs sm:text-lg transition-all transform hover:scale-105 hover:-rotate-1 active:scale-95 shadow-[0_15px_30px_-10px_rgba(251,191,36,0.5)] overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            {slide.primaryBtn}
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </span>
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                    </button>

                                    <button
                                        onClick={() => navigateTo(slide.secondaryLink as Page || 'hotDeals')}
                                        className="px-5 sm:px-10 py-3 sm:py-5 rounded-xl sm:rounded-2xl bg-brand-green-deep text-white border-2 border-brand-yellow/50 font-bold text-xs sm:text-lg hover:bg-brand-green transition-all flex items-center justify-center gap-2 shadow-xl"
                                    >
                                        {slide.secondaryBtn}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}

                {/* Custom CSS for pagination to match theme */}
                <style>{`
                    .swiper-pagination-bullet {
                        background: white;
                        opacity: 0.5;
                        width: 12px;
                        height: 12px;
                        transition: all 0.3s ease;
                    }
                    .swiper-pagination-bullet-active {
                        background: #fbbf24;
                        opacity: 1;
                        width: 32px;
                        border-radius: 6px;
                    }
                    .swiper-button-next, .swiper-button-prev {
                        color: white;
                        background: rgba(0,0,0,0.2);
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                        backdrop-filter: blur(8px);
                        transition: all 0.3s ease;
                        border: 1px border-white/10;
                    }
                    .swiper-button-next:after, .swiper-button-prev:after {
                        font-size: 24px;
                        font-weight: bold;
                    }
                    .swiper-button-next:hover, .swiper-button-prev:hover {
                        background: #fbbf24;
                        color: #064e3b;
                        transform: scale(1.1);
                    }
                    @media (max-width: 640px) {
                        .swiper-button-next, .swiper-button-prev {
                            display: none;
                        }
                    }
                `}</style>
            </Swiper>
        </div>
    );
};