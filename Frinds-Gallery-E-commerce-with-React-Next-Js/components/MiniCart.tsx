'use client';

import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { CartItem } from '../types';
import Link from 'next/link';

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string | number, amount: number) => void;
  onRemove: (id: string | number) => void;
}

const MiniCart: React.FC<MiniCartProps> = ({ isOpen, onClose, cart, onUpdateQuantity, onRemove }) => {
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 60;
  const total = subtotal + shipping;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />

      {/* Mini Cart Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-indigo-950">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-rose-400" />
            <h3 className="text-lg font-bold text-white">আপনার ব্যাগ</h3>
            <span className="bg-rose-500 text-indigo-950 text-xs font-bold px-2 py-0.5 rounded-full">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-indigo-900 rounded-full transition text-indigo-200 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto h-[calc(100vh-280px)] custom-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag size={40} className="text-stone-300" />
              </div>
              <h4 className="text-lg font-bold text-stone-800 mb-2">আপনার ব্যাগ খালি</h4>
              <p className="text-stone-500 text-sm mb-6">কিছু পণ্য যোগ করুন এবং কেনাকাটা শুরু করুন!</p>
              <Link
                href="/shop"
                onClick={onClose}
                className="bg-indigo-700 text-white px-6 py-2.5 rounded-full font-medium hover:bg-indigo-800 transition"
              >
                কেনাকাটা শুরু করুন
              </Link>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 bg-stone-50 p-3 rounded-xl border border-stone-100 hover:shadow-md transition"
                >
                  {/* Product Image */}
                  <Link href={`/product/${item.id}`} onClick={onClose}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg bg-white"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.id}`}
                      onClick={onClose}
                      className="block"
                    >
                      <h4 className="text-sm font-bold text-stone-800 line-clamp-2 mb-1 hover:text-indigo-700 transition">
                        {item.name}
                      </h4>
                    </Link>
                    <p className="text-xs text-indigo-600 font-semibold mb-2">৳ {item.price}</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 bg-white rounded-lg border border-stone-200">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1.5 hover:bg-stone-50 rounded-l-lg transition"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} className={item.quantity <= 1 ? 'text-stone-300' : 'text-stone-600'} />
                        </button>
                        <span className="text-sm font-bold text-stone-800 px-2">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1.5 hover:bg-stone-50 rounded-r-lg transition"
                        >
                          <Plus size={14} className="text-stone-600" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemove(item.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Totals & Checkout */}
        {cart.length > 0 && (
          <div className="border-t border-stone-200 p-4 bg-white">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-stone-600">
                <span>সাবটোটাল</span>
                <span className="font-semibold">৳ {subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-stone-600">
                <span>ডেলিভারি চার্জ</span>
                <span className="font-semibold">৳ {shipping}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-indigo-900 pt-2 border-t border-stone-200">
                <span>মোট</span>
                <span>৳ {total}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={onClose}
                className="block w-full bg-indigo-700 text-white text-center py-3 rounded-xl font-bold hover:bg-indigo-800 transition shadow-lg"
              >
                চেকআউট করুন
              </Link>
              <Link
                href="/cart"
                onClick={onClose}
                className="block w-full bg-stone-100 text-stone-700 text-center py-3 rounded-xl font-semibold hover:bg-stone-200 transition"
              >
                ব্যাগ দেখুন
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MiniCart;
