import { createClient } from '@/lib/supabase/server';
import { ShoppingCart, Package, TrendingUp, AlertTriangle, Users, ArrowUpRight, BarChart3, DollarSign, Clock, Star, Eye, Download, Calendar, Filter } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch stats
    const { data: orders } = await supabase.from('orders').select('*');
    const { data: products } = await supabase.from('products').select('*');

    // Calculate advanced analytics
    const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_price), 0) || 0;
    const totalOrders = orders?.length || 0;
    const activeProducts = products?.filter(p => p.status === 'active').length || 0;
    const lowStockProducts = products?.filter(p => p.stock < 10).length || 0;
    
    // Today's stats
    const today = new Date();
    const todayOrders = orders?.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.toDateString() === today.toDateString();
    }).length || 0;
    
    const todayRevenue = orders?.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.toDateString() === today.toDateString();
    }).reduce((sum, order) => sum + Number(order.total_price), 0) || 0;
    
    // Order status breakdown
    const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
    const processingOrders = orders?.filter(o => o.status === 'processing').length || 0;
    const deliveredOrders = orders?.filter(o => o.status === 'delivered').length || 0;
    const cancelledOrders = orders?.filter(o => o.status === 'cancelled').length || 0;
    
    // Product analytics
    const totalStockValue = products?.reduce((sum, product) => sum + (product.price * product.stock), 0) || 0;
    const outOfStockProducts = products?.filter(p => p.stock <= 0).length || 0;
    const newProducts = products?.filter(p => p.isNew).length || 0;
    const popularProducts = products?.filter(p => p.isPopular).length || 0;
    
    // Average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Category breakdown
    const categoryBreakdown = products?.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>) || {};

    const stats = [
        { 
            label: 'মোট রেভিনিউ', 
            value: `৳ ${totalRevenue.toLocaleString()}`, 
            icon: DollarSign, 
            color: 'text-emerald-600', 
            bg: 'bg-emerald-50', 
            trend: '+১২%',
            subValue: `আজ: ৳${todayRevenue.toLocaleString()}`
        },
        { 
            label: 'মোট অর্ডার', 
            value: totalOrders, 
            icon: ShoppingCart, 
            color: 'text-blue-600', 
            bg: 'bg-blue-50', 
            trend: `+${todayOrders}`,
            subValue: `আজকের: ${todayOrders}`
        },
        { 
            label: 'সচল পণ্য', 
            value: activeProducts, 
            icon: Package, 
            color: 'text-purple-600', 
            bg: 'bg-purple-50', 
            trend: `${newProducts} নতুন`,
            subValue: `জনপ্রিয়: ${popularProducts}`
        },
        { 
            label: 'স্টক অ্যালার্ট', 
            value: lowStockProducts + outOfStockProducts, 
            icon: AlertTriangle, 
            color: 'text-rose-600', 
            bg: 'bg-rose-50', 
            trend: 'জরুরী',
            subValue: `স্টকআউট: ${outOfStockProducts}`
        },
    ];

    // Prepare chart data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
    });
    
    const chartData = last7Days.map(date => {
        const dayOrders = orders?.filter(order => {
            const orderDate = new Date(order.created_at).toISOString().split('T')[0];
            return orderDate === date;
        }) || [];
        
        return {
            date: new Date(date).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' }),
            orders: dayOrders.length,
            revenue: dayOrders.reduce((sum, order) => sum + Number(order.total_price), 0)
        };
    });

    return (
        <div className="space-y-10 animate-fade-in pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-4xl font-black text-emerald-950 tracking-tight">ড্যাশবোর্ড</h2>
                    <p className="text-stone-500 font-medium">আজকের স্টোর ওভারভিউ এবং গুরুত্বপূর্ণ নিউজ</p>
                </div>
                <div className="flex gap-2">
                    <span className="bg-white px-4 py-2 rounded-xl text-xs font-black border border-stone-100 shadow-sm flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        লাইভ আপডেট
                    </span>
                </div>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
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

                        {/* Decorative Background Element */}
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
                                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full bg-emerald-500 rounded-t-lg transition-all hover:bg-emerald-600" 
                                         style={{ height: `${Math.max((data.orders / Math.max(...chartData.map(d => d.orders))) * 100, 10)}%` }}>
                                    </div>
                                    <span className="text-xs text-stone-500 font-medium">{data.date}</span>
                                    <span className="text-xs text-emerald-600 font-bold">{data.orders}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="text-center p-4 bg-emerald-50 rounded-2xl">
                            <p className="text-2xl font-black text-emerald-900">{Math.round(avgOrderValue)}</p>
                            <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">গড় অর্ডার</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-2xl">
                            <p className="text-2xl font-black text-blue-900">{deliveredOrders}</p>
                            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">ডেলিভারড</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-2xl">
                            <p className="text-2xl font-black text-purple-900">৳{totalStockValue.toLocaleString()}</p>
                            <p className="text-xs text-purple-600 font-bold uppercase tracking-wider">স্টক মূল্য</p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[3rem] border border-stone-100 shadow-xl shadow-stone-200/40 p-8">
                        <h3 className="text-lg font-black text-stone-900 mb-6">অর্ডার স্ট্যাটাস</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'পেন্ডিং', value: pendingOrders, color: 'bg-amber-100 text-amber-700' },
                                { label: 'প্রসেসিং', value: processingOrders, color: 'bg-blue-100 text-blue-700' },
                                { label: 'ডেলিভারড', value: deliveredOrders, color: 'bg-emerald-100 text-emerald-700' },
                                { label: 'বাতিল', value: cancelledOrders, color: 'bg-rose-100 text-rose-700' },
                            ].map((status, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-stone-600">{status.label}</span>
                                    <span className={`text-xs font-black px-3 py-1 rounded-full ${status.color}`}>
                                        {status.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[3rem] p-8 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <Star className="h-8 w-8 text-emerald-200" />
                            <h3 className="text-lg font-black">টপ পারফর্মার</h3>
                        </div>
                        <p className="text-3xl font-black mb-2">রোজারহাট</p>
                        <p className="text-emerald-200 text-sm font-medium">এ মাসের সেরা স্টোর</p>
                        <div className="mt-4 pt-4 border-t border-emerald-500">
                            <p className="text-xs text-emerald-300">কনভারশন রেট</p>
                            <p className="text-2xl font-black">94.5%</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Recent Orders Table */}
                <div className="bg-white rounded-[3rem] border border-stone-100 shadow-xl shadow-stone-200/40 overflow-hidden">
                    <div className="p-8 border-b border-stone-50 flex justify-between items-center bg-stone-50/50">
                        <div>
                            <h3 className="text-xl font-black text-stone-900">সাম্প্রতিক অর্ডার</h3>
                            <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mt-1">শেষ ৫টি অর্ডার</p>
                        </div>
                        <Link href="/admin/orders" className="bg-white p-3 rounded-2xl border border-stone-100 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm group">
                            <ArrowUpRight size={20} className="group-hover:rotate-45 transition-transform" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-stone-400 text-[10px] uppercase font-black tracking-widest">
                                    <th className="px-8 py-5">গ্রাহক</th>
                                    <th className="px-8 py-5">অবস্থা</th>
                                    <th className="px-8 py-5 text-right">মূল্য</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                                {orders?.slice(0, 5).map((order) => (
                                    <tr key={order.id} className="hover:bg-emerald-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <p className="text-base font-bold text-stone-800 group-hover:text-emerald-800 transition-colors">{order.customer_name}</p>
                                            <p className="text-xs text-stone-400 font-medium">{order.phone}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                                                    order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                        order.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-stone-100 text-stone-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right text-base font-black text-stone-900">৳ {order.total_price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Performance / Inventory Alerts */}
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
                            {products?.filter(p => p.stock < 10).slice(0, 4).map((product) => (
                                <div key={product.id} className="flex items-center justify-between p-5 bg-stone-50 rounded-[2rem] border border-white hover:border-rose-200 transition-colors group/item">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white rounded-2xl p-1 overflow-hidden shadow-sm group-hover/item:scale-110 transition-transform">
                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-stone-800">{product.name}</h4>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>
                                                <p className="text-xs text-rose-600 font-black">মাত্র {product.stock} টি বাকি</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Link href="/admin/products" className="text-[10px] font-black text-white bg-stone-900 px-4 py-2 rounded-xl hover:bg-emerald-600 transition-colors uppercase tracking-widest shadow-sm">
                                        আপডেট
                                    </Link>
                                </div>
                            ))}
                            {(!products || products.filter(p => p.stock < 10).length === 0) && (
                                <div className="text-center py-10 opacity-50 grayscale">
                                    <Package size={48} className="mx-auto text-stone-200 mb-4" />
                                    <p className="text-stone-500 font-bold">সকল পণ্যের স্টক পর্যাপ্ত আছে</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Access Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/admin/products" className="bg-emerald-600 p-8 rounded-[2.5rem] text-white hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 group">
                            <Package className="mb-4 text-emerald-200 group-hover:scale-110 transition-transform" />
                            <h4 className="font-black text-lg">পণ্য যোগ করুন</h4>
                            <p className="text-emerald-100/60 text-xs font-medium mt-1">নতুন আইটেম এবং ইনভেন্টরি</p>
                        </Link>
                        <Link href="/admin/users" className="bg-stone-900 p-8 rounded-[2.5rem] text-white hover:bg-black transition-all shadow-xl shadow-stone-900/20 group">
                            <Users className="mb-4 text-stone-400 group-hover:scale-110 transition-transform" />
                            <h4 className="font-black text-lg">গ্রাহক তালিকা</h4>
                            <p className="text-stone-500 text-xs font-medium mt-1">কাস্টমার বেইজ ম্যানেজমেন্ট</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

