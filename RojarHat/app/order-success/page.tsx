'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Home, ShoppingBag, CreditCard, Download, Share2, Clock, MapPin, Phone, Mail, Truck, Shield, RefreshCw } from 'lucide-react';

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId') || 'N/A';
    const paymentNumber = searchParams.get('paymentNumber') || 'N/A';
    const [orderDetails, setOrderDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Simulate fetching order details
        const timer = setTimeout(() => {
            setOrderDetails({
                customerName: 'মোঃ আহসান হাবীব',
                phone: '01712-345678',
                address: 'মিরপুর, ঢাকা',
                totalAmount: 1250,
                estimatedDelivery: 'আজ রাত ৮টা',
                items: 3
            });
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [orderId]);

    const handleCopyOrderId = () => {
        navigator.clipboard.writeText(orderId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShareOrder = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'রোজারহাট - অর্ডার সফল',
                    text: `আমার অর্ডার #${orderId} সফলভাবে সম্পন্ন হয়েছে। ডেলিভারি নম্বর: ${paymentNumber}`,
                    url: window.location.href
                });
            } catch (err) {
                console.log('Share failed:', err);
            }
        }
    };

    const handleDownloadReceipt = () => {
        // Simulate download
        const receiptContent = `
রোজারহাট - অর্ডার রসিদ
========================
অর্ডার আইডি: #${orderId}
ডেলিভারি নম্বর: ${paymentNumber}
গ্রাহক: ${orderDetails?.customerName}
ফোন: ${orderDetails?.phone}
ঠিকানা: ${orderDetails?.address}
মোট পরিমাণ: ৳${orderDetails?.totalAmount}
প্রাক্কালিত ডেলিভারি: ${orderDetails?.estimatedDelivery}
        `;
        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `order-${orderId}-receipt.txt`;
        a.click();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-stone-50">
            {/* Header */}
            <div className="bg-white border-b border-stone-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-100 p-2 rounded-lg">
                                <CheckCircle className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-stone-900">রোজারহাট</h1>
                                <p className="text-xs text-stone-500">অর্ডার সফলভাবে সম্পন্ন হয়েছে</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleShareOrder}
                                className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 transition"
                            >
                                <Share2 className="h-4 w-4 text-stone-600" />
                            </button>
                            <button
                                onClick={handleDownloadReceipt}
                                className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 transition"
                            >
                                <Download className="h-4 w-4 text-stone-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Success Message */}
                <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
                        <CheckCircle className="h-12 w-12 text-white" />
                    </div>
                    <h2 className="text-4xl font-black text-stone-900 mb-3">অর্ডার সফল হয়েছে!</h2>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                        আপনার অর্ডারটি আমাদের কাছে পৌঁছেছে। আমরা এটি যাচাই করছি এবং শীঘ্রই আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবেন।
                    </p>
                </div>

                {/* Order Details Grid */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {/* Order ID Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider">অর্ডার আইডি</h3>
                            <button
                                onClick={handleCopyOrderId}
                                className="p-1 rounded hover:bg-stone-100 transition"
                            >
                                {copied ? (
                                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                                ) : (
                                    <RefreshCw className="h-4 w-4 text-stone-400" />
                                )}
                            </button>
                        </div>
                        <p className="text-2xl font-mono font-black text-stone-900">#{orderId}</p>
                        {copied && (
                            <p className="text-xs text-emerald-600 mt-2">কপি করা হয়েছে!</p>
                        )}
                    </div>

                    {/* Payment Number Card */}
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl shadow-sm border border-emerald-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="h-5 w-5 text-emerald-700" />
                            <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider">ডেলিভারি নম্বর</h3>
                        </div>
                        <p className="text-2xl font-mono font-black text-emerald-900">{paymentNumber}</p>
                        <p className="text-xs text-emerald-600 mt-2">ডেলিভারির সময় এই নম্বরটি দেখান</p>
                    </div>

                    {/* Delivery Status Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Truck className="h-5 w-5 text-blue-600" />
                            <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider">ডেলিভারি স্ট্যাটাস</h3>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-stone-700">অর্ডার গৃহীত</span>
                            </div>
                            <p className="text-xs text-stone-500">প্রাক্কালিত ডেলিভারি: {orderDetails?.estimatedDelivery || 'আজ রাত ৮টা'}</p>
                        </div>
                    </div>
                </div>

                {/* Detailed Order Information */}
                {loading ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
                        <div className="animate-pulse space-y-4">
                            <div className="h-4 bg-stone-200 rounded w-1/4"></div>
                            <div className="h-3 bg-stone-200 rounded w-1/2"></div>
                            <div className="h-3 bg-stone-200 rounded w-3/4"></div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 mb-8">
                        <h3 className="text-lg font-bold text-stone-900 mb-6">অর্ডারের বিস্তারিত</h3>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Customer Info */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-stone-100 rounded-lg">
                                        <Phone className="h-4 w-4 text-stone-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-stone-500 uppercase tracking-wider">ফোন নম্বর</p>
                                        <p className="text-sm font-bold text-stone-900">{orderDetails?.phone}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-stone-100 rounded-lg">
                                        <MapPin className="h-4 w-4 text-stone-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-stone-500 uppercase tracking-wider">ডেলিভারি ঠিকানা</p>
                                        <p className="text-sm font-bold text-stone-900">{orderDetails?.address}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                        <ShoppingBag className="h-4 w-4 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-stone-500 uppercase tracking-wider">মোট পণ্য</p>
                                        <p className="text-sm font-bold text-stone-900">{orderDetails?.items} টি পণ্য</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                        <CreditCard className="h-4 w-4 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-stone-500 uppercase tracking-wider">মোট মূল্য</p>
                                        <p className="text-lg font-black text-emerald-900">৳{orderDetails?.totalAmount}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Trust Badges */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { icon: Shield, label: 'নিরাপদ পেমেন্ট', color: 'text-blue-600', bg: 'bg-blue-50' },
                        { icon: Truck, label: 'দ্রুত ডেলিভারি', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { icon: Phone, label: '২৪/৭ সাপোর্ট', color: 'text-purple-600', bg: 'bg-purple-50' },
                        { icon: RefreshCw, label: 'সহজ রিটার্ন', color: 'text-amber-600', bg: 'bg-amber-50' }
                    ].map((badge, i) => (
                        <div key={i} className={`${badge.bg} rounded-xl p-4 text-center border border-white/50`}>
                            <badge.icon className={`h-6 w-6 ${badge.color} mx-auto mb-2`} />
                            <p className="text-xs font-bold text-stone-700">{badge.label}</p>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/shop"
                        className="flex-1 bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                        <ShoppingBag className="h-5 w-5" /> 
                        আরও কেনাকাটা করুন
                    </Link>
                    <Link
                        href="/"
                        className="flex-1 bg-white text-stone-700 font-bold py-4 rounded-xl border-2 border-stone-200 hover:bg-stone-50 transition flex items-center justify-center gap-2"
                    >
                        <Home className="h-5 w-5" /> 
                        হোমে ফিরে যান
                    </Link>
                </div>

                {/* Help Section */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-stone-500 mb-3">কোনো প্রশ্ন আছে?</p>
                    <div className="flex items-center justify-center gap-4">
                        <a href="tel:01712-345678" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                            <Phone className="h-4 w-4" />
                            01712-345678
                        </a>
                        <span className="text-stone-300">|</span>
                        <a href="mailto:support@rojarhat.com" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                            <Mail className="h-4 w-4" />
                            support@rojarhat.com
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-stone-50 flex items-center justify-center">লোড হচ্ছে...</div>}>
            <OrderSuccessContent />
        </Suspense>
    );
}
