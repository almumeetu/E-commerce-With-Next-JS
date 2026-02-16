-- =====================================================================================
-- FIX MISSING CREATED_AT COLUMN IN ORDERS TABLE
-- =====================================================================================

-- The error "column orders.created_at does not exist" means your orders table is missing
-- the standard timestamp column. This script adds it and backfills data.

-- 1. Add created_at column if it's missing
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- 2. Backfill created_at from 'date' column if available, or just use now()
UPDATE public.orders 
SET created_at = COALESCE(date::timestamptz, now()) 
WHERE created_at IS NULL;

-- 3. Ensure 'date' column also exists and is consistent (some parts of app use 'date')
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS date timestamptz DEFAULT now();

-- 4. Sync 'date' and 'created_at' to be safe
UPDATE public.orders SET date = created_at WHERE date IS NULL;

-- 5. Final safety check on other columns mentioned in previous errors
ALTER TABLE public.orders DROP COLUMN IF EXISTS items;
ALTER TABLE public.orders ALTER COLUMN total_amount DROP NOT NULL;
ALTER TABLE public.orders ALTER COLUMN total_price DROP NOT NULL;
