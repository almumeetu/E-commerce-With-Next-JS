'use client'; // Harmless in Vite, keeps compatibility if moved back to Next.js

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Plus, Search, MoreVertical, Edit2, Trash2, Package, Upload, X, Check, Loader2, Star, Zap, Filter, Download, TrendingUp, AlertCircle, ChevronDown, Eye, BarChart3 } from 'lucide-react';
import { databaseService } from '../services/databaseService';
import { supabase } from '../services/supabase';

// Helper for toast-like notifications
const notify = (message: string, type: 'success' | 'error' = 'success') => {
    // In a real app, use a toast library. For now, alert is simple and works.
    alert(`${type === 'success' ? '✅' : '❌'} ${message}`);
};

export default function AdminProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch products and categories on mount
    useEffect(() => {
        loadData();

        // Realtime Subscription
        const channel = supabase
            .channel('table-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'products',
                },
                (payload) => {
                    console.log('Realtime update received!', payload);
                    loadData();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [productsData, categoriesData] = await Promise.all([
                databaseService.getProducts(),
                databaseService.getCategories()
            ]);
            setProducts(productsData || []);
            setCategories(categoriesData || []);
        } catch (error) {
            console.error('Failed to load data:', error);
            notify('ডাটা লোড করতে সমস্যা হয়েছে', 'error');
        } finally {
            setLoading(false);
        }
    };

    // To maintain compatibility with existing reload calls
    const loadProducts = loadData;

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');
    const [showFilters, setShowFilters] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Analytics calculations
    const analytics = useMemo(() => {
        const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
        const lowStock = products.filter(product => product.stock < 10).length;
        const outOfStock = products.filter(product => product.stock <= 0).length;
        const newProducts = products.filter(product => product.is_new).length;
        const popularProducts = products.filter(product => product.is_popular).length;
        const totalStock = products.reduce((sum, product) => sum + product.stock, 0);

        const categoryCounts = products.reduce((acc, product) => {
            acc[product.category] = (acc[product.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            totalValue,
            totalProducts: products.length,
            lowStock,
            outOfStock,
            newProducts,
            popularProducts,
            totalStock,
            categoryCounts
        };
    }, [products]);

    const filteredAndSortedProducts = useMemo(() => {
        let filtered = products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (categoryFilter !== 'all') {
            filtered = filtered.filter(p => p.category === categoryFilter);
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(p => {
                if (statusFilter === 'in_stock') return p.stock > 0;
                if (statusFilter === 'low_stock') return p.stock > 0 && p.stock < 10;
                if (statusFilter === 'out_of_stock') return p.stock <= 0;
                return true;
            });
        }

        // Sort products
        filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [products, searchTerm, categoryFilter, statusFilter, sortBy, sortOrder]);

    const handleExportProducts = () => {
        const csvContent = [
            ['Product Name', 'Category', 'Price', 'Stock', 'Unit', 'Status', 'Created Date'].join(','),
            ...filteredAndSortedProducts.map(product => [
                product.name,
                product.category,
                product.price,
                product.stock,
                product.unit || 'কেজি',
                product.status,
                new Date(product.created_at).toLocaleDateString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `products-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        setUploadingImage(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `product-images/${fileName}`;

            const { data, error } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            setPreviewUrl(publicUrl);
        } catch (error: any) {
            console.error('Error uploading image:', error);
            notify('ইমেজ আপলোড করতে সমস্যা হয়েছে: ' + error.message, 'error');
        } finally {
            setUploadingImage(false);
        }
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const productData = {
            name: formData.get('name'),
            category: formData.get('category'),
            // Fix: Add SKU to prevent DB error (Not Null constraint)
            sku: formData.get('sku') ? formData.get('sku') : `SKU-${Date.now().toString(36).toUpperCase()}`,
            price: parseFloat(formData.get('price') as string),
            stock: parseInt(formData.get('stock') as string),
            unit: formData.get('unit'),
            image_url: previewUrl || editingProduct?.image_url,
            description: formData.get('description'),
            is_popular: formData.get('isPopular') === 'on',
            is_new: formData.get('isNew') === 'on',
            status: parseInt(formData.get('stock') as string) > 0 ? 'active' : 'out_of_stock'
        };

        try {
            if (editingProduct) {
                const res = await databaseService.updateProduct(editingProduct.id, productData);
                if (res.success) {
                    notify('পণ্য আপডেট করা হয়েছে');
                } else {
                    throw new Error(res.error);
                }
            } else {
                const res = await databaseService.addProduct(productData);
                if (res.success) {
                    notify('নতুন পণ্য যোগ করা হয়েছে');
                } else {
                    throw new Error(res.error);
                }
            }
            setIsModalOpen(false);
            setEditingProduct(null);
            setPreviewUrl(null);
            loadProducts(); // Reload instead of window.location.reload()
        } catch (error: any) {
            notify('সমস্যা হয়েছে: ' + error.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleDelete = async (id: string) => {
        if (window.confirm('আপনি কি নিশ্চিত যে এই পণ্যটি ডিলিট করতে চান?')) {
            try {
                const res = await databaseService.deleteProduct(id);
                if (res.success) {
                    notify('পণ্য ডিলিট করা হয়েছে');
                    loadProducts();
                } else {
                    notify('সমস্যা হয়েছে: ' + res.error, 'error');
                }
            } catch (error: any) {
                notify('সমস্যা হয়েছে: ' + error.message, 'error');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-emerald-600" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-stone-900 tracking-tight">পণ্য ব্যবস্থাপনা</h2>
                    <p className="text-stone-500 font-medium">আপনার স্টোরের সকল পণ্য এখান থেকে নিয়ন্ত্রণ করুন</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleExportProducts}
                        className="bg-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 border border-stone-100 shadow-sm hover:bg-stone-50 transition"
                    >
                        <Download className="text-emerald-600" size={20} />
                        <span className="text-stone-900">এক্সপোর্ট</span>
                    </button>
                    <button
                        onClick={() => {
                            setEditingProduct(null);
                            setPreviewUrl(null);
                            setIsModalOpen(true);
                        }}
                        className="group bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                    >
                        <Plus size={22} className="group-hover:rotate-90 transition-transform" />
                        নতুন পণ্য যোগ করুন
                    </button>
                </div>
            </div>

            {/* Enhanced Analytics Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-[2rem] border border-emerald-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                            <Package className="h-6 w-6 text-emerald-600" />
                        </div>
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">মোট</span>
                    </div>
                    <p className="text-2xl font-black text-emerald-900">{analytics.totalProducts}</p>
                    <p className="text-xs text-emerald-600 font-bold mt-1">পণ্য সংখ্যা</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-[2rem] border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                            <TrendingUp className="h-6 w-6 text-blue-600" />
                        </div>
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">মূল্য</span>
                    </div>
                    <p className="text-2xl font-black text-blue-900">৳{analytics.totalValue.toLocaleString()}</p>
                    <p className="text-xs text-blue-600 font-bold mt-1">মোট মূল্য</p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-[2rem] border border-amber-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                            <AlertCircle className="h-6 w-6 text-amber-600" />
                        </div>
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">সতর্কতা</span>
                    </div>
                    <p className="text-2xl font-black text-amber-900">{analytics.lowStock}</p>
                    <p className="text-xs text-amber-600 font-bold mt-1">কম স্টক</p>
                </div>

                <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-6 rounded-[2rem] border border-rose-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                            <X className="h-6 w-6 text-rose-600" />
                        </div>
                        <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">স্টক আউট</span>
                    </div>
                    <p className="text-2xl font-black text-rose-900">{analytics.outOfStock}</p>
                    <p className="text-xs text-rose-600 font-bold mt-1">স্টক শেষ</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative group flex-1">
                    <input
                        type="text"
                        placeholder="পণ্যের নাম বা ক্যাটাগরি দিয়ে খুঁজুন..."
                        className="w-full pl-14 pr-6 py-5 rounded-[2rem] border-2 border-stone-100 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-stone-700 font-medium shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-emerald-500 transition-colors" size={24} />
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
                    <div className="bg-white px-4 py-5 rounded-[2rem] font-bold flex items-center gap-2 border border-stone-100 shadow-sm">
                        <BarChart3 className="text-emerald-600" size={20} />
                        <span className="text-stone-900">{filteredAndSortedProducts.length} টি</span>
                    </div>
                </div>
            </div>

            {/* Filter Options */}
            {showFilters && (
                <div className="bg-white rounded-[2rem] border border-stone-100 shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="text-xs font-black text-stone-400 uppercase tracking-wider mb-3 block">ক্যাটাগরি</label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-emerald-500 outline-none font-medium text-stone-700"
                            >
                                <option value="all">সব ক্যাটাগরি</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.slug || cat.name.toLowerCase()}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-black text-stone-400 uppercase tracking-wider mb-3 block">স্ট্যাটাস</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-emerald-500 outline-none font-medium text-stone-700"
                            >
                                <option value="all">সব স্ট্যাটাস</option>
                                <option value="in_stock">স্টক আছে</option>
                                <option value="low_stock">কম স্টক</option>
                                <option value="out_of_stock">স্টক আউট</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-black text-stone-400 uppercase tracking-wider mb-3 block">সাজান</label>
                            <select
                                value={`${sortBy}-${sortOrder}`}
                                onChange={(e) => {
                                    const [field, order] = e.target.value.split('-');
                                    setSortBy(field);
                                    setSortOrder(order as 'asc' | 'desc');
                                }}
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-emerald-500 outline-none font-medium text-stone-700"
                            >
                                <option value="created_at-desc">নতুন আগে</option>
                                <option value="created_at-asc">পুরনো আগে</option>
                                <option value="name-asc">নাম (A-Z)</option>
                                <option value="name-desc">নাম (Z-A)</option>
                                <option value="price-asc">কম মূল্য</option>
                                <option value="price-desc">বেশি মূল্য</option>
                                <option value="stock-desc">বেশি স্টক</option>
                                <option value="stock-asc">কম স্টক</option>
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
                                <th className="px-8 py-5">পণ্য</th>
                                <th className="px-8 py-5">ক্যাটাগরি / ইউনিট</th>
                                <th className="px-8 py-5">স্টক</th>
                                <th className="px-8 py-5">মূল্য</th>
                                <th className="px-8 py-5 text-right">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                            {filteredAndSortedProducts.map((product: any) => (
                                <tr key={product.id} className="hover:bg-emerald-50/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl border-2 border-stone-100 overflow-hidden bg-stone-50 group-hover:border-emerald-200 transition-colors">
                                                <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">{product.name}</p>
                                                    {product.is_new && <span className="bg-emerald-100 text-emerald-700 text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">NEW</span>}
                                                </div>
                                                <p className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase inline-block mt-1 ${product.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                                    }`}>
                                                    {product.status === 'active' ? 'অনলাইন' : 'আউট অফ স্টক'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-sm font-bold text-stone-700 capitalize">{product.category}</p>
                                        <p className="text-xs text-stone-400 font-medium">প্রতি {product.unit || 'পিস'}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="inline-flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${product.stock < 10 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                                            <span className={`text-sm font-black ${product.stock < 10 ? 'text-rose-600' : 'text-stone-700'}`}>
                                                {product.stock} {product.unit || 'পিস'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-base font-black text-emerald-900">৳ {product.price}</td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => {
                                                    setEditingProduct(product);
                                                    setPreviewUrl(product.image_url);
                                                    setIsModalOpen(true);
                                                }}
                                                className="p-3 bg-white border border-stone-100 hover:bg-emerald-600 hover:text-white text-emerald-600 rounded-xl transition shadow-sm"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-3 bg-white border border-stone-100 hover:bg-rose-600 hover:text-white text-rose-600 rounded-xl transition shadow-sm"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Enhanced Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-slide-up my-8">
                        <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 p-10 text-white flex justify-between items-center relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-3xl font-black tracking-tight">{editingProduct ? 'পণ্য আপডেট করুন' : 'নতুন পণ্য যোগ করুন'}</h3>
                                <p className="text-emerald-200/80 font-medium mt-1">পণ্যের যাবতীয় তথ্য এখানে দিন</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition relative z-10 active:scale-95">
                                <X size={24} />
                            </button>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            {/* Image Upload Area */}
                            <div className="space-y-3">
                                <label className="text-xs font-black text-stone-400 uppercase tracking-widest">পণ্যের ছবি</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative h-56 rounded-[2rem] border-4 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden
                                        ${previewUrl ? 'border-emerald-500/20 bg-emerald-50/10' : 'border-stone-100 bg-stone-50 hover:border-emerald-500/30 hover:bg-emerald-50/10'}
                                    `}
                                >
                                    {uploadingImage ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="animate-spin text-emerald-600" size={40} />
                                            <p className="text-sm font-bold text-stone-500">আপলোড হচ্ছে...</p>
                                        </div>
                                    ) : previewUrl ? (
                                        <>
                                            <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Upload className="text-white" size={32} />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center group">
                                            <div className="bg-white p-4 rounded-3xl shadow-sm inline-block mb-3 group-hover:scale-110 transition-transform">
                                                <Upload className="text-emerald-600" size={32} />
                                            </div>
                                            <p className="text-stone-500 font-bold">ক্লিক করে ছবি আপলোড করুন</p>
                                            <p className="text-stone-300 text-xs mt-1">JPG, PNG বা WebP (সর্বোচ্চ ৫ মেগাবাইট)</p>
                                        </div>
                                    )}
                                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-stone-400 uppercase tracking-widest leading-loose">পণ্যের নাম</label>
                                    <input name="name" defaultValue={editingProduct?.name} required className="w-full px-6 py-4 rounded-2xl bg-stone-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 outline-none font-bold text-stone-700 transition-all placeholder:text-stone-300" placeholder="যেমন: প্রিমিয়াম মরিয়ম খেজুর" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-stone-400 uppercase tracking-widest leading-loose">এসকেইউ (SKU)</label>
                                    <input name="sku" defaultValue={editingProduct?.sku} className="w-full px-6 py-4 rounded-2xl bg-stone-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 outline-none font-bold text-stone-700 transition-all placeholder:text-stone-300" placeholder="অটোমেটিক জেনারেট হবে (যদি খালি রাখেন)" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-stone-400 uppercase tracking-widest leading-loose">ক্যাটাগরি</label>
                                    <select name="category" defaultValue={editingProduct?.category} className="w-full px-6 py-4 rounded-2xl bg-stone-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 outline-none font-bold text-stone-700 transition-all appearance-none cursor-pointer">
                                        <option value="">ক্যাটাগরি সিলেক্ট করুন</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.slug || cat.name.toLowerCase()}>
                                                {cat.icon} {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-stone-400 uppercase tracking-widest leading-loose">মূল্য (৳)</label>
                                    <input name="price" type="number" defaultValue={editingProduct?.price} required className="w-full px-6 py-4 rounded-2xl bg-stone-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 outline-none font-bold text-stone-700 transition-all" placeholder="0.00" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-stone-400 uppercase tracking-widest leading-loose">ইউনিট (Unit)</label>
                                    <select name="unit" defaultValue={editingProduct?.unit || 'কেজি'} className="w-full px-6 py-4 rounded-2xl bg-stone-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 outline-none font-bold text-stone-700 transition-all appearance-none cursor-pointer">
                                        <option value="কেজি">কেজি (KG)</option>
                                        <option value="গ্রাম">গ্রাম (Gram)</option>
                                        <option value="পিস">পিস (Piece)</option>
                                        <option value="লিটার">লিটার (Litre)</option>
                                        <option value="বক্স">বক্স (Box)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-stone-400 uppercase tracking-widest leading-loose">স্টক পরিমাণ</label>
                                    <input name="stock" type="number" defaultValue={editingProduct?.stock} required className="w-full px-6 py-4 rounded-2xl bg-stone-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 outline-none font-bold text-stone-700 transition-all" placeholder="যেমন: ৫০" />
                                </div>
                                <div className="flex items-center gap-8 pt-6">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" name="isNew" defaultChecked={editingProduct?.is_new} className="hidden peer" />
                                        <div className="w-6 h-6 rounded-lg border-2 border-stone-200 peer-checked:bg-emerald-600 peer-checked:border-emerald-600 transition-all flex items-center justify-center">
                                            <Check className="text-white" size={14} />
                                        </div>
                                        <span className="text-sm font-bold text-stone-600 group-hover:text-stone-900 transition-colors">নতুন পণ্য</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" name="isPopular" defaultChecked={editingProduct?.is_popular} className="hidden peer" />
                                        <div className="w-6 h-6 rounded-lg border-2 border-stone-200 peer-checked:bg-purple-600 peer-checked:border-purple-600 transition-all flex items-center justify-center">
                                            <Check className="text-white" size={14} />
                                        </div>
                                        <span className="text-sm font-bold text-stone-600 group-hover:text-stone-900 transition-colors">জনপ্রিয়</span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-stone-400 uppercase tracking-widest leading-loose">বিস্তারিত বিবরণ</label>
                                <textarea name="description" defaultValue={editingProduct?.description} rows={4} className="w-full px-6 py-4 rounded-2xl bg-stone-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 outline-none font-bold text-stone-700 transition-all resize-none" placeholder="পণ্য সম্পর্কে বিস্তারিত লিখুন..." />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-5 rounded-[2rem] border-2 border-stone-100 font-bold text-stone-500 hover:bg-stone-50 hover:text-stone-800 transition-all active:scale-95">বাতিল করুন</button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || uploadingImage}
                                    className="flex-[2] px-8 py-5 rounded-[2rem] bg-emerald-600 text-white font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={24} className="animate-spin" />
                                            সেভ হচ্ছে...
                                        </>
                                    ) : (
                                        'তথ্য নিশ্চিত করুন'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
