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
    <div className="space-y-8">
       <div>
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">ক্যাটাগরি</h3>
        <ul className="space-y-1">
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-brand-green text-white font-semibold'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">অ্যাভেইলেবিলিটি</h3>
        <div className="space-y-2">
           <label className="flex items-center">
            <input 
              type="radio" 
              name="availability" 
              value="all"
              checked={availability === 'all'}
              onChange={(e) => setAvailability(e.target.value)}
            />
            <span className="ml-2 text-gray-700">সব</span>
          </label>
          <label className="flex items-center">
            <input 
              type="radio" 
              name="availability" 
              value="inStock"
              checked={availability === 'inStock'}
              onChange={(e) => setAvailability(e.target.value)}
            />
            <span className="ml-2 text-gray-700">স্টকে আছে</span>
          </label>
          <label className="flex items-center">
            <input 
              type="radio" 
              name="availability" 
              value="outOfStock" 
              checked={availability === 'outOfStock'}
              onChange={(e) => setAvailability(e.target.value)}
            />
            <span className="ml-2 text-gray-700">স্টকের বাইরে</span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">মূল্য</h3>
        <div className="flex items-center space-x-2">
          <input 
            type="number" 
            name="min"
            value={priceRange.min}
            onChange={handlePriceChange}
            placeholder="Min" 
            className="w-full px-2 py-1 text-center"
          />
          <span>-</span>
          <input 
            type="number" 
            name="max"
            value={priceRange.max}
            onChange={handlePriceChange}
            placeholder="Max" 
            className="w-full px-2 py-1 text-center"
          />
          <button onClick={() => setPriceRange({ min: 0, max: 10000 })} className="text-xs text-gray-600 hover:text-brand-green">রিসেট</button>
        </div>
        {/* Simple range slider visual - non-interactive, for styling */}
        <div className="relative h-2 bg-gray-200 rounded-full mt-4">
            <div className="absolute h-2 bg-brand-green rounded-full" style={{ left: `${(priceRange.min/10000)*100}%`, right: `${100-((priceRange.max/10000)*100)}%` }}></div>
        </div>
      </div>
    </div>
  );
};