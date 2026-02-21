# Implementation Plan

- [~] 1. Write bug condition exploration tests
  - **Property 1: Fault Condition** - Admin Dashboard Loading, Order Status Persistence, and Site Performance
  - **CRITICAL**: These tests MUST FAIL on unfixed code - failure confirms the bugs exist
  - **DO NOT attempt to fix the tests or the code when they fail**
  - **NOTE**: These tests encode the expected behavior - they will validate the fixes when they pass after implementation
  - **GOAL**: Surface counterexamples that demonstrate the three bugs exist
  - **Scoped PBT Approach**: Scope properties to concrete failing cases for reproducibility

  - [ ] 1.1 Bug 1: Admin Dashboard Loading Test
    - Seed test database with 500 orders
    - Access `/admin/orders` and measure load time
    - Monitor network request to confirm all orders fetched in single request
    - Test assertions: page should load within 2 seconds, display 20 orders per page, show pagination controls
    - Run test on UNFIXED code
    - **EXPECTED OUTCOME**: Test FAILS (infinite loading or very slow load confirms bug)
    - Document counterexamples: loading spinner behavior, network payload size, memory usage
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ] 1.2 Bug 2: Order Status Persistence Test
    - Create test order with `status: "processing"` using `placeOrder` function
    - Create test order with `status: "incomplete"` using `placeOrder` function
    - Query database to verify persisted status values
    - Test assertions: database status should match provided status parameter
    - Run test on UNFIXED code
    - **EXPECTED OUTCOME**: Test FAILS (status shows "pending" instead of provided value)
    - Document counterexamples: actual vs expected status values, RPC vs direct insert behavior
    - _Requirements: 2.5, 2.6, 2.7, 2.8_

  - [ ] 1.3 Bug 3: Site Performance Test
    - Load product page and inspect image formats, sizes, and optimization
    - Navigate between pages and count redundant API calls
    - Run EXPLAIN ANALYZE on order queries to check for table scans
    - Check response headers for compression (gzip/brotli)
    - Measure time to interactive on product pages
    - Test assertions: images should be WebP/AVIF, API calls should be cached, queries should use indexes, assets should be compressed
    - Run test on UNFIXED code
    - **EXPECTED OUTCOME**: Test FAILS (unoptimized images, no caching, table scans, no compression)
    - Document counterexamples: image formats, API call counts, query plans, response headers
    - _Requirements: 2.9, 2.10, 2.11, 2.12_

- [~] 2. Write preservation property tests (BEFORE implementing fixes)
  - **Property 2: Preservation** - Admin Functionality, Order Creation Flow, and General Site Functionality
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (confirms baseline behavior to preserve)

  - [ ] 2.1 Admin Functionality Preservation Tests
    - Observe: Admin search by name, phone, order ID returns filtered results on unfixed code
    - Observe: Admin filter by status, date applies filters correctly on unfixed code
    - Observe: Admin order details view displays complete information on unfixed code
    - Observe: Admin order status updates persist correctly on unfixed code
    - Observe: Admin CSV export generates files with all filtered orders on unfixed code
    - Write property-based tests: for all admin operations (search, filter, details, status update, export), results match observed behavior
    - Verify tests pass on UNFIXED code
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 2.2 Order Creation Flow Preservation Tests
    - Observe: Order creation without status parameter defaults to "pending" on unfixed code
    - Observe: Stock check failures use fallback direct insert on unfixed code
    - Observe: Order items link correctly to parent orders on unfixed code
    - Observe: Order totals compute accurate prices on unfixed code
    - Write property-based tests: for all order creations without explicit status, behavior matches observed patterns
    - Verify tests pass on UNFIXED code
    - _Requirements: 3.6, 3.7, 3.8, 3.9_

  - [ ] 2.3 General Site Functionality Preservation Tests
    - Observe: Product browsing, filtering, and search work correctly on unfixed code
    - Observe: Cart management (add, remove, update) functions correctly on unfixed code
    - Observe: Navigation between pages works correctly on unfixed code
    - Observe: Authentication and authorization work correctly on unfixed code
    - Observe: API routes return correct data structures and error responses on unfixed code
    - Write property-based tests: for all general site interactions, behavior matches observed patterns
    - Verify tests pass on UNFIXED code
    - _Requirements: 3.10, 3.11, 3.12, 3.13, 3.14_

- [x] 3. Fix for Admin Dashboard Loading (Bug 1)

  - [x] 3.1 Convert AdminOrders to Server Component
    - Remove 'use client' directive from `app/admin/orders/page.tsx`
    - Convert to async function component
    - Fetch orders server-side using Supabase server client
    - Accept searchParams for pagination (page number)
    - _Bug_Condition: isBugCondition where scenario="admin_dashboard_load" AND orderCount > 100 AND fetchMethod="client_side_all_at_once"_
    - _Expected_Behavior: Paginated dashboard loads within 2 seconds, displays 20 orders per page, provides pagination controls_
    - _Preservation: Admin search, filter, order details, status updates, CSV export must remain unchanged_
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 3.2 Implement pagination logic in AdminOrders
    - Define PAGE_SIZE constant (20 orders per page)
    - Calculate offset: `(page - 1) * PAGE_SIZE`
    - Use `.range(offset, offset + PAGE_SIZE - 1)` in Supabase query
    - Fetch total count for pagination controls
    - Return paginated results with metadata
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.3 Add pagination UI controls
    - Display current page and total pages
    - Add Previous/Next buttons with proper disabled states
    - Add page number links for direct navigation
    - Ensure pagination controls are accessible
    - _Requirements: 2.3, 2.4_

  - [x] 3.4 Update API route for pagination support (if needed)
    - Check if `app/api/orders/route.ts` exists and is used
    - If yes: Add page and limit query parameters
    - Parse `?page=1&limit=20` from request URL
    - Apply pagination to database query
    - Return paginated results with metadata (total, page, totalPages)
    - _Requirements: 2.1, 2.2_

  - [x] 3.5 Verify Bug 1 exploration test now passes
    - **Property 1: Expected Behavior** - Admin Dashboard Pagination
    - **IMPORTANT**: Re-run the SAME test from task 1.1 - do NOT write a new test
    - The test from task 1.1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run admin dashboard loading test from step 1.1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - Verify: page loads within 2 seconds, displays 20 orders, shows pagination controls
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 3.6 Verify admin functionality preservation tests still pass
    - **Property 2: Preservation** - Admin Functionality
    - **IMPORTANT**: Re-run the SAME tests from task 2.1 - do NOT write new tests
    - Run admin functionality preservation tests from step 2.1
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Verify: search, filter, order details, status updates, CSV export work as before
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 4. Fix for Order Status Persistence (Bug 2)

  - [x] 4.1 Update Supabase RPC function to accept status parameter
    - Create migration file: `supabase/migrations/[timestamp]_update_place_order_rpc.sql`
    - Modify `place_order_with_stock_check` function signature to add `p_status text DEFAULT 'pending'`
    - Update INSERT statement to use `p_status` instead of hardcoded 'pending'
    - Test migration on local Supabase instance
    - _Bug_Condition: isBugCondition where scenario="order_creation" AND statusParam IN ["processing", "incomplete"] AND persistedStatus != statusParam_
    - _Expected_Behavior: Order status persists correctly in both RPC and direct insert paths_
    - _Preservation: Order creation without status parameter defaults to "pending", stock check fallback works correctly_
    - _Requirements: 2.5, 2.6, 2.7, 2.8, 3.6, 3.7, 3.8, 3.9_

  - [x] 4.2 Update placeOrder function to pass status to RPC
    - Open `lib/databaseService.ts`
    - Locate `placeOrder` function
    - Update RPC call to include status parameter: `.rpc('place_order_with_stock_check', { ..., status: orderData.status || 'pending' })`
    - Ensure status parameter is properly typed in OrderData type
    - _Requirements: 2.5, 2.6, 2.7_

  - [x] 4.3 Fix direct insert path to use status parameter
    - Locate fallback direct insert logic in `placeOrder` function
    - Remove any conditional logic that overrides status
    - Use: `status: orderData.status || 'pending'` consistently
    - Ensure no hardcoded 'pending' values when status is provided
    - _Requirements: 2.6, 2.8_

  - [x] 4.4 Verify Bug 2 exploration test now passes
    - **Property 1: Expected Behavior** - Order Status Persistence
    - **IMPORTANT**: Re-run the SAME test from task 1.2 - do NOT write a new test
    - The test from task 1.2 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run order status persistence test from step 1.2
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - Verify: orders with status="processing" and status="incomplete" persist correctly
    - _Requirements: 2.5, 2.6, 2.7, 2.8_

  - [x] 4.5 Verify order creation flow preservation tests still pass
    - **Property 2: Preservation** - Order Creation Flow
    - **IMPORTANT**: Re-run the SAME tests from task 2.2 - do NOT write new tests
    - Run order creation flow preservation tests from step 2.2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Verify: default "pending" status, stock check fallback, order item linking, total calculations work as before
    - _Requirements: 3.6, 3.7, 3.8, 3.9_

- [-] 5. Fix for Site Performance (Bug 3)

  - [x] 5.1 Replace img tags with Next.js Image component
    - Identify all components using `<img>` tags (ProductCard, product detail pages, etc.)
    - Import Next.js Image: `import Image from 'next/image'`
    - Replace `<img>` with `<Image>` component
    - Add required width and height props
    - Add sizes prop for responsive images
    - Enable lazy loading (default behavior)
    - _Bug_Condition: isBugCondition where scenario="page_load" AND imagesUnoptimized=true_
    - _Expected_Behavior: Images served as WebP/AVIF, responsive sizing, lazy loading_
    - _Preservation: Product browsing, cart management, navigation must remain unchanged_
    - _Requirements: 2.9, 3.10, 3.11, 3.12_

  - [x] 5.2 Implement SWR caching for API calls
    - Install SWR: `npm install swr`
    - Identify components making API calls without caching
    - Import useSWR: `import useSWR from 'swr'`
    - Replace fetch calls with useSWR: `const { data, error } = useSWR('/api/orders', fetcher, { revalidateOnFocus: false })`
    - Configure appropriate revalidation strategies per endpoint
    - Test caching behavior across navigation
    - _Requirements: 2.10, 3.13_

  - [x] 5.3 Create database indexes for performance
    - Create migration file: `supabase/migrations/[timestamp]_add_performance_indexes.sql`
    - Add index on orders.created_at: `CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);`
    - Add index on orders.status: `CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);`
    - Add index on orders.customer_id: `CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);`
    - Add index on products.category_id: `CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);`
    - Test migration on local Supabase instance
    - Verify indexes are used with EXPLAIN ANALYZE
    - _Requirements: 2.11_

  - [x] 5.4 Enable compression in Next.js config
    - Open or create `next.config.js`
    - Add compress configuration: `compress: true`
    - Configure image optimization: `images: { formats: ['image/avif', 'image/webp'], deviceSizes: [...] }`
    - Test compression locally
    - _Requirements: 2.12_

  - [x] 5.5 Configure compression for deployment
    - Create `vercel.json` if deploying to Vercel (or equivalent for Hostinger)
    - Add compression headers configuration
    - Ensure gzip/brotli enabled for static assets
    - Test in production environment
    - _Requirements: 2.12_

  - [ ] 5.6 Verify Bug 3 exploration test now passes
    - **Property 1: Expected Behavior** - Site Performance Optimization
    - **IMPORTANT**: Re-run the SAME test from task 1.3 - do NOT write a new test
    - The test from task 1.3 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run site performance test from step 1.3
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - Verify: images optimized, API calls cached, queries use indexes, assets compressed
    - _Requirements: 2.9, 2.10, 2.11, 2.12_

  - [ ] 5.7 Verify general site functionality preservation tests still pass
    - **Property 2: Preservation** - General Site Functionality
    - **IMPORTANT**: Re-run the SAME tests from task 2.3 - do NOT write new tests
    - Run general site functionality preservation tests from step 2.3
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Verify: product browsing, cart management, navigation, authentication, API routes work as before
    - _Requirements: 3.10, 3.11, 3.12, 3.13, 3.14_

- [~] 6. Integration testing and deployment preparation

  - [ ] 6.1 Run full admin workflow integration test
    - Test sequence: login → view orders (paginated) → search → filter → view details → update status → export CSV
    - Verify all steps work correctly with fixes applied
    - Verify pagination works throughout workflow
    - Verify performance improvements visible
    - _Requirements: All admin-related requirements_

  - [ ] 6.2 Run full checkout flow integration test
    - Test sequence: browse products → view details → add to cart → checkout → verify order created
    - Verify order status persists correctly if provided
    - Verify admin can see order in paginated dashboard
    - Verify performance improvements visible
    - _Requirements: All order creation requirements_

  - [ ] 6.3 Run performance benchmarks
    - Measure admin dashboard load time with 1000 orders (should be < 2 seconds)
    - Measure product page load time (should be improved by 50%+)
    - Verify image optimization (WebP/AVIF formats)
    - Verify API call caching (no redundant requests)
    - Verify database query performance (indexes used)
    - Verify compression enabled (check response headers)
    - _Requirements: All performance requirements_

  - [ ] 6.4 Apply database migrations
    - Run RPC update migration on staging/production Supabase
    - Run performance indexes migration on staging/production Supabase
    - Verify migrations applied successfully
    - Verify existing data intact
    - Test new functionality in staging environment
    - _Requirements: 2.5, 2.6, 2.7, 2.8, 2.11_

  - [ ] 6.5 Deploy to production
    - Deploy application to Hostinger (or target environment)
    - Verify compression enabled in production
    - Verify image optimization working in production
    - Verify caching working in production
    - Monitor performance metrics
    - _Requirements: All requirements_

- [x] 7. Checkpoint - Ensure all tests pass
  - Verify all exploration tests pass (Bug 1, 2, 3 fixed)
  - Verify all preservation tests pass (no regressions)
  - Verify all integration tests pass
  - Verify performance benchmarks meet targets
  - Ask user if questions arise or issues found
