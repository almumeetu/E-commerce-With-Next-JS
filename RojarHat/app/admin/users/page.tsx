import { createClient } from '@/lib/supabase/server';
import AdminUsers from '@/components/AdminUsers';

export default async function AdminUsersPage() {
    const supabase = await createClient();

    // Fetch all orders to extract unique customers
    const { data: orders } = await supabase
        .from('orders')
        .select('customer_name, phone, address, total_price, created_at')
        .order('created_at', { ascending: false });

    // Group by phone to get unique customers
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

    const customers = Array.from(customersMap.values());

    return <AdminUsers customers={customers} />;
}
