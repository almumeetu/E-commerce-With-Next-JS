import React from 'react';
import type { Product, CartItem } from '../types';
import type { Page } from '../App';
import { ShoppingCart } from 'lucide-react';

interface FloatingCartProps {
  cart: CartItem[];
  products: Product[];
  navigateTo: (page: Page) => void;
}

export const FloatingCart: React.FC<FloatingCartProps> = ({ cart, products, navigateTo }) => {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  if (itemCount === 0) {
    return null;
  }

  return (
    <div
      onClick={() => navigateTo('checkout')}
      className="fixed right-0 top-1/2 -translate-y-1/2 bg-brand-green-deep text-white w-24 sm:w-28 py-6 rounded-l-[2rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center cursor-pointer z-50 space-y-2 border-l-4 border-y-4 border-white/10 transform hover:-translate-x-2 transition-all duration-500 group"
    >
      <div className="relative">
        <ShoppingCart className="w-8 h-8 text-brand-yellow group-hover:scale-110 transition-transform" />
        <span className="absolute -top-3 -right-3 bg-brand-yellow text-brand-green-deep text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-brand-green-deep shadow-lg">
          {itemCount}
        </span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-[10px] uppercase font-black tracking-widest text-white/50 mb-1">মোট</span>
        <div className="text-sm font-black text-brand-yellow">৳{total.toLocaleString('bn-BD')}</div>
      </div>
    </div>
  );
};