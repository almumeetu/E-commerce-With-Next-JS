import { PRODUCTS, CATEGORIES } from '../constants';
import { Product, Category } from '../types';
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
        product_id: number;
        quantity: number;
        price: number;
    }[];
}

export const databaseService = {
    // Products
    async getProducts() {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                return PRODUCTS as Product[];
            }

            if (data && data.length > 0) {
                return data.map(p => ({
                    id: p.id,
                    name: p.name,
                    category: p.category,
                    price: parseFloat(p.price || '0'),
                    imageUrl: p.image_url || p.image || '',
                    description: p.description || '',
                    sku: p.sku || `SKU-${p.id}`,
                    stock: p.stock || 10,
                    rating: p.rating || 5, // Default if missing
                    reviewCount: p.review_count || 0,
                })) as Product[];
            }

            return PRODUCTS as Product[];
        } catch (error) {
            return PRODUCTS as Product[];
        }
    },

    async getProductById(id: string | number) {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) {
                const product = PRODUCTS.find(p => p.id === id);
                if (!product) throw new Error('Product not found');
                return product as Product;
            }

            return {
                id: data.id,
                name: data.name,
                category: data.category,
                price: parseFloat(data.price || '0'),
                imageUrl: data.image_url || data.image || '',
                description: data.description || '',
                sku: data.sku || `SKU-${data.id}`,
                stock: data.stock || 10,
                rating: data.rating || 5,
                reviewCount: data.review_count || 0,
            } as Product;
        } catch (error) {
            // @ts-ignore
            const product = PRODUCTS.find(p => String(p.id) === String(id));
            if (!product) throw new Error('Product not found');
            return product as Product;
        }
    },

    // Categories
    async getCategories() {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name');

            if (error) {
                return CATEGORIES as Category[];
            }

            if (data && data.length > 0) {
                return data.map(c => ({
                    id: c.id,
                    name: c.name,
                    icon: c.icon || '📦',
                })) as Category[];
            }

            return CATEGORIES as Category[];
        } catch (error) {
            return CATEGORIES as Category[];
        }
    },

    // Orders
    async createOrder(orderData: OrderData) {
        try {
            // 1. Try Supabase first if configured
            if (supabase.auth) { // Basic check for client initialization
                try {
                    const { data: order, error: orderError } = await supabase
                        .from('orders')
                        .insert({
                            customer_name: orderData.customer_name,
                            phone: orderData.phone,
                            address: orderData.address,
                            city: orderData.city,
                            note: orderData.note || null,
                            total_amount: orderData.total_amount,
                            payment_number: orderData.payment_number || null,
                            payment_method: orderData.payment_method || 'cash_on_delivery',
                            status: 'pending'
                        })
                        .select()
                        .single();

                    if (!orderError && order) {
                        const orderItems = orderData.items.map(item => ({
                            order_id: order.id,
                            product_id: item.product_id,
                            quantity: item.quantity,
                            price: item.price
                        }));

                        const { error: itemsError } = await supabase
                            .from('order_items')
                            .insert(orderItems);

                        if (!itemsError) {
                            return {
                                id: order.id,
                                ...orderData,
                                payment_number: order.payment_number,
                                created_at: order.created_at
                            };
                        }
                    }
                } catch (e) {
                    console.warn('Supabase order failed, falling back to local storage');
                }// Fallback to local storage
            }

            // 2. Fallback to Local Storage (Always works)
            const localOrders = JSON.parse(localStorage.getItem('friends_gallery_orders') || '[]');
            const newOrder = {
                id: Date.now(), // Generate a unique ID locally
                ...orderData,
                status: 'pending',
                created_at: new Date().toISOString(),
                isLocal: true
            };

            localOrders.push(newOrder);
            localStorage.setItem('friends_gallery_orders', JSON.stringify(localOrders));

            return newOrder;

        } catch (error) {
            throw error;
        }
    },

    // Get local orders for admin/debug
    getLocalOrders() {
        return JSON.parse(localStorage.getItem('friends_gallery_orders') || '[]');
    },

    // Get order by ID
    async getOrderById(orderId: number) {
        try {
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();

            if (orderError || !order) {
                throw new Error('Order not found');
            }

            const { data: items, error: itemsError } = await supabase
                .from('order_items')
                .select('*')
                .eq('order_id', orderId);

            return {
                ...order,
                items: items || []
            };
        } catch (error) {
            throw error;
        }
    }
};
