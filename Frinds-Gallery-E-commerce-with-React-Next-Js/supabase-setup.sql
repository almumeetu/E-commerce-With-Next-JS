-- ============================================================
-- SUPABASE DATABASE SETUP
-- ============================================================
-- Run this SQL in your Supabase SQL Editor
-- Go to: https://gkvzcmhtsbhvydtdapxu.supabase.co/project/gkvzcmhtsbhvydtdapxu/sql
-- ============================================================

-- Create Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  stock INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  total_orders INTEGER DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  order_ids TEXT[] DEFAULT '{}'
);

-- Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_id UUID REFERENCES customers(id),
  items JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  shipping_address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'প্রক্রিয়াধীন',
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Product Reviews Table
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(date DESC);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (safe to run multiple times)
DROP POLICY IF EXISTS "Public can read products" ON products;
DROP POLICY IF EXISTS "Public can read reviews" ON product_reviews;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Users can read their orders" ON orders;
DROP POLICY IF EXISTS "Users can create reviews" ON product_reviews;
DROP POLICY IF EXISTS "Admins can do everything on products" ON products;
DROP POLICY IF EXISTS "Admins can do everything on orders" ON orders;
DROP POLICY IF EXISTS "Admins can do everything on customers" ON customers;

-- Create policies for public read access
CREATE POLICY "Public can read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public can read reviews" ON product_reviews FOR SELECT USING (true);

-- Create policies for authenticated users
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read their orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON product_reviews FOR INSERT WITH CHECK (true);

-- Admin policies (you'll need to set up admin role separately)
CREATE POLICY "Admins can do everything on products" ON products FOR ALL USING (true);
CREATE POLICY "Admins can do everything on orders" ON orders FOR ALL USING (true);
CREATE POLICY "Admins can do everything on customers" ON customers FOR ALL USING (true);

-- Insert your products (only if they don't exist)
INSERT INTO products (name, price, original_price, image_url, category, sku, stock, rating, review_count)
SELECT 'জিলবাব লং খিমার', 990, 1200, '/images/products/lehengga-1.webp', 'long-khimar', 'FG-LK-001', 15, 4.5, 65
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'FG-LK-001');

INSERT INTO products (name, price, original_price, image_url, category, sku, stock, rating, review_count)
SELECT 'প্রিমিয়াম জর্জেট হিজাব', 699, 999, '/images/products/lehengga-2.webp', 'hijab', 'FG-HJ-005', 25, 4.8, 120
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'FG-HJ-005');

INSERT INTO products (name, price, original_price, image_url, category, sku, stock, rating, review_count)
SELECT 'কমফোর্ট ফিট ফুল কভারেজ ব্রা', 750, NULL, '/images/products/lehengga-3.webp', 'innar-collection', 'FG-IN-012', 30, 4.2, 40
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'FG-IN-012');

INSERT INTO products (name, price, original_price, image_url, category, sku, stock, rating, review_count)
SELECT 'স্টাইলিশ কটন থ্রি-পিস', 2250, NULL, '/images/products/lehengga-4.webp', 'three-piece', 'FG-TP-020', 10, 4.9, 88
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'FG-TP-020');

INSERT INTO products (name, price, original_price, image_url, category, sku, stock, rating, review_count)
SELECT 'প্রিমিয়াম সফট হ্যান্ড গ্লাভস (কালো)', 150, 200, '/images/products/lehengga-5.webp', 'islamic-item', 'FG-IS-003', 50, 4.0, 32
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'FG-IS-003');

INSERT INTO products (name, price, original_price, image_url, category, sku, stock, rating, review_count)
SELECT 'আরবিয়ান চেরি লং খিমার', 1150, 1400, '/images/products/lehengga-6.webp', 'long-khimar', 'FG-LK-002', 12, 4.6, 75
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'FG-LK-002');

INSERT INTO products (name, price, original_price, image_url, category, sku, stock, rating, review_count)
SELECT 'ইন্দোনেশিয়ান প্রিমিয়াম হিজাব', 799, NULL, '/images/products/modern-dress.webp', 'hijab', 'FG-HJ-008', 20, 4.7, 95
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'FG-HJ-008');

INSERT INTO products (name, price, original_price, image_url, category, sku, stock, rating, review_count)
SELECT 'সিমলেস কমফোর্ট ব্রা', 850, NULL, '/images/products/modern-dress-2.webp', 'innar-collection', 'FG-IN-015', 0, 4.3, 50
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'FG-IN-015');

INSERT INTO products (name, price, original_price, image_url, category, sku, stock, rating, review_count)
SELECT 'ডিজিটাল প্রিন্ট কটন থ্রি-পিস', 2400, 2800, '/images/products/threepic-1.webp', 'three-piece', 'FG-TP-022', 8, 5.0, 110
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'FG-TP-022');

INSERT INTO products (name, price, original_price, image_url, category, sku, stock, rating, review_count)
SELECT 'ইসলামিক মোজা (কালো)', 90, 150, '/images/products/threepics-3.webp', 'islamic-item', 'FG-IS-004', 40, 3.9, 25
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'FG-IS-004');

INSERT INTO products (name, price, original_price, image_url, category, sku, stock, rating, review_count)
SELECT 'এক্সট্রা প্রোডাক্ট 1', 1000, NULL, '/images/products/thereepices-2.webp', 'three-piece', 'FG-EX-001', 5, 4.0, 10
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'FG-EX-001');

INSERT INTO products (name, price, original_price, image_url, category, sku, stock, rating, review_count)
SELECT 'এক্সট্রা প্রোডাক্ট 2', 1100, NULL, '/images/products/thereepices-4.webp', 'three-piece', 'FG-EX-002', 5, 4.0, 10
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'FG-EX-002');

INSERT INTO products (name, price, original_price, image_url, category, sku, stock, rating, review_count)
SELECT 'এক্সট্রা প্রোডাক্ট 3', 1200, NULL, '/images/products/thereepices-5.webp', 'three-piece', 'FG-EX-003', 5, 4.0, 10
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'FG-EX-003');

INSERT INTO products (name, price, original_price, image_url, category, sku, stock, rating, review_count)
SELECT 'এক্সট্রা প্রোডাক্ট 4', 1300, NULL, '/images/products/thereepics-4.webp', 'three-piece', 'FG-EX-004', 5, 4.0, 10
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'FG-EX-004');

-- Update existing products to use local images
UPDATE products SET image_url = '/images/products/lehengga-1.webp' WHERE sku = 'FG-LK-001';
UPDATE products SET image_url = '/images/products/lehengga-2.webp' WHERE sku = 'FG-HJ-005';
UPDATE products SET image_url = '/images/products/lehengga-3.webp' WHERE sku = 'FG-IN-012';
UPDATE products SET image_url = '/images/products/lehengga-4.webp' WHERE sku = 'FG-TP-020';
UPDATE products SET image_url = '/images/products/lehengga-5.webp' WHERE sku = 'FG-IS-003';
UPDATE products SET image_url = '/images/products/lehengga-6.webp' WHERE sku = 'FG-LK-002';
UPDATE products SET image_url = '/images/products/modern-dress.webp' WHERE sku = 'FG-HJ-008';
UPDATE products SET image_url = '/images/products/modern-dress-2.webp' WHERE sku = 'FG-IN-015';
UPDATE products SET image_url = '/images/products/threepic-1.webp' WHERE sku = 'FG-TP-022';
UPDATE products SET image_url = '/images/products/threepics-3.webp' WHERE sku = 'FG-IS-004';
UPDATE products SET image_url = '/images/products/thereepices-2.webp' WHERE sku = 'FG-EX-001';
UPDATE products SET image_url = '/images/products/thereepices-4.webp' WHERE sku = 'FG-EX-002';
UPDATE products SET image_url = '/images/products/thereepices-5.webp' WHERE sku = 'FG-EX-003';
UPDATE products SET image_url = '/images/products/thereepics-4.webp' WHERE sku = 'FG-EX-004';

-- Success message
SELECT 'Database setup complete! Found ' || COUNT(*) || ' products.' as message FROM products;
