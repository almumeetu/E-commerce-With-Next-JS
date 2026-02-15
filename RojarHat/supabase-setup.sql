-- ============================================
-- RojarHat E-commerce - Complete Database Setup
-- ============================================
-- Copy and paste this entire file into Supabase SQL Editor
-- Run it once to create all tables, seed data, and functions

-- Enable UUID generator
create extension if not exists "uuid-ossp";

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Products Table
create table if not exists public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price numeric(12, 2) not null,
  stock integer not null default 0,
  category text,
  image_url text,
  isPopular boolean default false,
  isNew boolean default false,
  status text check (status in ('active', 'out_of_stock')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Categories Table
create table if not exists public.categories (
  id text primary key,
  name text not null,
  icon text
);

-- Orders Table
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  customer_name text not null,
  phone text not null,
  address text not null,
  total_price numeric(12, 2) not null,
  payment_method text default 'COD',
  status text check (status in ('pending', 'processing', 'delivered', 'cancelled')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Order Items Table
create table if not exists public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  quantity integer not null,
  price numeric(12, 2) not null
);

-- ============================================
-- 2. SEED CATEGORIES (Idempotent)
-- ============================================

insert into public.categories (id, name, icon) values
  ('dates',   'খেজুর ও ফল',     '🌴'),
  ('drinks',  'শরবত ও পানীয়',   '🍹'),
  ('iftar',   'ইফতার আইটেম',    '🥙'),
  ('islamic', 'ইসলামিক পণ্য',   '🌙'),
  ('sehri',   'সেহরি স্পেশাল',  '🍛')
on conflict (id) do update
set name = excluded.name,
    icon = excluded.icon;

-- ============================================
-- 3. SEED PRODUCTS (All 18 products)
-- ============================================

insert into public.products (name, category, price, stock, image_url, description, isPopular, isNew) values
  ('মরিয়ম খেজুর (১ কেজি)', 'dates', 1200.00, 10, '/images/marium-khejur_compressed.webp', 'উন্নত মানের সৌদি মরিয়ম খেজুর। রমজানে ইফতারের জন্য সেরা পছন্দ।', true, false),
  ('আজওয়া খেজুর প্রিমিয়াম', 'dates', 1500.00, 10, '/images/black-khejur_compressed.webp', 'মদিনার বিখ্যাত আজওয়া খেজুর। সুস্বাদু এবং পুষ্টিকর।', true, false),
  ('রুহ আফজা (৭৫০ মিলি)', 'drinks', 450.00, 10, '/images/roapja_compressed.webp', 'ইফতারের ক্লান্তি দূর করতে রুহ আফজা।', true, false),
  ('স্পেশাল হালিম মিক্স', 'iftar', 120.00, 10, '/images/halim_compressed.webp', 'দ্রুত এবং সুস্বাদু হালিম তৈরির জন্য সেরা মিক্স।', false, true),
  ('জায়নামাজ (তুর্কি)', 'islamic', 850.00, 10, '/images/jaynamaz_compressed.webp', 'নরম এবং আরামদায়ক তুর্কি জায়নামাজ।', false, true),
  ('তসবিহ (ক্রিস্টাল)', 'islamic', 250.00, 10, '/images/tosbi_compressed.webp', 'সুন্দর ডিজাইনের ক্রিস্টাল তসবিহ।', false, false),
  ('চিনিগুড়া চাল (৫ কেজি)', 'sehri', 650.00, 10, '/images/cinigura-chal_compressed.webp', 'সুগন্ধি চিনিগুড়া চাল, বিরিয়ানি বা পোলাওয়ের জন্য।', true, false),
  ('খাটি সরিষার তেল (১ লিটার)', 'sehri', 320.00, 10, '/images/khati-sorisha_compressed.webp', 'ঘানি ভাঙা খাটি সরিষার তেল।', false, true),
  ('মেহেরাব খেজুর (প্যাকেট)', 'dates', 800.00, 10, '/images/khejur_compressed.webp', 'মধ্যপ্রাচ্য থেকে আমদানিকৃত মেহেরাব খেজুর।', true, false),
  ('বরই (১ কেজি)', 'dates', 280.00, 10, '/images/boroi_compressed.webp', 'তাজা বরই, ভিটামিন সি সমৃদ্ধ।', false, false),
  ('পেয়ারা জুস (১ লিটার)', 'drinks', 180.00, 10, '/images/peyara-jush_compressed.webp', 'প্রাকৃতিক পেয়ারা জুস।', false, true),
  ('ডিম (১২ পিস)', 'sehri', 160.00, 10, '/images/dim_compressed.webp', 'তাজা দেশি মুরগির ডিম।', true, false),
  ('পেঁয়াজু মিক্স', 'iftar', 95.00, 10, '/images/peyaji-mix_compressed.webp', 'সহজে পেঁয়াজু বানানোর জন্য রেডিমেড মিক্স।', false, true),
  ('জিলাপি (১ কেজি)', 'iftar', 420.00, 10, '/images/jilapi_compressed.webp', 'মিষ্টি এবং সুস্বাদু জিলাপি।', true, false),
  ('কুরআন শরীফ (বাংলা অনুবাদ)', 'islamic', 550.00, 10, '/images/Quran-Sharif_compressed.webp', 'বাংলা অনুবাদসহ কুরআন শরীফ।', true, false),
  ('আতর (৬ মিলি)', 'islamic', 380.00, 10, '/images/ator_compressed.webp', 'আরবি আতর।', false, true),
  ('দুধ (১ লিটার)', 'drinks', 85.00, 10, '/images/milk_compressed.webp', 'তাজা পাস্তুরিত দুধ।', true, false),
  ('ছোলা বুট (১ কেজি)', 'iftar', 110.00, 10, '/images/sola-but_compressed.webp', 'ইফতারের জন্য ছোলা বুট।', true, false)
on conflict do nothing;

-- ============================================
-- 4. ORDER FUNCTION (Atomic Stock Check)
-- ============================================

create or replace function public.place_order_with_stock_check(
  p_customer_name text,
  p_phone text,
  p_address text,
  p_total_price numeric,
  p_items jsonb
)
returns uuid
language plpgsql
set search_path = pg_catalog, public
as $function$
declare
  v_order_id uuid;
  v_item record;
begin
  -- Insert order
  insert into public.orders (customer_name, phone, address, total_price, status)
  values (p_customer_name, p_phone, p_address, p_total_price, 'pending')
  returning id into v_order_id;

  -- Process each item and check stock atomically
  for v_item in
    select * from jsonb_to_recordset(p_items) as x(product_id uuid, quantity int, price numeric)
  loop
    -- Update stock (fails if insufficient)
    update public.products
    set stock = stock - v_item.quantity
    where id = v_item.product_id and stock >= v_item.quantity;

    if not found then
      raise exception 'Stock insufficient for product_id: %', v_item.product_id;
    end if;

    -- Insert order item
    insert into public.order_items (order_id, product_id, quantity, price)
    values (v_order_id, v_item.product_id, v_item.quantity, v_item.price);
  end loop;

  return v_order_id;
end;
$function$;

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS) - OPTIONAL
-- ============================================
-- Uncomment below if you need to enable RLS

-- Enable RLS on all tables
-- alter table public.products enable row level security;
-- alter table public.categories enable row level security;
-- alter table public.orders enable row level security;
-- alter table public.order_items enable row level security;

-- Public read access for products and categories
-- create policy "Products are viewable by everyone" on public.products for select using (true);
-- create policy "Categories are viewable by everyone" on public.categories for select using (true);

-- Orders can be inserted by anyone (for checkout)
-- create policy "Anyone can create orders" on public.orders for insert with check (true);
-- create policy "Anyone can create order items" on public.order_items for insert with check (true);

-- Only authenticated users can view orders
-- create policy "Orders viewable by auth users" on public.orders for select using (auth.role() = 'authenticated');
-- create policy "Order items viewable by auth users" on public.order_items for select using (auth.role() = 'authenticated');

-- ============================================
-- SETUP COMPLETE! 🎉
-- ============================================
-- Your database is ready. Next steps:
-- 1. Add NEXT_PUBLIC_SUPABASE_URL to .env.local
-- 2. Add NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local
-- 3. Restart your Next.js dev server
-- 4. Visit your website - products should load from Supabase!
