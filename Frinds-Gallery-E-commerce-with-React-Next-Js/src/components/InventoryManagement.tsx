import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Search, Plus, Download, TrendingUp, TrendingDown, AlertTriangle, Package, Truck, DollarSign, BarChart3, Filter, Eye, Edit, Trash2, RefreshCw } from 'lucide-react';
import { supabase } from '../services/supabase';

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  cost_price?: number;
  sku?: string;
  min_stock_level?: number;
  max_stock_level?: number;
  supplier_name?: string;
  image_url?: string;
  unit?: string;
}

interface InventoryTransaction {
  id: string;
  product_id: string;
  transaction_type: 'purchase' | 'sale' | 'adjustment' | 'return' | 'damage';
  quantity: number;
  unit_cost?: number;
  total_cost?: number;
  reference_id?: string;
  notes?: string;
  created_at: string;
}

export default function InventoryManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [showTransactions, setShowTransactions] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .order('name');

      const { data: transactionsData } = await supabase
        .from('inventory_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      setProducts(productsData || []);
      setTransactions(transactionsData || []);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const analytics = useMemo(() => {
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
    const totalCost = products.reduce((sum, product) => sum + ((product.cost_price || 0) * product.stock), 0);
    const totalProfit = totalValue - totalCost;
    const lowStock = products.filter(p => p.stock < (p.min_stock_level || 10)).length;
    const outOfStock = products.filter(p => p.stock <= 0).length;
    const totalProducts = products.length;

    return {
      totalValue,
      totalCost,
      totalProfit,
      profitMargin: totalCost > 0 ? (totalProfit / totalCost) * 100 : 0,
      lowStock,
      outOfStock,
      totalProducts
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    if (stockFilter !== 'all') {
      filtered = filtered.filter(p => {
        if (stockFilter === 'in_stock') return p.stock > (p.min_stock_level || 10);
        if (stockFilter === 'low_stock') return p.stock > 0 && p.stock <= (p.min_stock_level || 10);
        if (stockFilter === 'out_of_stock') return p.stock <= 0;
        return true;
      });
    }

    return filtered;
  }, [products, searchTerm, categoryFilter, stockFilter]);

  const getStockStatus = (product: Product) => {
    const minStock = product.min_stock_level || 10;
    if (product.stock <= 0) return { status: 'out_of_stock', text: 'স্টক আউট', color: 'rose' };
    if (product.stock <= minStock) return { status: 'low_stock', text: `কম স্টক (${product.stock})`, color: 'amber' };
    return { status: 'in_stock', text: 'স্টক আছে', color: 'indigo' };
  };

  const getProfitMargin = (product: Product) => {
    if (!product.cost_price) return 0;
    return ((product.price - product.cost_price) / product.cost_price) * 100;
  };

  const handleExportInventory = () => {
    const csvContent = [
      ['SKU', 'Product Name', 'Category', 'Stock', 'Unit', 'Price', 'Cost', 'Profit Margin', 'Supplier'].join(','),
      ...filteredProducts.map(product => [
        product.sku || '',
        product.name,
        product.category,
        product.stock,
        product.unit || 'কেজি',
        product.price,
        product.cost_price || 0,
        `${getProfitMargin(product).toFixed(2)}%`,
        product.supplier_name || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-stone-600 font-medium">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h2 className="text-3xl font-black text-stone-900 tracking-tight">ইনভেন্টরি ব্যবস্থাপনা</h2>
            <p className="text-stone-500 font-medium">আপনার স্টক, পণ্য, এবং লাভ-ক্ষতি ট্র্যাকিং সিস্টেম</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleExportInventory}
              className="bg-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 border border-stone-100 shadow-sm hover:bg-stone-50 transition"
            >
              <Download className="text-emerald-600" size={20} />
              <span className="text-stone-900">এক্সপোর্ট</span>
            </button>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition shadow-xl shadow-emerald-500/20 active:scale-95">
              <Plus size={20} />
              <span>নতুন পণ্য</span>
            </button>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-[2rem] border border-emerald-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <Package className="h-6 w-6 text-emerald-600" />
              </div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">মোট</span>
            </div>
            <p className="text-2xl font-black text-emerald-900">৳{analytics.totalValue.toLocaleString()}</p>
            <p className="text-xs text-emerald-600 font-bold mt-1">মোট স্টক মূল্য</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-[2rem] border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">মুনাফা</span>
            </div>
            <p className="text-2xl font-black text-blue-900">৳{analytics.totalProfit.toLocaleString()}</p>
            <p className="text-xs text-blue-600 font-bold mt-1">মোট মুনাফা ({analytics.profitMargin.toFixed(1)}%)</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-[2rem] border border-amber-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">সতর্কতা</span>
            </div>
            <p className="text-2xl font-black text-amber-900">{analytics.lowStock}</p>
            <p className="text-xs text-amber-600 font-bold mt-1">কম স্টক</p>
          </div>

          <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-6 rounded-[2rem] border border-rose-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <Package className="h-6 w-6 text-rose-600" />
              </div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">স্টকআউট</span>
            </div>
            <p className="text-2xl font-black text-rose-900">{analytics.outOfStock}</p>
            <p className="text-xs text-rose-600 font-bold mt-1">স্টক শেষ</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-[2rem] border border-stone-100 shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
              <input
                type="text"
                placeholder="পণ্য খুঁজুন..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:border-emerald-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-stone-200 focus:border-emerald-500 outline-none"
            >
              <option value="all">সব ক্যাটাগরি</option>
              <option value="dates">খেজুর</option>
              <option value="drinks">পানীয়</option>
              <option value="iftar">ইফতার</option>
              <option value="islamic">ইসলামিক</option>
            </select>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-stone-200 focus:border-emerald-500 outline-none"
            >
              <option value="all">সব স্ট্যাটাস</option>
              <option value="in_stock">স্টক আছে</option>
              <option value="low_stock">কম স্টক</option>
              <option value="out_of_stock">স্টক আউট</option>
            </select>

            <button
              onClick={() => setShowTransactions(!showTransactions)}
              className="bg-stone-100 px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-stone-200 transition"
            >
              <BarChart3 size={20} />
              <span>{showTransactions ? 'পণ্য' : 'লেনদেন'}</span>
            </button>
          </div>
        </div>

        {!showTransactions ? (
          /* Products Table */
          <div className="bg-white rounded-[2rem] border border-stone-100 shadow-xl shadow-stone-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-stone-50 text-stone-400 text-[10px] uppercase font-black tracking-widest border-b border-stone-100">
                    <th className="px-6 py-4 text-left">পণ্য</th>
                    <th className="px-6 py-4 text-left">SKU</th>
                    <th className="px-6 py-4 text-left">স্টক</th>
                    <th className="px-6 py-4 text-left">মূল্য</th>
                    <th className="px-6 py-4 text-left">খরচ</th>
                    <th className="px-6 py-4 text-left">মুনাফা %</th>
                    <th className="px-6 py-4 text-left">সরবরাহকারী</th>
                    <th className="px-6 py-4 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product);
                    const profitMargin = getProfitMargin(product);

                    return (
                      <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 relative">
                              <Image src={product.image_url || '/images/placeholder.png'} alt={product.name} fill className="object-cover" sizes="40px" />
                            </div>
                            <div>
                              <p className="font-bold text-stone-900">{product.name}</p>
                              <p className="text-xs text-stone-500">{product.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-mono text-stone-600">{product.sku || 'N/A'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${stockStatus.color === 'indigo' ? 'bg-emerald-100 text-emerald-700' :
                              stockStatus.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                                'bg-rose-100 text-rose-700'
                              }`}>
                              {stockStatus.text}
                            </span>
                            <span className="text-sm font-bold text-stone-900">{product.stock}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-emerald-900">৳{product.price}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-stone-600">৳{product.cost_price || 0}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            {profitMargin >= 0 ? (
                              <TrendingUp className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-rose-600" />
                            )}
                            <span className={`font-bold text-sm ${profitMargin >= 0 ? 'text-emerald-600' : 'text-rose-600'
                              }`}>
                              {profitMargin.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-stone-600">{product.supplier_name || 'N/A'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 transition">
                              <Eye size={16} className="text-stone-600" />
                            </button>
                            <button className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 transition">
                              <Edit size={16} className="text-stone-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Transactions Table */
          <div className="bg-white rounded-[2rem] border border-stone-100 shadow-xl shadow-stone-200/50 overflow-hidden">
            <div className="p-6 border-b border-stone-100">
              <h3 className="text-xl font-black text-stone-900">সাম্প্রতিক লেনদেন</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-stone-50 text-stone-400 text-[10px] uppercase font-black tracking-widest border-b border-stone-100">
                    <th className="px-6 py-4 text-left">তারিখ</th>
                    <th className="px-6 py-4 text-left">টাইপ</th>
                    <th className="px-6 py-4 text-left">পণ্য</th>
                    <th className="px-6 py-4 text-left">পরিমাণ</th>
                    <th className="px-6 py-4 text-left">মোট খরচ</th>
                    <th className="px-6 py-4 text-left">রেফারেন্স</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm text-stone-600">
                          {new Date(transaction.created_at).toLocaleDateString('bn-BD')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${transaction.transaction_type === 'purchase' ? 'bg-indigo-100 text-indigo-700' :
                          transaction.transaction_type === 'sale' ? 'bg-blue-100 text-blue-700' :
                            transaction.transaction_type === 'adjustment' ? 'bg-amber-100 text-amber-700' :
                              transaction.transaction_type === 'return' ? 'bg-purple-100 text-purple-700' :
                                'bg-rose-100 text-rose-700'
                          }`}>
                          {transaction.transaction_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-stone-900">
                          {products.find(p => p.id === transaction.product_id)?.name || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-stone-900">{transaction.quantity}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-indigo-900">৳{transaction.total_cost || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-stone-600">{transaction.reference_id || 'N/A'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
