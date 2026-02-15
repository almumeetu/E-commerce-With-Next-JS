import { createClient } from '@/lib/supabase/server';
import AdminOrders from '@/components/AdminOrders';

export default async function AdminOrdersPage() {
    const supabase = createClient();

    // Fetch orders with their items and product names
    const { data: orders } = await (await supabase)
        .from('orders')
        .select(`
      *,
      items:order_items(
        *,
        product:products(name)
      )
    `)
        .order('created_at', { ascending: false });

    // Map product names to items for easier display
    const formattedOrders = (orders || []).map(order => ({
        ...order,
        items: order.items?.map((item: any) => ({
            ...item,
            product_name: item.product?.name || 'অজানা পণ্য'
        }))
    }));

    return <AdminOrders orders={formattedOrders} />;
}
