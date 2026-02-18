import { supabase } from '../../../services/supabase';

export type PlaceOrderResult =
    | { success: true; orderId: any; message?: string }
    | { success: false; error: string; invalidIds?: (string | number)[]; missingIds?: string[] };

const isUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

export async function placeOrder(formData: any, items: any[], total: number): Promise<PlaceOrderResult> {
    try {
        // 1. Validate Product IDs (UUID check)
        const invalidIds = items.filter(item => !isUUID(item.id)).map(item => item.id);
        if (invalidIds.length > 0) {
            console.error('❌ Found invalid UUIDs in cart:', invalidIds);
            // In a real scenario, we might want to allow non-UUIDs if we support legacy items, 
            // but assuming strict UUIDs for Supabase:
            return {
                success: false,
                error: 'আপনার কার্টে পুরনো পণ্য রয়েছে যা এখন আর উপলব্ধ নেই। দয়া করে কার্ট রিভিউ করে ভুল পণ্যগুলো সরিয়ে দিন।',
                invalidIds
            };
        }

        // 2. Validate Products Exist in DB
        const productIds = items.map(item => item.id);
        const { data: existingProducts, error: fetchError } = await supabase
            .from('products')
            .select('id')
            .in('id', productIds);

        if (fetchError) {
            console.error('❌ Error checking products:', fetchError);
            return { success: false, error: 'পণ্যের তথ্য যাচাই করতে সমস্যা হয়েছে।' };
        }

        const existingIds = new Set(existingProducts?.map(p => p.id) || []);
        const missingItems = items.filter(item => !existingIds.has(item.id));
        const missingIds = missingItems.map(item => item.id);

        if (missingIds.length > 0) {
            console.error('❌ Products not found in DB:', missingIds);
            return {
                success: false,
                error: 'আপনার কার্টে এমন কিছু পণ্য রয়েছে যা এখন স্টকে নেই। অনুগ্রহ করে পণ্যগুলো চেক করুন।',
                missingIds
            };
        }

        // Prepare order data
        console.log('📦 Placing order:', {
            customer: formData.name,
            phone: formData.phone,
            total,
            items: items.length
        });

        // Direct insert approach
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                customer_name: formData.name,
                phone: formData.phone,
                address: formData.address,
                total_price: total,
                payment_method: 'COD',
                status: 'pending'
            })
            .select()
            .single();

        if (orderError) {
            console.error('❌ Order insert error:', orderError);
            return { success: false, error: `Database Error: ${orderError.message}` };
        }

        // Insert order items
        const orderItems = items.map(item => ({
            order_id: order.id,
            product_id: item.id,
            quantity: item.quantity,
            price: item.price
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) {
            console.error('❌ Order items error:', itemsError);
            return { success: false, error: `Item Error: ${itemsError.message}` };
        }

        console.log('✅ Order successful:', order.id);
        // revalidatePath('/admin/orders'); // Client-side apps don't use this
        return { success: true, orderId: order.id };

    } catch (err: any) {
        console.error('❌ Order Exception:', err);
        return { success: false, error: err.message || 'Unexpected error occurred' };
    }
}

export async function updateOrderStatus(orderId: string, status: string) {
    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

    if (error) return { success: false, error: error.message };
    // revalidatePath('/admin/orders');
    return { success: true };
}
