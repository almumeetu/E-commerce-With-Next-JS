'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { Eye, Heart, ShoppingBag, ShoppingCart, Truck, Shield, Zap, TrendingUp, Package, Clock, Award, RefreshCw, Plus, Minus, Loader2, Globe, Languages } from 'lucide-react';
import Link from 'next/link';
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
  showQuickActions = true,
  compact = false
}: ProductCardProps) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleBuyNow = async () => {
    setIsBuying(true);
    try {
      onAddToCart(product, quantity);
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
      onAddToCart(product, quantity);
      setQuantity(1);
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const getStockStatus = () => {
    if (product.stock <= 0) return { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-100', bn: 'স্টক আউট' };
    if (product.stock < 10) return { text: `Low Stock (${product.stock})`, color: 'text-amber-600', bg: 'bg-amber-100', bn: `কম স্টক (${product.stock})` };
    return { text: 'In Stock', color: 'text-green-600', bg: 'bg-green-100', bn: 'স্টক আছে' };
  };

  const stockStatus = getStockStatus();

  if (compact) {
    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100">
        <div className="flex gap-4 p-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
            {!imageError ? (
              <img
                src={product.image || '/images/placeholder.png'}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm tracking-tight line-clamp-2 group-hover:text-emerald-600 transition-colors duration-300">{product.name}</h3>
            <p className="text-xs text-gray-500 mb-2">{product.category}</p>
            <div className="flex items-center justify-between">
            <div>
                <p className="text-lg font-bold text-amber-600">৳{(product.price || 0).toLocaleString('en-US')}</p>
                <p className="text-xs text-gray-500">{product.unit || 'কেজি'}</p>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isAdding || product.stock <= 0}
                className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
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
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group relative border border-gray-100 overflow-hidden">
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
        {product.isNew && (
          <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-md tracking-wide">
            নতুন
          </span>
        )}
        {product.isPopular && (
          <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
            জনপ্রিয়
          </span>
        )}
        {(product as any).discount && (
          <span className="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
            {(product as any).discount}% ছাড়
          </span>
        )}
        {(product as any).localBrand && (
          <span className="bg-gradient-to-r from-green-600 to-green-700 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
            🇧🇩 স্থানীয়
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      {onToggleWishlist && (
        <button
          onClick={() => onToggleWishlist(product.id)}
          className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-sm p-2.5 rounded-full hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg group/wishlist"
        >
          <Heart
            size={16}
            className={`transition-all duration-300 ${isInWishlist ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-600 group-hover/wishlist:text-red-500'}`}
          />
        </button>
      )}

      {/* Product Image */}
      <div className="relative h-72 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {!imageError ? (
          <img
            src={product.image || '/images/placeholder.png'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-20 h-20 text-gray-400" />
          </div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            {onQuickView && (
              <button
                onClick={() => onQuickView(product)}
                className="flex-1 bg-white/95 backdrop-blur-sm text-gray-800 py-2.5 px-4 rounded-xl text-sm font-semibold hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                <Eye size={14} />
                দ্রুত দেখুন
              </button>
            )}
          </div>
        </div>

        {/* Stock Status Badge */}
        <div className="absolute bottom-3 left-3">
          <span className={`text-xs px-2.5 py-1.5 rounded-full font-semibold ${stockStatus.bg} ${stockStatus.color} shadow-md`}>
            {stockStatus.bn}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3">
        {/* Title and Category */}
        <div className="mb-2.5">
          <h3 className="font-semibold text-gray-900 text-base tracking-tight mb-0.5 line-clamp-2 group-hover:text-emerald-600 transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 font-medium tracking-tight">{product.category}</p>
        </div>

        {/* Features */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2 text-xs">
          {(product as any).warranty && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full font-semibold text-xs">
              <Shield className="w-3 h-3" />
              <span className="tracking-tight">{(product as any).warranty}</span>
            </div>
          )}
          {(product as any).fastDelivery && (
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-full font-semibold text-xs">
              <Zap className="w-3 h-3" />
              <span className="tracking-tight">দ্রুত ডেলিভারি</span>
            </div>
          )}
          {(product as any).freeDelivery && (
            <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full font-semibold text-xs">
              <Truck className="w-3 h-3" />
              <span className="tracking-tight">বিনামূল্যে</span>
            </div>
          )}
          {(product as any).codAvailable && (
            <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-full font-semibold text-xs">
              <ShoppingBag className="w-3 h-3" />
              <span className="tracking-tight">নগদ পরিশোধ</span>
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="mb-1.5">
              <p className="text-3xl font-bold text-amber-600 tracking-tight">৳{(product.price || 0).toLocaleString('en-US')}</p>
            </div>
            {(product as any).originalPrice && (product as any).originalPrice > product.price && (
              <p className="text-sm text-gray-400 line-through">৳{((product as any).originalPrice || 0).toLocaleString('en-US')}</p>
            )}
            <p className="text-xs text-gray-500 font-medium">{product.unit || 'কেজি'}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">স্টক</p>
            <p className="text-sm font-bold text-gray-900">{product.stock} {product.unit || 'পিস'}</p>
          </div>
        </div>

        {/* Quantity Selection */}
        <div className="mb-2.5 flex items-center justify-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="w-8 h-8 rounded-lg bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-gray-700"
          >
            <Minus size={14} />
          </button>
          <div className="flex-1 text-center">
            <span className="text-xs font-semibold text-gray-700 tracking-wide">পরিমাণ: <span className="text-amber-600 font-bold text-sm">{quantity}</span></span>
          </div>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= product.stock}
            className="w-8 h-8 rounded-lg bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-gray-700"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Action Buttons - Simple & Responsive */}
        <div className="space-y-1.5">
          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.stock <= 0}
            className="w-full bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white py-3 px-4 rounded-lg font-semibold tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base shadow-sm hover:shadow-md"
          >
            {isAdding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>যুক্ত করা হচ্ছে...</span>
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                <span>কার্টে যোগ করুন</span>
              </>
            )}
          </button>

          <button
            onClick={handleBuyNow}
            disabled={isBuying || product.stock <= 0}
            className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-3 px-4 rounded-lg font-semibold tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base shadow-sm hover:shadow-md"
          >
            {isBuying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>প্রক্রিয়াকরণ...</span>
              </>
            ) : (
              <>
                <Zap size={16} />
                <span>এখনই কিনুন</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
