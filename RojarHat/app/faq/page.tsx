'use client';

import React, { useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: "আমি কিভাবে অর্ডার করতে পারি?",
            answer: "খুবই সহজ! আমাদের শপ পেজ থেকে আপনার পছন্দের পণ্যগুলো 'কার্টে' যোগ করুন। এরপর কার্ট পেজ থেকে 'চেকআউট' বাটনে ক্লিক করে আপনার নাম, ফোন নাম্বার এবং ঠিকানা দিয়ে অর্ডার কনফার্ম করুন।"
        },
        {
            question: "আপনাদের কি হোম ডেলিভারি সুবিধা আছে?",
            answer: "হ্যাঁ, আমরা সারা বাংলাদেশে হোম ডেলিভারি দিয়ে থাকি। ঢাকার মধ্যে ডেলিভারি চার্জ ৬০ টাকা এবং ঢাকার বাইরে ক্যাশ অন ডেলিভারি পাওয়া যাবে।"
        },
        {
            question: "পণ্য ভাল না হলে কি ফেরত দেওয়া যাবে?",
            answer: "অবশ্যই! পণ্য গ্রহনের সময় ডেলিভারি ম্যান থাকাকালীন চেক করে দেখুন। যদি পণ্যে কোনো ত্রুটি থাকে, আপনি তা সাথে সাথে ফেরত দিতে পারেন।"
        },
        {
            question: "পেমেন্ট কিভাবে করতে হয়?",
            answer: "আমরা বর্তমানে ক্যাশ অন ডেলিভারি সাপোর্ট করি। অর্থাৎ পণ্য হাতে পাওয়ার পর আপনি ডেলিভারি ম্যানকে টাকা পরিশোধ করবেন।"
        },
        {
            question: "অর্ডার করার পর কতদিনের মধ্যে পণ্য পাব?",
            answer: "ঢাকার মধ্যে সাধারণত ২৪-৪৮ ঘণ্টার মধ্যে এবং ঢাকার বাইরে ৩-৫ দিনের মধ্যে পণ্য পৌঁছে দেওয়া হয়।"
        }
    ];

    return (
        <div className="bg-stone-50 min-h-screen animate-fade-in pb-12">
            <Breadcrumbs />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="bg-emerald-950 rounded-2xl p-6 md:p-8 mb-10 text-center relative overflow-hidden shadow-xl border border-emerald-800">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <HelpCircle className="w-8 h-8 text-gold-400 mb-3" />
                        <h1 className="text-2xl font-bold text-white tracking-tight">সাধারণ জিজ্ঞাসা (FAQ)</h1>
                    </div>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden transition-all duration-300"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full text-left p-5 flex justify-between items-center hover:bg-emerald-50/50 transition"
                            >
                                <span className="font-bold text-emerald-900 md:text-lg">{faq.question}</span>
                                {openIndex === index ? (
                                    <ChevronUp className="text-gold-500 h-5 w-5 shrink-0" />
                                ) : (
                                    <ChevronDown className="text-stone-400 h-5 w-5 shrink-0" />
                                )}
                            </button>

                            <div className={`transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                <div className="p-5 pt-0 text-stone-600 leading-relaxed border-t border-stone-50">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-emerald-50 rounded-2xl p-8 border border-emerald-100 text-center">
                    <MessageCircle className="w-12 h-12 text-emerald-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-emerald-950 mb-2">আরও কিছু জানতে চান?</h3>
                    <p className="text-stone-600 mb-6">আমাদের কাস্টমার সাপোর্ট টিম আপনাকে সহায়তার জন্য সর্বদা প্রস্তুত।</p>
                    <a
                        href="tel:+8801722301927"
                        className="inline-block bg-emerald-700 text-white font-bold px-8 py-3 rounded-full hover:bg-emerald-800 transition shadow-lg"
                    >
                        কল করুন
                    </a>
                </div>
            </div>
        </div>
    );
};
