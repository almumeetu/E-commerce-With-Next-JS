'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { Eye, Heart, ShoppingBag, ShoppingCart, Package, Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity?: number) => void;
  isInWishlist?: boolean;
  onToggleWishlist?: (id: string | number) => void;
  onQuickView?: (product: Product) => void;
  showQuickActions?: boolean;
  compact?: boolean;
}

export default function ProductCard({
  product,
  onAddToCart,
  isInWishlist = false,
  onToggleWishlist,
  onQuickView,
  compact = false
}: ProductCardProps) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleBuyNow = async () => {
    setIsBuying(true);
    try {
      onAddToCart(product, 1);
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/checkout');
    } finally {
      setIsBuying(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      onAddToCart(product, 1);
    } finally {
      setIsAdding(false);
    }
  };

  if (compact) {
    return (
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100 overflow-hidden">
        <div className="flex gap-4 p-3">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
            {!imageError ? (
              <img
                src={product.image || '/images/placeholder.png'}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-8 h-8 text-slate-300" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h3 className="font-bold text-slate-800 text-sm tracking-tight line-clamp-2 group-hover:text-brand-green transition-colors duration-300 leading-tight mb-1">{product.name}</h3>
            <div className="flex items-center justify-between mt-auto">
              <div>
                <p className="text-base font-black text-brand-green-deep">৳{(product.price || 0).toLocaleString('en-US')}</p>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isAdding || product.stock <= 0}
                className="bg-brand-yellow text-brand-green-deep p-2 rounded-lg hover:bg-brand-yellow-vibrant transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:scale-110 active:scale-95"
              >
                {isAdding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShoppingCart className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 group relative border border-slate-100 overflow-hidden premium-card-shadow">
      {/* Top Badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {product.isNew && (
          <span className="bg-brand-green-deep text-brand-yellow text-[10px] px-3 py-1 rounded-full font-black shadow-lg tracking-[0.1em] uppercase border border-brand-yellow/30 bg-opacity-90 backdrop-blur-md">
            NEW
          </span>
        )}
        {product.isPopular && (
          <span className="bg-brand-yellow text-brand-green-deep text-[10px] px-3 py-1 rounded-full font-black shadow-lg tracking-[0.1em] uppercase border border-brand-green-deep/10 bg-opacity-90 backdrop-blur-md">
            HOT
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      {onToggleWishlist && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-md p-2.5 rounded-full hover:bg-brand-yellow transition-all duration-300 shadow-xl border border-white/20 group/wishlist"
        >
          <Heart
            size={18}
            className={`transition-all duration-300 ${isInWishlist ? 'fill-brand-green-deep text-brand-green-deep scale-110' : 'text-white group-hover/wishlist:text-brand-green-deep'}`}
          />
        </button>
      )}

      {/* Product Image */}
      <div className="relative h-72 sm:h-80 overflow-hidden bg-slate-50">
        {!imageError ? (
          <img
            src={product.image || '/images/placeholder.png'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-20 h-20 text-slate-200" />
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-green-deep/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="w-full bg-brand-yellow text-brand-green-deep py-3.5 rounded-xl text-sm font-black hover:bg-brand-yellow-vibrant transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_10px_20px_-5px_rgba(251,191,36,0.3)] transform translate-y-4 group-hover:translate-y-0"
            >
              <Eye size={16} />
              দ্রুত দেখুন
            </button>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="mb-4">
          <p className="text-[10px] text-brand-green font-black tracking-[0.2em] uppercase mb-1">{product.category}</p>
          <h3 className="font-bold text-slate-900 text-lg sm:text-xl tracking-tight leading-tight line-clamp-1 group-hover:text-brand-green transition-colors duration-300">
            {product.name}
          </h3>
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <p className="text-2xl font-black text-brand-green-deep tracking-tighter">৳{(product.price || 0).toLocaleString('en-US')}</p>
            {(product as any).originalPrice && (product as any).originalPrice > product.price && (
              <p className="text-sm text-slate-400 line-through font-medium">৳{((product as any).originalPrice || 0).toLocaleString('en-US')}</p>
            )}
          </div>
          <div className="bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">স্টক</p>
            <p className="text-xs font-black text-slate-800 text-center">{product.stock} পিস</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-5 gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.stock <= 0}
            className="col-span-1 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-brand-green-deep transition-all duration-300 disabled:opacity-50 group-hover:shadow-lg"
          >
            {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus size={20} />}
          </button>

          <button
            onClick={handleBuyNow}
            disabled={isBuying || product.stock <= 0}
            className="col-span-4 bg-brand-green-deep text-brand-yellow py-4 rounded-xl font-black tracking-widest uppercase text-xs transition-all duration-300 hover:bg-brand-green hover:shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isBuying ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ShoppingBag size={14} />
                এখনই কিনুন
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
