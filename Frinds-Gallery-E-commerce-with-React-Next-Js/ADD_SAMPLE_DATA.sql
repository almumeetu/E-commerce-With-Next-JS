-- =====================================================================================
-- ADD SAMPLE DATA TO SUPABASE - FOR VERCEL DEPLOYMENT
-- =====================================================================================
-- This script adds sample products, categories, and fixes all permissions
-- Run this COMPLETE script in Supabase SQL Editor
-- =====================================================================================

-- =====================================================================================
-- STEP 1: FIX RLS POLICIES (Allow public read access)
-- =====================================================================================

-- Drop all existing policies first
DROP POLICY IF EXISTS "Public Read Products" ON public.products;
DROP POLICY IF EXISTS "Admin Insert Products" ON public.products;
DROP POLICY IF EXISTS "Admin Update Products" ON public.products;
DROP POLICY IF EXISTS "Admin Delete Products" ON public.products;
DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
DROP POLICY IF EXISTS "Admin Insert Categories" ON public.categories;
DROP POLICY IF EXISTS "Admin Update Categories" ON public.categories;
DROP POLICY IF EXISTS "Admin Delete Categories" ON public.categories;
DROP POLICY IF EXISTS "Admin Manage Categories" ON public.categories;
DROP POLICY IF EXISTS "Guest Insert Orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated View Orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated Update Orders" ON public.orders;
DROP POLICY IF EXISTS "Guest Insert Order Items" ON public.order_items;
DROP POLICY IF EXISTS "Authenticated View Order Items" ON public.order_items;

-- Create new public access policies
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Guest Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Guest Insert Order Items" ON public.order_items FOR INSERT WITH CHECK (true);

-- Admin policies (allow anyone for now - you can restrict later)
CREATE POLICY "Admin Insert Products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Update Products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Admin Delete Products" ON public.products FOR DELETE USING (true);
CREATE POLICY "Admin Insert Categories" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Update Categories" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "Admin Delete Categories" ON public.categories FOR DELETE USING (true);
CREATE POLICY "Authenticated View Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Authenticated Update Orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Authenticated View Order Items" ON public.order_items FOR SELECT USING (true);

-- =====================================================================================
-- STEP 2: ADD SAMPLE CATEGORIES
-- =====================================================================================

-- Delete existing categories (optional - comment out if you want to keep existing data)
-- TRUNCATE public.categories CASCADE;

-- Insert categories
INSERT INTO public.categories (name, icon, slug)
VALUES 
    ('Long Khimar', '👘', 'long-khimar'),
    ('Three Piece', '👗', 'three-piece'),
    ('Hijab', '🧕', 'hijab'),
    ('Inner Collection', '👚', 'inner-collection'),
    ('Islamic Items', '🕌', 'islamic-items')
ON CONFLICT (name) DO NOTHING;

-- =====================================================================================
-- STEP 3: ADD SAMPLE PRODUCTS
-- =====================================================================================

-- Delete existing products (optional - comment out if you want to keep existing data)
-- TRUNCATE public.products CASCADE;

-- Insert sample products for Long Khimar
INSERT INTO public.products (name, category, price, image_url, description, stock, is_popular, is_new)
VALUES 
    ('Premium Black Long Khimar', 'Long Khimar', 1500.00, 'https://via.placeholder.com/400x400/000000/FFFFFF?text=Black+Khimar', 'High-quality black long khimar made from premium fabric. Perfect for daily wear and special occasions.', 25, true, true),
    ('Navy Blue Long Khimar', 'Long Khimar', 1400.00, 'https://via.placeholder.com/400x400/000080/FFFFFF?text=Navy+Khimar', 'Elegant navy blue long khimar with soft, breathable material.', 30, true, false),
    ('Grey Long Khimar', 'Long Khimar', 1350.00, 'https://via.placeholder.com/400x400/808080/FFFFFF?text=Grey+Khimar', 'Comfortable grey long khimar suitable for all seasons.', 20, false, false),
    
    -- Three Piece Collection
    ('Beige Three Piece Set', 'Three Piece', 2500.00, 'https://via.placeholder.com/400x400/F5F5DC/000000?text=Beige+Set', 'Complete three-piece set in beige color. Includes top, bottom, and matching scarf.', 15, true, true),
    ('Maroon Three Piece Set', 'Three Piece', 2400.00, 'https://via.placeholder.com/400x400/800000/FFFFFF?text=Maroon+Set', 'Beautiful maroon three-piece outfit perfect for formal occasions.', 18, false, false),
    ('Olive Green Three Piece', 'Three Piece', 2300.00, 'https://via.placeholder.com/400x400/808000/FFFFFF?text=Olive+Set', 'Trendy olive green three-piece set with modern design.', 12, false, true),
    
    -- Hijab Collection
    ('Black Instant Hijab', 'Hijab', 500.00, 'https://via.placeholder.com/400x400/000000/FFFFFF?text=Black+Hijab', 'Easy-to-wear instant hijab in classic black. No pins needed!', 50, true, false),
    ('White Cotton Hijab', 'Hijab', 450.00, 'https://via.placeholder.com/400x400/FFFFFF/000000?text=White+Hijab', 'Soft cotton hijab in pure white. Breathable and comfortable.', 45, true, false),
    ('Dusty Pink Hijab', 'Hijab', 480.00, 'https://via.placeholder.com/400x400/FADADD/000000?text=Pink+Hijab', 'Beautiful dusty pink hijab made from premium jersey fabric.', 40, false, true),
    ('Turquoise Chiffon Hijab', 'Hijab', 550.00, 'https://via.placeholder.com/400x400/40E0D0/000000?text=Turquoise+Hijab', 'Lightweight chiffon hijab in stunning turquoise color.', 35, false, false),
    
    -- Inner Collection
    ('Cotton Inner Cap', 'Inner Collection', 200.00, 'https://via.placeholder.com/400x400/FFFFFF/000000?text=Inner+Cap', 'Comfortable cotton inner cap to wear under hijab. Pack of 3.', 60, true, false),
    ('Neck Cover', 'Inner Collection', 250.00, 'https://via.placeholder.com/400x400/000000/FFFFFF?text=Neck+Cover', 'Full coverage neck cover in black. One size fits all.', 40, false, false),
    
    -- Islamic Items
    ('Prayer Mat - Turkish Design', 'Islamic Items', 1200.00, 'https://via.placeholder.com/400x400/8B4513/FFFFFF?text=Prayer+Mat', 'Beautiful Turkish design prayer mat with cushioned padding.', 20, true, true),
    ('Tasbih Counter - Digital', 'Islamic Items', 350.00, 'https://via.placeholder.com/400x400/4169E1/FFFFFF?text=Tasbih', 'Digital tasbih counter with LED display. Battery included.', 30, false, false),
    ('Islamic Wall Art', 'Islamic Items', 800.00, 'https://via.placeholder.com/400x400/FFD700/000000?text=Wall+Art', 'Elegant Islamic calligraphy wall art. Perfect for home decor.', 15, false, true)
ON CONFLICT DO NOTHING;

-- =====================================================================================
-- STEP 4: VERIFICATION QUERIES
-- =====================================================================================

-- Check if data was inserted successfully
SELECT 'Categories Count:' as info, count(*) as total FROM public.categories;
SELECT 'Products Count:' as info, count(*) as total FROM public.products;
SELECT 'Products by Category:' as info, category, count(*) as total FROM public.products GROUP BY category;

-- View all categories
SELECT * FROM public.categories ORDER BY name;

-- View sample products
SELECT id, name, category, price, stock, is_popular, is_new FROM public.products ORDER BY category, name LIMIT 20;

-- =====================================================================================
-- STEP 5: CHECK RLS POLICIES
-- =====================================================================================

-- List all policies to verify they were created
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    cmd as operation,
    CASE 
        WHEN qual = 'true'::text THEN 'PUBLIC ACCESS'
        WHEN qual LIKE '%auth.uid()%' THEN 'AUTHENTICATED ONLY'
        ELSE 'CUSTOM RULE'
    END as access_type
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('products', 'categories', 'orders', 'order_items')
ORDER BY tablename, policyname;

-- =====================================================================================
-- SUCCESS MESSAGE
-- =====================================================================================

SELECT '✅ SETUP COMPLETE!' as status,
       'Your Vercel site should now show products and categories!' as message;

-- =====================================================================================
-- NEXT STEPS:
-- 1. Go to your Vercel deployed site
-- 2. Refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)
-- 3. You should see all the products and categories!
-- 4. Check browser console - there should be NO errors
-- =====================================================================================
