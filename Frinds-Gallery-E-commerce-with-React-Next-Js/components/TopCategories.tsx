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
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-8">
        {categories.map((category) => (
          <button key={category.id} onClick={() => navigateToShop(category.id)} className="flex flex-col items-center group text-center focus:outline-none">
            <div className="w-full aspect-square rounded-[2rem] sm:rounded-[3rem] bg-white flex items-center justify-center transition-all duration-500 overflow-hidden border border-slate-100 premium-card-shadow group-hover:scale-105 group-hover:border-brand-yellow/30 group-hover:shadow-[0_20px_40px_-15px_rgba(251,191,36,0.2)]">
              {category.imageUrl ? (
                <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              ) : (
                <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                  <span className="text-slate-200 text-6xl font-black">FG</span>
                </div>
              )}
            </div>
            <h3 className="mt-4 sm:mt-6 font-bold text-slate-800 transition-colors duration-300 group-hover:text-brand-green text-sm sm:text-lg tracking-tight uppercase">{category.name}</h3>
          </button>
        ))}
      </div>
    </section>
  );
};