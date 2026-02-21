import React from 'react';
import type { Category } from '../types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

interface TopCategoriesProps {
  categories: Category[];
  navigateToShop: (categoryId: string) => void;
}

export const TopCategories: React.FC<TopCategoriesProps> = ({ categories, navigateToShop }) => {
  return (
    <section className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center mb-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-brand-green-deep tracking-tight mb-2">টপ ক্যাটাগরি</h2>
        <div className="h-1.5 w-24 bg-brand-yellow rounded-full shadow-sm"></div>
      </div>

      <div className="relative">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={12}
          slidesPerView={2.2}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            480: { slidesPerView: 3.2, spaceBetween: 16, centeredSlides: false },
            640: { slidesPerView: 4.2, spaceBetween: 16, centeredSlides: false },
            768: { slidesPerView: 5.2, spaceBetween: 20, centeredSlides: false },
            1024: { slidesPerView: 6.2, spaceBetween: 20, centeredSlides: false },
            1280: { slidesPerView: 7.2, spaceBetween: 24, centeredSlides: false },
          }}
          className="pb-10"
        >
          <style>{`
            .swiper-wrapper {
              justify-content: center !important;
            }
          `}</style>
          {categories.map((category) => {
            const catImage = category.image_url || category.imageUrl;
            return (
              <SwiperSlide key={category.id}>
                <button
                  onClick={() => navigateToShop(category.id)}
                  className="relative flex flex-col items-center w-full mx-auto max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] group active:scale-95 transition-all duration-300"
                >
                  <div className="w-full aspect-square rounded-full bg-white border-2 border-brand-yellow p-1.5 shadow-xl transition-all duration-300 group-hover:shadow-brand-yellow/30 group-hover:-translate-y-1">
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-brand-green/40 group-hover:border-brand-green transition-colors relative">
                      {catImage ? (
                        <img
                          src={catImage}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400">
                          <span className="text-3xl">{category.icon || '📦'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base md:text-lg text-center mt-4 transition-colors group-hover:text-brand-green-deep line-clamp-1">{category.name}</h3>
                </button>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};