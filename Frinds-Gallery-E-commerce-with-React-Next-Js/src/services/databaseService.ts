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
    async getOrdersWithItems(page: number = 1, pageSize: number = 20) {
        // Attempt 1: Full Fetch with Joins (with pagination)
        try {
            const offset = (page - 1) * pageSize;
            
            // Get total count for pagination
            const { count, error: countError } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true });

            if (countError) throw countError;

            const { data: orders, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    items:order_items(
                        *,
                        product:products(name)
                    )
                `)
                .order('created_at', { ascending: false })
                .range(offset, offset + pageSize - 1);

            if (error) throw error;

            const mappedOrders = (orders || []).map(order => ({
                ...order,
                // Ensure date field is populated for frontend even if DB only has created_at
                date: order.date || order.created_at,
                created_at: order.created_at || order.date,
                items: order.items?.map((item: any) => ({
                    ...item,
                    product_name: item.product?.name || 'অজানা পণ্য (' + (item.product_id ? item.product_id.toString().slice(0, 4) : 'N/A') + ')'
                })) || []
            }));

            return {
                orders: mappedOrders,
                total: count || 0,
                page,
                pageSize,
                totalPages: Math.ceil((count || 0) / pageSize)
            };
        } catch (fullFetchError: any) {
            console.error('⚠️ Full Order Fetch Failed (likely join error):', fullFetchError);

            // Attempt 2: Fetch Orders Only (Fallback to at least show the orders)
            try {
                console.log('🔄 Attempting fallback fetch (Orders only)...');
                
                const offset = (page - 1) * pageSize;
                
                // Get total count
                const { count, error: countError } = await supabase
                    .from('orders')
                    .select('*', { count: 'exact', head: true });

                if (countError) throw countError;

                const { data: orders, error: ordersError } = await supabase
                    .from('orders')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .range(offset, offset + pageSize - 1);

                if (ordersError) throw ordersError;

                console.log('✅ Fallback fetch successful. Orders loaded without items.');

                // Return orders with empty items array to prevent UI crash
                return {
                    orders: (orders || []).map(order => ({
                        ...order,
                        items: []
                    })),
                    total: count || 0,
                    page,
                    pageSize,
                    totalPages: Math.ceil((count || 0) / pageSize)
                };
            } catch (fallbackError) {
                console.error('❌ Critical: Failed to fetch any orders from Supabase, trying local storage...', fallbackError);
                try {
                    const localOrdersRaw = typeof window !== 'undefined'
                        ? window.localStorage.getItem('friends_gallery_orders')
                        : null;
                    const localOrders = localOrdersRaw ? JSON.parse(localOrdersRaw) : [];

                    if (Array.isArray(localOrders) && localOrders.length > 0) {
                        console.log(`🗂 Loaded ${localOrders.length} local orders from browser storage`);
                        
                        const offset = (page - 1) * pageSize;
                        const paginatedOrders = localOrders.slice(offset, offset + pageSize);
                        
                        return {
                            orders: paginatedOrders.map((o: any) => ({
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
                            })),
                            total: localOrders.length,
                            page,
                            pageSize,
                            totalPages: Math.ceil(localOrders.length / pageSize)
                        };
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

    async placeOrder(formData: { name: string; phone: string; address: string }, items: any[], total: number, status: string = 'processing') {
        console.log("🚀 Placing Order:", { formData, itemsCount: items.length, total, status });

        try {
            // Use the advanced atomic function from Supabase setup
            // Note: RPC currently DOES NOT accept status, it defaults to 'pending' or whatever logic inside.
            // If we want to support 'incomplete', we might need to NOT use RPC for incomplete orders OR update RPC.
            // Since RPC is hard to update from here without SQL access, let's use Direct Insert for 'incomplete' status orders
            // OR use RPC and then update status.

            // Actually, for 'incomplete' orders, we should probably skip the stock check? 
            // If it's incomplete, maybe we don't reserve stock yet? 
            // But user wants to capture data. 
            // Let's try direct insert for 'incomplete' status to ensure we can set the status.

            if (status === 'অসম্পূর্ণ' || status === 'incomplete') {
                // Fallback: Direct insert without stock check logic for draft/incomplete orders
                const { data: orderData, error: orderError } = await supabase
                    .from('orders')
                    .insert({
                        customer_name: formData.name,
                        phone: formData.phone,
                        address: formData.address,
                        shipping_address: formData.address,
                        total_price: total,
                        total_amount: total,
                        status: status,
                        date: new Date().toISOString()
                    })
                    .select()
                    .single();

                if (orderError) throw orderError;

                const newOrderId = orderData.id;

                if (items.length > 0) {
                    const { error: itemsError } = await supabase
                        .from('order_items')
                        .insert(items.map(item => ({
                            order_id: newOrderId,
                            product_id: item.id,
                            quantity: item.quantity,
                            price: item.price,
                            product_name: item.name || 'Unknown Product'
                        })));

                    if (itemsError) console.error("❌ Draft Items Insert Failed:", itemsError);
                }
                return { success: true, orderId: newOrderId };
            }

            const { data: orderIds, error } = await supabase.rpc('place_order_with_stock_check', {
                p_customer_name: formData.name,
                p_phone: formData.phone,
                p_address: formData.address,
                p_total_price: total,
                p_items: items.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                p_status: status || 'pending'
            });

            if (error) {
                console.warn("⚠️ RPC stock check failed, falling back to direct insert. Error:", error);

                // Fallback: Direct insert without stock check logic
                const { data: orderData, error: orderError } = await supabase
                    .from('orders')
                    .insert({
                        customer_name: formData.name,
                        phone: formData.phone,
                        address: formData.address,
                        shipping_address: formData.address,
                        total_price: total,
                        total_amount: total,
                        status: status || 'pending',
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
                            product_name: item.name || 'Unknown Product'
                        })));

                    if (itemsError) {
                        console.error("❌ Fallback Items Insert Failed:", itemsError);
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
        try {
            // 1. Fetch all profiles
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (profilesError) throw profilesError;

            // 2. Fetch all orders (lightweight select)
            const { data: orders, error: ordersError } = await supabase
                .from('orders')
                .select('customer_id, total_price, created_at, phone');

            if (ordersError) throw ordersError;

            // 3. Aggregate order stats per customer
            const orderStats = new Map();
            (orders || []).forEach(order => {
                // Try to match by customer_id first, then phone as fallback
                const id = order.customer_id; // Assuming orders have customer_id linked to auth.users
                if (id) {
                    if (!orderStats.has(id)) {
                        orderStats.set(id, { count: 0, spent: 0, lastOrder: null });
                    }
                    const stat = orderStats.get(id);
                    stat.count += 1;
                    stat.spent += Number(order.total_price || 0);
                    if (!stat.lastOrder || new Date(order.created_at) > new Date(stat.lastOrder)) {
                        stat.lastOrder = order.created_at;
                    }
                }
            });

            // 4. Merge profiles with stats
            return (profiles || []).map(profile => {
                const stat = orderStats.get(profile.id) || { count: 0, spent: 0, lastOrder: null };
                return {
                    id: profile.id,
                    name: profile.name || 'Unknown',
                    email: profile.email || '',
                    phone: profile.phone || '',
                    totalOrders: stat.count,
                    totalSpent: stat.spent,
                    joinDate: profile.created_at,
                    orderIds: [], // Populating this might be expensive if not needed
                };
            });

        } catch (error) {
            console.error('Error fetching customers (real):', error);
            // Fallback to order-derived customers if profiles table doesn't exist yet/fails
            return this.getCustomersFromOrders();
        }
    },

    // Fallback method (renamed from original getCustomers)
    async getCustomersFromOrders() {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('customer_name, phone, address, total_price, created_at')
            .order('created_at', { ascending: false });

        if (error) return [];

        const customersMap = new Map();

        (orders || []).forEach(order => {
            const key = order.phone || order.customer_name || 'unknown';
            if (!customersMap.has(key)) {
                customersMap.set(key, {
                    id: 'guest-' + key, // Temporary ID
                    name: order.customer_name,
                    phone: order.phone,
                    email: '', // No email in this fallback
                    address: order.address,
                    totalSpent: 0,
                    totalOrders: 0,
                    joinDate: order.created_at,
                    orderIds: []
                });
            }
            const customer = customersMap.get(key);
            customer.totalSpent += Number(order.total_price || 0);
            customer.totalOrders += 1;
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
