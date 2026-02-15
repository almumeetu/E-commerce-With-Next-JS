'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Minus, X, ShoppingCart, CreditCard, Receipt, Package, TrendingUp, DollarSign, User, Phone, MapPin, Calendar, Filter, Download, Printer, Banknote } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  cost_price?: number;
  sku?: string;
  unit?: string;
  image_url?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  total: number;
}

interface Customer {
  name: string;
  phone: string;
  address: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

export default function POSSystem() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [customer, setCustomer] = useState<Customer>({
    name: '',
    phone: '',
    address: ''
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [recentSales, setRecentSales] = useState<any[]>([]);

  const paymentMethods: PaymentMethod[] = [
    { id: 'cash', name: 'নগদ', icon: <Banknote size={20} />, color: 'bg-emerald-500' },
    { id: 'card', name: 'কার্ড', icon: <CreditCard size={20} />, color: 'bg-blue-500' },
    { id: 'mobile', name: 'মোবাইল', icon: <Phone size={20} />, color: 'bg-purple-500' },
    { id: 'bKash', name: 'বিকাশ', icon: <Phone size={20} />, color: 'bg-pink-500' }
  ];

  useEffect(() => {
    fetchProducts();
    fetchRecentSales();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('name');
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchRecentSales = async () => {
    try {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      setRecentSales(data || []);
    } catch (error) {
      console.error('Error fetching recent sales:', error);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    ).filter(p => categoryFilter === 'all' ? true : p.category === categoryFilter);
  }, [products, searchTerm, categoryFilter]);

  const cartTotals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.05; // 5% tax
    const discount = subtotal * 0.02; // 2% discount
    const total = subtotal + tax - discount;
    return { subtotal, tax, discount, total };
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          return prevCart.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.product.price }
              : item
          );
        }
        return prevCart;
      } else {
        return [...prevCart, { product, quantity: 1, total: product.price }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const item = cart.find(item => item.product.id === productId);
    if (item && quantity <= item.product.stock) {
      setCart(prevCart =>
        prevCart.map(cartItem =>
          cartItem.product.id === productId
            ? { ...cartItem, quantity, total: quantity * cartItem.product.price }
            : cartItem
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
    setCustomer({ name: '', phone: '', address: '' });
  };

  const processSale = async () => {
    if (cart.length === 0 || !customer.name || !customer.phone) {
      alert('কার্ট খালি অথবা গ্রাহকের তথ্য সম্পূর্ণ করুন');
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = {
        customer_name: customer.name,
        phone: customer.phone,
        address: customer.address,
        total_price: cartTotals.total,
        payment_method: selectedPaymentMethod,
        status: 'pending',
        items: cart.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          total: item.total
        }))
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select();

      if (error) throw error;

      // Update stock
      for (const item of cart) {
        await supabase
          .from('products')
          .update({ stock: item.product.stock - item.quantity })
          .eq('id', item.product.id);
      }

      setShowReceipt(true);
      fetchRecentSales();
      clearCart();
      
    } catch (error) {
      console.error('Error processing sale:', error);
      alert('বিক্রয় প্রক্রিয়া করতে সমস্যা হয়েছে');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.stock <= 0) return { color: 'text-rose-600', bg: 'bg-rose-100', text: 'স্টক আউট' };
    if (product.stock < 10) return { color: 'text-amber-600', bg: 'bg-amber-100', text: 'কম স্টক' };
    return { color: 'text-emerald-600', bg: 'bg-emerald-100', text: 'স্টক আছে' };
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="flex h-screen">
        {/* Left Side - Products */}
        <div className="w-1/2 bg-white border-r border-stone-200 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-black text-stone-900">পণ্য নির্বাচন</h1>
              <div className="flex items-center gap-2">
                <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">
                  {filteredProducts.length} পণ্য
                </div>
              </div>
            </div>
            
            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="relative flex-1">
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
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                const isInCart = cart.some(item => item.product.id === product.id);
                
                return (
                  <div
                    key={product.id}
                    className={`bg-white border rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer ${
                      isInCart ? 'border-emerald-500 bg-emerald-50' : 'border-stone-200'
                    }`}
                    onClick={() => !isInCart && addToCart(product)}
                  >
                    <div className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                        <img
                          src={product.image_url || '/images/placeholder.png'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-stone-900 text-sm truncate">{product.name}</h3>
                        <p className="text-xs text-stone-500">{product.category}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-emerald-600">৳{product.price}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${stockStatus.bg} ${stockStatus.color}`}>
                            {stockStatus.text}
                          </span>
                        </div>
                        {product.stock > 0 && (
                          <div className="text-xs text-stone-500">
                            স্টক: {product.stock} {product.unit || 'পিস'}
                          </div>
                        )}
                      </div>
                    </div>
                    {isInCart && (
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-emerald-600 font-bold">কার্টে আছে</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromCart(product.id);
                          }}
                          className="text-rose-600 hover:text-rose-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side - Cart and Checkout */}
        <div className="w-1/2 bg-stone-50 flex flex-col">
          {/* Cart */}
          <div className="bg-white m-6 rounded-2xl shadow-lg flex-1 flex flex-col">
            <div className="p-6 border-b border-stone-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-stone-900">শপিং কার্ট</h2>
                <button
                  onClick={clearCart}
                  className="text-stone-500 hover:text-rose-600 transition"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                  <p className="text-stone-500">কার্ট খালি</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-200">
                        <img
                          src={item.product.image_url || '/images/placeholder.png'}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-stone-900">{item.product.name}</h3>
                        <p className="text-sm text-stone-600">৳{item.product.price} x {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg bg-white border border-stone-300 flex items-center justify-center hover:bg-stone-100"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg bg-white border border-stone-300 flex items-center justify-center hover:bg-stone-100"
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-stone-900">৳{item.total}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Summary */}
            <div className="p-6 border-t border-stone-200">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">সাবটোটাল</span>
                  <span className="font-medium">৳{cartTotals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">ট্যাক্স (৫%)</span>
                  <span className="font-medium">৳{cartTotals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">ডিসকাউন্ট (২%)</span>
                  <span className="font-medium text-emerald-600">-৳{cartTotals.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>মোট</span>
                  <span>৳{cartTotals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white mx-6 mb-6 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-4">গ্রাহক তথ্য</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">নাম</label>
                <input
                  type="text"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-emerald-500 outline-none"
                  placeholder="গ্রাহকের নাম"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">ফোন</label>
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-emerald-500 outline-none"
                  placeholder="ফোন নম্বর"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">ঠিকানা</label>
                <textarea
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:border-emerald-500 outline-none resize-none"
                  placeholder="ডেলিভারি ঠিকানা"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white mx-6 mb-6 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-4">পেমেন্ট পদ্ধতি</h3>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedPaymentMethod === method.id
                      ? `${method.color} text-white border-transparent`
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {method.icon}
                    <span className="font-medium">{method.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Process Button */}
          <div className="px-6 pb-6">
            <button
              onClick={processSale}
              disabled={cart.length === 0 || isProcessing || !customer.name || !customer.phone}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>প্রক্রিয়া হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Receipt size={20} />
                  <span>বিক্রয় সম্পন্ন করুন</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-stone-900">বিক্রয় সফল!</h2>
              <p className="text-stone-600">আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="border-b border-stone-200 pb-4">
                <p className="text-sm text-stone-600">অর্ডার #</p>
                <p className="font-bold">POS-{Date.now()}</p>
              </div>
              
              <div className="border-b border-stone-200 pb-4">
                <p className="text-sm text-stone-600">গ্রাহক</p>
                <p className="font-bold">{customer.name}</p>
                <p className="text-sm">{customer.phone}</p>
                <p className="text-sm">{customer.address}</p>
              </div>
              
              <div className="border-b border-stone-200 pb-4">
                <p className="text-sm text-stone-600 mb-2">পণ্যসমূহ</p>
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.product.name} x {item.quantity}</span>
                    <span>৳{item.total}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-b border-stone-200 pb-4">
                <div className="flex justify-between text-sm">
                  <span>মোট</span>
                  <span className="font-bold">৳{cartTotals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowReceipt(false)}
                className="flex-1 bg-stone-200 text-stone-700 py-3 rounded-xl font-medium hover:bg-stone-300 transition"
              >
                বন্ধ করুন
              </button>
              <button
                onClick={() => {
                  window.print();
                  setShowReceipt(false);
                }}
                className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition flex items-center justify-center gap-2"
              >
                <Printer size={16} />
                প্রিন্ট
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
