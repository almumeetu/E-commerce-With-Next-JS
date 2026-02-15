import { createClient } from '@/lib/supabase/server';
import ShopClient from '@/components/ShopClient';
import { Product, Category } from '@/types';
import { PRODUCTS, CATEGORIES } from '@/constants';

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string, sort?: string, q?: string }> }) {
    const supabase = createClient();
    const params = await searchParams;

    // Always fetch all products to allow client-side filtering
    const query = (await supabase).from('products').select('*');

    const { data: productsData, error: productsError } = await query;
    const { data: categoriesData, error: categoriesError } = await (await supabase).from('categories').select('*');

    const products: Product[] = !productsError && (productsData || []).length > 0
        ? (productsData || []).map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: Number(p.price),
            image: p.image_url || p.image || '',
            description: p.description || '',
            isPopular: p.isPopular || false,
            isNew: p.isNew || false,
            stock: p.stock,
            unit: p.unit
        }))
        : PRODUCTS;

    const categories: Category[] = !categoriesError && (categoriesData || []).length > 0
        ? (categoriesData || []).map(c => ({
            id: c.id,
            name: c.name,
            icon: c.icon || '📦'
        }))
        : CATEGORIES;

    return (
        <ShopClient
            initialProducts={products}
            categories={categories}
            initialCategory={params.category}
            initialSearch={params.q}
        />
    );
}
