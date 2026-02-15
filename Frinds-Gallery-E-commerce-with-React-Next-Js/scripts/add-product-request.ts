
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function addProduct() {
    console.log('📦 Adding "Premium Quality Dress"...');

    const { data, error } = await supabase
        .from('products')
        .insert({
            name: 'প্রিমিয়াম Quality Dress',
            category: 'islamic',
            price: 5000,
            unit: 'পিস',
            stock: 50,
            image_url: 'https://images.unsplash.com/photo-1594580393963-71867c40d04c?q=80&w=600&auto=format&fit=crop', // Stock image for dress/islamic wear
            description: 'good',
            isPopular: true,
            isNew: true,
            status: 'active'
        })
        .select()
        .single();

    if (error) {
        console.error('❌ Failed to add product:', error);
    } else {
        console.log('✅ Product added successfully:', data);
    }
}

addProduct();
