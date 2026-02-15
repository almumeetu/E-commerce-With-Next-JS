'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { toast } from '@/lib/toast';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('ধন্যবাদ! আপনার বার্তাটি পাঠানো হয়েছে।');
        setFormData({ name: '', phone: '', message: '' });
    };

    return (
        <div className="bg-stone-50 min-h-screen pb-12 animate-fade-in">
            <Breadcrumbs />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

                {/* Professional Small Header */}
                <div className="bg-emerald-950 rounded-2xl p-6 md:p-8 mb-10 text-center relative overflow-hidden shadow-xl border border-emerald-800">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">যোগাযোগ করুন</h1>
                        <p className="text-emerald-200/80 text-xs md:text-sm max-w-xl mx-auto font-medium">যেকোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করুন</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-sm overflow-hidden border border-stone-100">
                    {/* Info Side */}
                    <div className="bg-emerald-900 text-white p-8 md:p-12">
                        <h3 className="text-xl font-bold mb-6">আমাদের ঠিকানা</h3>
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <MapPin className="h-6 w-6 text-gold-400 mt-1" />
                                <div>
                                    <p className="font-semibold">প্রধান অফিস:</p>
                                    <p className="text-emerald-100 text-sm"> ঢাকা, বাংলাদেশ</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <Phone className="h-6 w-6 text-gold-400 mt-1" />
                                <div>
                                    <p className="font-semibold">ফোন:</p>
                                    <p className="text-emerald-100 text-sm">+8801722-301927</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <Mail className="h-6 w-6 text-gold-400 mt-1" />
                                <div>
                                    <p className="font-semibold">ইমেইল:</p>
                                    <p className="text-emerald-100 text-sm">almumeetu@gmail.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h4 className="font-semibold mb-3 text-gold-400">খোলার সময়:</h4>
                            <p className="text-sm">শনি - বৃহস্পতি: সকাল ১০টা - রাত ৮টা</p>
                            <p className="text-sm">শুক্রবার: বিকাল ৪টা - রাত ১০টা</p>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="p-8 md:p-12">
                        <h3 className="text-xl font-bold text-emerald-900 mb-6">বার্তা পাঠান</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2 font-semibold">আপনার নাম</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/40 backdrop-blur-md border border-yellow-400 rounded-xl text-emerald-950 placeholder-emerald-700/60 font-medium focus:ring-2 focus:ring-gold-400 focus:border-gold-500 focus:bg-white/60 outline-none transition duration-300 shadow-sm"
                                    placeholder="নাম লিখুন"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2 font-semibold">ফোন নাম্বার</label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/40 backdrop-blur-md border border-yellow-400 rounded-xl text-emerald-950 placeholder-emerald-700/60 font-medium focus:ring-2 focus:ring-gold-400 focus:border-gold-500 focus:bg-white/60 outline-none transition duration-300 shadow-sm"
                                    placeholder="০১৭XXXXXXXX"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2 font-semibold">আপনার বার্তা</label>
                                <textarea
                                    rows={4}
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/40 backdrop-blur-md border border-yellow-400 rounded-xl text-emerald-950 placeholder-emerald-700/60 font-medium focus:ring-2 focus:ring-gold-400 focus:border-gold-500 focus:bg-white/60 outline-none transition duration-300 shadow-sm resize-none"
                                    placeholder="বিস্তারিত লিখুন..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold py-3 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 duration-300 mt-2"
                            >
                                বার্তা পাঠান <Send className="ml-2 h-5 w-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
