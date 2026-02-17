import React from 'react';
import type { Page } from '../App';
import { BiHomeAlt, BiShoppingBag, BiHeart, BiUser } from 'react-icons/bi';

interface MobileBottomNavProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentPage, navigateTo }) => {
  const navItems = [
    { page: 'home' as Page, label: 'হোম', icon: BiHomeAlt },
    { page: 'shop' as Page, label: 'শপ', icon: BiShoppingBag },
    { page: 'wishlist' as Page, label: 'পছন্দ', icon: BiHeart },
    { page: 'account' as Page, label: 'অ্যাকাউন্ট', icon: BiUser },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] z-[55] safe-area-inset-bottom rounded-t-[2.5rem]">
      <div className="flex justify-around items-center h-22 px-6 pb-2">
        {navItems.map((item) => {
          const isActive = currentPage === item.page;
          const Icon = item.icon;
          return (
            <button
              key={item.page}
              onClick={() => navigateTo(item.page)}
              className={`flex flex-col items-center justify-center relative w-full pt-4 transition-all duration-500 ${isActive ? 'scale-110' : 'opacity-50 hover:opacity-100'}`}
            >
              {isActive && (
                <div className="absolute top-0 flex flex-col items-center">
                  <div className="w-12 h-1 bg-brand-yellow rounded-full shadow-[0_0_15px_rgba(251,191,36,0.5)] animate-in slide-in-from-top-1 duration-500" />
                  <div className="w-20 h-20 bg-brand-yellow/5 rounded-full blur-xl -mt-4 animate-pulse" />
                </div>
              )}
              <div className={`p-2 rounded-2xl transition-all duration-500 ${isActive ? 'bg-brand-green-deep text-brand-yellow shadow-lg rotate-0' : 'bg-transparent text-slate-500 rotate-0'}`}>
                <Icon size={24} />
              </div>

              <span className={`text-[10px] font-black uppercase tracking-[0.2em] mt-2 transition-all duration-500 ${isActive ? 'text-brand-green-deep' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>

  );
};