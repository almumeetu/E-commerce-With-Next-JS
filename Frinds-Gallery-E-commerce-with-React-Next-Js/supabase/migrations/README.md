# Supabase Migrations

This directory contains SQL migration files for the Friends Gallery E-commerce database.

## How to Apply Migrations

### Option 1: Using Supabase CLI (Recommended)

If you have the Supabase CLI installed:

```bash
# Apply all pending migrations
supabase db push

# Or apply a specific migration
supabase db execute --file supabase/migrations/20250101000000_update_place_order_rpc.sql
```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of the migration file
4. Paste and execute the SQL

### Option 3: Direct Database Connection

If you have direct database access:

```bash
psql -h your-db-host -U postgres -d your-database -f supabase/migrations/20250101000000_update_place_order_rpc.sql
```

## Migration Files

### 20250101000000_update_place_order_rpc.sql

**Purpose**: Fixes Bug 2 - Order Status Persistence

**Changes**:
- Updates the `place_order_with_stock_check` RPC function to accept a `p_status` parameter
- The function now properly persists the order status (processing, incomplete, pending) instead of always defaulting to 'pending'
- Maintains backward compatibility with a default value of 'pending'

**Required for**: Hostinger deployment - this migration MUST be applied before deploying the updated application code.

## Important Notes

- Always backup your database before applying migrations
- Test migrations on a staging environment first
- The application code has been updated to pass the status parameter to this RPC function
- Without this migration, orders will continue to be saved with incorrect status values
