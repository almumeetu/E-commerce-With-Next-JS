import React, { useState } from 'react';
import { getOrderStatus } from '../services/api';
import { OrderStatus } from '../types';

export const OrderTrackingWidget: React.FC = () => {
    const [trackingId, setTrackingId] = useState('');
    const [status, setStatus] = useState<OrderStatus | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingId) return;
        setIsLoading(true);
        setStatus(null);
        const result = await getOrderStatus(trackingId);
        setStatus(result);
        setIsLoading(false);
    };

    const getStatusColor = (currentStatus: OrderStatus) => {
        switch (currentStatus) {
            case OrderStatus.Processing: return 'bg-yellow-500';
            case OrderStatus.Shipped: return 'bg-blue-500';
            case OrderStatus.Delivered: return 'bg-green-500';
            case OrderStatus.NotFound: return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">আপনার অর্ডার ট্র্যাক করুন</h2>
            <p className="text-brand-yellow/80 mb-10 font-medium text-lg">আপনার অর্ডার আইডি দিয়ে সহজেই বর্তমান অবস্থা জানুন।</p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="relative w-full sm:w-96 group">
                    <input
                        type="text"
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        placeholder="অর্ডার আইডি লিখুন (e.g., FG-2024-12345)"
                        className="w-full bg-white/10 border-2 border-white/10 rounded-2xl py-4 px-6 text-white placeholder-white/40 focus:outline-none focus:border-brand-yellow/50 focus:bg-white/20 transition-all font-medium"
                        aria-label="Order Tracking ID"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto bg-brand-yellow text-brand-green-deep py-4 px-10 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-brand-yellow-vibrant disabled:opacity-50 transition-all shadow-xl active:scale-95 whitespace-nowrap"
                >
                    {isLoading ? 'অনুসন্ধান...' : 'ট্র্যাক করুন'}
                </button>
            </form>

            {status && (
                <div className="mt-12 p-8 bg-white/10 rounded-3xl border border-white/5 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-white/60 font-bold uppercase tracking-[0.2em] text-xs mb-4">অর্ডারের বর্তমান অবস্থা</h3>
                    <div className={`inline-flex items-center px-8 py-3 rounded-full text-base font-black uppercase tracking-widest shadow-2xl ${getStatusColor(status)} text-white`}>
                        {status}
                    </div>
                </div>
            )}
        </div>
    );
};