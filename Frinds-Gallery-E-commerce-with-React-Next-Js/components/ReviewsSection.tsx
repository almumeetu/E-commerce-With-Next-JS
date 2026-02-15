import React from 'react';
import { mockReviews } from '../constants';
import type { Review } from '../types';

const StarRating: React.FC<{ rating: number; className?: string }> = ({ rating, className = "" }) => {
    return (
        <div className={`flex items-center ${className}`}>
            {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-5 h-5 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
};

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
    return (
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 transform hover:-translate-y-2 transition-all duration-500 flex flex-col h-full relative group">
            <div className="flex items-center mb-8">
                <div className="relative">
                    <img src={review.avatarUrl} alt={review.author} className="w-16 h-16 rounded-full object-cover mr-5 border-4 border-slate-50 shadow-lg group-hover:border-brand-yellow transition-colors duration-300" />
                    <div className="absolute -bottom-1 -right-1 bg-brand-yellow text-brand-green-deep p-1 rounded-full border-2 border-white shadow-md">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    </div>
                </div>
                <div>
                    <p className="font-black text-xl text-slate-800 tracking-tight leading-none mb-1">{review.author}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{review.location}</p>
                </div>
            </div>
            <StarRating rating={review.rating} className="mb-6" />
            <blockquote className="text-slate-600 font-medium leading-relaxed relative flex-grow">
                <span className="absolute -top-6 -left-4 text-8xl text-slate-100 font-serif opacity-50 group-hover:text-brand-yellow group-hover:opacity-20 transition-all duration-500 select-none">“</span>
                <p className="z-10 relative">{review.quote}</p>
            </blockquote>
        </div>
    );
};

export const ReviewsSection: React.FC = () => {
    return (
        <section className="bg-white py-24 md:py-32">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-8xl">
                <div className="flex flex-col items-center text-center mb-16 px-4">
                    <span className="text-brand-green font-black uppercase tracking-[0.3em] text-xs mb-4">Happy Customers</span>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-brand-green-deep tracking-tight mb-6">ক্রেতাদের মতামত</h2>
                    <p className="text-lg sm:text-xl text-slate-400 font-medium max-w-2xl">আমাদের সার্ভিস নিয়ে সন্তুষ্ট ক্রেতারা যা বলেন। তাদের বিশ্বাসই আমাদের এগিয়ে চলার প্রেরণা।</p>
                    <div className="mt-8 w-24 h-1.5 bg-brand-yellow rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {mockReviews.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            </div>
        </section>
    );
};