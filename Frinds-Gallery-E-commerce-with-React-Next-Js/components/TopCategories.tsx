import React from 'react';
import type { Category } from '../types';

interface TopCategoriesProps {
  categories: Category[];
  navigateToShop: (categoryId: string) => void;
}

export const TopCategories: React.FC<TopCategoriesProps> = ({ categories, navigateToShop }) => {
  return (
    <section className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-green-deep tracking-tight mb-2">টপ ক্যাটাগরি</h2>
          <p className="text-sm sm:text-base text-slate-400 font-medium">সবার পছন্দের সেরা কালেকশনগুলো দেখুন</p>
        </div>
        <div className="h-1 flex-grow bg-slate-100 mb-2 hidden md:block mx-8 rounded-full"></div>
        <button onClick={() => navigateToShop('all')} className="group flex items-center gap-2 text-sm font-black text-brand-green hover:text-brand-green-deep transition-colors uppercase tracking-widest whitespace-nowrap">
          সব দেখুন
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((category) => {
          const catImage = category.image_url || category.imageUrl;
          return (
            <button
              key={category.id}
              onClick={() => navigateToShop(category.id)}
              className="group relative flex flex-col items-center bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 overflow-hidden"
            >
              <div className="w-full aspect-[4/5] rounded-[1.5rem] bg-slate-50 overflow-hidden mb-4 relative">
                {catImage ? (
                  <img
                    src={catImage}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-300">
                    <span className="text-4xl mb-2">{category.icon || '📦'}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
                  </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="text-center w-full">
                <h3 className="font-bold text-slate-800 text-sm sm:text-base transition-colors group-hover:text-brand-green-deep line-clamp-1">{category.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                  কালেকশন দেখুন
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};