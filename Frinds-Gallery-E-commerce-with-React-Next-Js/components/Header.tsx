
import React, { useState, useEffect } from 'react';
import type { Page } from '../App';
import { categories } from '../constants';
import type { Customer } from '../types';
import { SearchIcon, HeartIcon, ShoppingCartIcon, UserCircleIcon, Bars3Icon, XMarkIcon, CubeIcon, UserIcon, ArrowLeftOnRectangleIcon, Cog6ToothIcon } from './icons';

interface HeaderProps {
    navigateTo: (page: Page) => void;
    navigateToShop: (categoryId: string) => void;
    cartItemCount: number;
    wishlistItemCount: number;
    currentUser: Customer | null;
    onLogout: () => void;
}

const Logo = () => (
    <div className="flex items-center gap-3 group cursor-pointer">
        <div className="relative">
            <div className="w-12 h-12 bg-brand-yellow rounded-2xl flex items-center justify-center shadow-[0_10px_20px_-5px_rgba(251,191,36,0.4)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <span className="text-brand-green-deep font-black text-2xl">F</span>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-brand-green-deep animate-pulse"></div>
        </div>
        <div className="flex flex-col">
            <span className="text-white font-black text-xl md:text-2xl leading-none tracking-tight uppercase group-hover:text-brand-yellow transition-colors">Friend's</span>
            <div className="flex items-center gap-1.5 mt-1">
                <div className="h-[2px] w-4 bg-brand-yellow rounded-full"></div>
                <span className="text-brand-yellow font-black text-[10px] md:text-xs leading-none tracking-[0.3em] uppercase">GALLERY</span>
            </div>
        </div>
    </div>
);

// Designated admin user for demo purposes
const ADMIN_EMAIL = 'amina@example.com';

export const Header: React.FC<HeaderProps> = ({ navigateTo, navigateToShop, cartItemCount, wishlistItemCount, currentUser, onLogout }) => {
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
            {/* Top decorative gradient line */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-brand-yellow to-transparent opacity-80 z-10"></div>

            <div className="relative w-full mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-18 sm:h-20">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="lg:hidden p-3 -ml-3 text-white hover:text-brand-yellow bg-white/5 hover:bg-white/10 rounded-2xl transition-all"
                            aria-label="Open menu"
                        >
                            <Bars3Icon className="w-6 h-6" />
                        </button>
                        <div className="ml-4 lg:ml-0">
                            <button onClick={() => handleNavClick('home')} className="block transform hover:scale-105 transition-transform">
                                <Logo />
                            </button>
                        </div>
                    </div>

                    <nav className="hidden lg:flex items-center gap-1 px-2 py-1.5">
                        <button onClick={() => handleNavClick('home')} className="px-5 py-2.5 rounded-full text-sm font-black text-white hover:text-brand-yellow transition-all uppercase tracking-widest">হোম</button>
                        <button onClick={() => navigateToShop('all')} className="px-5 py-2.5 rounded-full text-sm font-black text-white hover:text-brand-yellow transition-all uppercase tracking-widest">শপ</button>
                        <button onClick={() => handleNavClick('hotDeals')} className="px-5 py-2.5 rounded-full text-sm font-black text-brand-yellow hover:bg-brand-yellow/10 transition-all flex items-center gap-2 uppercase tracking-widest">
                            হট ডিল
                            <span className="flex h-2.5 w-2.5 rounded-full bg-brand-yellow animate-ping"></span>
                        </button>
                        <div className="relative group">
                            <button className="px-5 py-2.5 rounded-full text-sm font-black text-white hover:text-brand-yellow transition-all flex items-center gap-2 uppercase tracking-widest">
                                ক্যাটাগরি
                                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                            <div className="absolute left-0 mt-4 w-72 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] bg-brand-green-deep border border-brand-yellow/20 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-3 z-50 transform translate-y-4 group-hover:translate-y-0 text-white">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryClick(cat.id)}
                                        className="block text-left w-full px-8 py-4 text-sm text-white/80 hover:bg-brand-yellow/10 hover:text-brand-yellow font-black uppercase tracking-widest transition-all border-l-4 border-transparent hover:border-brand-yellow"
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button onClick={() => handleNavClick('contact')} className="px-5 py-2.5 rounded-full text-sm font-black text-white hover:text-brand-yellow transition-all uppercase tracking-widest">যোগাযোগ</button>
                    </nav>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <button onClick={() => handleNavClick('wishlist')} className="relative p-3.5 text-white/70 hover:text-brand-yellow hover:bg-brand-yellow/10 rounded-2xl transition-all group">
                            <HeartIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                            {wishlistItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-yellow text-brand-green-deep text-[10px] font-black shadow-lg border-2 border-brand-green-deep animate-bounce">
                                    {wishlistItemCount}
                                </span>
                            )}
                        </button>

                        <button onClick={() => handleNavClick('checkout')} className="relative p-3.5 text-white underline-offset-4 hover:text-brand-yellow bg-transparent hover:bg-brand-yellow/10 rounded-2xl transition-all group">
                            <ShoppingCartIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-yellow text-brand-green-deep text-[10px] font-black shadow-lg border-2 border-brand-green-deep animate-bounce">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                        <div className="relative group ml-2">
                            <button onClick={() => navigateTo('account')} className="flex items-center gap-3 p-1.5 pr-5 rounded-full bg-transparent hover:bg-brand-yellow/10 border border-transparent hover:border-brand-yellow/20 transition-all group">
                                <div className="w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                                    <UserCircleIcon className="h-7 w-7 text-brand-green-deep" />
                                </div>
                                <span className="hidden xl:block text-xs font-black uppercase tracking-widest text-white">{currentUser ? currentUser.name.split(' ')[0] : 'অ্যাকাউন্ট'}</span>
                            </button>
                            <div className="absolute right-0 mt-3 w-72 rounded-2xl shadow-2xl bg-white overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform translate-y-2 group-hover:translate-y-0">
                                <div className="bg-brand-green-deep p-6 text-white relative">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-yellow/10 rounded-full -mr-8 -mt-8"></div>
                                    {currentUser ? (
                                        <>
                                            <p className="font-bold text-lg mb-0.5">হ্যালো, {currentUser.name}</p>
                                            <p className="text-white/70 text-sm truncate">{currentUser.email}</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="font-bold text-lg mb-1">ফ্রেন্ডস গ্যালারি</p>
                                            <p className="text-white/70 text-sm italic">আপনার ফ্যাশন, আপনার পরিচয়</p>
                                        </>
                                    )}
                                </div>
                                <div className="p-4 space-y-1">
                                    {currentUser ? (
                                        <>
                                            <button onClick={() => navigateTo('account')} className="flex items-center gap-3 w-full text-left px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-semibold">
                                                <UserIcon className="h-5 w-5 text-brand-green-deep" /> আমার অ্যাকাউন্ট
                                            </button>
                                            <button onClick={() => navigateTo('admin')} className="flex items-center gap-3 w-full text-left px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-semibold">
                                                <Cog6ToothIcon className="h-5 w-5 text-brand-green-deep" /> অ্যাডমিন প্যানেল
                                            </button>
                                            <div className="h-px bg-slate-100 my-2 mx-4"></div>
                                            <button onClick={onLogout} className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold">
                                                <ArrowLeftOnRectangleIcon className="h-5 w-5" /> লগআউট
                                            </button>
                                        </>
                                    ) : (
                                        <div className="p-2">
                                            <button onClick={() => navigateTo('account')} className="w-full bg-brand-green-deep text-white py-4 rounded-xl font-bold hover:bg-brand-green transition-all shadow-lg shadow-brand-green-deep/20 active:scale-95">
                                                লগইন অথবা সাইন আপ
                                            </button>
                                            <p className="text-center text-xs text-slate-400 mt-4 px-4 leading-relaxed">অর্ডার করতে এবং সেরা ডিল পেতে আজই আমাদের সাথে যুক্ত হন</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`lg:hidden fixed inset-0 z-50 transition-opacity ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>

                <div className={`fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col h-full ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-4 flex justify-between items-center border-b">
                        <button onClick={() => handleNavClick('home')}><Logo /></button>
                        <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-500 hover:text-brand-green" aria-label="Close menu">
                            <XMarkIcon />
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto">
                        <div className="p-4">
                            <div className="relative mb-4">
                                <input type="search" placeholder="পণ্য খুঁজুন..." className="w-full rounded-full pl-4 pr-10" />
                                <button className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-slate-500 hover:text-brand-green">
                                    <SearchIcon />
                                </button>
                            </div>

                            <nav className="space-y-1">
                                <button onClick={() => handleNavClick('home')} className="block w-full text-left font-semibold py-2.5 px-3 rounded-md hover:bg-slate-100">হোম</button>
                                <button onClick={() => navigateToShop('all')} className="block w-full text-left font-semibold py-2.5 px-3 rounded-md hover:bg-slate-100">শপ</button>
                                <button onClick={() => handleNavClick('hotDeals')} className="block w-full text-left font-semibold py-2.5 px-3 rounded-md hover:bg-slate-100">হট ডিল</button>
                            </nav>
                        </div>

                        <div className="border-t p-4">
                            <h3 className="font-bold text-slate-800 px-3 py-2">ক্যাটাগরি</h3>
                            <nav className="space-y-1">
                                {categories.map(cat => (
                                    <button key={cat.id} onClick={() => handleCategoryClick(cat.id)} className="block w-full text-left py-2.5 px-3 rounded-md hover:bg-slate-100 text-slate-600">{cat.name}</button>
                                ))}
                            </nav>
                        </div>

                        <div className="border-t p-4">
                            <nav className="space-y-1">
                                <button onClick={() => handleNavClick('about')} className="block w-full text-left font-semibold py-2.5 px-3 rounded-md hover:bg-slate-100">আমাদের সম্পর্কে</button>
                                <button onClick={() => handleNavClick('contact')} className="block w-full text-left font-semibold py-2.5 px-3 rounded-md hover:bg-slate-100">যোগাযোগ</button>
                            </nav>
                        </div>
                    </div>

                    <div className="p-4 border-t bg-slate-50">
                        {currentUser ? (
                            <div className="space-y-2">
                                <p className="px-3 text-sm text-slate-500">হ্যালো, <strong>{currentUser.name}</strong></p>
                                <button onClick={() => handleNavClick('account')} className="w-full flex items-center text-left px-3 py-2.5 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-200">
                                    <UserIcon className="mr-3" /> আমার অ্যাকাউন্ট
                                </button>
                                <button onClick={() => handleNavClick('admin')} className="w-full flex items-center text-left px-3 py-2.5 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-200">
                                    <Cog6ToothIcon className="mr-3" /> অ্যাডমিন ড্যাশবোর্ড
                                </button>
                                <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="w-full flex items-center text-left px-3 py-2.5 rounded-md text-sm font-semibold text-red-600 hover:bg-red-50">
                                    <ArrowLeftOnRectangleIcon className="mr-3" /> লগআউট
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => handleNavClick('account')} className="w-full bg-brand-green text-white py-2.5 rounded-lg font-semibold hover:bg-brand-green-dark transition-all">
                                লগইন / রেজিস্টার
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};