export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  sku: string;
  stock: number;
  rating: number;
  reviewCount: number;
  date?: string;
  description?: string;
  isPopular?: boolean;
  isNew?: boolean;
}

export interface Category {
  id: string;
  name: string;
  imageUrl?: string; // Legacy
  image_url?: string; // DB column
  icon?: string; // DB column
  slug?: string;
}

export interface Review {
  id: number;
  quote: string;
  author: string;
  location: string;
  rating: number;
  avatarUrl: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  author: string;
  email: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export enum OrderStatus {
  Processing = 'প্রক্রিয়াধীন',
  Shipped = 'শিপিং-এ',
  Delivered = 'পৌঁছে গেছে',
  Cancelled = 'বাতিল',
  NotFound = 'অর্ডার খুঁজে পাওয়া যায়নি',
  Incomplete = 'অসম্পূর্ণ',
}

export interface SalesSummary {
  totalSales: string;
  totalOrders: string;
  grossProfit: string;
}

export interface OrderDetails {
  orderId: string;
  customerName: string;
  totalAmount: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number; // Price at the time of order
}

export interface Order {
  id: string;
  orderId: string;
  customerName: string;
  date: string;
  totalAmount: number;
  // FIX: Changed status to use the OrderStatus enum for type safety.
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: string;
  customerId?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  password?: string;
  orderIds: string[];
}
