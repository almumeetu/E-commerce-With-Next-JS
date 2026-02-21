# Bug 2 Fix: Order Status Persistence - Deployment Notes

## Summary

Fixed the order status persistence bug where orders were being saved with "pending" status instead of the intended status ("processing" or "incomplete").

## Changes Made

### 1. Database Migration (MUST BE APPLIED FIRST)

**File**: `supabase/migrations/20250101000000_update_place_order_rpc.sql`

Created a new Supabase RPC function that accepts a status parameter:
- Function: `place_order_with_stock_check`
- New parameter: `p_status text DEFAULT 'pending'`
- The function now uses the provided status when creating orders
- Maintains backward compatibility with default 'pending' status

**Action Required**: Apply this migration to your Supabase database BEFORE deploying the code changes.

### 2. Code Changes

**File**: `src/services/databaseService.ts`

#### Change 1: RPC Call (Line ~238)
- **Before**: RPC call didn't include status parameter
- **After**: Added `p_status: status || 'pending'` to RPC call
- **Impact**: Orders created via RPC path now persist the correct status

#### Change 2: Fallback Direct Insert (Line ~268)
- **Before**: `status: status === 'processing' ? 'pending' : status`
- **After**: `status: status || 'pending'`
- **Impact**: Removed the bug where "processing" status was being converted to "pending" in the fallback path

## How the Fix Works

### Before the Fix:
1. User completes checkout with status="processing"
2. Code calls `placeOrder()` with status="processing"
3. RPC function ignores status parameter → saves as "pending"
4. OR fallback path converts "processing" to "pending"
5. Database shows status="pending" ❌

### After the Fix:
1. User completes checkout with status="processing"
2. Code calls `placeOrder()` with status="processing"
3. RPC function receives `p_status="processing"` → saves as "processing"
4. OR fallback path uses `status="processing"` directly
5. Database shows status="processing" ✅

## Deployment Steps for Hostinger

### Step 1: Apply Database Migration

Choose one of these methods:

**Option A: Supabase Dashboard (Easiest)**
1. Log into your Supabase project dashboard
2. Go to SQL Editor
3. Copy the contents of `supabase/migrations/20250101000000_update_place_order_rpc.sql`
4. Paste and execute
5. Verify success message

**Option B: Supabase CLI**
```bash
supabase db push
```

### Step 2: Deploy Code Changes

Deploy the updated application code to Hostinger as usual. The changes are in:
- `src/services/databaseService.ts`

### Step 3: Verify the Fix

After deployment, test order creation:

1. **Test Processing Status**:
   - Complete a checkout
   - Check the database: order status should be "processing"

2. **Test Incomplete Status**:
   - Create an incomplete order (if applicable)
   - Check the database: order status should be "incomplete"

3. **Test Default Behavior**:
   - Create an order without specifying status
   - Check the database: order status should be "pending" (default)

## Backward Compatibility

✅ **Fully backward compatible**:
- Orders created without status parameter still default to "pending"
- Existing orders are not affected
- The RPC function has a default parameter value
- No breaking changes to the API

## Files Modified

1. ✅ `src/services/databaseService.ts` - Updated placeOrder function
2. ✅ `supabase/migrations/20250101000000_update_place_order_rpc.sql` - New RPC function
3. ✅ `supabase/migrations/README.md` - Migration documentation

## Testing Checklist

- [ ] Migration applied successfully to production database
- [ ] Code deployed to Hostinger
- [ ] Test order with status="processing" persists correctly
- [ ] Test order with status="incomplete" persists correctly  
- [ ] Test order without status defaults to "pending"
- [ ] Verify no errors in application logs
- [ ] Verify admin dashboard shows correct order statuses

## Rollback Plan

If issues occur:

1. **Code rollback**: Revert to previous deployment
2. **Database rollback**: The old code will still work with the new RPC function (backward compatible)
3. If needed, you can drop and recreate the old RPC function without the status parameter

## Notes

- The fix handles both the RPC path and the direct insert fallback path
- The incomplete order path (Bengali: 'অসম্পূর্ণ') already had correct status handling
- No changes needed to the frontend or checkout flow
- This fix is critical for accurate order tracking and reporting
