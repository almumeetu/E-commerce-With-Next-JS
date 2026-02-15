import { supabase } from './supabase';

export interface OrderData {
    customer_name: string;
    phone: string;
    address: string;
    city: string;
    note?: string;
    total_amount: number;
    payment_number?: string;
    payment_method?: string;
    items: {
        product_id: string | number;
        quantity: number;
        price: number;
    }[];
}

export const databaseService = {
    // Products
    async getProducts() {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Categories
    async getCategories() {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (error) throw error;
        return data;
    },

    // Orders
    async getOrdersWithItems() {
        const { data: orders, error } = await supabase
            .from('orders')
            .select(`
                *,
                items:order_items(
                    *,
                    product:products(name)
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (orders || []).map(order => ({
            ...order,
            items: order.items?.map((item: any) => ({
                ...item,
                product_name: item.product?.name || 'অজানা পণ্য'
            }))
        }));
    },

    async updateOrderStatus(orderId: string, status: string) {
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId);

        if (error) return { success: false, error: error.message };
        return { success: true };
    },

    async placeOrder(formData: { name: string; phone: string; address: string }, items: any[], total: number) {
        try {
            // Use the advanced atomic function from Supabase setup
            const { data: orderId, error } = await supabase.rpc('place_order_with_stock_check', {
                p_customer_name: formData.name,
                p_phone: formData.phone,
                p_address: formData.address,
                p_total_price: total,
                p_items: items.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            });

            if (error) throw error;

            return { success: true, orderId };
        } catch (err: any) {
            console.error('❌ Order Error:', err);
            return { success: false, error: err.message || 'Unexpected error occurred' };
        }
    },

    async getCustomers() {
        // Fetch all orders to extract unique customers (matching Rojarhat logic)
        const { data: orders, error } = await supabase
            .from('orders')
            .select('customer_name, phone, address, total_price, created_at')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const customersMap = new Map();

        (orders || []).forEach(order => {
            if (!customersMap.has(order.phone)) {
                customersMap.set(order.phone, {
                    name: order.customer_name,
                    phone: order.phone,
                    address: order.address,
                    totalSpent: 0,
                    orderCount: 0,
                    lastOrder: order.created_at
                });
            }

            const customer = customersMap.get(order.phone);
            customer.totalSpent += Number(order.total_price);
            customer.orderCount += 1;
            if (new Date(order.created_at) > new Date(customer.lastOrder)) {
                customer.lastOrder = order.created_at;
            }
        });

        return Array.from(customersMap.values());
    },

    async addProduct(product: any) {
        const { data, error } = await supabase
            .from('products')
            .insert(product)
            .select()
            .single();

        if (error) return { success: false, error: error.message };
        return { success: true, data };
    },

    async updateProduct(id: string, product: any) {
        const { data, error } = await supabase
            .from('products')
            .update(product)
            .eq('id', id)
            .select()
            .single();

        if (error) return { success: false, error: error.message };
        return { success: true, data };
    },

    async deleteProduct(id: string) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) return { success: false, error: error.message };
        return { success: true };
    }
};
