'use client';

import React from 'react';
import { Product } from '@/types';
import { X, ShoppingBag, Heart, ShoppingCart } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function QuickViewModal({ product, isOpen, onClose, onAddToCart }: QuickViewModalProps) {
  if (!product) return null;

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-sm" onClick={onClose} />

      <div className={`relative bg-white w-full max-w-4xl rounded-[32px] overflow-hidden shadow-2xl transform transition-all duration-500 flex flex-col md:flex-row ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'}`}>
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition">
          <X size={20} className="text-stone-800" />
        </button>

        {/* Image Section */}
        <div className="md:w-1/2 bg-stone-50 p-8">
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-inner bg-white">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Info Section */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
          <div className="mb-auto">
            <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-2 block">{product.category}</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 mb-4">{product.name}</h2>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-black text-emerald-800">৳ {product.price}</span>
              <span className="text-stone-400 line-through">৳ {Math.round(product.price * 1.1)}</span>
              <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-1 rounded-lg">১০% ছাড়</span>
            </div>

            <p className="text-stone-600 leading-relaxed mb-8">
              {product.description || 'এই পণ্যটি আপনার রমজানকে আরও সুন্দর করে তুলবে। এর স্বাদ এবং গুণমান বজায় রাখতে আমরা সর্বদাই সচেষ্ট।'}
            </p>

            <div className="space-y-4">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  স্টক আছে ({product.stock} টি)
                </div>
              ) : (
                <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                  স্টক শেষ
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <button
              onClick={() => { onAddToCart(product); onClose(); }}
              className="flex items-center justify-center gap-2 bg-emerald-900 text-white py-4 rounded-2xl font-bold hover:bg-emerald-950 transition-all shadow-xl shadow-emerald-900/20"
            >
              <ShoppingCart size={20} /> কার্টে যোগ করুন
            </button>
            <button className="flex items-center justify-center gap-2 bg-stone-100 text-stone-800 py-4 rounded-2xl font-bold hover:bg-stone-200 transition-all">
              <Heart size={20} /> উইশলিস্ট
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}