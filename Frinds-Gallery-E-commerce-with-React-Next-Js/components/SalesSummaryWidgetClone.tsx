
import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, Package, TrendingUp, AlertTriangle, Users, ArrowUpRight, BarChart3, DollarSign, Clock, Star, Eye, Download, Calendar, Filter, Loader2 } from 'lucide-react';
import { databaseService } from '../services/databaseService';

export default function SalesSummaryWidgetClone() {
    const [orders, setOrders] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [ordersData, productsData] = await Promise.all([
                databaseService.getOrdersWithItems(),
                databaseService.getProducts()
            ]);
            setOrders(ordersData || []);
            setProducts(productsData || []);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => {
        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_price), 0);
        const totalOrders = orders.length;
        const activeProducts = products.filter(p => p.status === 'active').length;
        const lowStockProducts = products.filter(p => p.stock < 10).length;

        const today = new Date().toDateString();
        const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === today);
        const todayRevenue = todayOrders.reduce((sum, o) => sum + Number(o.total_price), 0);

        return {
            totalRevenue,
            totalOrders,
            activeProducts,
            lowStockProducts,
            todayOrders: todayOrders.length,
            todayRevenue
        };
    }, [orders, products]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <Loader2 className="animate-spin text-emerald-600" size={32} />
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
            subValue: `আজ: ৳${stats.todayRevenue.toLocaleString()}`
        },
        {
            label: 'মোট অর্ডার',
            value: stats.totalOrders,
            icon: ShoppingCart,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            subValue: `আজকের: ${stats.todayOrders}`
        },
        {
            label: 'সচল পণ্য',
            value: stats.activeProducts,
            icon: Package,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            subValue: `মোট আইটেম`
        },
        {
            label: 'স্টক অ্যালার্ট',
            value: stats.lowStockProducts,
            icon: AlertTriangle,
            color: 'text-rose-600',
            bg: 'bg-rose-50',
            subValue: `কম স্টক পণ্য`
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-xl font-black text-stone-900 tracking-tight">স্টোর ওভারভিউ</h3>
                    <p className="text-sm text-stone-500 font-medium">রিয়েল-টাইম সেলস এবং ইনভেন্টরি রিপোর্ট</p>
                </div>
                <button onClick={loadData} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-400">
                    <Clock size={20} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest relative z-10">{stat.label}</p>
                        <h2 className="text-2xl font-black text-stone-900 mt-1 relative z-10">{stat.value}</h2>
                        <p className="text-[10px] text-stone-500 font-bold mt-1 relative z-10">{stat.subValue}</p>

                        <div className={`absolute -bottom-4 -right-4 w-16 h-16 ${stat.bg} rounded-full blur-xl opacity-30`}></div>
                    </div>
                ))}
            </div>

            <div className="bg-gradient-to-br from-stone-900 to-black rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="text-emerald-400" />
                        <h4 className="font-black tracking-tight text-lg">পারফরমেন্স আপডেট</h4>
                    </div>
                    <p className="text-stone-400 text-sm leading-relaxed max-w-md">
                        আপনার স্টোর বর্তমানে ভালো চলছে। গত সপ্তাহের তুলনায় সেলস ১০% বৃদ্ধি পেয়েছে। গুরুত্বপূর্ণ ইনভেন্টরি চেক করুন।
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            </div>
        </div>
    );
}
