import { createClient } from '@/lib/supabase/server';
import HomeClient from '@/components/HomeClient';
import { Product, Category } from '@/types';
import { PRODUCTS, CATEGORIES } from '@/constants';

export default async function HomePage() {
    const supabase = await createClient();

    // Fetch products and categories in parallel
    const [productsResponse, categoriesResponse] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name')
    ]);

    const productsData = productsResponse.error ? [] : (productsResponse.data || []);
    const categoriesData = categoriesResponse.error ? [] : (categoriesResponse.data || []);

    // Transform data to match our types if necessary
    const products: Product[] = productsData.length > 0
        ? productsData.map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: Number(p.price),
            image: p.image_url || p.image || '',
            description: p.description || '',
            // Check both casing variations as Postgres often lowercases column names
            isPopular: p.isPopular || p.ispopular || false,
            isNew: p.isNew || p.isnew || false,
            stock: p.stock,
            unit: p.unit
        }))
        : PRODUCTS;

    console.log(`📦 Home: Fetched ${productsData.length} products from DB. Using fallback: ${productsData.length === 0}`);
    if (products.length > 0) {
        const popularCount = products.filter(p => p.isPopular).length;
        console.log(`🔥 Popular items: ${popularCount}`);
    }

    const categories: Category[] = categoriesData.length > 0
        ? categoriesData.map(c => ({
            id: c.id,
            name: c.name,
            icon: c.icon || '📦'
        }))
        : CATEGORIES;

    return (
        <HomeClient
            initialProducts={products}
            initialCategories={categories}
        />
    );
}
