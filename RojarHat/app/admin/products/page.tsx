import { createClient } from '@/lib/supabase/server';
import AdminProducts from '@/components/AdminProducts';

export default async function AdminProductsPage() {
    const supabase = await createClient();

    // Fetch products
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    return <AdminProducts products={products || []} />;
}