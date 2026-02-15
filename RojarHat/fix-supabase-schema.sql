-- Fix Supabase Schema Exposure Issue
-- Run this in Supabase SQL Editor

-- Step 1: Check current schemas
SELECT nspname FROM pg_namespace WHERE nspname IN ('public', 'api');

-- Step 2: Grant permissions on public schema
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

-- Step 3: Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;

-- Step 4: Verify your tables exist and are accessible
SELECT 
    schemaname, 
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Step 5: Test if you can select from orders table
SELECT COUNT(*) as order_count FROM public.orders;

-- Step 6: If above works, test the RPC function
SELECT place_order_with_stock_check(
    'Test Customer'::text,
    '01234567890'::text, 
    'Test Address'::text,
    100.00::numeric,
    '[{"product_id": "your-product-uuid-here", "quantity": 1, "price": 100}]'::jsonb
);

-- Step 7: If error persists, check PostgREST config
SHOW pgrst.db_schema;
