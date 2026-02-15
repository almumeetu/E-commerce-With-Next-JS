'use client';

import React from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-stone-50 min-h-screen animate-fade-in pb-12">
            <Breadcrumbs />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="bg-emerald-950 rounded-2xl p-6 md:p-8 mb-10 text-center relative overflow-hidden shadow-xl border border-emerald-800">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <Shield className="w-8 h-8 text-gold-400 mb-3" />
                        <h1 className="text-2xl font-bold text-white tracking-tight">গোপনীয়তা নীতি (Privacy Policy)</h1>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 md:p-12 prose prose-emerald max-w-none">
                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-emerald-900 mb-4 flex items-center">
                            <Eye className="mr-2 h-5 w-5 text-gold-500" /> ১. তথ্য সংগ্রহ
                        </h2>
                        <p className="text-stone-600 leading-relaxed mb-4">
                            রোজারহাট আপনার ব্যক্তিগত তথ্যের সুরক্ষায় প্রতিশ্রুতিবদ্ধ। আমাদের ওয়েবসাইট ব্যবহারের সময় আমরা আপনার নাম, ফোন নাম্বার, ইমেইল এবং ডেলিভারি অ্যাড্রেস সংগ্রহ করে থাকি শুধুমাত্র অর্ডার প্রসেস করার উদ্দেশ্যে।
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-emerald-900 mb-4 flex items-center">
                            <Lock className="mr-2 h-5 w-5 text-gold-500" /> ২. তথ্যের ব্যবহার
                        </h2>
                        <p className="text-stone-600 leading-relaxed mb-4">
                            আপনার সংগৃহীত তথ্য নিম্নোক্ত কাজে ব্যবহৃত হয়:
                        </p>
                        <ul className="list-disc pl-6 text-stone-600 space-y-2">
                            <li>অর্ডার কনফার্মেশন এবং ডেলিভারি নিশ্চিত করা।</li>
                            <li>কাস্টমার সার্ভিসের মাধ্যমে আপনাকে সহায়তা করা।</li>
                            <li>নতুন অফার এবং আপডেট সম্পর্কে জানানো (আপনার অনুমতি সাপেক্ষে)।</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-emerald-900 mb-4 flex items-center">
                            <Shield className="mr-2 h-5 w-5 text-gold-500" /> ৩. নিরাপত্তা
                        </h2>
                        <p className="text-stone-600 leading-relaxed">
                            আমরা আপনার ব্যক্তিগত তথ্য সুরক্ষিত রাখতে সর্বাধুনিক নিরাপত্তা ব্যবস্থা ব্যবহার করি। আমরা কোনো অবস্থাতেই আপনার তথ্য তৃতীয় কোনো পক্ষের কাছে বিক্রি বা শেয়ার করি না।
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-emerald-900 mb-4 flex items-center">
                            <FileText className="mr-2 h-5 w-5 text-gold-500" /> ৪. কুকিজ (Cookies)
                        </h2>
                        <p className="text-stone-600 leading-relaxed">
                            আপনার ব্রাউজিং অভিজ্ঞতা উন্নত করতে আমরা কুকিজ ব্যবহার করি। আপনি চাইলে আপনার ব্রাউজার সেটিংস থেকে এটি নিয়ন্ত্রণ করতে পারেন।
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
