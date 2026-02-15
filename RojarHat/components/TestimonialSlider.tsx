'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  image: string;
  rating: number;
  text: string;
}

const TestimonialSlider: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'ফাতিমা বেগম',
      location: 'ঢাকা',
      image: '👩',
      rating: 5,
      text: 'রোজারহাট থেকে অর্ডার করে আমি অত্যন্ত সন্তুষ্ট। পণ্যের গুণমান চমৎকার এবং ডেলিভারি খুবই দ্রুত ছিল। রমজানে এটি আমার প্রথম পছন্দ।',
    },
    {
      id: 2,
      name: 'করিম আহমেদ',
      location: 'চট্টগ্রাম',
      image: '👨',
      rating: 5,
      text: 'খেজুর এবং ইফতারের পণ্যগুলি সত্যিই প্রিমিয়াম মানের। হালাল সার্টিফাইড পণ্য পেয়ে আমরা নিশ্চিন্তে ইবাদত করতে পারি।',
    },
    {
      id: 3,
      name: 'আয়েশা খাতুন',
      location: 'সিলেট',
      image: '👩',
      rating: 5,
      text: 'পরিবারের সবাই রোজারহাটের পণ্য ব্যবহার করি। দাম যুক্তিসঙ্গত এবং কোয়ালিটি অসাধারণ। অবশ্যই সবাইকে রেকমেন্ড করব।',
    },
    {
      id: 4,
      name: 'মুহাম্মদ ইমরান',
      location: 'খুলনা',
      image: '👨',
      rating: 5,
      text: 'প্রথমবার অনলাইন অর্ডার করেছিলাম রোজারহাটে। পণ্য আসেনি কিন্তু কাস্টমার সাপোর্ট টিম দুর্দান্ত সেবা দিয়েছে। এখন নিয়মিত গ্রাহক।',
    },
    {
      id: 5,
      name: 'সালমা আক্তার',
      location: 'রাজশাহী',
      image: '👩',
      rating: 5,
      text: 'রোজারহাটের প্যাকেজিং এবং পণ্যের তাজা ভাব দেখে মুগ্ধ হয়েছি। সত্যি একটি বিশ্বস্ত অনলাইন স্টোর।',
    },
    {
      id: 6,
      name: 'আব্দুল্লাহ রহিম',
      location: 'ঢাকা',
      image: '👨',
      rating: 5,
      text: 'এই রমজানে রোজারহাটের সাথে আছি। সব ধরনের পণ্য এক জায়গায় পাওয়া যায়। বিনামূল্যে ডেলিভারি অফার সত্যিই দুর্দান্ত।',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-3">গ্রাহক পর্যালোচনা</h2>
          <div className="h-1.5 w-24 bg-gold-500 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            আমাদের সন্তুষ্ট গ্রাহকরা আমাদের সেবার প্রশংসা করেছেন। তাদের মতামত আমাদের আরও ভালো সেবা দিতে অনুপ্রাণিত করে।
          </p>
        </div>

        {/* Testimonial Slider */}
        <div className="relative px-4 md:px-8">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={{
              prevEl: '.swiper-button-prev-testimonial',
              nextEl: '.swiper-button-next-testimonial',
            }}
            loop={true}
            className="testimonial-swiper"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-stone-50 rounded-2xl p-6 md:p-8 border border-emerald-200/40 hover:border-emerald-300/60 transition duration-300 hover:shadow-lg h-full flex flex-col bg-gradient-to-br from-stone-50 via-stone-50 to-emerald-50/20">
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} size={18} className="fill-gold-500 text-gold-500" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-stone-700 leading-relaxed mb-6 flex-grow text-sm md:text-base">
                    "{testimonial.text}"
                  </p>

                  {/* Customer Info */}
                  <div className="flex items-center gap-3 pt-4 border-t border-stone-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-2xl">
                      {testimonial.image}
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm md:text-base">{testimonial.name}</h4>
                      <p className="text-stone-600 text-xs md:text-sm">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button className="swiper-button-prev-testimonial absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 z-10 bg-emerald-700 text-white p-2.5 rounded-full hover:bg-emerald-800 transition shadow-lg hidden md:flex items-center justify-center">
            <ChevronLeft size={20} />
          </button>
          <button className="swiper-button-next-testimonial absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 z-10 bg-emerald-700 text-white p-2.5 rounded-full hover:bg-emerald-800 transition shadow-lg hidden md:flex items-center justify-center">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <style>{`
        .testimonial-swiper .swiper-pagination-bullet {
          background-color: #047857;
          opacity: 0.5;
        }
        .testimonial-swiper .swiper-pagination-bullet-active {
          background-color: #047857;
          opacity: 1;
        }
        .testimonial-swiper .swiper-pagination {
          position: relative;
          margin-top: 30px;
        }
      `}</style>
    </section>
  );
};

export default TestimonialSlider;
