-- Migration: Update place_order_with_stock_check RPC to accept status parameter
-- This fixes Bug 2: Order Status Persistence
-- The RPC function now accepts a status parameter and uses it when creating orders

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS place_order_with_stock_check(text, text, text, numeric, jsonb);

-- Create or replace the RPC function with status parameter
CREATE OR REPLACE FUNCTION place_order_with_stock_check(
    p_customer_name text,
    p_phone text,
    p_address text,
    p_total_price numeric,
    p_items jsonb,
    p_status text DEFAULT 'pending'
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
    v_order_id uuid;
    v_item jsonb;
    v_product_id uuid;
    v_quantity integer;
    v_price numeric;
    v_current_stock integer;
BEGIN
    -- Start transaction (implicit in function)
    
    -- Check stock for all items first
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (v_item->>'product_id')::uuid;
        v_quantity := (v_item->>'quantity')::integer;
        
        -- Get current stock
        SELECT stock INTO v_current_stock
        FROM products
        WHERE id = v_product_id;
        
        -- Check if product exists and has enough stock
        IF v_current_stock IS NULL THEN
            RAISE EXCEPTION 'Product % not found', v_product_id;
        END IF;
        
        IF v_current_stock < v_quantity THEN
            RAISE EXCEPTION 'Insufficient stock for product %. Available: %, Requested: %', 
                v_product_id, v_current_stock, v_quantity;
        END IF;
    END LOOP;
    
    -- All stock checks passed, create the order
    INSERT INTO orders (
        customer_name,
        phone,
        address,
        shipping_address,
        total_price,
        total_amount,
        status,
        date,
        created_at
    )
    VALUES (
        p_customer_name,
        p_phone,
        p_address,
        p_address,
        p_total_price,
        p_total_price,
        p_status,  -- Use the provided status parameter
        NOW(),
        NOW()
    )
    RETURNING id INTO v_order_id;
    
    -- Insert order items and update stock
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (v_item->>'product_id')::uuid;
        v_quantity := (v_item->>'quantity')::integer;
        v_price := (v_item->>'price')::numeric;
        
        -- Insert order item
        INSERT INTO order_items (
            order_id,
            product_id,
            quantity,
            price
        )
        VALUES (
            v_order_id,
            v_product_id,
            v_quantity,
            v_price
        );
        
        -- Update product stock
        UPDATE products
        SET stock = stock - v_quantity
        WHERE id = v_product_id;
    END LOOP;
    
    RETURN v_order_id;
END;
$$;

-- Add comment explaining the function
COMMENT ON FUNCTION place_order_with_stock_check IS 
    'Creates an order with stock validation. Accepts status parameter (processing, incomplete, pending). Validates stock availability before creating order and order items.';
