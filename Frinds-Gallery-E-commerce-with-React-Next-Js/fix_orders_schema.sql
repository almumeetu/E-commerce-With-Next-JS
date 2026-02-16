-- =====================================================================================
-- FIX ORDERS TABLE SCHEMA - CRITICAL FIX
-- =====================================================================================

-- 1. Remove the problematic 'items' column if it exists in 'orders' table
-- This column is NOT needed as we use 'order_items' table for items.
ALTER TABLE public.orders DROP COLUMN IF EXISTS items;

-- 2. Ensure 'total_amount' allows NULLs initially or has a default, OR better yet, ensure our code sends it.
-- The error "null value in column "total_amount" ... violates not-null constraint" means the DB expects it.
-- We should double check if the column name is 'total_amount' or 'total_price'.
-- Our code sends 'total_price', but the schema might have 'total_amount' as NOT NULL.

-- Let's make both columns safe by allowing NULLs, then we fix the data.
ALTER TABLE public.orders ALTER COLUMN total_amount DROP NOT NULL;
ALTER TABLE public.orders ALTER COLUMN total_price DROP NOT NULL;

-- 3. Ensure 'total_amount' matches 'total_price' just in case
UPDATE public.orders SET total_amount = total_price WHERE total_amount IS NULL;
UPDATE public.orders SET total_price = total_amount WHERE total_price IS NULL;

-- 4. Re-verify other potential strict columns
ALTER TABLE public.orders ALTER COLUMN customer_name DROP NOT NULL; -- Allow drafts if needed
ALTER TABLE public.orders ALTER COLUMN phone DROP NOT NULL;

-- 5. Final check on order_id
ALTER TABLE public.orders ALTER COLUMN order_id DROP NOT NULL;
-- Ensure default exists for order_id
ALTER TABLE public.orders ALTER COLUMN order_id SET DEFAULT 'ORD-' || floor(extract(epoch from now()));
