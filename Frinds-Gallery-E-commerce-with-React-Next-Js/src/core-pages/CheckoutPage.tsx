import React, { useState, useEffect } from 'react';
import type { Product, CartItem, OrderItem, Customer } from '../types';
import { paymentMethods } from '../constants';
import { Breadcrumbs } from '../components/Breadcrumbs';
import type { Page } from '../types';
import { XMarkIcon } from '../components/icons';
import { trackEvent, trackPurchase } from '../components/MetaPixel';
import { useRouter } from 'next/navigation';


interface CheckoutPageProps {
  cart: CartItem[];
  products: Product[];
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  onPlaceOrder: (orderData: { customerName: string; totalAmount: number; shippingAddress: string; items: OrderItem[] }) => void;
  navigateTo: (page: Page) => void;
  currentUser: Customer | null;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, products, updateCartQuantity, removeFromCart, onPlaceOrder, navigateTo, currentUser }) => {
  const router = useRouter();
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('inside'); // 'inside' or 'outside'
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setPhone(currentUser.phone);
    }
  }, [currentUser]);

  const cartDetails = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    return { ...item, product };
  }).filter(item => item.product);

  const subtotal = cartDetails.reduce((sum, item) => sum + item.product!.price * item.quantity, 0);
  const deliveryCharge = deliveryLocation === 'inside' ? 80 : 150;

  // Clean discount if it exceeds subtotal (optional safety check)
  const actualDiscount = Math.min(discount, subtotal);
  const total = subtotal + deliveryCharge - actualDiscount;

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    const code = promoCode.trim().toUpperCase();

    if (!code) return;

    if (code === 'SAVE10') {
      const disc = Math.round(subtotal * 0.10);
      setDiscount(disc);
      setPromoSuccess('১০% ডিসকাউন্ট অ্যাপ্লাই করা হয়েছে!');
    } else if (code === 'FLAT50') {
      setDiscount(50);
      setPromoSuccess('৫০ টাকা ছাড় অ্যাপ্লাই করা হয়েছে!');
    } else if (code === 'EID2024') {
      const disc = Math.round(subtotal * 0.15);
      setDiscount(disc);
      setPromoSuccess('ঈদ স্পেশাল ১৫% ডিসকাউন্ট!');
    } else {
      setDiscount(0);
      setPromoError('দুঃখিত, এই প্রোমো কোডটি সঠিক নয়।');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("আপনার কার্ট খালি।");
      return;
    }
    setIsSubmitting(true);

    try {
      if (typeof window !== 'undefined') {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const fullAddress = `${address}, ঢাকা ${deliveryLocation === 'inside' ? 'এর ভিতরে' : 'এর বাইরে'}`;

      onPlaceOrder({
        customerName: name,
        totalAmount: total,
        shippingAddress: fullAddress,
        items: cartDetails.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.product!.price,
        })),
      });

      trackPurchase(`ORDER-${Date.now()}`, total, cartDetails.map(item => ({
        id: item.id,
        name: item.product!.name,
        price: item.product!.price,
        quantity: item.quantity
      })));
    } catch (error) {
      alert('অর্ডার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'হোম', onClick: () => navigateTo('home') }, { label: 'শপ', onClick: () => navigateTo('shop') }, { label: 'চেকআউট' }]} />
        <h1 className="text-3xl font-bold text-center my-8">চেকআউট</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12 items-start">
          {/* Billing Details */}
          <div className="bg-white p-6 lg:p-8 rounded-xl shadow-sm border lg:col-span-7">
            <h2 className="text-2xl font-semibold mb-6">বিলিং তথ্য</h2>
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-base font-medium text-slate-700 mb-1">আপনার নাম *</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  onBlur={() => {
                    if (name && phone) {
                      onPlaceOrder({
                        customerName: name,
                        totalAmount: total,
                        shippingAddress: `${address}, ঢাকা ${deliveryLocation === 'inside' ? 'এর ভিতরে' : 'এর বাইরে'}`,
                        items: cartDetails.map(item => ({
                          productId: item.id,
                          quantity: item.quantity,
                          price: item.product!.price,
                        })),
                        // @ts-ignore
                        isIncomplete: true
                      });
                    }
                  }}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-base font-medium text-slate-700 mb-1">আপনার মোবাইল নাম্বার *</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => {
                    if (name && phone) {
                      onPlaceOrder({
                        customerName: name,
                        totalAmount: total,
                        shippingAddress: `${address}, ঢাকা ${deliveryLocation === 'inside' ? 'এর ভিতরে' : 'এর বাইরে'}`,
                        items: cartDetails.map(item => ({
                          productId: item.id,
                          quantity: item.quantity,
                          price: item.product!.price,
                        })),
                        // @ts-ignore
                        isIncomplete: true
                      });
                    }
                  }}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-slate-700 mb-2">ডেলিভারি এলাকা *</label>
                <div className="flex space-x-4">
                  <label className="flex items-center"><input type="radio" name="area" value="inside" checked={deliveryLocation === 'inside'} onChange={(e) => setDeliveryLocation(e.target.value)} /> <span className="ml-2">ঢাকার ভিতরে</span></label>
                  <label className="flex items-center"><input type="radio" name="area" value="outside" checked={deliveryLocation === 'outside'} onChange={(e) => setDeliveryLocation(e.target.value)} /> <span className="ml-2">ঢাকার বাইরে</span></label>
                </div>
              </div>
              <div>
                <label htmlFor="address" className="block text-base font-medium text-slate-700 mb-1">সম্পূর্ণ ঠিকানা *</label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onBlur={() => {
                    if (name && phone && address) {
                      onPlaceOrder({
                        customerName: name,
                        totalAmount: total,
                        shippingAddress: `${address}, ঢাকা ${deliveryLocation === 'inside' ? 'এর ভিতরে' : 'এর বাইরে'}`,
                        items: cartDetails.map(item => ({
                          productId: item.id,
                          quantity: item.quantity,
                          price: item.product!.price,
                        })),
                        // @ts-ignore
                        isIncomplete: true
                      });
                    }
                  }}
                  required
                  rows={3}
                  placeholder="বাসা/হোল্ডিং, রোড, থানা"
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"></textarea>
              </div>
              <div>
                <label htmlFor="notes" className="block text-base font-medium text-slate-700 mb-1">বিশেষ নোট (ঐচ্ছিক)</label>
                <textarea id="notes" rows={2} placeholder="অর্ডার সম্পর্কিত কোনো বিশেষ নির্দেশনা থাকলে লিখুন..." className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"></textarea>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 lg:p-8 rounded-xl shadow-sm border mt-8 lg:mt-0 lg:col-span-5 lg:sticky lg:top-28">
            <h2 className="text-2xl font-semibold mb-6">আপনার অর্ডার</h2>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {cartDetails.map(item => (
                <div key={item.id} className="flex items-start space-x-4">
                  <img src={item.product!.imageUrl} alt={item.product!.name} className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-grow">
                    <p className="font-semibold text-base leading-tight">{item.product!.name}</p>
                    <p className="text-sm text-slate-600 mt-1">পরিমাণ: {item.quantity}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-brand-dark">৳{(item.product!.price * item.quantity).toLocaleString('bn-BD')}</p>
                    <button type="button" onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 hover:underline mt-1 flex items-center ml-auto">
                      <XMarkIcon className="h-3 w-3 mr-1" /> মুছুন
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Section */}
            <div className="mt-6 pt-4 border-t">
              <label htmlFor="promo" className="block text-sm font-medium text-slate-700 mb-2">প্রোমো কোড আছে?</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="promo"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="কোড লিখুন"
                  className="flex-grow uppercase p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="bg-brand-dark text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors"
                >
                  এপ্লাই
                </button>
              </div>
              {promoSuccess && <p className="text-sm text-green-600 mt-2 font-medium">{promoSuccess}</p>}
              {promoError && <p className="text-sm text-red-500 mt-2">{promoError}</p>}
            </div>

            <div className="mt-6 border-t pt-4 space-y-2 text-base">
              <div className="flex justify-between text-slate-600"><span>সাব-টোটাল</span> <span className="font-medium">৳{subtotal.toLocaleString('bn-BD')}</span></div>
              <div className="flex justify-between text-slate-600"><span>ডেলিভারি চার্জ</span> <span className="font-medium">৳{deliveryCharge.toLocaleString('bn-BD')}</span></div>
              {actualDiscount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>ডিসকাউন্ট</span>
                  <span>-৳{actualDiscount.toLocaleString('bn-BD')}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold text-brand-dark mt-2 pt-2 border-t"><span>মোট</span> <span>৳{total.toLocaleString('bn-BD')}</span></div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">পেমেন্ট পদ্ধতি</h3>
              <div className="space-y-3">
                {paymentMethods.map(method => (
                  <label key={method.id} className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${paymentMethod === method.id ? 'border-brand-green bg-green-50 shadow-lg' : 'border-slate-200 hover:border-brand-green/50'}`}>
                    <div className="flex items-center space-x-4">
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-5 w-5 text-brand-green focus:ring-brand-green"
                      />
                      <div className="flex items-center space-x-3">
                        <img src={method.icon} alt={method.name} className="h-8 w-auto object-contain" />
                        <span className="font-medium text-slate-700">{method.name}</span>
                      </div>
                    </div>
                    {paymentMethod === method.id && (
                      <svg className="h-6 w-6 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </label>
                ))}
              </div>
              {paymentMethod === 'cod' && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 flex items-start">
                    <svg className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    পণ্য হাতে পেয়ে টাকা পরিশোধ করুন। ডেলিভারি ম্যান আপনার কাছে পৌঁছানোর পর টাকা দিন।
                  </p>
                </div>
              )}
              {paymentMethod === 'bkash' && (
                <div className="mt-3 p-3 bg-pink-50 border border-pink-200 rounded-lg">
                  <p className="text-sm text-pink-800 flex items-start">
                    <svg className="h-5 w-5 text-pink-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    অর্ডার কনফার্ম করার পর আমরা আপনাকে বিকাশ পেমেন্ট নম্বর পাঠাবো।
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6">
              <button type="submit" disabled={isSubmitting || cart.length === 0} className="w-full bg-brand-green text-white py-3 rounded-lg text-lg font-bold hover:bg-brand-green-dark disabled:bg-slate-400 disabled:cursor-not-allowed transition-all">
                {isSubmitting ? 'প্রসেসিং...' : `অর্ডার কনফার্ম করুন`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};