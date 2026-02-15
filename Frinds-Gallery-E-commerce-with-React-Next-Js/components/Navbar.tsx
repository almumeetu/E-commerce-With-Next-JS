'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Moon, Heart, Search, ArrowLeft } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import { useCart } from '@/src/context/CartContext';

interface NavbarProps {
  onCartClick?: () => void;
}

export default function Navbar({ onCartClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { cartCount, wishlistCount } = useCart();

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false); // Mobile search toggle
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path ? "text-rose-400 font-bold" : "text-indigo-50 hover:text-rose-200";

  // Mobile menu link active state
  const isMobileActive = (path: string) => pathname === path;

  // Announce route changes for screen readers
  useEffect(() => {
    document.title = `${pathname === '/' ? 'হোম' : pathname.slice(1)} – ফ্রেন্ডস গ্যালারি`;
  }, [pathname]);

  const runSearch = (query: string): void => {
    const trimmed = query.trim();
    setSearchQuery(query);
    if (!trimmed) {
      setSearchResults([]);
      return;
    }

    const lowered = trimmed.toLowerCase();
    const filtered = PRODUCTS.filter((p: Product) =>
      p.name.toLowerCase().includes(lowered) ||
      p.category.toLowerCase().includes(lowered) ||
      p.description.toLowerCase().includes(lowered)
    );
    setSearchResults(filtered);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    runSearch(e.target.value);
  };

  const handleResultClick = (): void => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
  };

  useEffect(() => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={`h-20 md:h-[105px] fixed top-0 inset-x-0 z-40 transition-all duration-300 ${scrolled
          ? 'bg-indigo-950/95 backdrop-blur-md shadow-lg border-b border-indigo-800/50'
          : 'bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950/90 border-b border-indigo-900/50'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 md:h-[105px]">
          <div className="flex justify-between items-center h-20 md:h-[105px]">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 shrink-0 group">
              <div className="bg-gradient-to-br from-rose-300 to-rose-500 p-1.5 rounded-lg shadow-lg group-hover:shadow-rose-500/30 transition duration-300">
                <Moon className="h-5 w-5 text-indigo-950" fill="currentColor" />
              </div>
              <span className="text-2xl md:text-3xl font-bold text-white tracking-wide">
                ফ্রেন্ডস <span className="text-rose-400">গ্যালারি</span>
              </span>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden md:block flex-1 max-w-md mx-8 relative group">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="ইফতার, খেজুর বা সেহরি খুঁজুন..."
                  className={`w-full bg-indigo-900/50 text-white placeholder-indigo-300/60 rounded-full py-2.5 pl-11 pr-4 outline-none border transition-all duration-300 ${searchQuery ? 'bg-indigo-900 border-rose-500/50 ring-2 ring-rose-500/20' : 'border-indigo-700/50 focus:bg-indigo-900 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20'
                    }`}
                />
                <Search className="absolute left-4 top-3 h-4 w-4 text-indigo-300 group-focus-within:text-rose-400 transition-colors" />
              </div>

              {/* Desktop Search Results */}
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-50 border border-stone-100 max-h-96 overflow-y-auto animate-fade-in custom-scrollbar">
                  {searchResults.length > 0 ? (
                    searchResults.map((product: Product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        onClick={handleResultClick}
                        className="flex items-center p-3 hover:bg-indigo-50 border-b border-stone-100 last:border-none transition group"
                      >
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg bg-stone-100" />
                        <div className="ml-3">
                          <p className="text-sm font-semibold text-stone-800 group-hover:text-indigo-700 transition">{product.name}</p>
                          <p className="text-xs text-stone-500 capitalize">{product.category}</p>
                        </div>
                        <div className="ml-auto">
                          <p className="text-sm font-bold text-indigo-700">৳ {product.price}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-6 text-center text-stone-500 text-sm">
                      কোনো পণ্য পাওয়া যায়নি
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/" className={`text-sm font-medium transition duration-200 ${isActive('/')}`}>হোম</Link>
              <Link href="/shop" className={`text-sm font-medium transition duration-200 ${isActive('/shop')}`}>কেনাকাটা</Link>
              <Link href="/about" className={`text-sm font-medium transition duration-200 ${isActive('/about')}`}>আমাদের সম্পর্কে</Link>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3 sm:space-x-5 shrink-0">
              {/* Mobile Search Toggle */}
              <button
                className="md:hidden p-2 text-indigo-100 hover:text-rose-400 transition"
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-6 w-6" />
              </button>

              <Link href="/wishlist" className="relative p-2 text-indigo-100 hover:text-rose-400 transition hidden sm:block">
                <Heart className="h-6 w-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-indigo-950 text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                onClick={onCartClick}
                className="relative p-2 text-indigo-100 hover:text-rose-400 transition cursor-pointer"
              >
                <ShoppingBag className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm border border-indigo-900">
                    {cartCount}
                  </span>
                )}
              </button>


            </div>
          </div>
        </div>

        {/* Mobile Full Screen Search */}
        {showSearch && (
          <div className="fixed inset-0 bg-indigo-950 z-[90] p-4 flex flex-col animate-fade-in">
            <div className="flex items-center space-x-3 mb-4">
              <button onClick={() => setShowSearch(false)} className="p-2 text-indigo-200 hover:text-white transition">
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="পণ্য খুঁজুন..."
                  className="w-full bg-indigo-900 text-white placeholder-indigo-500/70 rounded-full py-3 pl-10 pr-4 outline-none border border-indigo-800 focus:border-rose-500"
                />
                <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-indigo-500" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-indigo-900/30 rounded-2xl">
              {searchQuery ? (
                searchResults.length > 0 ? (
                  searchResults.map((product: Product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      onClick={handleResultClick}
                      className="flex items-center p-4 border-b border-indigo-800/50 last:border-none active:bg-indigo-800/50 transition"
                    >
                      <img src={product.image} alt={product.name} className="w-14 h-14 object-cover rounded-lg bg-indigo-800" />
                      <div className="ml-4 flex-1">
                        <p className="text-base font-medium text-indigo-50">{product.name}</p>
                        <p className="text-sm text-rose-400 font-bold mt-1">৳ {product.price}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-8 text-center text-indigo-400/60">
                    কোনো পণ্য পাওয়া যায়নি
                  </div>
                )
              ) : (
                <div className="p-8 text-center">
                  <p className="text-indigo-400/60 text-sm">জনপ্রিয় সার্চ</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {['খেজুর', 'শরবত', 'জায়নামাজ'].map((term: string) => (
                      <button
                        key={term}
                        onClick={() => runSearch(term)}
                        className="bg-indigo-800/50 text-indigo-200 px-3 py-1.5 rounded-full text-sm border border-indigo-700/50"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Bottom Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 lg:hidden z-40 bg-gradient-to-t from-indigo-950/98 to-indigo-950/95 backdrop-blur-md border-t border-indigo-800/60 shadow-2xl">
          <div className="max-w-7xl mx-auto px-2 sm:px-3">
            {/* Mobile Navigation Items */}
            <div className="flex items-center justify-around h-20 md:h-24 gap-1 overflow-x-auto custom-scrollbar">
              {/* Home */}
              <Link
                href="/"
                className={`flex flex-col items-center justify-center min-w-fit px-3 py-2.5 rounded-xl transition-all duration-200 group ${isMobileActive('/')
                  ? 'bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg shadow-rose-500/30'
                  : 'hover:bg-indigo-800/60 active:bg-indigo-800/80'
                  }`}
              >
                <svg className={`h-6 w-6 mb-1 ${isMobileActive('/') ? 'text-white' : 'text-indigo-200 group-hover:text-rose-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className={`text-xs font-bold whitespace-nowrap ${isMobileActive('/') ? 'text-white' : 'text-indigo-100'}`}>হোম</span>
              </Link>

              {/* Shop */}
              <Link
                href="/shop"
                className={`flex flex-col items-center justify-center min-w-fit px-3 py-2.5 rounded-xl transition-all duration-200 group ${isMobileActive('/shop')
                  ? 'bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg shadow-rose-500/30'
                  : 'hover:bg-indigo-800/60 active:bg-indigo-800/80'
                  }`}
              >
                <svg className={`h-6 w-6 mb-1 ${isMobileActive('/shop') ? 'text-white' : 'text-indigo-200 group-hover:text-rose-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className={`text-xs font-bold whitespace-nowrap ${isMobileActive('/shop') ? 'text-white' : 'text-indigo-100'}`}>কেনাকাটা</span>
              </Link>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className={`flex flex-col items-center justify-center min-w-fit px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${isMobileActive('/wishlist')
                  ? 'bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg shadow-rose-500/30'
                  : 'hover:bg-indigo-800/60 active:bg-indigo-800/80'
                  }`}
              >
                <Heart className={`h-6 w-6 mb-1 ${isMobileActive('/wishlist') ? 'text-white' : 'text-rose-400 group-hover:text-rose-300'}`} />
                {wishlistCount > 0 && (
                  <span className={`absolute -top-1 -right-1 h-5 w-5 text-[10px] font-bold rounded-full flex items-center justify-center ${isMobileActive('/wishlist')
                    ? 'bg-white/30 text-white'
                    : 'bg-rose-500 text-white'
                    }`}>
                    {wishlistCount}
                  </span>
                )}
                <span className={`text-xs font-bold whitespace-nowrap ${isMobileActive('/wishlist') ? 'text-white' : 'text-indigo-100'}`}>পছন্দ</span>
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className={`flex flex-col items-center justify-center min-w-fit px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${isMobileActive('/cart')
                  ? 'bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg shadow-rose-500/30'
                  : 'hover:bg-indigo-800/60 active:bg-indigo-800/80'
                  }`}
              >
                <ShoppingBag className={`h-6 w-6 mb-1 ${isMobileActive('/cart') ? 'text-white' : 'text-amber-400 group-hover:text-rose-300'}`} />
                {cartCount > 0 && (
                  <span className={`absolute -top-1 -right-1 h-5 w-5 text-[10px] font-bold rounded-full flex items-center justify-center ${isMobileActive('/cart')
                    ? 'bg-white/30 text-white'
                    : 'bg-red-500 text-white'
                    }`}>
                    {cartCount}
                  </span>
                )}
                <span className={`text-xs font-bold whitespace-nowrap ${isMobileActive('/cart') ? 'text-white' : 'text-indigo-100'}`}>ব্যাগ</span>
              </Link>

              {/* About */}
              <Link
                href="/about"
                className={`flex flex-col items-center justify-center min-w-fit px-3 py-2.5 rounded-xl transition-all duration-200 group ${isMobileActive('/about')
                  ? 'bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg shadow-rose-500/30'
                  : 'hover:bg-indigo-800/60 active:bg-indigo-800/80'
                  }`}
              >
                <svg className={`h-6 w-6 mb-1 ${isMobileActive('/about') ? 'text-white' : 'text-blue-400 group-hover:text-rose-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={`text-xs font-bold whitespace-nowrap ${isMobileActive('/about') ? 'text-white' : 'text-indigo-100'}`}>সম্পর্কে</span>
              </Link>

              {/* Contact */}
              <Link
                href="/contact"
                className={`flex flex-col items-center justify-center min-w-fit px-3 py-2.5 rounded-xl transition-all duration-200 group ${isMobileActive('/contact')
                  ? 'bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg shadow-rose-500/30'
                  : 'hover:bg-indigo-800/60 active:bg-indigo-800/80'
                  }`}
              >
                <svg className={`h-6 w-6 mb-1 ${isMobileActive('/contact') ? 'text-white' : 'text-purple-400 group-hover:text-rose-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className={`text-xs font-bold whitespace-nowrap ${isMobileActive('/contact') ? 'text-white' : 'text-indigo-100'}`}>যোগাযোগ</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {/* Spacer for sticky navbar and bottom nav */}
      <div className={`${pathname === '/' ? 'pb-20 lg:pb-0' : 'h-20 md:h-[105px] pb-20 lg:pb-0'}`}></div>
    </>
  );
}