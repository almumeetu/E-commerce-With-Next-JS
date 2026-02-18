import React, { useState } from 'react';
import { Product } from '@/types';
import { BiShow, BiHeart, BiShoppingBag, BiPackage, BiPlus, BiLoaderAlt, BiStar } from 'react-icons/bi';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, quantity?: number) => void;
  addToCart?: (productId: string, quantity: number) => void;
  buyNow?: (productId: string, quantity: number) => void;
  isInWishlist?: boolean;
  onToggleWishlist?: (id: string) => void;
  toggleWishlist?: (id: string) => void; // Alias
  onQuickView?: (product: Product) => void;
  showQuickActions?: boolean;
  compact?: boolean;
  onProductSelect?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  addToCart,
  buyNow,
  isInWishlist = false,
  onToggleWishlist,
  toggleWishlist,
  onQuickView,
  showQuickActions = true,
  compact = false,
  onProductSelect
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  // Handle aliases
  const handleToggleWishlist = onToggleWishlist || toggleWishlist;
  const handleAddToCartAction = onAddToCart || ((p) => addToCart && addToCart(p.id, 1));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;

    setIsAdding(true);
    if (handleAddToCartAction) {
      handleAddToCartAction(product);
    }
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;

    setIsBuying(true);
    if (buyNow) {
      buyNow(product.id, 1);
    }
    setTimeout(() => setIsBuying(false), 1000);
  };

  const handleCardClick = () => {
    if (onProductSelect) {
      onProductSelect(product);
    }
  };

  // Safe checks for new/popular with types casting to avoid TS errors
  const isNew = (product as any).isNew || (product.date && new Date(product.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0;

  const displayImage = product.imageUrl || (product as any).image || '/images/placeholder.png';

  if (compact) {
    return (
      <div
        onClick={handleCardClick}
        className="bg-white rounded-xl shadow-sm hover:shadow-card-hover transition-all duration-300 group border border-slate-100 overflow-hidden cursor-pointer flex gap-3 p-2 h-full"
      >
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-50 flex-shrink-0 relative">
          {!imageError ? (
            <img
              src={displayImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <BiPackage size={20} />
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight mb-1 group-hover:text-brand-green-deep transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-sm font-bold text-brand-green-deep font-english">৳{product.price.toLocaleString()}</span>
            <button
              onClick={handleAddToCart}
              disabled={isAdding || product.stock <= 0}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand-yellow/10 text-brand-green-deep hover:bg-brand-yellow hover:text-brand-green-deep transition-all active:scale-90"
            >
              {isAdding ? <div className="animate-spin"><BiLoaderAlt /></div> : <BiShoppingBag />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl sm:rounded-[1.5rem] border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 cursor-pointer w-full"
    >
      {/* Scroll-stop improvement for mobile grid */}
      <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-slate-50">
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md shadow-sm font-english tracking-wide backdrop-blur-md bg-opacity-90">
              -{discountPercent}%
            </span>
          )}
          {isNew && (
            <span className="bg-brand-green-deep text-brand-yellow text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm tracking-wider uppercase border border-brand-yellow/20 backdrop-blur-md bg-opacity-90">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        {handleToggleWishlist && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleToggleWishlist(product.id);
            }}
            className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm text-slate-400 hover:text-red-500 hover:bg-white transition-all shadow-sm active:scale-95 group/wishlist"
          >
            <div className={`transition-colors ${isInWishlist ? 'text-red-500 fill-red-500' : 'group-hover/wishlist:text-red-500'}`}>
              <BiHeart size={18} />
            </div>
          </button>
        )}

        {/* Image */}
        {!imageError ? (
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
            <BiPackage size={32} />
            <span className="text-xs">No Image</span>
          </div>
        )}

        {/* Quick View Overlay (Desktop) */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden lg:flex justify-center bg-gradient-to-t from-black/50 to-transparent pt-10">
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="bg-white text-slate-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg hover:bg-brand-yellow hover:text-brand-green-deep transition-colors flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 duration-300"
            >
              <BiShow size={16} /> দ্রুত দেখুন
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        {/* Category & Rating */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider font-semibold truncate max-w-[60%]">
            {product.category}
          </span>
          <div className="flex items-center gap-0.5 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100">
            <div className="text-brand-yellow text-xs"><BiStar /></div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-700 font-english">{product.rating}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-bold text-slate-800 line-clamp-2 leading-tight mb-2 min-h-[2.5em] group-hover:text-brand-green-deep transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
          <span className="text-base sm:text-lg font-bold text-brand-green-deep font-english">
            ৳{product.price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs sm:text-sm text-slate-400 line-through font-english">
              ৳{product.originalPrice?.toLocaleString()}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
          <button
            onClick={handleBuyNow}
            disabled={product.stock <= 0 || isBuying}
            className="w-full bg-brand-green-deep text-white py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-brand-green-deep/10 hover:shadow-brand-green-deep/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider h-[44px]"
          >
            {isBuying ? (
              <div className="animate-spin text-lg"><BiLoaderAlt /></div>
            ) : (
              <>
                <div className="text-lg"><BiShoppingBag /></div>
                <span>এখনই কিনুন</span>
              </>
            )}
          </button>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || isAdding}
            className="w-[44px] h-[44px] flex items-center justify-center rounded-xl bg-brand-yellow text-brand-green-deep hover:bg-brand-yellow-vibrant transition-colors active:scale-90 disabled:opacity-50 shadow-md hover:shadow-lg"
          >
            {isAdding ? (
              <div className="animate-spin"><BiLoaderAlt /></div>
            ) : (
              <BiPlus size={24} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
