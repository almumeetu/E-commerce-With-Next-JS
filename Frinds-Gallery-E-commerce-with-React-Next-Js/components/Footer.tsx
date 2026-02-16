import React from 'react';
import { ServiceInfo } from './ServiceInfo';
import type { Page } from '../App';
import { BiLogoFacebook, BiLogoInstagram, BiLogoTwitter } from 'react-icons/bi';

interface FooterProps {
    navigateTo: (page: Page) => void;
    navigateToShop: (categoryId: string) => void;
}

const Logo = () => (
    <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center shadow-[0_5px_15px_rgba(251,191,36,0.3)] group-hover:rotate-6 transition-transform">
                <span className="text-brand-green-deep font-black text-xl">F</span>
            </div>
            <span className="text-white font-black text-2xl tracking-tighter uppercase">Friend's Gallery</span>
        </div>
        <div className="flex items-center gap-2 px-1">
            <div className="h-[2px] w-8 bg-brand-yellow/50 rounded-full"></div>
            <p className="text-brand-yellow/70 text-[10px] tracking-[0.4em] uppercase font-black">Verified Premium Store</p>
        </div>
    </div>
);

const SocialIcon: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-brand-green-dark flex items-center justify-center text-white/50 hover:text-brand-green-deep hover:bg-brand-yellow transition-all duration-300 transform hover:-translate-y-2 border border-brand-green-dark hover:border-brand-yellow group">
        <div className="w-6 h-6 transition-transform group-hover:scale-110">{children}</div>
    </a>
);

export const Footer: React.FC<FooterProps> = ({ navigateTo, navigateToShop }) => {
    return (
        <footer className="bg-brand-green-deep text-white/80 relative overflow-hidden pt-20">
            {/* Massive background decorative elements for "Sundr" effect */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-yellow/5 rounded-full -mr-64 -mt-64 blur-[120px]"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-green-deep/40 rounded-full -ml-48 -mb-48 blur-[100px] border border-brand-yellow/10"></div>
            <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-brand-yellow/5 rounded-full blur-[80px]"></div>

            <div className="relative w-full mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
                    {/* Brand Section */}
                    <div className="md:col-span-4 space-y-8">
                        <div className="group cursor-pointer">
                            <Logo />
                        </div>
                        <p className="text-sm leading-relaxed text-white/60 max-w-md font-medium">
                            বাংলাদেশের মহিলাদের ফ্যাশন জগতে আভিজাত্য ও আধুনিকতার এক অনন্য নাম <span className="text-brand-yellow font-black">ফ্রেন্ডস গ্যালারি</span>। আমরা বিশ্বাস করি আপনার পোশাকই আপনার পরিচয়, তাই আমরা দিচ্ছি সেরা মানের প্রিমিয়াম কালেকশন।
                        </p>
                        <div className="flex gap-4 pt-2">
                            <SocialIcon href="#"><BiLogoTwitter className="w-full h-full p-1" /></SocialIcon>
                            <SocialIcon href="#"><BiLogoFacebook className="w-full h-full p-1" /></SocialIcon>
                            <SocialIcon href="#"><BiLogoInstagram className="w-full h-full p-1" /></SocialIcon>
                            <SocialIcon href="#"><BiLogoTwitter className="w-full h-full p-1" /></SocialIcon>
                            <SocialIcon href="#"><BiLogoFacebook className="w-full h-full p-1" /></SocialIcon>
                            <SocialIcon href="#"><BiLogoInstagram className="w-full h-full p-1" /></SocialIcon>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-2">
                        <h3 className="text-sm font-black text-brand-yellow uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                            <span className="w-6 h-[2px] bg-brand-yellow rounded-full"></span>
                            শপ
                        </h3>
                        <ul className="space-y-4">
                            {['long-khimar', 'hijab', 'three-piece', 'innar-collection', 'islamic-item'].map((id) => (
                                <li key={id}>
                                    <button
                                        onClick={() => navigateToShop(id)}
                                        className="text-white/50 hover:text-brand-yellow transition-all flex items-center group text-xs font-black uppercase tracking-widest"
                                    >
                                        <span className="w-0 group-hover:w-3 h-[2px] bg-brand-yellow transition-all mr-0 group-hover:mr-2"></span>
                                        {id === 'long-khimar' ? 'লং খিমার' :
                                            id === 'hijab' ? 'হিজাব' :
                                                id === 'three-piece' ? 'থ্রি-পিস' :
                                                    id === 'innar-collection' ? 'ইনার' : 'ইসলামিক আইটেম'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="text-sm font-black text-brand-yellow uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                            <span className="w-6 h-[2px] bg-brand-yellow rounded-full"></span>
                            সেবা
                        </h3>
                        <ul className="space-y-4">
                            {[
                                { label: 'অ্যাকাউন্ট', page: 'account' },
                                { label: 'ট্র্যাকিং', page: 'utility' },
                                { label: 'রিটার্ন', page: 'returns' },
                                { label: 'শর্তাবলী', page: 'terms' },
                            ].map((item: any) => (
                                <li key={item.page}>
                                    <button
                                        onClick={() => navigateTo(item.page)}
                                        className="text-white/50 hover:text-brand-yellow transition-all text-xs font-black uppercase tracking-widest flex items-center group"
                                    >
                                        <span className="w-0 group-hover:w-3 h-[2px] bg-brand-yellow transition-all mr-0 group-hover:mr-2"></span>
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                            {/* Admin Link Added Here */}
                            <li>
                                <button
                                    onClick={() => navigateTo('admin')}
                                    className="text-white/50 hover:text-brand-yellow transition-all text-xs font-black uppercase tracking-widest flex items-center group"
                                >
                                    <span className="w-0 group-hover:w-3 h-[2px] bg-brand-yellow transition-all mr-0 group-hover:mr-2"></span>
                                    অ্যাডমিন প্যানেল
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter & Contact */}
                    <div className="md:col-span-4 space-y-8">
                        <div>
                            <h3 className="text-sm font-black text-brand-yellow uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                <span className="w-6 h-[2px] bg-brand-yellow rounded-full"></span>
                                নিউজলেটার
                            </h3>
                            <div className="flex flex-col gap-4">
                                <div className="relative group">
                                    <input
                                        type="email"
                                        placeholder="আপনার ইমেইল দিন"
                                        className="w-full bg-black/20 border border-brand-green-dark rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 transition-all text-xs font-black tracking-widest placeholder:text-white/20 text-white"
                                    />
                                    <button className="absolute right-1.5 top-1.5 bg-brand-yellow text-brand-green-deep p-2.5 rounded-xl hover:bg-white transition-all transform active:scale-95 shadow-xl">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-4 group cursor-pointer">
                                <div className="w-12 h-12 rounded-2xl bg-brand-green-dark flex items-center justify-center text-brand-yellow group-hover:bg-brand-yellow group-hover:text-brand-green-deep transition-all shadow-lg border border-brand-green-dark group-hover:scale-110">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h2.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z"></path></svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">কল করুন</span>
                                    <a href="tel:01618803154" className="text-sm font-black text-white hover:text-brand-yellow transition-colors">01618803154</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-brand-green-dark bg-black/40">
                <div className="w-full mx-auto max-w-8xl py-12 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
                            &copy; ২০২৪ <span className="text-brand-yellow">ফ্রেন্ডস গ্যালারি</span>। বাংলাদেশের সেরা ইসলামিক পোশাকের প্রিমিয়াম কালেকশন।
                            <span className="block mt-1 text-white/20">All Rights Reserved. Designed for Excellence.</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-6 saturate-0 opacity-30 hover:saturate-100 hover:opacity-100 transition-all duration-700">
                        <img src="/images/logo/bkash.png" alt="bKash" className="h-8 object-contain" />
                        <img src="/images/logo/nagad.png" alt="Nagad" className="h-8 object-contain" />
                        <div className="h-8 w-px bg-white/10 mx-2"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-brand-green-dark flex items-center justify-center border border-brand-green-dark/50">
                                <svg className="w-4 h-4 text-white/50" fill="currentColor" viewBox="0 0 24 24"><path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H3V6h18v12zm-9-7c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z"></path></svg>
                            </div>
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Secure Payments</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};