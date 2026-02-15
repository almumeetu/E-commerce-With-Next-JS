import React, { useState } from 'react';
import type { Product } from '../types';
import { HeartIcon, XMarkIcon, PlusIcon, MinusIcon } from './icons';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
  addToCart: (productId: string, quantity: number) => void;
  buyNow: (productId: string, quantity: number) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose, addToCart, buyNow, wishlist, toggleWishlist }) => {
  const [quantity, setQuantity] = useState(1);
  const isInWishlist = wishlist.includes(product.id);

  const discount = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="quick-view-title">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10" aria-label="Close modal">
          <XMarkIcon />
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Image */}
          <div>
            <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-contain rounded-md" />
          </div>
          {/* Details */}
          <div>
            <h2 id="quick-view-title" className="text-3xl font-bold text-gray-900">{product.name}</h2>
            <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
            {/* Price */}
            <div className="flex items-baseline space-x-2 mt-4">
                <p className="text-4xl text-brand-green font-bold">৳{product.price.toLocaleString('bn-BD')}</p>
                 {product.originalPrice && (
                    <p className="text-2xl text-gray-500 line-through">৳{product.originalPrice.toLocaleString('bn-BD')}</p>
                )}
                {discount > 0 && (
                    <span className="text-sm font-semibold text-red-600">({discount}% ছাড়)</span>
                )}
            </div>
            {/* Stock status */}
            <div className="mt-4">
                {product.stock > 0 ? (
                    <p className="text-sm text-green-600 font-semibold inline-flex items-center"><svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>স্টকে আছে</p>
                ) : (
                    <p className="text-sm text-red-600 font-semibold inline-flex items-center"><svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>স্টক শেষ</p>
                )}
            </div>
            {/* Short description */}
            <div className="mt-4 text-base text-gray-600">
                <p>পণ্যের একটি সংক্ষিপ্ত বিবরণ এখানে থাকবে। এটি ব্যবহারকারীকে দ্রুত পণ্য সম্পর্কে ধারণা দেবে।</p>
            </div>
            {/* Quantity Selector */}
            <div className="mt-6">
                <label htmlFor="quantity-qv" className="block text-sm font-semibold text-gray-700 mb-2">পরিমাণ</label>
                <div className="flex items-center border-2 border-gray-400 rounded-lg overflow-hidden w-40 h-14 bg-slate-50 shadow-sm">
                    <button
                        type="button"
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="px-4 h-full text-gray-800 font-bold hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center bg-slate-100"
                        aria-label="Decrease quantity"
                    >
                        <MinusIcon className="h-6 w-6" />
                    </button>
                    <div className="flex-1 h-full flex items-center justify-center border-l-2 border-r-2 border-gray-400 bg-white">
                        <span className="text-2xl font-bold text-gray-900">{quantity}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                        disabled={quantity >= product.stock}
                        className="px-4 h-full text-gray-800 font-bold hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center bg-slate-100"
                        aria-label="Increase quantity"
                    >
                        <PlusIcon className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            addToCart(product.id, quantity);
                            onClose();
                        }}
                        disabled={product.stock === 0}
                        className="flex-1 bg-brand-yellow text-gray-900 py-3.5 px-6 rounded-lg font-bold hover:bg-yellow-400 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                    >
                        কার্টে যোগ করুন
                    </button>
                    <button
                        onClick={() => toggleWishlist(product.id)}
                        className="p-3.5 border-2 border-slate-300 rounded-lg hover:bg-gray-50 hover:border-brand-green transition-all shadow-sm"
                        aria-label="Add to wishlist"
                    >
                        <HeartIcon className={`w-6 h-6 ${isInWishlist ? 'text-red-500' : 'text-gray-500'}`} isFilled={isInWishlist} />
                    </button>
                </div>
                <button
                    onClick={() => {
                        buyNow(product.id, quantity);
                        onClose();
                    }}
                    disabled={product.stock === 0}
                    className="w-full bg-brand-green text-white py-3.5 px-8 rounded-lg font-bold hover:bg-brand-green-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                >
                    এখনই কিনুন
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};