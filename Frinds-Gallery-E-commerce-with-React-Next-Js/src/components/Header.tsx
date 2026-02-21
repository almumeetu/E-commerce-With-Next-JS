
import React, { useState, useEffect } from 'react';
import type { Page } from '../types';
import type { Customer, Category } from '../types';
import { SearchIcon, HeartIcon, ShoppingCartIcon, UserCircleIcon, Bars3Icon, XMarkIcon, CubeIcon, UserIcon, ArrowLeftOnRectangleIcon, Cog6ToothIcon } from './icons';

interface HeaderProps {
    navigateTo: (page: Page) => void;
    navigateToShop: (categoryId: string) => void;
    cartItemCount: number;
    wishlistItemCount: number;
    currentUser: Customer | null;
    onLogout: () => void;
    categories: Category[];
}

const Logo = () => (
    <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
        <div className="relative">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-yellow rounded-xl sm:rounded-2xl flex items-center justify-center shadow-[0_10px_20px_-5px_rgba(251,191,36,0.4)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <span className="text-brand-green-deep font-black text-xl sm:text-2xl">F</span>
            </div>
            <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full border-2 border-brand-green-deep animate-pulse"></div>
        </div>
        <div className="flex flex-col">
            <span className="text-white font-black text-base sm:text-xl md:text-2xl leading-none tracking-tight uppercase group-hover:text-brand-yellow transition-colors">Friend's</span>
            <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1">
                <div className="h-[2px] w-3 sm:w-4 bg-brand-yellow rounded-full"></div>
                <span className="text-brand-yellow font-black text-[9px] sm:text-[10px] md:text-xs leading-none tracking-[0.2em] sm:tracking-[0.3em] uppercase">GALLERY</span>
            </div>
        </div>
    </div>
);

// Designated admin user for demo purposes
const ADMIN_EMAIL = 'amina@example.com';

export const Header: React.FC<HeaderProps> = ({ navigateTo, navigateToShop, cartItemCount, wishlistItemCount, currentUser, onLogout, categories }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMenuOpen]);

    const handleNavClick = (page: Page) => {
        navigateTo(page);
        setIsMenuOpen(false);
    };

    const handleCategoryClick = (categoryId: string) => {
        navigateToShop(categoryId);
        setIsMenuOpen(false);
    }

    return (
        <header className={`sticky top-0 z-50 transition-all duration-500 shadow-2xl ${isScrolled ? 'py-2 bg-brand-green-deep/95 backdrop-blur-xl border-b border-white/5' : 'py-4 sm:py-6 bg-brand-green-deep'}`}>
            {/* Main Background - Solid Color */}
            {!isScrolled && <div className="absolute inset-0 bg-brand-green-deep"></div>}
            <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-brand-yellow to-transparent opacity-80 z-10 ${isScrolled ? 'hidden' : 'block'}`}></div>

            <div className="container-custom">
                <div className="flex items-center justify-between h-16 sm:h-20 transition-all duration-300">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="lg:hidden p-2.5 -ml-2 text-white hover:text-brand-yellow bg-white/10 hover:bg-white/20 rounded-xl transition-all active-press"
                            aria-label="Open menu"
                        >
                            <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                        <div className="flex flex-col justify-center">
                            <button onClick={() => handleNavClick('home')} className="block transform hover:scale-105 transition-transform active-press text-left">
                                <Logo />
                            </button>
                        </div>
                    </div>

                    <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-full backdrop-blur-sm border border-white/10 shadow-lg">
                        <button onClick={() => handleNavClick('home')} className="px-6 py-2.5 rounded-full text-sm font-bold text-white hover:bg-brand-yellow hover:text-brand-green-deep transition-all">হোম</button>
                        <button onClick={() => navigateToShop('all')} className="px-6 py-2.5 rounded-full text-sm font-bold text-white hover:bg-brand-yellow hover:text-brand-green-deep transition-all">শপ</button>
                        <button onClick={() => handleNavClick('hotDeals')} className="px-6 py-2.5 rounded-full text-sm font-bold text-brand-yellow hover:bg-brand-yellow hover:text-brand-green-deep transition-all flex items-center gap-2">
                            হট ডিল
                            <span className="flex h-2 w-2 rounded-full bg-brand-yellow group-hover:bg-brand-green-deep animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.8)]"></span>
                        </button>
                        <div className="relative group">
                            <button className="px-6 py-2.5 rounded-full text-sm font-bold text-white hover:bg-brand-yellow hover:text-brand-green-deep transition-all flex items-center gap-2">
                                ক্যাটাগরি
                                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                            <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl shadow-xl bg-white text-slate-800 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryClick(cat.id)}
                                        className="block text-left w-full px-6 py-3 text-sm font-semibold hover:bg-brand-yellow hover:text-brand-green-deep transition-colors border-l-4 border-transparent hover:border-brand-green-deep"
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button onClick={() => handleNavClick('contact')} className="px-6 py-2.5 rounded-full text-sm font-bold text-white hover:bg-brand-yellow hover:text-brand-green-deep transition-all">যোগাযোগ</button>
                    </nav>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <button onClick={() => handleNavClick('wishlist')} className="relative p-2.5 text-white/90 hover:text-brand-green-deep hover:bg-brand-yellow rounded-xl transition-all group active-press">
                            <HeartIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                            {wishlistItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-yellow text-brand-green-deep group-hover:bg-brand-green-deep group-hover:text-brand-yellow text-[10px] font-bold shadow-lg border border-brand-green-deep number-text transition-colors">
                                    {wishlistItemCount}
                                </span>
                            )}
                        </button>

                        <button onClick={() => handleNavClick('checkout')} className="relative p-2.5 text-white/90 hover:text-brand-green-deep hover:bg-brand-yellow rounded-xl transition-all group active-press">
                            <ShoppingCartIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-yellow text-brand-green-deep group-hover:bg-brand-green-deep group-hover:text-brand-yellow text-[10px] font-bold shadow-lg border border-brand-green-deep number-text transition-colors">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>

                        <div className="relative group ml-1 sm:ml-2">
                            <button onClick={() => navigateTo('account')} className="hidden sm:flex items-center gap-3 p-1 pl-4 rounded-full bg-white/10 hover:bg-brand-yellow border border-white/10 transition-all active-press group/account">
                                <span className="text-xs font-bold uppercase tracking-wider text-yellow group-hover/account:text-brand-green-deep transition-colors">
                                    {currentUser ? currentUser.name.split(' ')[0] : 'অ্যাকাউন্ট'}
                                </span>
                                <div className="w-9 h-9 rounded-full bg-brand-yellow flex items-center justify-center shadow-lg transform group-hover/account:rotate-12 transition-transform">
                                    <UserCircleIcon className="h-6 w-6 text-brand-green-deep" />
                                </div>
                            </button>

                            {/* Mobile Account Icon (Visible only on mobile) */}
                            <button onClick={() => navigateTo('account')} className="sm:hidden p-2.5 rounded-xl bg-white/10 text-brand-yellow hover:bg-brand-yellow hover:text-brand-green-deep active-press transition-all">
                                <UserCircleIcon className="h-6 w-6" />
                            </button>

                            {/* Dropdown Menu */}
                            <div className="absolute right-0 mt-3 w-72 rounded-2xl shadow-2xl bg-white overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform translate-y-2 group-hover:translate-y-0 border border-slate-100">
                                <div className="bg-brand-green-deep p-6 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                                    <div className="relative z-10">
                                        {currentUser ? (
                                            <>
                                                <p className="font-bold text-lg mb-0.5">হ্যালো, {currentUser.name}</p>
                                                <p className="text-white/70 text-sm truncate font-english">{currentUser.email}</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="font-bold text-lg mb-1">ফ্রেন্ডস গ্যালারি</p>
                                                <p className="text-white/70 text-sm italic">আপনার ফ্যাশন, আপনার পরিচয়</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="p-2 space-y-1">
                                    {currentUser ? (
                                        <>
                                            <button onClick={() => navigateTo('account')} className="flex items-center gap-3 w-full text-left px-4 py-3 text-slate-700 hover:bg-brand-yellow/10 rounded-xl transition-colors font-semibold">
                                                <UserIcon className="h-5 w-5 text-brand-green-deep" /> আমার অ্যাকাউন্ট
                                            </button>
                                            <button onClick={() => navigateTo('admin')} className="flex items-center gap-3 w-full text-left px-4 py-3 text-slate-700 hover:bg-brand-yellow/10 rounded-xl transition-colors font-semibold">
                                                <Cog6ToothIcon className="h-5 w-5 text-brand-green-deep" /> অ্যাডমিন প্যানেল
                                            </button>
                                            <div className="h-px bg-slate-100 my-2 mx-4"></div>
                                            <button onClick={onLogout} className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold">
                                                <ArrowLeftOnRectangleIcon className="h-5 w-5" /> লগআউট
                                            </button>
                                        </>
                                    ) : (
                                        <div className="p-2">
                                            <button onClick={() => navigateTo('account')} className="w-full bg-brand-green-deep text-white py-3.5 rounded-xl font-bold hover:bg-brand-green transition-all shadow-lg shadow-brand-green-deep/20 active:scale-95 flex items-center justify-center gap-2">
                                                <UserIcon className="w-4 h-4" /> লগইন / সাইন আপ
                                            </button>
                                            <p className="text-center text-[10px] text-slate-400 mt-3 px-2 leading-relaxed font-english">Get the best deals & offers</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`lg:hidden fixed inset-0 z-[60] transition-all duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-brand-green-deep/40 backdrop-blur-md transition-opacity duration-500" onClick={() => setIsMenuOpen(false)}></div>

                <div className={`fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white shadow-2xl transform transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col h-full rounded-r-[2.5rem] ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-6 flex justify-between items-center border-b border-slate-50 bg-brand-green-deep rounded-tr-[2.5rem]">
                        <button onClick={() => handleNavClick('home')} className="transform hover:scale-105 transition-transform"><Logo /></button>
                        <button onClick={() => setIsMenuOpen(false)} className="p-3 text-white/70 hover:text-brand-yellow bg-white/10 hover:bg-white/20 rounded-2xl transition-all" aria-label="Close menu">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto custom-scrollbar px-6 py-8">
                        <div className="mb-8">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <SearchIcon className="h-5 w-5 text-slate-400 group-focus-within:text-brand-green transition-colors" />
                                </div>
                                <input
                                    type="search"
                                    placeholder="পণ্য খুঁজুন..."
                                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-brand-green/20 focus:bg-white transition-all shadow-inner font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 mb-4">মেনু</h3>
                                <nav className="grid gap-2">
                                    <button onClick={() => handleNavClick('home')} className="flex items-center gap-4 w-full text-left font-black py-4 px-5 rounded-2xl text-slate-700 hover:bg-brand-green/5 hover:text-brand-green transition-all group active:scale-[0.98]">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-brand-green group-hover:text-white transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                                        </div>
                                        <span className="uppercase tracking-widest text-sm">হোম</span>
                                    </button>
                                    <button onClick={() => navigateToShop('all')} className="flex items-center gap-4 w-full text-left font-black py-4 px-5 rounded-2xl text-slate-700 hover:bg-brand-green/5 hover:text-brand-green transition-all group active:scale-[0.98]">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-brand-green group-hover:text-white transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                        </div>
                                        <span className="uppercase tracking-widest text-sm">শপ</span>
                                    </button>
                                    <button onClick={() => handleNavClick('hotDeals')} className="flex items-center gap-4 w-full text-left font-black py-4 px-5 rounded-2xl text-brand-green hover:bg-brand-green/5 transition-all group active:scale-[0.98]">
                                        <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green group-hover:bg-brand-green group-hover:text-white transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                        </div>
                                        <span className="uppercase tracking-widest text-sm">হট ডিল</span>
                                    </button>
                                </nav>
                            </div>

                            <div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 mb-4">ক্যাটাগরি</h3>
                                <nav className="grid gap-2">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleCategoryClick(cat.id)}
                                            className="flex items-center justify-between w-full text-left font-bold py-4 px-6 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-brand-green transition-all border border-transparent hover:border-slate-100 active:scale-[0.98]"
                                        >
                                            <span className="text-sm font-black uppercase tracking-wider">{cat.name}</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-50 bg-slate-50/50 rounded-br-[2.5rem]">
                        {currentUser ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 bg-white p-4 rounded-[1.5rem] shadow-sm ring-1 ring-slate-100">
                                    <div className="w-12 h-12 bg-brand-yellow rounded-2xl flex items-center justify-center font-black text-brand-green-deep shadow-lg">
                                        {currentUser.name.charAt(0)}
                                    </div>
                                    <div className="flex-grow overflow-hidden">
                                        <p className="font-black text-brand-green-deep truncate">{currentUser.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">অ্যাকাউন্ট প্রোফাইল</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => handleNavClick('account')} className="flex items-center justify-center gap-3 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-white text-slate-700 shadow-sm border border-slate-100 hover:bg-slate-50 transition-all active:scale-95">
                                        প্রোফাইল
                                    </button>
                                    <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="flex items-center justify-center gap-3 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-600 hover:bg-red-100 transition-all active:scale-95">
                                        লগআউট
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => handleNavClick('account')} className="w-full bg-brand-green-deep text-brand-yellow py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-brand-green transition-all active:scale-95 flex items-center justify-center gap-3">
                                <UserIcon className="w-5 h-5" />
                                লগইন / রেজিস্টার
                            </button>
                        )}
                        <p className="text-center text-[10px] font-bold text-slate-400 mt-6 uppercase tracking-[0.2em]">Friend's Gallery &copy; 2024</p>
                    </div>
                </div>
            </div>

        </header >
    );
};