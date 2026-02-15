
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manually load env vars from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();
    // Remove quotes if present
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

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
      image_url: 'https://images.unsplash.com/photo-1594580393963-71867c40d04c?q=80&w=600&auto=format&fit=crop', 
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
