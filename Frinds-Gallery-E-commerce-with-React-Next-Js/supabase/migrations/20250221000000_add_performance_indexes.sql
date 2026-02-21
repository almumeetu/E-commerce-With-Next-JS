-- Performance Indexes Migration
-- This migration adds indexes to frequently queried columns to improve query performance

-- Index on orders.created_at for sorting and date filtering
-- Used in admin dashboard for ordering by date
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Index on orders.status for filtering by order status
-- Used in admin dashboard for status filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Index on orders.customer_id for customer-related queries
-- Used for joining orders with customer data
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);

-- Index on products.category_id for category filtering
-- Used in shop page for filtering products by category
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- Composite index on orders for common query patterns
-- Combines status and created_at for efficient filtering and sorting
CREATE INDEX IF NOT EXISTS idx_orders_status_created_at ON orders(status, created_at DESC);

-- Index on order_items.order_id for joining with orders
-- Used when fetching order details with items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Index on order_items.product_id for product-related queries
-- Used for analytics and product performance tracking
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Index on products.stock for low stock alerts
-- Used in inventory management
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);

-- Index on products.name for search functionality
-- Using GIN index for full-text search capabilities
CREATE INDEX IF NOT EXISTS idx_products_name_search ON products USING gin(to_tsvector('english', name));

-- Index on orders customer fields for search
-- Helps with searching orders by customer name or phone
CREATE INDEX IF NOT EXISTS idx_orders_customer_name ON orders(customer_name);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);

-- Analyze tables to update statistics for query planner
ANALYZE orders;
ANALYZE order_items;
ANALYZE products;
ANALYZE categories;
