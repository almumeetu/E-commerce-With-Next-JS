import { supabase } from './supabase';
import { Customer } from '../types';

export const customerService = {
  // Register new customer
  async registerCustomer(customerData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .insert([{
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        password: customerData.password, // In production, hash this!
        total_orders: 0,
        total_spent: 0,
        join_date: new Date().toISOString(),
        order_ids: []
      }])
      .select()
      .single();

    if (error) throw error;
    return this.mapToCustomer(data);
  },

  // Get customer by ID
  async getCustomerById(id: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return this.mapToCustomer(data);
  },

  // Get customer by phone (for login)
  async getCustomerByPhone(phone: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) return null;
    return this.mapToCustomer(data);
  },

  // Get all customers (Admin)
  async getAllCustomers(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('join_date', { ascending: false });

    if (error) throw error;
    return (data || []).map(this.mapToCustomer);
  },

  // Update customer
  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapToCustomer(data);
  },

  // Helper to map database format to Customer type
  mapToCustomer(data: any): Customer {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      totalOrders: data.total_orders,
      totalSpent: data.total_spent,
      joinDate: data.join_date,
      orderIds: data.order_ids || []
    };
  }
};
