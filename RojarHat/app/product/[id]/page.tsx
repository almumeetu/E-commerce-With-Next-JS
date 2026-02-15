import { createClient } from '@/lib/supabase/server';
import ProductDetailsClient from '@/components/ProductDetailsClient';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = createClient();
    const { id } = await params;

    const { data: product } = await (await supabase)
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (!product) notFound();

    const formattedProduct = {
        ...product,
        id: product.id,
        price: Number(product.price),
        image: product.image_url,
        isPopular: product.isPopular || false,
        isNew: product.isNew || false,
    };

    return <ProductDetailsClient product={formattedProduct} />;
}
