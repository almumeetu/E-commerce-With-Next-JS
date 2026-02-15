import React from 'react';
import type { Product } from '../types';
import { HeartIcon, ShoppingCartIcon, EyeIcon } from './icons';

interface MobileProductCardProps {
  product: Product;
  onProductSelect: (product: Product) => void;
  addToCart: (productId: string, quantity: number) => void;
  buyNow: (productId: string, quantity: number) => void;
  isInWishlist: boolean;
  toggleWishlist: (productId: string) => void;
  onQuickView: (product: Product) => void;
}

const StarRating: React.FC<{ rating: number, reviewCount: number }> = ({ rating, reviewCount }) => {
  return (
    <div className="flex items-center">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className={`w-4 h-4 ${i < Math.round(rating) ? 'text-amber-400' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-slate-500 ml-1.5">({reviewCount})</span>
    </div>
  );
};

export const MobileProductCard: React.FC<MobileProductCardProps> = ({ product, onProductSelect, addToCart, buyNow, isInWishlist, toggleWishlist, onQuickView }) => {
  const displayImage = product.imageUrl || '/images/products/default.webp';

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isNew = product.date ? (new Date().getTime() - new Date(product.date).getTime()) < 7 * 24 * 60 * 60 * 1000 : false;

  return (
    <div className="w-full h-full bg-white rounded-[2rem] border border-slate-100 overflow-hidden group flex flex-col relative transition-all duration-500 premium-card-shadow hover:-translate-y-2">
      <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden bg-slate-50 cursor-pointer" onClick={() => onProductSelect(product)}>
        {/* Quick View Button */}
        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none group-hover:pointer-events-auto bg-brand-green-deep/20 backdrop-blur-[2px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 bg-brand-yellow text-brand-green-deep px-6 py-3 rounded-xl text-xs font-black uppercase tracking-[0.1em] shadow-2xl hover:scale-110 active:scale-95 flex items-center gap-2"
          >
            <EyeIcon className="h-4 w-4" />
            <span>দ্রুত দেখুন</span>
          </button>
        </div>

        <img
          className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-110"
          src={displayImage}
          alt={product.name}
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
          {discount > 0 && (
            <div className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg border border-white/20">
              -{discount}%
            </div>
          )}
          {isNew && (
            <div className="bg-brand-green-deep text-brand-yellow text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg border border-brand-yellow/30 bg-opacity-90 backdrop-blur-md">
              NEW
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-brand-yellow hover:text-brand-green-deep transition-all duration-300 z-20 shadow-xl border border-white/20 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-x-4 sm:group-hover:translate-x-0"
        >
          <HeartIcon className={`w-5 h-5 ${isInWishlist ? 'text-brand-green-deep fill-current' : ''}`} isFilled={isInWishlist} />
        </button>

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[4px] z-30 flex items-center justify-center">
            <span className="bg-brand-green-deep text-brand-yellow font-black text-xs uppercase tracking-[0.2em] px-6 py-3 rounded-xl border border-brand-yellow/30 shadow-2xl">Stock Out</span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow bg-white">
        <div className="flex-grow">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-green mb-2 block">{product.category}</span>
          <h3
            className="text-base sm:text-lg font-bold text-slate-800 cursor-pointer hover:text-brand-green transition-colors line-clamp-2 mb-3 leading-snug"
            onClick={() => onProductSelect(product)}
          >
            {product.name}
          </h3>
          <div className="mb-4">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          </div>
        </div>

        <div className="mt-auto pt-5 border-t border-slate-50">
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-2xl font-black text-brand-green-deep">৳{product.price.toLocaleString('bn-BD')}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-slate-400 line-through font-medium">৳{product.originalPrice.toLocaleString('bn-BD')}</span>
            )}
          </div>

          <div className="grid grid-cols-5 gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product.id, 1);
              }}
              disabled={product.stock === 0}
              className="col-span-1 flex items-center justify-center bg-slate-900 text-white rounded-xl hover:bg-brand-green-deep transition-all duration-300 disabled:opacity-50 h-12 shadow-lg"
            >
              <ShoppingCartIcon className="h-5 w-5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                buyNow(product.id, 1);
              }}
              disabled={product.stock === 0}
              className="col-span-4 flex items-center justify-center bg-brand-green-deep text-brand-yellow rounded-xl hover:bg-brand-green transition-all duration-300 disabled:opacity-50 font-black text-xs tracking-[0.1em] uppercase h-12 shadow-[0_10px_20px_-5px_rgba(6,78,59,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(6,78,59,0.4)] active:scale-95"
            >
              এখনই কিনুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};