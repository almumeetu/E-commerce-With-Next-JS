
-- Run this in your Supabase SQL Editor to add the product
INSERT INTO public.products (name, category, price, unit, stock, image_url, description, "isPopular", "isNew", status)
VALUES (
  'প্রিমিয়াম Quality Dress',
  'islamic',
  5000,
  'পিস',
  50,
  'https://images.unsplash.com/photo-1594580393963-71867c40d04c?q=80&w=600&auto=format&fit=crop',
  'good',
  true,
  true,
  'active'
);
