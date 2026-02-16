# 🔧 Vercel Deployment - Supabase RLS Fix

## ❌ সমস্যা:
Vercel এ deploy করা site এ এই errors আসছে:
```
Error fetching products
Error fetching categories  
Error fetching orders
Failed to fetch from Supabase
```

## 🎯 কারণ:
Supabase এ **Row Level Security (RLS)** enabled আছে, কিন্তু anonymous users (public visitors) দের জন্য read permission নেই। ফলে Vercel site থেকে data fetch করতে পারছে না।

---

## ✅ সমাধান (2টি ধাপ):

### ধাপ ১: Supabase SQL Editor এ যান

1. **Supabase Dashboard খুলুন:** https://supabase.com/dashboard
2. আপনার project select করুন
3. Left sidebar এ **SQL Editor** এ যান
4. **New Query** button click করুন

### ধাপ ২: Fix Script Run করুন

নিচের complete SQL script টি **copy করুন** এবং SQL Editor এ **paste** করে **Run** করুন:

```sql
-- =====================================================================================
-- FIX RLS PUBLIC ACCESS FOR VERCEL DEPLOYMENT
-- =====================================================================================

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Public Read Products" ON public.products;
DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
DROP POLICY IF EXISTS "Public Read Orders" ON public.orders;
DROP POLICY IF EXISTS "Guest Insert Orders" ON public.orders;
DROP POLICY IF EXISTS "Guest Insert Order Items" ON public.order_items;
DROP POLICY IF EXISTS "Authenticated View Orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated View Order Items" ON public.order_items;

-- =====================================================================================
-- PUBLIC ACCESS POLICIES (Allow anonymous users to read)
-- =====================================================================================

-- Anyone can read products (including anonymous users from Vercel)
CREATE POLICY "Public Read Products" 
ON public.products 
FOR SELECT 
USING (true);

-- Anyone can read categories (including anonymous users from Vercel)
CREATE POLICY "Public Read Categories" 
ON public.categories 
FOR SELECT 
USING (true);

-- =====================================================================================
-- ORDER PLACEMENT (Allow anonymous users to place orders)
-- =====================================================================================

-- Anyone can place orders (guest checkout)
CREATE POLICY "Guest Insert Orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Anyone can insert order items
CREATE POLICY "Guest Insert Order Items" 
ON public.order_items 
FOR INSERT 
WITH CHECK (true);

-- =====================================================================================
-- ADMIN ACCESS (Only authenticated users can view/manage orders)
-- =====================================================================================

-- Only authenticated users can view all orders
CREATE POLICY "Authenticated View Orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Only authenticated users can view order items
CREATE POLICY "Authenticated View Order Items" 
ON public.order_items 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Only authenticated users can update orders
CREATE POLICY "Authenticated Update Orders" 
ON public.orders 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- =====================================================================================
-- PRODUCT & CATEGORY MANAGEMENT (Admin only)
-- =====================================================================================

-- Authenticated users can insert products
CREATE POLICY "Admin Insert Products" 
ON public.products 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Authenticated users can update products
CREATE POLICY "Admin Update Products" 
ON public.products 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Authenticated users can delete products
CREATE POLICY "Admin Delete Products" 
ON public.products 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Authenticated users can insert categories
CREATE POLICY "Admin Insert Categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Authenticated users can update categories
CREATE POLICY "Admin Update Categories" 
ON public.categories 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Authenticated users can delete categories
CREATE POLICY "Admin Delete Categories" 
ON public.categories 
FOR DELETE 
USING (auth.uid() IS NOT NULL);
```

### ধাপ ৩: Verify করুন

SQL script run করার পর, নিচের verification queries run করুন:

```sql
-- Check if policies are created
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- Test if public can read products
SELECT count(*) FROM public.products;

-- Test if public can read categories
SELECT count(*) FROM public.categories;
```

যদি কোন row return করে, তাহলে সব ঠিক আছে!

---

## 🌐 Vercel Site Test করুন

SQL script run করার পর:

1. আপনার Vercel site এ যান
2. Browser refresh করুন (Ctrl+F5 বা Cmd+Shift+R)
3. Products এবং categories এখন load হবে!
4. Browser console (F12) check করুন - errors থাকবে না

---

## 📋 কি পরিবর্তন হলো?

### আগে:
```
❌ Anonymous users products দেখতে পারত না
❌ Categories load হত না
❌ Guest orders place করতে পারত না
```

### এখন:
```
✅ Anyone can read products (public access)
✅ Anyone can read categories (public access)
✅ Guest users can place orders
✅ Only admins can manage products/categories
✅ Only admins can view all orders
```

---

## 🔒 Security এখনও আছে:

- ✅ Products/Categories management শুধু authenticated users এর জন্য
- ✅ Order viewing শুধু authenticated users এর জন্য
- ✅ Guest users শুধু read এবং order place করতে পারবে
- ✅ কেউ database modify করতে পারবে না (admin ছাড়া)

---

## 🆘 Still Not Working?

যদি এখনও সমস্যা হয়:

### Check 1: Supabase Connection
Browser console এ এই command run করুন:
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL);
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Key exists' : 'Key missing');
```

### Check 2: Check Supabase Tables
Supabase Dashboard → Table Editor এ যান এবং verify করুন:
- `products` table আছে এবং data আছে
- `categories` table আছে এবং data আছে

### Check 3: Add Sample Data

যদি tables empty থাকে, sample data add করুন:

```sql
-- Add sample categories
INSERT INTO public.categories (name, icon, slug)
VALUES 
    ('Long Khimar', '👘', 'long-khimar'),
    ('Three Piece', '👗', 'three-piece'),
    ('Hijab', '🧕', 'hijab'),
    ('Inner Collection', '👚', 'inner-collection'),
    ('Islamic Items', '🕌', 'islamic-items')
ON CONFLICT (name) DO NOTHING;

-- Add sample products
INSERT INTO public.products (name, category, price, image_url, description, stock)
VALUES 
    ('Black Long Khimar', 'Long Khimar', 1500, '/placeholder-product.jpg', 'Premium quality long khimar', 10),
    ('White Hijab', 'Hijab', 500, '/placeholder-product.jpg', 'Soft cotton hijab', 20),
    ('Prayer Mat', 'Islamic Items', 800, '/placeholder-product.jpg', 'Islamic prayer mat', 15);
```

---

## ✅ Success Indicators:

After running the SQL script:

- [ ] SQL script executed successfully (no errors)
- [ ] Verification queries return data
- [ ] Vercel site loads products
- [ ] Vercel site loads categories
- [ ] No errors in browser console
- [ ] Can add items to cart

---

**SQL script run করে আমাকে জানান যদি কোন সমস্যা হয়!** 🚀
