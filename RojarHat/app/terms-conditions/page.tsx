'use client';

import React from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Gavel, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function TermsConditionsPage() {
    return (
        <div className="bg-stone-50 min-h-screen animate-fade-in pb-12">
            <Breadcrumbs />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="bg-emerald-950 rounded-2xl p-6 md:p-8 mb-10 text-center relative overflow-hidden shadow-xl border border-emerald-800">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <Gavel className="w-8 h-8 text-gold-400 mb-3" />
                        <h1 className="text-2xl font-bold text-white tracking-tight">শর্তাবলী (Terms & Conditions)</h1>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 md:p-12 prose prose-emerald max-w-none">
                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-emerald-900 mb-4 flex items-center">
                            <CheckCircle className="mr-2 h-5 w-5 text-gold-500" /> ১. সাধারণ নিয়মাবলী
                        </h2>
                        <p className="text-stone-600 leading-relaxed">
                            রোজারহাট ওয়েবসাইট ব্যবহার করার মাধ্যমে আপনি আমাদের শর্তাবলীর সাথে একমত পোষণ করছেন। আমরা যেকোনো সময় এই শর্তাবলী পরিবর্তন বা পরিমার্জন করার অধিকার সংরক্ষণ করি।
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-emerald-900 mb-4 flex items-center">
                            <AlertCircle className="mr-2 h-5 w-5 text-gold-500" /> ২. অর্ডার এবং পেমেন্ট
                        </h2>
                        <ul className="list-disc pl-6 text-stone-600 space-y-2">
                            <li>অর্ডার করার সময় সঠিক নাম এবং ফোন নাম্বার প্রদান করা বাধ্যতামুলক।</li>
                            <li>বর্তমানে আমরা ক্যাশ অন ডেলিভারি (Cash on Delivery) প্রদান করছি।</li>
                            <li>পণ্য স্টকের ওপর ভিত্তি করে অর্ডারের প্রাপ্যতা নির্ভর করবে।</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-emerald-900 mb-4 flex items-center">
                            <RefreshCw className="mr-2 h-5 w-5 text-gold-500" /> ৩. রিটার্ন এবং রিফান্ড পলিসি
                        </h2>
                        <p className="text-stone-600 leading-relaxed">
                            পণ্য গ্রহনের সময় কোনো ত্রুটি থাকলে ডেলিভারি ম্যানের সামনেই তা চেক করে গ্রহন করুন। ত্রুটিপূর্ণ পণ্য ২৪ ঘণ্টার মধ্যে আমাদের জানালে আমরা তা পরিবর্তন বা রিফান্ডের ব্যবস্থা করব। পচনশীল পণ্যের ক্ষেত্রে তৎক্ষণাৎ সিদ্ধান্ত নিতে হবে।
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-emerald-900 mb-4 flex items-center">
                            <AlertCircle className="mr-2 h-5 w-5 text-gold-500" /> ৪. ডেলিভারি সময়সীমা
                        </h2>
                        <p className="text-stone-600 leading-relaxed">
                            ঢাকার মধ্যে ২৪-৪৮ ঘণ্টা এবং ঢাকার বাইরে ৩-৫ কার্যদিবসের মধ্যে ডেলিভারি সম্পন্ন করা হয়। তবে বিশেষ পরিস্থিতিতে সময় কিছুটা বেশি লাগতে পারে।
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
