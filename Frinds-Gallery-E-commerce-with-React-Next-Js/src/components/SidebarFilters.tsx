import React from 'react';
import type { Category } from '../types';

interface SidebarFiltersProps {
  priceRange: { min: number; max: number };
  setPriceRange: (range: { min: number; max: number }) => void;
  availability: string;
  setAvailability: (status: string) => void;
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (categoryId: string) => void;
}

export const SidebarFilters: React.FC<SidebarFiltersProps> = ({ priceRange, setPriceRange, availability, setAvailability, categories, selectedCategory, setSelectedCategory }) => {

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPriceRange({ ...priceRange, [name]: value === '' ? 0 : parseInt(value, 10) });
  };

  return (
    <div className="space-y-8 p-6 bg-white rounded-xl border border-slate-200 sticky top-24 self-start">
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
          <span>ক্যাটাগরি</span>
          <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{categories.length}</span>
        </h3>
        <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          <li>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 flex items-center justify-between group ${selectedCategory === 'all'
                  ? 'bg-brand-green/10 text-brand-green font-bold shadow-sm border border-brand-green/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                }`}
            >
              <span>সব পণ্য</span>
              {selectedCategory === 'all' && <div className="w-2 h-2 rounded-full bg-brand-green"></div>}
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 flex items-center justify-between group ${selectedCategory === category.id
                    ? 'bg-brand-green/10 text-brand-green font-bold shadow-sm border border-brand-green/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                  }`}
              >
                <span className="group-hover:translate-x-1 transition-transform">{category.name}</span>
                {selectedCategory === category.id && <div className="w-2 h-2 rounded-full bg-brand-green"></div>}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">স্টক অবস্থা</h3>
        <div className="space-y-3">
          {['all', 'inStock', 'outOfStock'].map((status) => (
            <label key={status} className="flex items-center group cursor-pointer">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="availability"
                  value={status}
                  checked={availability === status}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-brand-green checked:bg-brand-green transition-all"
                />
                <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
              <span className={`ml-3 text-sm font-medium transition-colors ${availability === status ? 'text-brand-green' : 'text-slate-600 group-hover:text-slate-900'}`}>
                {status === 'all' && 'সব দেখান'}
                {status === 'inStock' && 'স্টকে আছে'}
                {status === 'outOfStock' && 'স্টক আউট'}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex justify-between items-center">
          <span>মূল্য পরিসীমা</span>
          <button
            onClick={() => setPriceRange({ min: 0, max: 10000 })}
            className="text-xs font-semibold text-brand-green hover:underline cursor-pointer"
          >
            রিসেট
          </button>
        </h3>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="w-full">
              <label className="text-xs font-bold text-slate-400 mb-1 block">সর্বনিম্ন</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                <input
                  type="number"
                  name="min"
                  value={priceRange.min}
                  onChange={handlePriceChange}
                  className="w-full pl-7 pr-2 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-lg focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                />
              </div>
            </div>
            <div className="pt-5 text-slate-300 font-bold">-</div>
            <div className="w-full">
              <label className="text-xs font-bold text-slate-400 mb-1 block">সর্বোচ্চ</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                <input
                  type="number"
                  name="max"
                  value={priceRange.max}
                  onChange={handlePriceChange}
                  className="w-full pl-7 pr-2 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-lg focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Range Slider Visual */}
          <div className="relative h-1.5 bg-slate-200 rounded-full mt-2 mx-1">
            <div
              className="absolute h-full bg-brand-green rounded-full opacity-50"
              style={{
                left: `${Math.min(100, Math.max(0, (priceRange.min / 10000) * 100))}%`,
                right: `${100 - Math.min(100, Math.max(0, (priceRange.max / 10000) * 100))}%`
              }}
            ></div>
            {/* Visual Thumbnails (non-interactive) */}
            <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-brand-green rounded-full shadow-sm" style={{ left: `${Math.min(100, Math.max(0, (priceRange.min / 10000) * 100))}%` }}></div>
            <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-brand-green rounded-full shadow-sm" style={{ left: `${Math.min(100, Math.max(0, (priceRange.max / 10000) * 100))}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};