'use client';

import { useState } from 'react';
import { Search, User, Phone, MapPin, ShoppingBag, DollarSign, Calendar } from 'lucide-react';

export default function AdminUsers({ customers }: { customers: any[] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-stone-900 tracking-tight">গ্রাহক তালিকা</h2>
                    <p className="text-stone-500 font-medium">আপনার স্টোরের সকল নিবন্ধিত ও অনিয়মিত গ্রাহক</p>
                </div>
                <div className="bg-indigo-50 text-indigo-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 border border-indigo-100 shadow-sm transition-all">
                    <User size={20} /> মোট {customers.length} জন গ্রাহক
                </div>
            </div>

            <div className="relative group">
                <input
                    type="text"
                    placeholder="নাম বা ফোন নম্বর দিয়ে গ্রাহক খুঁজুন..."
                    className="w-full pl-14 pr-6 py-5 rounded-[2rem] border-2 border-stone-100 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all text-stone-700 font-medium shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-indigo-500 transition-colors" size={24} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCustomers.map((customer, i) => (
                    <div key={i} className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all p-8 flex flex-col group border-b-4 border-b-transparent hover:border-b-indigo-500">
                        <div className="flex items-start justify-between mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-inner">
                                <User size={32} />
                            </div>
                            <div className="text-right">
                                <div className="inline-flex items-center gap-1.5 bg-stone-50 text-stone-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-stone-100">
                                    <ShoppingBag size={10} /> {customer.orderCount} অর্ডার
                                </div>
                            </div>
                        </div>

                        <h3 className="text-xl font-black text-stone-900 mb-1 group-hover:text-indigo-800 transition-colors">{customer.name}</h3>
                        <div className="flex items-center gap-2 text-stone-400 mb-6">
                            <Phone size={14} />
                            <span className="text-sm font-bold">{customer.phone}</span>
                        </div>

                        <div className="space-y-4 mb-8 flex-grow">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 p-1.5 rounded-lg bg-stone-50 text-stone-400">
                                    <MapPin size={14} />
                                </div>
                                <p className="text-sm text-stone-600 font-medium leading-relaxed line-clamp-2">
                                    {customer.address}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-stone-100">
                            <div>
                                <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest mb-1">মোট খরচ</p>
                                <div className="flex items-center gap-1 text-indigo-700 font-black text-lg">
                                    <DollarSign size={16} />
                                    <span>{customer.totalSpent}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest mb-1">শেষ অর্ডার</p>
                                <div className="flex items-center justify-end gap-1 text-stone-600 font-bold text-xs mt-1.5">
                                    <Calendar size={12} />
                                    <span>{new Date(customer.lastOrder).toLocaleDateString('bn-BD')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCustomers.length === 0 && (
                <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-stone-100">
                    <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User size={48} className="text-stone-200" />
                    </div>
                    <h3 className="text-2xl font-black text-stone-900 mb-2">কোনো গ্রাহক পাওয়া যায়নি</h3>
                    <p className="text-stone-500 font-medium">অনুগ্রহ করে সঠিক নাম বা ফোন নম্বর দিয়ে সার্চ করুন।</p>
                </div>
            )}
        </div>
    );
}
