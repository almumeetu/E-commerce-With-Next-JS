-- =====================================================================================
-- SUPABASE COMPLETE SETUP SCRIPT FOR FRINDS GALLERY
-- =====================================================================================
-- This script consolidates all necessary table creations, column updates, safe defaults,
-- and Row Level Security (RLS) policies into a single file.
-- RUN THIS IN THE SUPABASE SQL EDITOR TO FIX ALL DATABASE ISSUES.
-- =====================================================================================

-- -------------------------------------------------------------------------------------
-- 1. PRODUCTS TABLE
-- -------------------------------------------------------------------------------------
-- Ensure the products table has all required columns with safe defaults.
CREATE TABLE IF NOT EXISTS public.products (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    price numeric(12, 2) DEFAULT 0,
    stock integer DEFAULT 0,
    category text,
    image_url text,
    created_at timestamptz DEFAULT now()
);

-- Add/Update columns to match application needs safely
ALTER TABLE public.products 
    ADD COLUMN IF NOT EXISTS is_popular boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS is_new boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS unit text DEFAULT 'কেজি',
    ADD COLUMN IF NOT EXISTS description text,
    ADD COLUMN IF NOT EXISTS status text DEFAULT 'active',
    ADD COLUMN IF NOT EXISTS sku text; -- Added but nullable to prevent errors

-- Safe updates for existing null values
UPDATE public.products SET is_popular = false WHERE is_popular IS NULL;
UPDATE public.products SET is_new = false WHERE is_new IS NULL;
UPDATE public.products SET status = 'active' WHERE status IS NULL;
UPDATE public.products SET unit = 'pc' WHERE unit IS NULL AND category != 'dates';

-- Make SKU nullable (critical fix for "null value" errors)
ALTER TABLE public.products ALTER COLUMN sku DROP NOT NULL;

-- -------------------------------------------------------------------------------------
-- 2. CATEGORIES TABLE
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL UNIQUE,
    icon text,
    slug text UNIQUE,
    created_at timestamptz DEFAULT now()
);

-- Seed default categories if they don't exist
INSERT INTO public.categories (name, icon, slug)
VALUES 
    ('Dates', '🌴', 'dates'),
    ('Honey', '🍯', 'honey'),
    ('Nuts', '🥜', 'nuts'),
    ('Oils', '🫒', 'oils'),
    ('Clothing', '👕', 'clothing'),
    ('Drinks', '🥤', 'drinks'),
    ('Iftar', '🍱', 'iftar'),
    ('Islamic', '🕌', 'islamic'),
    ('Sehri', '🌙', 'sehri')
ON CONFLICT (name) DO NOTHING;

-- -------------------------------------------------------------------------------------
-- 3. ORDERS & ORDER ITEMS TABLES
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamptz DEFAULT now(),
    user_id uuid REFERENCES auth.users(id), -- Optional link to auth user
    status text DEFAULT 'pending',
    total_amount numeric(12, 2)
);

-- Enhance Orders Table
ALTER TABLE public.orders 
    ADD COLUMN IF NOT EXISTS order_id text, -- Custom ID like ORD-123
    ADD COLUMN IF NOT EXISTS customer_name text,
    ADD COLUMN IF NOT EXISTS phone text,
    ADD COLUMN IF NOT EXISTS address text,
    ADD COLUMN IF NOT EXISTS total_price numeric(12, 2),
    ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'COD',
    ADD COLUMN IF NOT EXISTS date timestamptz DEFAULT now();

-- Data Migration for Orders (Best Effort)
UPDATE public.orders SET total_price = total_amount WHERE total_price IS NULL AND total_amount IS NOT NULL;
UPDATE public.orders SET address = shipping_address WHERE address IS NULL AND shipping_address IS NOT NULL; -- Assumes shipping_address existed

-- Set Default value for order_id to prevent "null value" constraint errors
ALTER TABLE public.orders 
ALTER COLUMN order_id SET DEFAULT 'ORD-' || floor(extract(epoch from now()));

-- Create Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id),
  quantity integer NOT NULL,
  price numeric(12, 2) NOT NULL,
  product_name text
);

-- -------------------------------------------------------------------------------------
-- 4. RPC FUNCTIONS (Business Logic)
-- -------------------------------------------------------------------------------------
-- Function to place an order and deduct stock atomically
CREATE OR REPLACE FUNCTION public.place_order_with_stock_check(
  p_customer_name text,
  p_phone text,
  p_address text,
  p_total_price numeric,
  p_items jsonb
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  v_order_id uuid;
  v_display_id text;
  v_item record;
BEGIN
  -- Generate custom ID
  v_display_id := 'ORD-' || floor(extract(epoch from now()));

  -- Insert order
  INSERT INTO public.orders (order_id, customer_name, phone, address, total_price, status, date)
  VALUES (v_display_id, p_customer_name, p_phone, p_address, p_total_price, 'pending', now())
  RETURNING id INTO v_order_id;

  -- Process each item and check stock atomically
  FOR v_item IN
    SELECT * FROM jsonb_to_recordset(p_items) AS x(product_id uuid, quantity int, price numeric)
  LOOP
    -- Update stock (fails if insufficient)
    UPDATE public.products
    SET stock = stock - v_item.quantity
    WHERE id = v_item.product_id AND stock >= v_item.quantity;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Stock insufficient for product_id: %', v_item.product_id;
    END IF;

    -- Insert order item
    INSERT INTO public.order_items (order_id, product_id, quantity, price)
    VALUES (v_order_id, v_item.product_id, v_item.quantity, v_item.price);
  END LOOP;

  RETURN v_order_id;
END;
$$;

-- -------------------------------------------------------------------------------------
-- 5. STORAGE BUCKET & POLICIES
-- -------------------------------------------------------------------------------------
-- Create 'products' bucket if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Enable RLS on Objects (Usually already enabled, skipping to avoid ownership errors)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Reset Storage Policies
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;

-- Create Open Storage Policies (Simplified for ease of use)
CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING ( bucket_id = 'products' );
CREATE POLICY "Public Insert Access" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'products' );
CREATE POLICY "Public Update Access" ON storage.objects FOR UPDATE USING ( bucket_id = 'products' );
CREATE POLICY "Public Delete Access" ON storage.objects FOR DELETE USING ( bucket_id = 'products' );

-- -------------------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) & ACCESS POLICIES
-- -------------------------------------------------------------------------------------
-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Reset Table Policies
DROP POLICY IF EXISTS "Public Read Products" ON public.products;
DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
DROP POLICY IF EXISTS "Guest Insert Orders" ON public.orders;
DROP POLICY IF EXISTS "Guest Insert Order Items" ON public.order_items;
DROP POLICY IF EXISTS "Authenticated View Orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated View Order Items" ON public.order_items;
DROP POLICY IF EXISTS "Admin Update Orders" ON public.orders;
DROP POLICY IF EXISTS "Admin Manage Categories" ON public.categories; -- Generic drop
DROP POLICY IF EXISTS "Admin Insert Categories" ON public.categories;
DROP POLICY IF EXISTS "Admin Update Categories" ON public.categories;
DROP POLICY IF EXISTS "Admin Delete Categories" ON public.categories;
DROP POLICY IF EXISTS "Admin Insert Products" ON public.products;
DROP POLICY IF EXISTS "Admin Update Products" ON public.products;
DROP POLICY IF EXISTS "Admin Delete Products" ON public.products;

-- PUBLIC READ policies (Anyone can view products and categories)
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);

-- GUEST ORDER policies (Anyone can insert an order)
CREATE POLICY "Guest Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Guest Insert Order Items" ON public.order_items FOR INSERT WITH CHECK (true);

-- AUTHENTICATED/ADMIN policies (Logged in users can view/manage)
-- Note: In a real production app, check specifically for admin role.
-- Here we allow any authenticated user for simplicity.

CREATE POLICY "Authenticated View Orders" ON public.orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated View Order Items" ON public.order_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Update Orders" ON public.orders FOR UPDATE USING (auth.role() = 'authenticated');

-- Admin Category Management
CREATE POLICY "Admin Insert Categories" ON public.categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin Update Categories" ON public.categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Delete Categories" ON public.categories FOR DELETE USING (auth.role() = 'authenticated');

-- Admin Product Management (Implicitly handled if using Service Role key, but good to add for Auth users)
CREATE POLICY "Admin Insert Products" ON public.products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin Update Products" ON public.products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Delete Products" ON public.products FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================================================
-- END OF SETUP SCRIPT
-- =====================================================================================
