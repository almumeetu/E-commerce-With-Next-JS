-- =====================================================================================
-- COMPLETE RLS FIX - DROP ALL EXISTING POLICIES AND RECREATE
-- =====================================================================================
-- This script completely resets all RLS policies for public access
-- Run this in Supabase SQL Editor
-- =====================================================================================

-- =====================================================================================
-- STEP 1: DROP ALL EXISTING POLICIES
-- =====================================================================================

-- Drop all products policies
DROP POLICY IF EXISTS "Public Read Products" ON public.products;
DROP POLICY IF EXISTS "Admin Insert Products" ON public.products;
DROP POLICY IF EXISTS "Admin Update Products" ON public.products;
DROP POLICY IF EXISTS "Admin Delete Products" ON public.products;

-- Drop all categories policies
DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
DROP POLICY IF EXISTS "Admin Insert Categories" ON public.categories;
DROP POLICY IF EXISTS "Admin Update Categories" ON public.categories;
DROP POLICY IF EXISTS "Admin Delete Categories" ON public.categories;
DROP POLICY IF EXISTS "Admin Manage Categories" ON public.categories;

-- Drop all orders policies
DROP POLICY IF EXISTS "Guest Insert Orders" ON public.orders;
DROP POLICY IF EXISTS "Public Read Orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated View Orders" ON public.orders;
DROP POLICY IF EXISTS "Admin Update Orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated Update Orders" ON public.orders;

-- Drop all order_items policies
DROP POLICY IF EXISTS "Guest Insert Order Items" ON public.order_items;
DROP POLICY IF EXISTS "Public Read Order Items" ON public.order_items;
DROP POLICY IF EXISTS "Authenticated View Order Items" ON public.order_items;

-- =====================================================================================
-- STEP 2: CREATE NEW POLICIES FOR PUBLIC ACCESS
-- =====================================================================================

-- ✅ PRODUCTS: Anyone can read, only authenticated users can modify
CREATE POLICY "Public Read Products" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Admin Insert Products" 
ON public.products 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin Update Products" 
ON public.products 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin Delete Products" 
ON public.products 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- ✅ CATEGORIES: Anyone can read, only authenticated users can modify
CREATE POLICY "Public Read Categories" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Admin Insert Categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin Update Categories" 
ON public.categories 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin Delete Categories" 
ON public.categories 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- ✅ ORDERS: Anyone can insert, only authenticated users can view/update
CREATE POLICY "Guest Insert Orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated View Orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated Update Orders" 
ON public.orders 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- ✅ ORDER ITEMS: Anyone can insert, only authenticated users can view
CREATE POLICY "Guest Insert Order Items" 
ON public.order_items 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated View Order Items" 
ON public.order_items 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- =====================================================================================
-- STEP 3: VERIFICATION
-- =====================================================================================
-- Run these queries to verify everything is working:

-- Check if policies exist
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('products', 'categories', 'orders', 'order_items')
ORDER BY tablename, policyname;

-- Test public read access (should work)
SELECT count(*) as product_count FROM public.products;
SELECT count(*) as category_count FROM public.categories;

-- =====================================================================================
-- SUCCESS! Your Vercel site should now be able to fetch data!
-- =====================================================================================
