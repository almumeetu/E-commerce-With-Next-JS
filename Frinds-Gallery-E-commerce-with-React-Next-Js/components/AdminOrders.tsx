'use client';

import { useState, useMemo } from 'react';
import { Search, Eye, CheckCircle, Truck, XCircle, Clock, Calendar, Phone, MapPin, DollarSign, Package, X, ShoppingBag, Filter, Download, TrendingUp, Users, AlertCircle, ChevronDown } from 'lucide-react';
import { updateOrderStatus } from '@/src/lib/actions/orders';
import { toast } from '@/lib/toast';

export default function AdminOrders({ orders: initialOrders }: { orders: any[] }) {
    const [orders, setOrders] = useState(initialOrders);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    // Analytics calculations
    const analytics = useMemo(() => {
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total_price || 0), 0);
        const pendingOrders = orders.filter(order => order.status === 'pending').length;
        const processingOrders = orders.filter(order => order.status === 'processing').length;
        const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
        const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;
        const todayOrders = orders.filter(order => {
            const today = new Date();
            const orderDate = new Date(order.created_at);
            return orderDate.toDateString() === today.toDateString();
        }).length;

        return {
            totalRevenue,
            totalOrders: orders.length,
            pendingOrders,
            processingOrders,
            deliveredOrders,
            cancelledOrders,
            todayOrders,
            avgOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0
        };
    }, [orders]);

    const filteredOrders = useMemo(() => {
        let filtered = orders.filter(o =>
            o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.phone.includes(searchTerm) ||
            o.id.toString().includes(searchTerm)
        );

        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        if (dateFilter !== 'all') {
            const today = new Date();
            filtered = filtered.filter(order => {
                const orderDate = new Date(order.created_at);
                switch (dateFilter) {
                    case 'today':
                        return orderDate.toDateString() === today.toDateString();
                    case 'week':
                        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return orderDate >= weekAgo;
                    case 'month':
                        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                        return orderDate >= monthAgo;
                    default:
                        return true;
                }
            });
        }

        return filtered;
    }, [orders, searchTerm, statusFilter, dateFilter]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-stone-100 text-stone-700 border-stone-200';
        }
    };

    async function handleStatusUpdate(id: string, status: string) {
        const res = await updateOrderStatus(id, status);
        if (res.success) {
            toast.success('অর্ডার স্ট্যাটাস আপডেট করা হয়েছে');
            window.location.reload();
        } else {
            toast.error('সমস্যা হয়েছে: ' + res.error);
        }
    }

    const handleExportOrders = () => {
        const csvContent = [
            ['Order ID', 'Customer Name', 'Phone', 'Address', 'Total Price', 'Status', 'Date'].join(','),
            ...filteredOrders.map(order => [
                `#${order.id.toString().slice(-8).toUpperCase()}`,
                order.customer_name,
                order.phone,
                `"${order.address}"`,
                order.total_price,
                order.status,
                new Date(order.created_at).toLocaleDateString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-stone-900 tracking-tight">অর্ডার ব্যবস্থাপনা</h2>
                    <p className="text-stone-500 font-medium">আপনার স্টোরের সকল বিক্রয় ও অর্ডারের তথ্য</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleExportOrders}
                        className="bg-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 border border-stone-100 shadow-sm hover:bg-stone-50 transition"
                    >
                        <Download className="text-indigo-600" size={20} />
                        <span className="text-stone-900">এক্সপোর্ট</span>
                    </button>
                    <div className="bg-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 border border-stone-100 shadow-sm">
                        <ShoppingBag className="text-indigo-600" size={20} />
                        <span className="text-stone-900">{orders.length} টি অর্ডার</span>
                    </div>
                </div>
            </div>

            {/* Analytics Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-[2rem] border border-indigo-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                            <TrendingUp className="h-6 w-6 text-indigo-600" />
                        </div>
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">+12%</span>
                    </div>
                    <p className="text-2xl font-black text-indigo-900">৳{analytics.totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-indigo-600 font-bold mt-1">মোট রেভিনিউ</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-[2rem] border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                            <ShoppingBag className="h-6 w-6 text-blue-600" />
                        </div>
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">আজ</span>
                    </div>
                    <p className="text-2xl font-black text-blue-900">{analytics.todayOrders}</p>
                    <p className="text-xs text-blue-600 font-bold mt-1">আজকের অর্ডার</p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-[2rem] border border-amber-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                            <Clock className="h-6 w-6 text-amber-600" />
                        </div>
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">পেন্ডিং</span>
                    </div>
                    <p className="text-2xl font-black text-amber-900">{analytics.pendingOrders}</p>
                    <p className="text-xs text-amber-600 font-bold mt-1">অপেক্ষমান অর্ডার</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-[2rem] border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                            <DollarSign className="h-6 w-6 text-purple-600" />
                        </div>
                        <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">গড়</span>
                    </div>
                    <p className="text-2xl font-black text-purple-900">৳{Math.round(analytics.avgOrderValue)}</p>
                    <p className="text-xs text-purple-600 font-bold mt-1">গড় অর্ডার মূল্য</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative group flex-1">
                    <input
                        type="text"
                        placeholder="নাম, ফোন বা অর্ডার আইডি দিয়ে খুঁজুন..."
                        className="w-full pl-14 pr-6 py-5 rounded-[2rem] border-2 border-stone-100 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all text-stone-700 font-medium shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-indigo-500 transition-colors" size={24} />
                </div>
                
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="bg-white px-6 py-5 rounded-[2rem] font-bold flex items-center gap-2 border border-stone-100 shadow-sm hover:bg-stone-50 transition"
                    >
                        <Filter className="text-stone-600" size={20} />
                        <span className="text-stone-900">ফিল্টার</span>
                        <ChevronDown className={`text-stone-400 transition-transform ${showFilters ? 'rotate-180' : ''}`} size={16} />
                    </button>
                </div>
            </div>

            {/* Filter Options */}
            {showFilters && (
                <div className="bg-white rounded-[2rem] border border-stone-100 shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-black text-stone-400 uppercase tracking-wider mb-3 block">স্ট্যাটাস</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-indigo-500 outline-none font-medium text-stone-700"
                            >
                                <option value="all">সব স্ট্যাটাস</option>
                                <option value="pending">পেন্ডিং</option>
                                <option value="processing">প্রসেসিং</option>
                                <option value="delivered">ডেলিভারড</option>
                                <option value="cancelled">বাতিল</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-black text-stone-400 uppercase tracking-wider mb-3 block">তারিখ</label>
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-indigo-500 outline-none font-medium text-stone-700"
                            >
                                <option value="all">সব সময়</option>
                                <option value="today">আজ</option>
                                <option value="week">গত ৭ দিন</option>
                                <option value="month">গত ৩০ দিন</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-stone-50/50 text-stone-400 text-[10px] uppercase font-black tracking-widest border-b border-stone-100">
                                <th className="px-8 py-5">অর্ডার আইডি</th>
                                <th className="px-8 py-5">গ্রাহক তথ্য</th>
                                <th className="px-8 py-5">তারিখ</th>
                                <th className="px-8 py-5">মোট মূল্য</th>
                                <th className="px-8 py-5">অবস্থা</th>
                                <th className="px-8 py-5 text-right">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-indigo-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <span className="font-mono text-xs font-bold text-stone-400 group-hover:text-indigo-600">#{order.id.toString().slice(-8).toUpperCase()}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-base font-bold text-stone-900">{order.customer_name}</p>
                                        <div className="flex items-center gap-1.5 text-xs text-stone-400 font-medium mt-0.5">
                                            <Phone size={10} />
                                            {order.phone}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-1.5 text-sm text-stone-600 font-bold">
                                            <Calendar size={14} className="text-stone-300" />
                                            {new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-base font-black text-indigo-900">৳ {order.total_price}</td>
                                    <td className="px-8 py-6">
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="p-3 bg-white border border-stone-100 hover:bg-indigo-600 hover:text-white text-indigo-600 rounded-xl transition shadow-sm active:scale-95 group/btn"
                                        >
                                            <Eye size={18} className="group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Premium Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-slide-up my-8">
                        <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 p-10 text-white flex justify-between items-center relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-3xl font-black tracking-tight">অর্ডার ডিটেইলস</h3>
                                <p className="text-indigo-200/80 font-medium mt-1">ID: #{selectedOrder.id.toString().toUpperCase()}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition relative z-10 active:scale-95">
                                <X size={24} />
                            </button>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                        </div>

                        <div className="p-10 space-y-10">
                            <div className="grid grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-xs font-black text-stone-400 uppercase tracking-widest">
                                        <Truck size={14} /> শিপিং তথ্য
                                    </div>
                                    <div>
                                        <p className="text-xl font-black text-stone-900">{selectedOrder.customer_name}</p>
                                        <p className="text-sm font-bold text-indigo-600 mt-1">{selectedOrder.phone}</p>
                                        <div className="mt-4 flex items-start gap-2 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                            <MapPin size={16} className="text-stone-300 mt-1 shrink-0" />
                                            <p className="text-sm text-stone-600 font-medium leading-relaxed">{selectedOrder.address}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-xs font-black text-stone-400 uppercase tracking-widest">
                                        <DollarSign size={14} /> পেমেন্ট ও সামারি
                                    </div>
                                    <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100">
                                        <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">{selectedOrder.payment_method || 'CASH ON DELIVERY'}</p>
                                        <p className="text-3xl font-black text-indigo-900">৳ {selectedOrder.total_price}</p>
                                        <p className="text-[10px] text-indigo-400 font-bold mt-2 italic">পেমেন্ট স্ট্যাটাস: পেন্ডিং</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-xs font-black text-stone-400 uppercase tracking-widest">
                                    <Package size={14} /> অর্ডারের পণ্যসমূহ
                                </div>
                                <div className="bg-stone-50 rounded-[2rem] border border-stone-100 overflow-hidden">
                                    <div className="p-2 space-y-1">
                                        {selectedOrder.items?.map((item: any, i: number) => (
                                            <div key={i} className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-stone-50 rounded-lg flex items-center justify-center text-stone-400 border border-stone-100 font-black text-[10px]">P</div>
                                                    <div>
                                                        <span className="text-sm font-black text-stone-800">{item.product_name}</span>
                                                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">পরিমাণ: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <span className="font-black text-indigo-800">৳ {item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-stone-100">
                                <div className="flex items-center gap-2 text-xs font-black text-stone-400 uppercase tracking-widest">
                                    <Clock size={14} /> স্ট্যাটাস আপডেট করুন
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    {[
                                        { id: 'pending', label: 'পেন্ডিং', icon: Clock, color: 'hover:bg-amber-500 hover:text-white text-amber-600 border-amber-100' },
                                        { id: 'processing', label: 'প্রসেসিং', icon: Truck, color: 'hover:bg-blue-500 hover:text-white text-blue-600 border-blue-100' },
                                        { id: 'delivered', label: 'ডেলিভারড', icon: CheckCircle, color: 'hover:bg-indigo-500 hover:text-white text-indigo-600 border-indigo-100' },
                                        { id: 'cancelled', label: 'বাতিল', icon: XCircle, color: 'hover:bg-rose-500 hover:text-white text-rose-600 border-rose-100' },
                                    ].map((status) => (
                                        <button
                                            key={status.id}
                                            onClick={() => handleStatusUpdate(selectedOrder.id, status.id)}
                                            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border bg-white transition-all active:scale-95 group/status ${status.color} ${selectedOrder.status === status.id ? ' ring-2 ring-stone-900 ring-offset-2' : ''}`}
                                        >
                                            <status.icon size={20} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{status.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

