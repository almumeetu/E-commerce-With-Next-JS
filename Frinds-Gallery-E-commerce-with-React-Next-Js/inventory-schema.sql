-- Advanced Inventory Management Schema
-- Run this in Supabase SQL Editor

-- Create inventory transactions table
CREATE TABLE IF NOT EXISTS public.inventory_transactions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  transaction_type text CHECK (transaction_type IN ('purchase', 'sale', 'adjustment', 'return', 'damage')) NOT NULL,
  quantity integer NOT NULL,
  unit_cost numeric(12, 2),
  total_cost numeric(12, 2),
  reference_id text, -- Order ID or Purchase Order ID
  notes text,
  created_by text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create purchase orders table
CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  supplier_name text NOT NULL,
  supplier_phone text,
  supplier_address text,
  total_amount numeric(12, 2) NOT NULL,
  status text CHECK (status IN ('pending', 'received', 'partial', 'cancelled')) DEFAULT 'pending',
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  received_at timestamp with time zone
);

-- Create purchase order items table
CREATE TABLE IF NOT EXISTS public.purchase_order_items (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  purchase_order_id uuid REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  quantity integer NOT NULL,
  unit_cost numeric(12, 2) NOT NULL,
  total_cost numeric(12, 2) NOT NULL,
  received_quantity integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add cost tracking to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS cost_price numeric(12, 2),
ADD COLUMN IF NOT EXISTS supplier_name text,
ADD COLUMN IF NOT EXISTS sku text UNIQUE,
ADD COLUMN IF NOT EXISTS barcode text UNIQUE,
ADD COLUMN IF NOT EXISTS min_stock_level integer DEFAULT 10,
ADD COLUMN IF NOT EXISTS max_stock_level integer DEFAULT 100,
ADD COLUMN IF NOT EXISTS reorder_point integer DEFAULT 15;

-- Create profit/loss tracking table
CREATE TABLE IF NOT EXISTS public.profit_loss (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  quantity integer NOT NULL,
  sale_price numeric(12, 2) NOT NULL,
  cost_price numeric(12, 2) NOT NULL,
  profit_amount numeric(12, 2) GENERATED ALWAYS AS ((sale_price - cost_price) * quantity) STORED,
  profit_percentage numeric(5, 2) GENERATED ALWAYS AS (((sale_price - cost_price) / cost_price) * 100) STORED,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create stock alerts table
CREATE TABLE IF NOT EXISTS public.stock_alerts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  alert_type text CHECK (alert_type IN ('low_stock', 'out_of_stock', 'overstock')) NOT NULL,
  current_stock integer NOT NULL,
  threshold_level integer,
  message text,
  is_resolved boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  resolved_at timestamp with time zone
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_product_id ON public.inventory_transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_created_at ON public.inventory_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON public.purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_profit_loss_order_id ON public.profit_loss(order_id);
CREATE INDEX IF NOT EXISTS idx_stock_alerts_product_id ON public.stock_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_alerts_resolved ON public.stock_alerts(is_resolved);

-- Enable RLS (Row Level Security)
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profit_loss ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own inventory transactions" ON public.inventory_transactions
  FOR SELECT USING (true);

CREATE POLICY "Users can insert inventory transactions" ON public.inventory_transactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own inventory transactions" ON public.inventory_transactions
  FOR UPDATE USING (true);

CREATE POLICY "Users can view purchase orders" ON public.purchase_orders
  FOR SELECT USING (true);

CREATE POLICY "Users can manage purchase orders" ON public.purchase_orders
  FOR ALL USING (true);

CREATE POLICY "Users can view purchase order items" ON public.purchase_order_items
  FOR SELECT USING (true);

CREATE POLICY "Users can manage purchase order items" ON public.purchase_order_items
  FOR ALL USING (true);

CREATE POLICY "Users can view profit loss data" ON public.profit_loss
  FOR SELECT USING (true);

CREATE POLICY "Users can manage profit loss data" ON public.profit_loss
  FOR ALL USING (true);

CREATE POLICY "Users can view stock alerts" ON public.stock_alerts
  FOR SELECT USING (true);

CREATE POLICY "Users can manage stock alerts" ON public.stock_alerts
  FOR ALL USING (true);

-- Grant permissions
GRANT ALL ON public.inventory_transactions TO anon, authenticated, service_role;
GRANT ALL ON public.purchase_orders TO anon, authenticated, service_role;
GRANT ALL ON public.purchase_order_items TO anon, authenticated, service_role;
GRANT ALL ON public.profit_loss TO anon, authenticated, service_role;
GRANT ALL ON public.stock_alerts TO anon, authenticated, service_role;
