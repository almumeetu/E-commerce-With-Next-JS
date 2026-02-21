import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { ShoppingCart, Package, TrendingUp, AlertTriangle, Users, ArrowUpRight, BarChart3, DollarSign, Clock, Star, Download } from 'lucide-react';
import { databaseService } from '../services/databaseService';
import { useDashboardData } from '../hooks/useSWRData';

interface SalesSummaryWidgetProps {
    setActiveView: (view: string) => void;
}

export default function SalesSummaryWidget({ setActiveView }: SalesSummaryWidgetProps) {
    // Use SWR for data fetching with caching
    const { orders, products, customers, isLoading: loading } = useDashboardData();

    const stats = useMemo(() => {
        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_price || order.total_amount || 0), 0);
        const totalOrders = orders.length;
        const activeProducts = products.filter(p => p.status === 'active').length;
        const lowStockProducts = products.filter(p => p.stock < 10).length;
        const outOfStockProducts = products.filter(p => p.stock <= 0).length;
        const newProducts = products.filter(p => p.is_new || p.isNew).length;
        const popularProducts = products.filter(p => p.is_popular || p.isPopular).length;

        const today = new Date().toDateString();
        const todayOrdersList = orders.filter(o => new Date(o.created_at || o.date).toDateString() === today);
        const todayOrders = todayOrdersList.length;
        const todayRevenue = todayOrdersList.reduce((sum, o) => sum + Number(o.total_price || o.total_amount || 0), 0);

        // Status Breakdown
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        const processingOrders = orders.filter(o => o.status === 'processing').length;
        const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
        const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

        // Inventory Value
        const totalStockValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        return {
            totalRevenue,
            totalOrders,
            activeProducts,
            lowStockProducts,
            outOfStockProducts,
            newProducts,
            popularProducts,
            todayOrders,
            todayRevenue,
            pendingOrders,
            processingOrders,
            deliveredOrders,
            cancelledOrders,
            totalStockValue,
            avgOrderValue
        };
    }, [orders, products]);

    // Chart Data (Last 7 Days)
    const chartData = useMemo(() => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toISOString().split('T')[0];
        });

        return last7Days.map(date => {
            const dayOrders = orders.filter(order => {
                const orderDate = new Date(order.created_at || order.date).toISOString().split('T')[0];
                return orderDate === date;
            });

            return {
                date: new Date(date).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' }),
                orders: dayOrders.length,
                revenue: dayOrders.reduce((sum, order) => sum + Number(order.total_price || order.total_amount || 0), 0)
            };
        });
    }, [orders]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    const dashboardStats = [
        {
            label: 'মোট রেভিনিউ',
            value: `৳ ${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            trend: '+১২%',
            subValue: `আজ: ৳${stats.todayRevenue.toLocaleString()}`
        },
        {
            label: 'মোট অর্ডার',
            value: stats.totalOrders,
            icon: ShoppingCart,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            trend: `+${stats.todayOrders}`,
            subValue: `আজকের: ${stats.todayOrders}`
        },
        {
            label: 'সচল পণ্য',
            value: stats.activeProducts,
            icon: Package,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            trend: `${stats.newProducts} নতুন`,
            subValue: `জনপ্রিয়: ${stats.popularProducts}`
        },
        {
            label: 'স্টক অ্যালার্ট',
            value: stats.lowStockProducts + stats.outOfStockProducts,
            icon: AlertTriangle,
            color: 'text-rose-600',
            bg: 'bg-rose-50',
            trend: 'জরুরী',
            subValue: `স্টকআউট: ${stats.outOfStockProducts}`
        },
    ];

    return (
        <div className="space-y-10 animate-fade-in pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-4xl font-black text-emerald-950 tracking-tight">ড্যাশবোর্ড</h2>
                    <p className="text-stone-500 font-medium">আজকের স্টোর ওভারভিউ এবং গুরুত্বপূর্ণ নিউজ</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={loadData} className="bg-white px-4 py-2 rounded-xl text-xs font-black border border-stone-100 shadow-sm flex items-center gap-2 hover:bg-stone-50 transition">
                        <Clock size={14} className="text-emerald-500" />
                        রিফ্রেশ
                    </button>
                    <span className="bg-white px-4 py-2 rounded-xl text-xs font-black border border-stone-100 shadow-sm flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        লাইভ আপডেট
                    </span>
                </div>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/40 hover:scale-[1.02] transition-all group overflow-hidden relative">
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon size={28} />
                            </div>
                            <span className={`text-[10px] font-black ${stat.color} bg-white px-2.5 py-1 rounded-full border border-stone-50 shadow-sm uppercase tracking-widest`}>{stat.trend}</span>
                        </div>
                        <p className="text-sm font-bold text-stone-400 uppercase tracking-widest relative z-10">{stat.label}</p>
                        <h2 className="text-3xl font-black text-stone-900 mt-2 relative z-10">{stat.value}</h2>
                        {stat.subValue && (
                            <p className="text-xs text-stone-500 font-medium mt-2 relative z-10">{stat.subValue}</p>
                        )}
                        <div className={`absolute -bottom-6 -right-6 w-24 h-24 ${stat.bg} rounded-full blur-2xl opacity-50 transition-opacity group-hover:opacity-100`}></div>
                    </div>
                ))}
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-[3rem] border border-stone-100 shadow-xl shadow-stone-200/40 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-black text-stone-900">৭ দিনের পারফরমেন্স</h3>
                            <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mt-1">অর্ডার এবং রেভিনিউ</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-lg bg-stone-50 hover:bg-stone-100 transition">
                                <BarChart3 size={16} className="text-stone-600" />
                            </button>
                            <button className="p-2 rounded-lg bg-stone-50 hover:bg-stone-100 transition">
                                <Download size={16} className="text-stone-600" />
                            </button>
                        </div>
                    </div>

                    {/* Simple Chart Representation */}
                    <div className="bg-gradient-to-br from-stone-50 to-white rounded-2xl p-6 border border-stone-100">
                        <div className="flex items-end justify-between h-40 gap-2">
                            {chartData.map((data, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center gap-2 group/bar">
                                    <div className="w-full bg-emerald-500 rounded-t-lg transition-all group-hover/bar:bg-emerald-600 relative group/tooltip"
                                        style={{ height: `${Math.max((data.orders / (Math.max(...chartData.map(d => d.orders)) || 1)) * 100, 10)}%` }}>
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            {data.orders} অর্ডার
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{data.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="text-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <p className="text-2xl font-black text-emerald-900">{Math.round(stats.avgOrderValue)}</p>
                            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-1">গড় অর্ডার ভ্যালু</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
                            <p className="text-2xl font-black text-blue-900">{stats.deliveredOrders}</p>
                            <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1">সফল ডেলিভারি</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-2xl border border-purple-100">
                            <p className="text-2xl font-black text-purple-900">৳{stats.totalStockValue.toLocaleString()}</p>
                            <p className="text-[10px] text-purple-600 font-black uppercase tracking-widest mt-1">ইনভেন্টরি ভ্যালু</p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats & Top Store */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[3rem] border border-stone-100 shadow-xl shadow-stone-200/40 p-8">
                        <h3 className="text-lg font-black text-stone-900 mb-6">অর্ডার স্ট্যাটাস</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'পেন্ডিং', value: stats.pendingOrders, color: 'bg-amber-100 text-amber-700' },
                                { label: 'প্রসেসিং', value: stats.processingOrders, color: 'bg-blue-100 text-blue-700' },
                                { label: 'ডেলিভারড', value: stats.deliveredOrders, color: 'bg-emerald-100 text-emerald-700' },
                                { label: 'বাতিল', value: stats.cancelledOrders, color: 'bg-rose-100 text-rose-700' },
                            ].map((status, i) => (
                                <div key={i} className="flex items-center justify-between p-3 hover:bg-stone-50 rounded-2xl transition-colors cursor-default">
                                    <span className="text-sm font-bold text-stone-600">{status.label}</span>
                                    <span className={`text-xs font-black px-3 py-1.5 rounded-full ${status.color}`}>
                                        {status.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[3rem] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/30 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <Star className="h-8 w-8 text-yellow-300 fill-yellow-300" />
                                <h3 className="text-lg font-black">টপ পারফর্মার</h3>
                            </div>
                            <p className="text-3xl font-black mb-1">ফ্রেন্ডস গ্যালারি</p>
                            <p className="text-emerald-200 text-sm font-medium">বেস্ট ই-কমার্স প্ল্যাটফর্ম</p>
                            <div className="mt-6 pt-6 border-t border-emerald-500/50 flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-widest">টোটাল কাস্টমার</p>
                                    <p className="text-2xl font-black">{customers.length}</p>
                                </div>
                                <div className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
                                    <p className="text-xs font-bold">Top 1%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Recent Orders Table */}
                <div className="bg-white rounded-[3rem] border border-stone-100 shadow-xl shadow-stone-200/40 overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-stone-50 flex justify-between items-center bg-stone-50/50">
                        <div>
                            <h3 className="text-xl font-black text-stone-900">সাম্প্রতিক অর্ডার</h3>
                            <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mt-1">শেষ ৫টি অর্ডার</p>
                        </div>
                        <button onClick={() => setActiveView('orders')} className="bg-white p-3 rounded-2xl border border-stone-100 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm group">
                            <ArrowUpRight size={20} className="group-hover:rotate-45 transition-transform" />
                        </button>
                    </div>
                    <div className="overflow-x-auto flex-grow">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-stone-400 text-[10px] uppercase font-black tracking-widest bg-stone-50/30">
                                    <th className="px-8 py-5">গ্রাহক</th>
                                    <th className="px-8 py-5">অবস্থা</th>
                                    <th className="px-8 py-5 text-right">মূল্য</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                                {orders.slice(0, 5).map((order) => (
                                    <tr key={order.id || order.order_id} className="hover:bg-emerald-50/30 transition-colors group cursor-pointer" onClick={() => setActiveView('orders')}>
                                        <td className="px-8 py-5">
                                            <p className="text-sm font-bold text-stone-800 group-hover:text-emerald-800 transition-colors">{order.customer_name}</p>
                                            <p className="text-[10px] text-stone-400 font-bold mt-0.5">{order.phone}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                                                order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-stone-100 text-stone-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right text-sm font-black text-stone-900">৳ {Number(order.total_price || order.total_amount).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Inventory Alerts & Quick Actions */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[3rem] border border-stone-100 shadow-xl shadow-stone-200/40 p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl shadow-sm">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-stone-900">ইনভেন্টরি অ্যালার্ট</h3>
                                <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mt-1">স্টক কম থাকা পণ্যসমূহ</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {products.filter(p => (p.stock || 0) < 10 && (p.stock || 0) > 0).slice(0, 3).map((product) => (
                                <div key={product.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-[2rem] border border-white hover:border-rose-200 transition-colors group/item shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl p-1 overflow-hidden shadow-sm group-hover/item:scale-110 transition-transform">
                                            <Image src={product.image_url} alt={product.name} width={48} height={48} className="w-full h-full object-cover rounded-lg" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-stone-800 line-clamp-1">{product.name}</h4>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>
                                                <p className="text-[10px] text-rose-600 font-black uppercase tracking-widest">মাত্র {product.stock} টি বাকি</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveView('products')} className="text-[10px] font-black text-white bg-stone-900 px-3 py-2 rounded-xl hover:bg-emerald-600 transition-colors uppercase tracking-widest shadow-sm">
                                        আপডেট
                                    </button>
                                </div>
                            ))}
                            {(!products || products.filter(p => p.stock < 10).length === 0) && (
                                <div className="text-center py-10 opacity-50 grayscale border-2 border-dashed border-stone-200 rounded-[2rem]">
                                    <Package size={48} className="mx-auto text-stone-300 mb-4" />
                                    <p className="text-stone-500 font-bold">সকল পণ্যের স্টক পর্যাপ্ত আছে</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Access Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setActiveView('products')} className="bg-emerald-600 p-8 rounded-[2.5rem] text-white hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 group text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl group-hover:scale-150 transition-transform"></div>
                            <Package className="mb-4 text-emerald-200 group-hover:scale-110 transition-transform" size={28} />
                            <h4 className="font-black text-lg relative z-10">পণ্য যোগ করুন</h4>
                            <p className="text-emerald-100/60 text-[10px] font-bold uppercase tracking-widest mt-1 relative z-10">নতুন আইটেম</p>
                        </button>
                        <button onClick={() => setActiveView('customers')} className="bg-stone-900 p-8 rounded-[2.5rem] text-white hover:bg-black transition-all shadow-xl shadow-stone-900/20 group text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl group-hover:scale-150 transition-transform"></div>
                            <Users className="mb-4 text-stone-400 group-hover:scale-110 transition-transform" size={28} />
                            <h4 className="font-black text-lg relative z-10">গ্রাহক তালিকা</h4>
                            <p className="text-stone-500 text-[10px] font-bold uppercase tracking-widest mt-1 relative z-10">ম্যানেজমেন্ট</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}