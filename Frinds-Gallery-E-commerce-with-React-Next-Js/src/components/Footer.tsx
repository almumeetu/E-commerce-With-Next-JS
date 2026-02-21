import React from 'react';
import type { Page } from '../types';
import type { Category } from '../types';
import { BiLogoFacebook, BiLogoInstagram, BiLogoYoutube, BiLogoTiktok, BiMap, BiEnvelope, BiPhoneCall } from 'react-icons/bi';

interface FooterProps {
    navigateTo: (page: Page) => void;
    navigateToShop: (categoryId: string) => void;
    categories?: Category[];
}

const Logo = () => (
    <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center shadow-[0_0_25px_rgba(251,191,36,0.4)] transform hover:rotate-12 transition-all duration-500">
                <span className="text-brand-green-deep font-black text-2xl">F</span>
            </div>
            <span className="text-white font-black text-2xl tracking-tighter uppercase drop-shadow-lg">Friend's Gallery</span>
        </div>
        <div className="flex items-center gap-3 px-1">
            <div className="h-[2px] w-12 bg-gradient-to-r from-brand-yellow to-transparent rounded-full"></div>
            <p className="text-brand-yellow/90 text-[10px] tracking-[0.3em] uppercase font-black">Premium Lifestyle</p>
        </div>
    </div>
);

const SocialIcon: React.FC<{ href: string, children: React.ReactNode, label: string, color?: string }> = ({ href, children, label, color }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-brand-yellow transition-all duration-300 transform hover:-translate-y-1 hover:scale-110 border border-white/10 hover:border-brand-yellow shadow-lg hover:shadow-brand-yellow/50 ${color ? color : 'hover:text-brand-green-deep'}`}
    >
        <div className="w-5 h-5">{children}</div>
    </a>
);

export const Footer: React.FC<FooterProps> = ({ navigateTo, navigateToShop, categories = [] }) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-brand-green-deep text-white/80 relative overflow-hidden pt-20 border-t-4 border-brand-yellow">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-yellow/5 rounded-full -mr-48 -mt-48 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-green-light/10 rounded-full -ml-32 -mb-32 blur-[100px] pointer-events-none"></div>

            <div className="relative w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="cursor-pointer inline-block" onClick={() => navigateTo('home')}>
                            <Logo />
                        </div>
                        <p className="text-sm leading-relaxed text-white/60 font-medium pr-4">
                            বাংলাদেশের মহিলাদের ফ্যাশন জগতে আভিজাত্য ও আধুনিকতার এক অনন্য নাম <span className="text-brand-yellow font-black">ফ্রেন্ডস গ্যালারি</span>। আপনার স্টাইল, আমাদের প্যাশন।
                        </p>
                        <div className="flex gap-3">
                            <SocialIcon href="https://facebook.com" label="Facebook" color="hover:text-[#1877F2]"><BiLogoFacebook size={20} /></SocialIcon>
                            <SocialIcon href="https://instagram.com" label="Instagram" color="hover:text-[#E4405F]"><BiLogoInstagram size={20} /></SocialIcon>
                            <SocialIcon href="https://youtube.com" label="YouTube" color="hover:text-[#FF0000]"><BiLogoYoutube size={20} /></SocialIcon>
                            <SocialIcon href="https://tiktok.com" label="TikTok" color="hover:text-[#000000]"><BiLogoTiktok size={20} /></SocialIcon>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-wider mb-6 relative inline-block">
                            কালেকশন
                            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-brand-yellow rounded-full"></span>
                        </h3>
                        <ul className="space-y-3">
                            {categories.slice(0, 6).map((category) => (
                                <li key={category.id}>
                                    <button
                                        onClick={() => navigateToShop(category.id)}
                                        className="group flex items-center text-sm text-white/60 hover:text-brand-yellow transition-colors duration-300 font-medium"
                                    >
                                        <span className="w-0 group-hover:w-2 h-[2px] bg-brand-yellow mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                        {category.name}
                                    </button>
                                </li>
                            ))}
                            {categories.length === 0 && (
                                <li className="text-sm text-white/40 italic">কোনো ক্যাটাগরি পাওয়া যায়নি</li>
                            )}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-wider mb-6 relative inline-block">
                            কাস্টমার সেবা
                            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-brand-yellow rounded-full"></span>
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { label: 'আমার অ্যাকাউন্ট', page: 'account' },
                                { label: 'অর্ডার ট্র্যাকিং', page: 'utility' },
                                { label: 'রিটার্ন পলিসি', page: 'returns' },
                                { label: 'শর্তাবলী ও নিয়ম', page: 'terms' },
                            ].map((item: any) => (
                                <li key={item.page}>
                                    <button
                                        onClick={() => navigateTo(item.page)}
                                        className="group flex items-center text-sm text-white/60 hover:text-brand-yellow transition-colors duration-300 font-medium"
                                    >
                                        <span className="w-0 group-hover:w-2 h-[2px] bg-brand-yellow mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                            {/* Admin Link */}
                            <li>
                                <button
                                    onClick={() => navigateTo('admin')}
                                    className="group flex items-center text-sm text-white/40 hover:text-red-400 transition-colors duration-300 font-medium mt-4 border-t border-white/10 pt-2 w-full"
                                >
                                    <span className="w-0 group-hover:w-2 h-[2px] bg-red-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                    অ্যাডমিন প্যানেল
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-wider mb-6 relative inline-block">
                            যোগাযোগ
                            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-brand-yellow rounded-full"></span>
                        </h3>
                        <div className="space-y-5">
                            <div className="flex items-start gap-4 group">
                                <div className="p-3 rounded-lg bg-white/5 text-brand-yellow ring-1 ring-white/10 group-hover:bg-brand-yellow group-hover:text-brand-green-deep transition-all duration-300">
                                    <BiMap size={20} />
                                </div>
                                <div>
                                    <h4 className="text-xs text-white/40 font-bold uppercase tracking-widest mb-1">অফিস</h4>
                                    <p className="text-sm text-white/80 font-medium">মিরপুর-১০, ঢাকা-১২১৬</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="p-3 rounded-lg bg-white/5 text-brand-yellow ring-1 ring-white/10 group-hover:bg-brand-yellow group-hover:text-brand-green-deep transition-all duration-300">
                                    <BiPhoneCall size={20} />
                                </div>
                                <div>
                                    <h4 className="text-xs text-white/40 font-bold uppercase tracking-widest mb-1">হটলাইন</h4>
                                    <a href="tel:01618803154" className="text-sm text-white/80 font-medium hover:text-brand-yellow transition-colors">01618803154</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="p-3 rounded-lg bg-white/5 text-brand-yellow ring-1 ring-white/10 group-hover:bg-brand-yellow group-hover:text-brand-green-deep transition-all duration-300">
                                    <BiEnvelope size={20} />
                                </div>
                                <div>
                                    <h4 className="text-xs text-white/40 font-bold uppercase tracking-widest mb-1">ইমেইল</h4>
                                    <a href="mailto:support@friendsgallery.com" className="text-sm text-white/80 font-medium hover:text-brand-yellow transition-colors">support@friendsgallery.com</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-black/30 border-t border-white/5 backdrop-blur-sm">
                <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-left">
                            <p className="text-xs text-white/40 font-medium">
                                &copy; {currentYear} <span className="text-brand-yellow font-bold">Friend's Gallery</span>. All rights reserved.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold hidden sm:block">We Accept</span>
                            <div className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity">
                                <img src="/images/logo/bkash.png" alt="bKash" className="h-6 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                                <img src="/images/logo/nagad.png" alt="Nagad" className="h-6 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                                <div className="h-6 w-px bg-white/10"></div>
                                <span className="text-xs text-white/50 font-medium">COD Available</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};