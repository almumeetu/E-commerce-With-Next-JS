export interface Product {
  id: string | number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  isPopular: boolean;
  isNew: boolean;
  stock: number;
  unit?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export type CartItem = Product & { quantity: number };

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  total_price: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product_name?: string;
}