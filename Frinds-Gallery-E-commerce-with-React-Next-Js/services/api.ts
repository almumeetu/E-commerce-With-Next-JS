import { productServiceAdapter, categoryServiceAdapter } from './backendAdapter';
import { supabase } from './supabase';
import { databaseService } from './databaseService';
import type { Product, Category, Order, Customer, SalesSummary, OrderItem } from '../types';
import { OrderStatus } from '../types';

// --- SUPABASE BACKEND ONLY ---

// Local product images mapping
const productImageMap: { [sku: string]: string } = {
  'FG-LK-001': '/images/products/lehengga-1.webp',
  'FG-HJ-005': '/images/products/lehengga-2.webp',
  'FG-IN-012': '/images/products/lehengga-3.webp',
  'FG-TP-020': '/images/products/lehengga-4.webp',
  'FG-IS-003': '/images/products/lehengga-5.webp',
  'FG-LK-002': '/images/products/lehengga-6.webp',
  'FG-HJ-008': '/images/products/modern-dress.webp',
  'FG-IN-015': '/images/products/modern-dress-2.webp',
  'FG-TP-022': '/images/products/threepic-1.webp',
  'FG-IS-004': '/images/products/threepics-3.webp',
  'FG-EX-001': '/images/products/thereepices-2.webp',
  'FG-EX-002': '/images/products/thereepices-4.webp',
  'FG-EX-003': '/images/products/thereepices-5.webp',
  'FG-EX-004': '/images/products/thereepics-4.webp',
};

// Helper to map database columns to frontend types
const mapProduct = (data: any): Product => ({
  id: data.id,
  name: data.name,
  price: Number(data.price),
  originalPrice: data.original_price ? Number(data.original_price) : undefined,
  imageUrl: productImageMap[data.sku] || data.image_url,
  category: data.category,
  sku: data.sku,
  stock: data.stock,
  rating: Number(data.rating),
  reviewCount: data.review_count
});

const mapOrder = (data: any): Order => ({
  id: data.id,
  orderId: data.order_id,
  customerName: data.customer_name,
  customerId: data.customer_id,
  date: data.date,
  totalAmount: Number(data.total_amount),
  status: data.status as OrderStatus,
  items: data.items,
  shippingAddress: data.shipping_address
});

// --- Data Fetching from Supabase ---
export const getProducts = async (): Promise<Product[]> => {
  try {
    const products = await databaseService.getProducts();
    if (products && products.length > 0) {
      return products.map(mapProduct);
    }
    return await productServiceAdapter.getAllProducts();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    return await categoryServiceAdapter.getAllCategories();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const getCustomers = async (): Promise<Customer[]> => {
  try {
    return await databaseService.getCustomers();
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
};

export const getOrders = async (customerId?: string): Promise<Order[]> => {
  try {
    const orders = await databaseService.getOrdersWithItems();
    if (customerId) {
      return orders.filter(o => o.customer_id === customerId).map(mapOrder);
    }
    return orders.map(mapOrder);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

// --- Authentication (Supabase/Local) ---
export const login = async (email: string, password: string): Promise<Customer | null> => {
  try {
    // Basic Supabase Auth implementation if needed
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      return {
        id: data.user.id,
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
        email: data.user.email || '',
        phone: data.user.phone || '',
        totalOrders: 0,
        totalSpent: 0,
        joinDate: data.user.created_at,
        password: '',
        orderIds: [],
        token: data.session?.access_token
      } as Customer;
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
  return null;
};

export const register = async (newCustomerData: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'joinDate' | 'orderIds'>): Promise<Customer> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: newCustomerData.email,
      password: newCustomerData.password || 'password123',
      options: {
        data: {
          name: newCustomerData.name,
          phone: newCustomerData.phone
        }
      }
    });

    if (error) throw error;

    if (data.user) {
      return {
        ...newCustomerData,
        id: data.user.id,
        totalOrders: 0,
        totalSpent: 0,
        joinDate: data.user.created_at,
        orderIds: []
      } as Customer;
    }
    throw new Error('Registration failed');
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// --- Order Management ---
export const createOrder = async (
  orderData: { customerName: string; phone?: string; totalAmount: number; shippingAddress: string; items: OrderItem[]; billing?: any; shipping?: any; note?: string; paymentMethod?: string },
  currentUser: Customer | null
): Promise<Order> => {
  try {
    const supabaseOrder = await databaseService.placeOrder(
      { name: orderData.customerName, phone: orderData.phone || '', address: orderData.shippingAddress },
      orderData.items.map(item => ({ id: item.productId, quantity: item.quantity, price: item.price })),
      orderData.totalAmount
    );

    return {
      id: supabaseOrder.success ? String(supabaseOrder.orderId) : 'temp_' + Date.now(),
      orderId: supabaseOrder.success ? `ORD-${supabaseOrder.orderId}` : 'PENDING',
      customerName: orderData.customerName,
      customerId: currentUser?.id,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      shippingAddress: orderData.shippingAddress,
      status: OrderStatus.Processing,
      date: new Date().toISOString()
    };

  } catch (error) {
    console.error('Create Order Error:', error);
    throw error;
  }
};

export const getOrderStatus = async (trackingId: string): Promise<OrderStatus> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('status')
      .eq('order_id', trackingId)
      .single();

    if (error || !data) return OrderStatus.NotFound;
    return data.status as OrderStatus;
  } catch (error) {
    return OrderStatus.NotFound;
  }
};

export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    throw new Error('Order update failed: ' + error.message);
  }

  return mapOrder(data);
};

// --- Product Management (Supabase Admin) ---
export const addProduct = async (newProductData: Omit<Product, 'id' | 'rating' | 'reviewCount'>): Promise<Product> => {
  return await productServiceAdapter.createProduct(newProductData);
};

export const updateProduct = async (updatedProductData: Product): Promise<Product> => {
  const { id, ...updates } = updatedProductData;
  return await productServiceAdapter.updateProduct(id, updates);
};

export const deleteProduct = async (productId: string): Promise<{ success: boolean }> => {
  await productServiceAdapter.deleteProduct(productId);
  return { success: true };
};

// --- Dashboard Widgets ---
export const getSalesSummary = async (): Promise<SalesSummary> => {
  try {
    const orders = await databaseService.getOrdersWithItems();
    const totalSalesValue = orders.reduce((sum: number, order: any) => sum + Number(order.total_amount), 0);
    const totalOrdersCount = orders.length;
    const grossProfitValue = totalSalesValue * 0.25;

    return {
      totalSales: `৳ ${totalSalesValue.toLocaleString('bn-BD')}`,
      totalOrders: totalOrdersCount.toLocaleString('bn-BD'),
      grossProfit: `৳ ${grossProfitValue.toLocaleString('bn-BD')}`
    };
  } catch (error) {
    return {
      totalSales: '৳ ০',
      totalOrders: '০',
      grossProfit: '৳ ০'
    };
  }
};
