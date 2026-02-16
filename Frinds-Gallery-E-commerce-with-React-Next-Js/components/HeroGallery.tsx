import React from 'react';
import type { Page } from '../App';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

interface HeroGalleryProps {
    navigateTo: (page: Page) => void;
}

const slides = [
    {
        id: 1,
        image: '/images/banner/banner.webp',
        subtitle: 'নতুন কালেকশন ২০২৪',
        title: <>আপনার <span className="text-brand-yellow italic">ফ্যাশন</span>,<br className="hidden sm:block" />আপনার পরিচয়</>,
        description: 'শৈলী আর আভিজাত্যের এক অপূর্ব সমন্বয়। আধুনিক ডিজাইনের শ্রেষ্ঠ পোশাক সম্ভার এখন আপনার নাগালে।',
        primaryBtn: 'শপ ভিজিট করুন',
        secondaryBtn: 'মেগা অফার'
    },
    {
        id: 2,
        image: '/images/banner/banner-2.webp',
        subtitle: 'এক্সক্লুসিভ কালেকশন',
        title: <>সেরা <span className="text-brand-yellow italic">ডিজাইন</span>,<br className="hidden sm:block" />সেরা মান</>,
        description: 'প্রিমিয়াম কোয়ালিটির নিশ্চয়তা। আপনার পছন্দের পোশাকটি বেছে নিন আমাদের বিশাল কালেকশন থেকে।',
        primaryBtn: 'অর্ডার করুন',
        secondaryBtn: 'নতুন কালেকশন'
    },
    {
        id: 3,
        image: '/images/banner/banner-3.webp',
        subtitle: 'ঈদ স্পেশাল',
        title: <>উৎসবের <span className="text-brand-yellow italic">রঙ</span>,<br className="hidden sm:block" />আপনার সাথে</>,
        description: 'ঈদের কেনাকাটায় বিশেষ ছাড়। আপনার প্রিয়জনের জন্য সেরা উপহারটি কিনুন এখনই।',
        primaryBtn: 'শপ ভিজিট করুন',
        secondaryBtn: 'ডিসকাউন্ট'
    }
];

export const HeroGallery: React.FC<HeroGalleryProps> = ({ navigateTo }) => {
    return (
        <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
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
                className="h-[400px] sm:h-[480px] md:h-[600px] rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border-[6px] border-white ring-1 ring-slate-100"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id} className="relative w-full h-full">
                        <div className="absolute inset-0">
                            <img
                                className="w-full h-full object-cover object-top"
                                src={slide.image}
                                alt="Fashion banner"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-green-deep/90 via-brand-green-deep/40 to-transparent"></div>
                        </div>

                        {/* Decorative floating shapes */}
                        <div className="absolute top-10 right-10 w-32 h-32 bg-brand-yellow/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-brand-green/10 rounded-full blur-3xl"></div>

                        <div className="relative w-full h-full flex items-center justify-start text-left px-6 sm:px-12 md:px-24">
                            <div className="max-w-xl">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-yellow/20 border border-brand-yellow/30 text-brand-yellow font-bold text-xs sm:text-sm uppercase tracking-[0.2em] mb-6 animate-fade-in">
                                    <span className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse"></span>
                                    {slide.subtitle}
                                </div>
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] mb-6">
                                    {slide.title}
                                </h1>
                                <p className="max-w-md text-base sm:text-lg md:text-xl text-white/80 leading-relaxed mb-10 font-medium">
                                    {slide.description}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => navigateTo('shop')}
                                        className="group relative px-8 sm:px-10 py-4 sm:py-5 rounded-2xl bg-brand-yellow text-brand-green-deep font-black text-base sm:text-lg transition-all transform hover:scale-105 hover:-rotate-1 active:scale-95 shadow-[0_15px_30px_-10px_rgba(251,191,36,0.5)] overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            {slide.primaryBtn}
                                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </span>
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                    </button>

                                    <button
                                        onClick={() => navigateTo('hotDeals')}
                                        className="px-8 sm:px-10 py-4 sm:py-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-base sm:text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
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
                        width: 10px;
                        height: 10px;
                    }
                    .swiper-pagination-bullet-active {
                        background: #fbbf24;
                        opacity: 1;
                        width: 24px;
                        border-radius: 5px;
                    }
                    .swiper-button-next, .swiper-button-prev {
                        color: white;
                        background: rgba(255,255,255,0.1);
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        backdrop-filter: blur(4px);
                    }
                    .swiper-button-next:after, .swiper-button-prev:after {
                        font-size: 20px;
                        font-weight: bold;
                    }
                    .swiper-button-next:hover, .swiper-button-prev:hover {
                        background: rgba(255,255,255,0.2);
                    }
                `}</style>
            </Swiper>
        </div>
    );
};