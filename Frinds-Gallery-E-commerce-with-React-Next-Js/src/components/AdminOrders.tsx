'use client';

import { useState, useMemo, useEffect } from 'react';
import {
    Search,
    Loader2,
    Download,
    ShoppingBag,
    TrendingUp,
    Clock,
    DollarSign,
    Filter,
    ChevronDown,
    Phone,
    Calendar,
    Eye,
    X,
    Truck,
    MapPin,
    Package,
    CheckCircle,
    XCircle,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { databaseService } from '../services/databaseService';
import { sendToSteadfast } from '../services/courierService';
import { useOrders } from '../hooks/useSWRData';

// Helper for notifications
const notify = (message: string, type: 'success' | 'error' = 'success') => {
    alert(`${type === 'success' ? '✅' : '❌'} ${message}`);
};

function AdminOrders() {
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 20;

    // Use SWR for data fetching with caching
    const { orders, totalPages, totalOrders, isLoading: loading, mutate } = useOrders(currentPage, PAGE_SIZE);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateFilter, setDateFilter] = useState<string>('all');
    const [showFilters, setShowFilters] = useState(false);

    // Filtered orders based on search and filters
    const filteredOrders = useMemo(() => {
        return orders.filter((order: any) => {
            const matchesSearch = !searchTerm ||
                order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer_phone?.includes(searchTerm) ||
                order.id?.toString().includes(searchTerm);

            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

            let matchesDate = true;
            if (dateFilter !== 'all') {
                const orderDate = new Date(order.created_at);
                const now = new Date();
                const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));

                if (dateFilter === 'today') matchesDate = daysDiff === 0;
                else if (dateFilter === 'week') matchesDate = daysDiff <= 7;
                else if (dateFilter === 'month') matchesDate = daysDiff <= 30;
            }

            return matchesSearch && matchesStatus && matchesDate;
        });
    }, [orders, searchTerm, statusFilter, dateFilter]);

    async function handleStatusUpdate(id: string, status: string) {
        const res = await databaseService.updateOrderStatus(id, status);
        if (res.success) {
            notify('অর্ডার স্ট্যাটাস আপডেট করা হয়েছে');
            mutate(); // Revalidate SWR cache
        } else {
            notify('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে', 'error');
        }
    }

    async function handleSendToCourier(order: any) {
        const result = await sendToSteadfast(order);
        if (result.success) {
            notify('কুরিয়ারে পাঠানো হয়েছে');
            await handleStatusUpdate(order.id, 'shipped');
        } else {
            notify(result.message || 'কুরিয়ারে পাঠাতে সমস্যা হয়েছে', 'error');
        }
    }

    function exportToCSV() {
        const headers = ['Order ID', 'Customer', 'Phone', 'Address', 'Total', 'Status', 'Date'];
        const rows = filteredOrders.map((o: any) => [
            o.id,
            o.customer_name,
            o.customer_phone,
            o.customer_address,
            o.total_amount,
            o.status,
            new Date(o.created_at).toLocaleDateString('bn-BD')
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    }

    const stats = useMemo(() => {
        const total = filteredOrders.length;
        const pending = filteredOrders.filter((o: any) => o.status === 'pending').length;
        const processing = filteredOrders.filter((o: any) => o.status === 'processing').length;
        const shipped = filteredOrders.filter((o: any) => o.status === 'shipped').length;
        const delivered = filteredOrders.filter((o: any) => o.status === 'delivered').length;
        const totalRevenue = filteredOrders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);

        return { total, pending, processing, shipped, delivered, totalRevenue };
    }, [filteredOrders]);

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            processing: 'bg-blue-100 text-blue-800 border-blue-200',
            shipped: 'bg-purple-100 text-purple-800 border-purple-200',
            delivered: 'bg-green-100 text-green-800 border-green-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200',
            incomplete: 'bg-gray-100 text-gray-800 border-gray-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatusIcon = (status: string) => {
        const icons: Record<string, any> = {
            pending: Clock,
            processing: Package,
            shipped: Truck,
            delivered: CheckCircle,
            cancelled: XCircle,
        };
        const Icon = icons[status] || Clock;
        return <Icon size={14} />;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Loader2 className="animate-spin text-emerald-600 mx-auto mb-4" size={48} />
                    <p className="text-stone-600 font-medium">অর্ডার লোড হচ্ছে...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <ShoppingBag className="text-emerald-600" size={24} />
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-200 px-2 py-1 rounded-full">মোট</span>
                    </div>
                    <p className="text-3xl font-black text-emerald-900">{stats.total}</p>
                    <p className="text-sm text-emerald-700 font-medium mt-1">মোট অর্ডার</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <Package className="text-blue-600" size={24} />
                        <span className="text-xs font-bold text-blue-600 bg-blue-200 px-2 py-1 rounded-full">প্রসেসিং</span>
                    </div>
                    <p className="text-3xl font-black text-blue-900">{stats.processing}</p>
                    <p className="text-sm text-blue-700 font-medium mt-1">প্রসেস হচ্ছে</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <Truck className="text-purple-600" size={24} />
                        <span className="text-xs font-bold text-purple-600 bg-purple-200 px-2 py-1 rounded-full">শিপড</span>
                    </div>
                    <p className="text-3xl font-black text-purple-900">{stats.shipped}</p>
                    <p className="text-sm text-purple-700 font-medium mt-1">পাঠানো হয়েছে</p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl border border-amber-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <DollarSign className="text-amber-600" size={24} />
                        <span className="text-xs font-bold text-amber-600 bg-amber-200 px-2 py-1 rounded-full">রেভিনিউ</span>
                    </div>
                    <p className="text-3xl font-black text-amber-900">৳{stats.totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-amber-700 font-medium mt-1">মোট বিক্রয়</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                        <input
                            type="text"
                            placeholder="নাম, ফোন বা অর্ডার আইডি দিয়ে খুঁজুন..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-stone-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all outline-none font-medium"
                        />
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-6 py-3 bg-stone-100 hover:bg-stone-200 rounded-xl font-bold text-stone-700 transition-colors"
                    >
                        <Filter size={20} />
                        ফিল্টার
                        <ChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} size={16} />
                    </button>

                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-emerald-600/20"
                    >
                        <Download size={20} />
                        CSV এক্সপোর্ট
                    </button>
                </div>

                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-stone-200">
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">স্ট্যাটাস</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2 border-2 border-stone-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all outline-none font-medium"
                            >
                                <option value="all">সব</option>
                                <option value="pending">পেন্ডিং</option>
                                <option value="processing">প্রসেসিং</option>
                                <option value="shipped">শিপড</option>
                                <option value="delivered">ডেলিভারড</option>
                                <option value="cancelled">ক্যান্সেলড</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">তারিখ</label>
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full px-4 py-2 border-2 border-stone-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all outline-none font-medium"
                            >
                                <option value="all">সব</option>
                                <option value="today">আজ</option>
                                <option value="week">এই সপ্তাহ</option>
                                <option value="month">এই মাস</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-stone-50 border-b-2 border-stone-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-black text-stone-700 uppercase tracking-wider">অর্ডার</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-stone-700 uppercase tracking-wider">কাস্টমার</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-stone-700 uppercase tracking-wider">পণ্য</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-stone-700 uppercase tracking-wider">মোট</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-stone-700 uppercase tracking-wider">স্ট্যাটাস</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-stone-700 uppercase tracking-wider">তারিখ</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-stone-700 uppercase tracking-wider">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {filteredOrders.map((order: any) => (
                                <tr key={order.id} className="hover:bg-stone-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                                <ShoppingBag className="text-emerald-600" size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-stone-900">#{order.id}</p>
                                                <p className="text-xs text-stone-500">{order.order_items?.length || 0} আইটেম</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-bold text-stone-900">{order.customer_name}</p>
                                            <p className="text-sm text-stone-600 flex items-center gap-1 mt-1">
                                                <Phone size={12} />
                                                {order.customer_phone}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-stone-600">
                                            {order.order_items?.slice(0, 2).map((item: any, idx: number) => (
                                                <div key={idx} className="truncate max-w-xs">
                                                    {item.product_name} × {item.quantity}
                                                </div>
                                            ))}
                                            {order.order_items?.length > 2 && (
                                                <div className="text-xs text-stone-400 mt-1">
                                                    +{order.order_items.length - 2} আরও
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-black text-lg text-emerald-600">৳{order.total_amount?.toLocaleString()}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${getStatusColor(order.status)} cursor-pointer hover:opacity-80 transition-opacity`}
                                        >
                                            <option value="pending">পেন্ডিং</option>
                                            <option value="processing">প্রসেসিং</option>
                                            <option value="shipped">শিপড</option>
                                            <option value="delivered">ডেলিভারড</option>
                                            <option value="cancelled">ক্যান্সেলড</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-stone-600">
                                            <Calendar size={14} />
                                            {new Date(order.created_at).toLocaleDateString('bn-BD')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-2 hover:bg-emerald-100 rounded-lg transition-colors group/btn"
                                                title="বিস্তারিত দেখুন"
                                            >
                                                <Eye className="text-stone-600 group-hover/btn:text-emerald-600" size={18} />
                                            </button>
                                            {order.status === 'processing' && (
                                                <button
                                                    onClick={() => handleSendToCourier(order)}
                                                    className="p-2 hover:bg-purple-100 rounded-lg transition-colors group/btn"
                                                    title="কুরিয়ারে পাঠান"
                                                >
                                                    <Truck className="text-stone-600 group-hover/btn:text-purple-600" size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredOrders.length === 0 && (
                    <div className="text-center py-12">
                        <Package className="mx-auto text-stone-300 mb-4" size={48} />
                        <p className="text-stone-500 font-medium">কোনো অর্ডার পাওয়া যায়নি</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                    <div className="text-sm text-stone-600">
                        পেজ <span className="font-bold text-stone-900">{currentPage}</span> of <span className="font-bold text-stone-900">{totalPages}</span>
                        <span className="ml-4">মোট <span className="font-bold text-stone-900">{totalOrders}</span> অর্ডার</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-stone-700 transition-colors"
                        >
                            <ChevronLeft size={18} />
                            আগের
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors"
                        >
                            পরের
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-stone-200 p-6 flex items-center justify-between rounded-t-3xl">
                            <h3 className="text-2xl font-black text-stone-900">অর্ডার বিস্তারিত</h3>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 hover:bg-stone-100 rounded-xl transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Customer Info */}
                            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
                                <h4 className="font-black text-stone-900 mb-4 flex items-center gap-2">
                                    <MapPin size={20} className="text-emerald-600" />
                                    কাস্টমার তথ্য
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-bold text-stone-700">নাম:</span> {selectedOrder.customer_name}</p>
                                    <p><span className="font-bold text-stone-700">ফোন:</span> {selectedOrder.customer_phone}</p>
                                    <p><span className="font-bold text-stone-700">ঠিকানা:</span> {selectedOrder.customer_address}</p>
                                    {selectedOrder.customer_email && (
                                        <p><span className="font-bold text-stone-700">ইমেইল:</span> {selectedOrder.customer_email}</p>
                                    )}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h4 className="font-black text-stone-900 mb-4 flex items-center gap-2">
                                    <Package size={20} className="text-emerald-600" />
                                    অর্ডার আইটেম
                                </h4>
                                <div className="space-y-3">
                                    {selectedOrder.order_items?.map((item: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-200">
                                            <div>
                                                <p className="font-bold text-stone-900">{item.product_name}</p>
                                                <p className="text-sm text-stone-600">পরিমাণ: {item.quantity}</p>
                                            </div>
                                            <p className="font-black text-emerald-600">৳{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="bg-emerald-50 rounded-2xl p-6 border-2 border-emerald-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-black text-stone-900">মোট</span>
                                    <span className="text-2xl font-black text-emerald-600">৳{selectedOrder.total_amount?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
