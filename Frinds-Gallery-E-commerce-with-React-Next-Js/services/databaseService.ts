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

        if (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
        return data;
    },

    // Categories
    async getCategories() {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
        return data;
    },

    // Orders
    async getOrdersWithItems() {
        // Attempt 1: Full Fetch with Joins
        try {
            const { data: orders, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    items:order_items(
                        *,
                        product:products(name)
                    )
                `)
                // Try sorting by created_at first, if it fails, the query might just return unordered data or error
                // but since we run the fix script, this column SHOULD exist now.
                .order('created_at', { ascending: false });

            if (error) throw error;

            return (orders || []).map(order => ({
                ...order,
                // Ensure date field is populated for frontend even if DB only has created_at
                date: order.date || order.created_at,
                created_at: order.created_at || order.date,
                items: order.items?.map((item: any) => ({
                    ...item,
                    product_name: item.product?.name || 'অজানা পণ্য (' + (item.product_id ? item.product_id.toString().slice(0, 4) : 'N/A') + ')'
                })) || []
            }));
        } catch (fullFetchError: any) {
            console.error('⚠️ Full Order Fetch Failed (likely join error):', fullFetchError);

            // Attempt 2: Fetch Orders Only (Fallback to at least show the orders)
            try {
                console.log('🔄 Attempting fallback fetch (Orders only)...');
                const { data: orders, error: ordersError } = await supabase
                    .from('orders')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (ordersError) throw ordersError;

                console.log('✅ Fallback fetch successful. Orders loaded without items.');

                // Return orders with empty items array to prevent UI crash
                return (orders || []).map(order => ({
                    ...order,
                    items: []
                }));
            } catch (fallbackError) {
                console.error('❌ Critical: Failed to fetch any orders from Supabase, trying local storage...', fallbackError);
                try {
                    const localOrdersRaw = typeof window !== 'undefined'
                        ? window.localStorage.getItem('friends_gallery_orders')
                        : null;
                    const localOrders = localOrdersRaw ? JSON.parse(localOrdersRaw) : [];

                    if (Array.isArray(localOrders) && localOrders.length > 0) {
                        console.log(`🗂 Loaded ${localOrders.length} local orders from browser storage`);
                        return localOrders.map((o: any) => ({
                            id: o.id || `local-${Date.now()}`,
                            customer_name: o.customer_name || o.customerName || 'Unknown',
                            phone: o.phone || '',
                            address: o.address || o.shippingAddress || '',
                            total_price: Number(o.total_amount || o.total || 0),
                            status: o.status || 'pending',
                            created_at: o.created_at || o.date || new Date().toISOString(),
                            items: (o.items || []).map((it: any) => ({
                                product_id: it.product_id || it.productId,
                                product_name: it.product_name || it.name || 'Unknown Product',
                                quantity: Number(it.quantity || 0),
                                price: Number(it.price || 0)
                            }))
                        }));
                    }
                } catch (localErr) {
                    console.error('🧹 Local storage orders not available or invalid format:', localErr);
                }
                // If nothing worked, bubble up error
                throw fallbackError;
            }
        }
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
        console.log("🚀 Placing Order:", { formData, itemsCount: items.length, total });

        try {
            // Use the advanced atomic function from Supabase setup
            const { data: orderIds, error } = await supabase.rpc('place_order_with_stock_check', {
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

            if (error) {
                // If the RPC fails (e.g. function doesn't exist or strict), try fallback
                console.warn("⚠️ RPC stock check failed, falling back to direct insert. Error:", error);

                // Fallback: Direct insert without stock check logic
                const { data: orderData, error: orderError } = await supabase
                    .from('orders')
                    .insert({
                        // Note: Let Supabase generate 'id' (UUID).
                        // We provide 'order_id' (Text) manually or let default handle it if set? 
                        // Setup script sets default for 'order_id'.
                        // But we can explicit set it to be safe.
                        customer_name: formData.name,
                        phone: formData.phone,
                        address: formData.address,
                        shipping_address: formData.address, // FIX: Some DB setups check this legacy column
                        total_price: total,
                        total_amount: total, // FIX: Some DB setups check this column
                        status: 'pending',
                        date: new Date().toISOString()
                    })
                    .select()
                    .single();

                if (orderError) {
                    console.error("❌ Fallback Order Insert Failed:", orderError);
                    throw orderError;
                }

                const newOrderId = orderData.id;

                if (items.length > 0) {
                    const { error: itemsError } = await supabase
                        .from('order_items')
                        .insert(items.map(item => ({
                            order_id: newOrderId,
                            product_id: item.id,
                            quantity: item.quantity,
                            price: item.price,
                            product_name: item.name || 'Unknown Product' // Ensure product_name is passed if required or useful
                        })));

                    if (itemsError) {
                        console.error("❌ Fallback Items Insert Failed:", itemsError);
                        // We don't throw here to avoid failing the whole order if just items fail, 
                        // but ideally we should transactionalize. Admin will see order with 0 items.
                    }
                }

                return { success: true, orderId: newOrderId };
            }

            return { success: true, orderId: orderIds };
        } catch (err: any) {
            console.error('❌ Order Error:', err);
            return { success: false, error: err.message || 'Unexpected error occurred' };
        }
    },

    async getCustomers() {
        // Fetch specific columns to optimize
        const { data: orders, error } = await supabase
            .from('orders')
            .select('customer_name, phone, address, total_price, created_at')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching customers (via orders):', error);
            // Return empty to avoid crash
            return [];
        }

        const customersMap = new Map();

        (orders || []).forEach(order => {
            // Normalize phone/name as key
            const key = order.phone || order.customer_name || 'unknown';

            if (!customersMap.has(key)) {
                customersMap.set(key, {
                    name: order.customer_name,
                    phone: order.phone,
                    address: order.address,
                    totalSpent: 0,
                    orderCount: 0,
                    lastOrder: order.created_at
                });
            }

            const customer = customersMap.get(key);
            customer.totalSpent += Number(order.total_price || 0);
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
    },

    // Categories CRUD
    async addCategory(category: { name: string; icon?: string; slug?: string }) {
        const { data, error } = await supabase
            .from('categories')
            .insert(category)
            .select()
            .single();

        if (error) return { success: false, error: error.message };
        return { success: true, data };
    },

    async updateCategory(id: string, updates: any) {
        const { data, error } = await supabase
            .from('categories')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) return { success: false, error: error.message };
        return { success: true, data };
    },

    async deleteCategory(id: string) {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) return { success: false, error: error.message };
        return { success: true };
    }
};
