'use client';

import React from 'react';
import { Facebook, Phone, Mail, MapPin, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer role="contentinfo" className="bg-emerald-950 text-emerald-100/80 pt-16 pb-8 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-white tracking-wide">
              রোজার<span className="text-gold-400">হাট</span>
            </h3>
            <p className="text-sm leading-relaxed max-w-xs">
              রমজানের পবিত্রতা রক্ষা করে আমরা পৌঁছে দিচ্ছি ভেজালমুক্ত এবং হালাল পণ্য। আপনার রোজা ও ইফতার হোক প্রশান্তিময়।
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-gold-500 hover:text-emerald-950 transition duration-300"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-gold-500 hover:text-emerald-950 transition duration-300"><Instagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-gold-500 hover:text-emerald-950 transition duration-300"><Youtube size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">ন্যাভিগেশন</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-gold-400 transition flex items-center"><span className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-2 opacity-0 hover:opacity-100 transition"></span>হোম</Link></li>
              <li><Link href="/shop" className="hover:text-gold-400 transition flex items-center"><span className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-2 opacity-0 hover:opacity-100 transition"></span>সকল পণ্য</Link></li>
              <li><Link href="/about" className="hover:text-gold-400 transition flex items-center"><span className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-2 opacity-0 hover:opacity-100 transition"></span>আমাদের গল্প</Link></li>
              <li><Link href="/contact" className="hover:text-gold-400 transition flex items-center"><span className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-2 opacity-0 hover:opacity-100 transition"></span>যোগাযোগ</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">কাস্টমার সার্ভিস</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/faq" className="hover:text-gold-400 transition">সচরাচর জিজ্ঞাসা (FAQ)</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-gold-400 transition">গোপনীয়তা নীতিমালা</Link></li>
              <li><Link href="/terms-conditions" className="hover:text-gold-400 transition">শর্তাবলী</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">যোগাযোগ</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <span>উত্তরা সেক্টর ১১, ঢাকা, বাংলাদেশ</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-gold-400 shrink-0" />
                <span className="font-mono text-base">+8801722-301927</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-gold-400 shrink-0" />
                <span>almumeetu@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-emerald-900/50 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs md:text-sm text-center md:text-left">&copy; {new Date().getFullYear()} রোজারহাট. সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="w-full md:w-auto flex justify-center md:justify-end">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md text-white bg-[#e2136e] shadow-sm shadow-[#e2136e]/40">bKash</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md text-white bg-[#f7931e] shadow-sm shadow-[#f7931e]/40">Nagad</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md text-emerald-900 bg-white border border-emerald-200 shadow-sm">COD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;