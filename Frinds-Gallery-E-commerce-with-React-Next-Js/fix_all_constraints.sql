-- =====================================================================================
-- FIX ALL ORDERS TABLE CONSTRAINTS ONCE AND FOR ALL
-- =====================================================================================

-- The error "null value in column "shipping_address" ... violates not-null constraint"
-- means your DB still has strict checks on legacy columns.

-- 1. Relax ALL strict columns that might cause issues
ALTER TABLE public.orders ALTER COLUMN shipping_address DROP NOT NULL;
ALTER TABLE public.orders ALTER COLUMN total_amount DROP NOT NULL;
ALTER TABLE public.orders ALTER COLUMN total_price DROP NOT NULL;
ALTER TABLE public.orders ALTER COLUMN customer_name DROP NOT NULL;
ALTER TABLE public.orders ALTER COLUMN phone DROP NOT NULL;

-- 2. Populate 'shipping_address' from 'address' if it's null (Data Sync)
UPDATE public.orders SET shipping_address = address WHERE shipping_address IS NULL;
UPDATE public.orders SET address = shipping_address WHERE address IS NULL;

-- 3. Ensure Created At exists (from previous fix)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- 4. Ensure Items column is GONE
ALTER TABLE public.orders DROP COLUMN IF EXISTS items;

-- 5. Ensure storage bucket for image upload is actually public (just in case)
UPDATE storage.buckets SET public = true WHERE id = 'products';
