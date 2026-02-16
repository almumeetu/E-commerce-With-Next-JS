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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.1)] z-40 safe-area-inset-bottom rounded-t-[2rem]">
      <div className="flex justify-around items-center h-20 px-4">
        {navItems.map((item) => {
          const isActive = currentPage === item.page;
          const Icon = item.icon;
          return (
            <button
              key={item.page}
              onClick={() => navigateTo(item.page)}
              className={`flex flex-col items-center justify-center relative w-full transition-all duration-300 ${isActive ? 'text-brand-green-deep scale-110' : 'text-slate-400 opacity-60'
                }`}
            >
              {isActive && (
                <span className="absolute -top-3 w-10 h-1 bg-brand-yellow rounded-full animate-in fade-in zoom-in duration-300" />
              )}
              <Icon size={24} className={`${isActive ? 'fill-brand-yellow text-brand-yellow' : ''}`} />
              <span className={`text-[10px] font-black uppercase tracking-widest mt-1.5 ${isActive ? 'text-brand-green-deep' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};