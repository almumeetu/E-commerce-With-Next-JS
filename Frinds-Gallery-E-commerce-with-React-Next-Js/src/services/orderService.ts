import { supabase } from './supabase';
import { Order, OrderItem } from '../types';

export const orderService = {
  // Create new order
  async createOrder(orderData: {
    customerName: string;
    customerId?: string;
    items: OrderItem[];
    totalAmount: number;
    shippingAddress: string;
  }): Promise<Order> {
    const orderId = `FG-${Date.now()}`;
    
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        order_id: orderId,
        customer_name: orderData.customerName,
        customer_id: orderData.customerId,
        items: orderData.items,
        total_amount: orderData.totalAmount,
        shipping_address: orderData.shippingAddress,
        status: 'প্রক্রিয়াধীন',
        date: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return this.mapToOrder(data);
  },

  // Get order by ID
  async getOrderById(orderId: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error) return null;
    return this.mapToOrder(data);
  },

  // Get all orders (Admin)
  async getAllOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return (data || []).map(this.mapToOrder);
  },

  // Get orders by customer
  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', customerId)
      .order('date', { ascending: false });

    if (error) throw error;
    return (data || []).map(this.mapToOrder);
  },

  // Update order status (Admin)
  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('order_id', orderId)
      .select()
      .single();

    if (error) throw error;
    return this.mapToOrder(data);
  },

  // Helper to map database format to Order type
  mapToOrder(data: any): Order {
    return {
      id: data.id,
      orderId: data.order_id,
      customerName: data.customer_name,
      customerId: data.customer_id,
      date: data.date,
      totalAmount: data.total_amount,
      status: data.status,
      items: data.items,
      shippingAddress: data.shipping_address
    };
  }
};
