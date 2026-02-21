import React from 'react';
import type { Page } from '../types';
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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass-nav border-t border-slate-200/50 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)] z-[60] safe-pb rounded-t-[1.5rem]">
      <div className="flex justify-around items-center h-[72px] px-2 relative">
        {navItems.map((item) => {
          const isActive = currentPage === item.page;
          const Icon = item.icon;
          return (
            <button
              key={item.page}
              onClick={() => navigateTo(item.page)}
              className={`flex flex-col items-center justify-center relative w-full h-full transition-all duration-300 active-press`}
            >
              <div className={`relative p-2 rounded-2xl transition-all duration-500 ${isActive ? '-translate-y-1' : ''}`}>
                {isActive && (
                  <div className="absolute inset-0 bg-brand-green-deep/10 rounded-2xl animate-ping opacity-20 duration-1000"></div>
                )}
                <div className={`transition-colors duration-300 ${isActive ? 'text-brand-green-deep' : 'text-slate-400'}`}>
                  <Icon size={24} />
                </div>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-green-deep rounded-full"></span>
                )}
              </div>

              <span className={`text-[10px] font-bold tracking-widest uppercase mt-1 transition-all duration-300 ${isActive ? 'text-brand-green-deep opacity-100 translate-y-0' : 'text-slate-400 opacity-70 translate-y-1'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>

  );
};