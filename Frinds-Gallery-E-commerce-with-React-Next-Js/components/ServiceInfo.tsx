import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';

const services = [
    { title: "দ্রুত ডেলিভারি", description: "৳১০০০+ কেনাকাটায়", icon: Truck },
    { title: "সহজ রিটার্ন", description: "৭ দিনের মধ্যে", icon: RotateCcw },
    { title: "মানসম্মত পণ্য", description: "১০০% অরিজিনাল", icon: ShieldCheck },
    { title: "সাহায্য দরকার?", description: "২৪/৭ অনলাইন সাপোর্ট", icon: Headphones },
];

export const ServiceInfo: React.FC = () => {
    return (
        <div className="bg-black/20 border-y border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-yellow/30 to-transparent"></div>
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
                    {services.map((service) => {
                        const Icon = service.icon;
                        return (
                            <div key={service.title} className="flex items-center gap-6 p-8 rounded-[2.5rem] bg-white/5 hover:bg-brand-yellow transition-all duration-500 border border-white/5 group active:scale-95 cursor-default">
                                <div className="p-4 rounded-2xl bg-brand-yellow text-brand-green-deep group-hover:bg-brand-green-deep group-hover:text-brand-yellow transition-all duration-500 shadow-xl group-hover:rotate-12">
                                    <Icon size={32} strokeWidth={2.5} />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="font-extrabold text-white group-hover:text-brand-green-deep tracking-tight text-lg transition-colors">{service.title}</h3>
                                    <p className="text-[10px] text-brand-yellow group-hover:text-brand-green-deep/70 mt-1 uppercase tracking-[0.2em] font-black transition-colors">{service.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};