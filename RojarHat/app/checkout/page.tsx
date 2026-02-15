'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/src/context/CartContext';
import { placeOrder } from '@/src/lib/actions/orders';
import { validateCart } from '@/src/lib/actions/products';
import { ChevronLeft, CheckCircle, ShieldCheck, Truck, CreditCard, Smartphone, MapPin, Clock, User, Phone, Mail, Package, DollarSign, Home, Lock, ArrowRight, Info } from 'lucide-react';
import Link from 'next/link';

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  estimatedTime: string;
  icon: React.ReactNode;
  description: string;
  areas: string[];
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  fee?: number;
}

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart, removeFromCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [orderDetails, setOrderDetails] = useState<any>(null);
    const [selectedShipping, setSelectedShipping] = useState<string>('dhaka');
    const [selectedPayment, setSelectedPayment] = useState<string>('cash');
    const [formData, setFormData] = useState({
      name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      postalCode: '',
      notes: ''
    });

    // Auto-validate cart on mount
    useEffect(() => {
        async function checkCart() {
            if (cart.length === 0) return;

            const itemIds = cart.map(item => item.id);
            const { invalidIds, missingIds } = await validateCart(itemIds);

            const problematicIds = [...invalidIds, ...missingIds];
            if (problematicIds.length > 0) {
                problematicIds.forEach(id => removeFromCart(id));
                alert('আপনার কার্টে কিছু পুরনো বা অনুপলব্ধ পণ্য ছিল যা সরিয়ে দেওয়া হয়েছে। দ্টা করে সংশোধিত কার্টটি চেক করুন।');
            }
        }
        checkCart();
    }, []);

    const shippingOptions: ShippingOption[] = [
        {
            id: 'dhaka',
            name: 'ঢাকা মেট্রোপলিটন',
            price: 60,
            estimatedTime: '১-২ কার্যদিন',
            icon: <Truck className="w-5 h-5" />,
            description: 'ঢাকা শহরের মধ্যে হোম ডেলিভারি',
            areas: ['ঢাকা', 'মিরপুর', 'ধানমন্ডি', 'মোহাম্মদপুর', 'গুলশান', 'বনানী', 'উত্তরা', 'ডেমরা', 'সাভার', 'কেরানীগঞ্জ']
        },
        {
            id: 'outside',
            name: 'ঢাকার বাইরে',
            price: 120,
            estimatedTime: '২-৪ কার্যদিন',
            icon: <Package className="w-5 h-5" />,
            description: 'ঢাকার বাইরে সারা বাংলাদেশে ডেলিভারি',
            areas: ['চট্টগ্রাম', 'সিলেট', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'কুমিল্লা', 'নারায়ণগঞ্জ', 'ফরিদপুর', 'ময়মনসিংহ', 'অন্যান্য']
        },
        {
            id: 'pickup',
            name: 'স্টোর পিকআপ',
            price: 0,
            estimatedTime: 'আজকেল',
            icon: <Package className="w-5 h-5" />,
            description: 'আমাদের স্টোর থেকে পণ্য সংগ্রহণ করুন',
            areas: ['স্টোর এড্রেস']
        }
    ];

    const paymentMethods: PaymentMethod[] = [
        {
            id: 'cash',
            name: 'ক্যাশ অন ডেলিভারি',
            icon: <DollarSign className="w-5 h-5" />,
            color: 'bg-green-600',
            description: 'ডেলিভারির সময পেমেন্ট করুন',
            fee: 0
        },
        {
            id: 'card',
            name: 'ক্রেডিট/ডেবিট কার্ড',
            icon: <CreditCard className="w-5 h-5" />,
            color: 'bg-blue-600',
            description: 'নিরাপত ও সুরক্ষা পেমেন্ট',
            fee: 0
        },
        {
            id: 'mobile',
            name: 'মোবাইল ব্যাংকিং',
            icon: <Smartphone className="w-5 h-5" />,
            color: 'bg-purple-600',
            description: 'বিকাশ, রকেট, নগদ',
            fee: 15
        },
        {
            id: 'bank',
            name: 'ব্যাংক ট্রান্সফার',
            icon: <CreditCard className="w-5 h-5" />,
            color: 'bg-amber-600',
            description: 'ব্যাংক ট্রান্সফারে পেমেন্ট',
            fee: 25
        }
    ];

    const selectedShippingOption = shippingOptions.find(option => option.id === selectedShipping);
    const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedPayment);
    const shippingCost = selectedShippingOption?.price || 0;
    const paymentFee = selectedPaymentMethod?.fee || 0;
    const totalAmount = cartTotal + shippingCost + paymentFee;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        // Only allow cash on delivery
        if (selectedPayment !== 'cash') {
            alert('বর্তমানে শুধুমাত্র ক্যাশ অন ডেলিভারি পেমেন্ট পদ্ধতি চালু আছে।');
            setLoading(false);
            return;
        }

        const orderData = {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            notes: formData.notes,
            shipping_method: selectedShipping,
            payment_method: selectedPayment,
            shipping_cost: shippingCost,
            payment_fee: paymentFee,
            total_amount: totalAmount
        };

        try {
            const res = await placeOrder(orderData, cart, totalAmount);
            
            if (res.success) {
                setSuccess(true);
                setOrderDetails({
                    ...orderData,
                    orderId: res.orderId,
                    items: cart,
                    subtotal: cartTotal,
                    shippingCost,
                    paymentFee,
                    total: totalAmount
                });
                clearCart();
            } else {
                throw new Error(res.error);
            }
        } catch (error: any) {
            console.error('Order error:', error);
            alert('অর্ডার সম্পন্ন করতে সমস্যা হয়েছে: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">অর্ডার সফল হয়েছে!</h2>
                        <p className="text-green-100">আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে</p>
                    </div>
                    
                    <div className="p-8">
                        <div className="text-center mb-6">
                            <p className="text-sm text-gray-600 mb-2">অর্ডার আইডি</p>
                            <p className="font-mono font-bold text-lg text-green-600">#{orderDetails.orderId}</p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-6 mb-6">
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">গ্রাহক:</span>
                                    <span className="font-medium">{orderDetails.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">ফোন:</span>
                                    <span className="font-medium">{orderDetails.phone}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">ঠিকানা:</span>
                                    <span className="font-medium">{orderDetails.address}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">ডেলিভারি:</span>
                                    <span className="font-medium">{orderDetails.shipping_method}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">পেমেন্ট:</span>
                                    <span className="font-medium">{orderDetails.payment_method}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold pt-3 border-t border-gray-200">
                                    <span>মোট:</span>
                                    <span className="text-green-600">৳{orderDetails.total}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-4">
                            <Link
                                href="/shop"
                                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition flex items-center justify-center"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                আরও কেনাকাটা করুন
                            </Link>
                            <Link
                                href={`/order-success?orderId=${orderDetails.orderId}&paymentNumber=${orderDetails.phone}`}
                                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition flex items-center justify-center"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                হোমে ফিরে যান
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-16 h-16 text-gray-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">আপনার কার্ট খালি</h2>
                    <p className="text-gray-600 mb-8">কেনাকারা করার জন্য আপনার কার্টে পণ্য যোগ করুন</p>
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        দোকানে ফিরে যান
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link
                        href="/shop"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        ফিরে যান
                    </Link>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900">চেকআউট</h1>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <div className="w-8 h-0.5 bg-green-600 rounded-full"></div>
                            <div className="w-8 h-0.5 bg-gray-300 rounded-full"></div>
                            <div className="w-8 h-0.5 bg-gray-300 rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Cart Summary */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Package className="w-5 h-5 text-gray-400" />
                                আপনার কার্ট ({cart.length} পণ্য)
                            </h2>
                            
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                            <img
                                                src={item.image || '/images/placeholder.png'}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                                                    <p className="text-sm text-gray-600">{item.category}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-green-600">৳{item.price}</p>
                                                    <p className="text-sm text-gray-500">x {item.quantity}</p>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-600">{item.description}</div>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 hover:text-red-700 transition text-sm font-medium"
                                        >
                                            মুছে ফেলুন
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Options */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Truck className="w-5 h-5 text-gray-400" />
                                ডেলিভারি পদ্ধতি
                            </h2>
                            
                            <div className="space-y-3">
                                {shippingOptions.map((option) => (
                                    <label
                                        key={option.id}
                                        className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                            selectedShipping === option.id
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                    option.id === 'dhaka' ? 'bg-green-100 text-green-600' :
                                                    option.id === 'outside' ? 'bg-blue-100 text-blue-600' :
                                                    'bg-amber-100 text-amber-600'
                                                }`}>
                                                    {option.icon}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{option.name}</div>
                                                    <div className="text-sm text-gray-600">{option.description}</div>
                                                    <div className="text-xs text-gray-500">{option.estimatedTime}</div>
                                                    <div className="text-xs text-gray-500">
                                                        এলাকা: {option.areas.join(', ')}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-gray-900">৳{option.price}</div>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-gray-400" />
                                পেমেন্ট পদ্ধতি
                            </h2>
                            
                            <div className="grid grid-cols-2 gap-3">
                                {paymentMethods.map((method) => (
                                    <label
                                        key={method.id}
                                        className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                            selectedPayment === method.id
                                                ? `${method.color} text-white`
                                                : method.id === 'cash' 
                                                    ? 'border-green-500 bg-green-50 cursor-pointer'
                                                    : 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                method.id === 'cash' ? 'bg-green-600 text-white' :
                                                method.id === 'card' ? 'bg-blue-600 text-white' :
                                                method.id === 'mobile' ? 'bg-purple-600 text-white' :
                                                'bg-amber-600 text-white'
                                            }`}>
                                                {method.icon}
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{method.name}</div>
                                                <div className="text-xs opacity-90">{method.description}</div>
                                                {method.fee && method.fee > 0 && (
                                                    <div className="text-xs opacity-90">ফি: ৳{method.fee}</div>
                                                )}
                                                {method.id !== 'cash' && (
                                                    <div className="text-xs opacity-90 flex items-center gap-1 mt-1">
                                                        <Info className="w-3 h-3" />
                                                        আসছে শীঘ্রই
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            
                            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                                <div className="flex items-start gap-2">
                                    <Info className="w-4 h-4 text-amber-600 mt-0.5" />
                                    <div className="text-sm text-amber-800">
                                        <p className="font-medium">পেমেন্ট সম্পর্কে:</p>
                                        <p>বর্তমানে শুধুমাত্র ক্যাশ অন ডেলিভারি পেমেন্ট পদ্ধতি চালু আছে। অন্য পেমেন্ট মাধ্যম আসছে শীঘ্রই।</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary & Form */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 space-y-6">
                            {/* Order Summary */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-gray-400" />
                                    অর্ডার সারাংশ
                                </h2>
                                
                                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">সাবটোটাল</span>
                                        <span className="font-medium">৳{cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">ডেলিভারি</span>
                                        <span className="font-medium">৳{shippingCost.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">পেমেন্ট ফি</span>
                                        <span className="font-medium">৳{paymentFee.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                                        <span>মোট</span>
                                        <span className="text-green-600">৳{totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Customer Information */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <User className="w-4 h-4 inline mr-2" />
                                            পূর্ণ নাম *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition"
                                            placeholder="আপনার নাম লিখুন"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Phone className="w-4 h-4 inline mr-2" />
                                            ফোন নম্বর *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition"
                                            placeholder="ফোন নম্বর লিখুন"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Mail className="w-4 h-4 inline mr-2" />
                                            ইমেইল (ঐচ্ছিক)
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition"
                                            placeholder="email@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <MapPin className="w-4 h-4 inline mr-2" />
                                            সম্পূর্ণ ঠিকানা *
                                        </label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none resize-none transition"
                                            placeholder="সম্পূর্ণ ঠিকানা লিখুন"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Package className="w-4 h-4 inline mr-2" />
                                                শহর
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition"
                                                placeholder="শহর"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                পোস্টাল কোড
                                            </label>
                                            <input
                                                type="text"
                                                name="postalCode"
                                                value={formData.postalCode}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition"
                                                placeholder="১ন্দদ"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            অতিরিক্ত নোট
                                        </label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            rows={2}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none resize-none transition"
                                            placeholder="অতিরিক্ত নোট (ঐচ্ছিক)"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span>প্রক্রিয়া হচ্ছে...</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck className="w-5 h-5" />
                                                <span>অর্ডার সম্পন্ন করুন</span>
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>

                            {/* Trust Badges */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <div className="flex items-center justify-center mb-4">
                                    <Lock className="w-5 h-5 text-green-600 mr-2" />
                                    <span className="text-sm font-medium text-gray-700">নিরাপাত চেকআউট</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="flex flex-col items-center">
                                        <ShieldCheck className="w-6 h-6 text-green-600 mb-2" />
                                        <p className="text-xs text-gray-600">SSL এনক্রিপ্টেশন</p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <Truck className="w-6 h-6 text-blue-600 mb-2" />
                                        <p className="text-xs text-gray-600">দ্রুত ডেলিভারি</p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                                        <p className="text-xs text-gray-600">৭রোত্ত সাপোর্ট</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
