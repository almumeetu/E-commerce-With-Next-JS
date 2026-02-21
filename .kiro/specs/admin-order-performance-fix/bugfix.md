# Bugfix Requirements Document

## Introduction

This document addresses three critical issues in the Friends-Gallery e-commerce site that are impacting admin functionality and overall site performance:

1. **Admin Dashboard Loading Issue**: The admin dashboard experiences an infinite loading spinner due to fetching all orders and order items at once, blocking client-side rendering when data volume is large.

2. **Order Status Persistence Bug**: After checkout, the order status ("incomplete" or "processing") is not correctly saved to the database. The `databaseService.placeOrder` function doesn't properly accept or use the status parameter, resulting in all orders being saved with "pending" or default status.

3. **Site Performance Degradation**: The site suffers from poor image optimization, lack of caching strategy, missing database indexing, and no compression, leading to slow page loads and poor user experience.

These issues affect admin workflow efficiency, data integrity, and overall site performance across the platform.

## Bug Analysis

### Current Behavior (Defect)

#### 1. Admin Dashboard Loading

1.1 WHEN an admin accesses the admin dashboard THEN the system fetches all orders with all order_items data in a single client-side request

1.2 WHEN the order dataset is large (hundreds or thousands of orders) THEN the system displays an infinite loading spinner and blocks rendering

1.3 WHEN AdminOrders component mounts THEN the system loads the entire dataset without pagination or lazy loading

#### 2. Order Status Persistence

2.1 WHEN a user completes checkout with "processing" status THEN the system saves the order with "pending" status instead

2.2 WHEN a user abandons checkout (incomplete order) THEN the system saves the order with "pending" or default status instead of "incomplete"

2.3 WHEN `databaseService.placeOrder` is called with a status parameter THEN the system ignores the status parameter in the RPC call path

2.4 WHEN the fallback direct insert path is used THEN the system conditionally applies status but defaults to "pending" for "processing" requests

#### 3. Site Performance

3.1 WHEN images are loaded on any page THEN the system serves unoptimized images without proper sizing or format optimization

3.2 WHEN users navigate the site THEN the system makes redundant API calls without caching strategy

3.3 WHEN database queries execute THEN the system performs table scans without proper indexes on frequently queried columns

3.4 WHEN static assets are served THEN the system delivers uncompressed files increasing bandwidth usage and load times

### Expected Behavior (Correct)

#### 1. Admin Dashboard Loading

2.1 WHEN an admin accesses the admin dashboard THEN the system SHALL fetch orders with server-side pagination (20 orders per page)

2.2 WHEN the order dataset is large THEN the system SHALL load and render the first page quickly without blocking

2.3 WHEN AdminOrders component mounts THEN the system SHALL use an API route with pagination support to fetch data incrementally

2.4 WHEN admins navigate between pages THEN the system SHALL cache previously loaded pages using SWR

#### 2. Order Status Persistence

2.5 WHEN a user completes checkout with "processing" status THEN the system SHALL save the order with "processing" status in the database

2.6 WHEN a user abandons checkout (incomplete order) THEN the system SHALL save the order with "incomplete" status in the database

2.7 WHEN `databaseService.placeOrder` is called with a status parameter THEN the system SHALL accept and use the status parameter for both RPC and direct insert paths

2.8 WHEN the order is created THEN the system SHALL persist the exact status value provided by the caller

#### 3. Site Performance

2.9 WHEN images are loaded on any page THEN the system SHALL serve optimized images using Next.js Image component with proper sizing and modern formats (WebP/AVIF)

2.10 WHEN users navigate the site THEN the system SHALL implement SWR caching for API responses with appropriate revalidation strategies

2.11 WHEN database queries execute THEN the system SHALL use indexes on frequently queried columns (orders.created_at, orders.status, orders.customer_id, products.category_id)

2.12 WHEN static assets are served THEN the system SHALL enable gzip/brotli compression on Vercel deployment

### Unchanged Behavior (Regression Prevention)

#### 1. Admin Dashboard Functionality

3.1 WHEN admins search for orders by name, phone, or order ID THEN the system SHALL CONTINUE TO filter results correctly

3.2 WHEN admins filter orders by status or date THEN the system SHALL CONTINUE TO apply filters accurately

3.3 WHEN admins view order details THEN the system SHALL CONTINUE TO display complete order information including items, customer details, and status

3.4 WHEN admins update order status THEN the system SHALL CONTINUE TO persist status changes correctly

3.5 WHEN admins export orders THEN the system SHALL CONTINUE TO generate CSV files with all filtered orders

#### 2. Order Creation Flow

3.6 WHEN users complete checkout with valid data THEN the system SHALL CONTINUE TO create orders with all items and customer information

3.7 WHEN stock check fails during order placement THEN the system SHALL CONTINUE TO use fallback direct insert

3.8 WHEN order items are created THEN the system SHALL CONTINUE TO link them correctly to the parent order

3.9 WHEN order totals are calculated THEN the system SHALL CONTINUE TO compute accurate prices including all items

#### 3. General Site Functionality

3.10 WHEN users browse products THEN the system SHALL CONTINUE TO display product listings correctly

3.11 WHEN users add items to cart THEN the system SHALL CONTINUE TO maintain cart state accurately

3.12 WHEN users navigate between pages THEN the system SHALL CONTINUE TO maintain application state

3.13 WHEN authentication is required THEN the system SHALL CONTINUE TO enforce access controls correctly

3.14 WHEN API routes are called THEN the system SHALL CONTINUE TO return correct data structures and error responses
