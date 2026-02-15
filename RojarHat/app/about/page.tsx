'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, Heart, Users, CheckCircle, Moon } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function AboutPage() {
    return (
        <div className="bg-stone-50 min-h-screen animate-fade-in pb-12">
            <Breadcrumbs />

            {/* Small Professional Header */}
            <section className="bg-emerald-950 text-white py-12 relative overflow-hidden mb-12">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <Moon className="w-12 h-12 text-gold-400 mx-auto mb-4" />
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">আমাদের সম্পর্কে</h1>
                    <p className="text-emerald-100/80 max-w-2xl mx-auto leading-relaxed text-sm md:text-base font-medium">
                        রোজারহাট - রমজানের পবিত্রতা রক্ষায় এবং আপনার ইবাদতকে সহজ করতে একটি উদ্যোগ।
                    </p>
                </div>
            </section>

            {/* Mission & Story */}
            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2">
                            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-emerald-100">
                                <img
                                    src="/images/about-us_compressed.webp"
                                    alt="Our Mission"
                                    className="w-full h-full object-cover transform hover:scale-105 transition duration-700"
                                />
                            </div>
                        </div>
                        <div className="md:w-1/2 space-y-6">
                            <h2 className="text-3xl font-bold text-emerald-900">কেন রোজারহাট?</h2>
                            <p className="text-stone-600 leading-relaxed text-lg">
                                রমজান মাস আমাদের জন্য অত্যন্ত পবিত্র। এই মাসে আমরা চাই ভেজালমুক্ত খাবার এবং সঠিক মানের পণ্য। কিন্তু ব্যস্ত শহরের ভিড়ে বিশুদ্ধ পণ্য খুঁজে পাওয়া অনেক সময় কঠিন হয়ে পড়ে।
                            </p>
                            <p className="text-stone-600 leading-relaxed text-lg">
                                সেই চিন্তা থেকেই <strong>'রোজারহাট'</strong> এর যাত্রা শুরু। আমরা সরাসরি উৎস থেকে পণ্য সংগ্রহ করি—মদিনার খেজুর থেকে শুরু করে গ্রামের খাঁটি সরিষার তেল। আমাদের লক্ষ্য শুধুই ব্যবসা নয়, বরং আপনার রমজানকে নিরাপদ ও প্রশান্তিময় করা।
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                <div className="flex items-center text-emerald-800 font-medium">
                                    <CheckCircle className="w-5 h-5 mr-3 text-gold-500" /> ১০০% হালাল পণ্য
                                </div>
                                <div className="flex items-center text-emerald-800 font-medium">
                                    <CheckCircle className="w-5 h-5 mr-3 text-gold-500" /> দ্রুত ডেলিভারি
                                </div>
                                <div className="flex items-center text-emerald-800 font-medium">
                                    <CheckCircle className="w-5 h-5 mr-3 text-gold-500" /> প্রিমিয়াম কোয়ালিটি
                                </div>
                                <div className="flex items-center text-emerald-800 font-medium">
                                    <CheckCircle className="w-5 h-5 mr-3 text-gold-500" /> সন্তুষ্টির নিশ্চয়তা
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="bg-emerald-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition border border-emerald-100">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="w-8 h-8 text-emerald-700" />
                            </div>
                            <h3 className="text-xl font-bold text-stone-800 mb-3">বিশুদ্ধতার নিশ্চয়তা</h3>
                            <p className="text-stone-600">আমরা প্রতিটি পণ্যের গুণমান নিশ্চিত করে তবেই তা আপনার কাছে পৌঁছে দেই।</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition border border-emerald-100">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Truck className="w-8 h-8 text-emerald-700" />
                            </div>
                            <h3 className="text-xl font-bold text-stone-800 mb-3">দ্রুত হোম ডেলিভারি</h3>
                            <p className="text-stone-600">ঢাকার মধ্যে ২৪-৪৮ ঘণ্টার মধ্যে এবং সারা দেশে দ্রুততম সময়ে ডেলিভারি।</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition border border-emerald-100">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart className="w-8 h-8 text-emerald-700" />
                            </div>
                            <h3 className="text-xl font-bold text-stone-800 mb-3">গ্রাহক সেবা</h3>
                            <p className="text-stone-600">আপনার যেকোনো প্রয়োজনে আমাদের সাপোর্ট টিম সর্বদা প্রস্তুত।</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-emerald-900 mb-6">আমাদের পরিবারের অংশ হোন</h2>
                    <p className="text-stone-600 mb-8 max-w-2xl mx-auto">
                        হাজারো সন্তুষ্ট গ্রাহকের মত আপনিও আপনার রমজানের কেনাকাটার জন্য রোজারহাটকে বেছে নিন।
                    </p>
                    <Link
                        href="/shop"
                        className="inline-block bg-gold-500 text-emerald-950 font-bold px-10 py-4 rounded-full hover:bg-gold-400 transition shadow-lg transform hover:-translate-y-1"
                    >
                        শপিং করুন
                    </Link>
                </div>
            </section>
        </div>
    );
}
