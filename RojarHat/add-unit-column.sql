-- Fix missing unit column in products table
-- Run this in Supabase SQL Editor

-- Add the missing unit column to the products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS unit text DEFAULT 'কেজি';

-- Add the missing isNew column to the products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS "isNew" boolean DEFAULT false;

-- Add the missing isPopular column to the products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS "isPopular" boolean DEFAULT false;

-- Update existing products to have a default unit
UPDATE public.products 
SET unit = 'কেজি' 
WHERE unit IS NULL;

-- Update existing products to have a default isNew value
UPDATE public.products 
SET "isNew" = false 
WHERE "isNew" IS NULL;

-- Update existing products to have a default isPopular value
UPDATE public.products 
SET "isPopular" = false 
WHERE "isPopular" IS NULL;

-- Verify the columns were added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name IN ('unit', 'isNew', 'isPopular');
