# Friends Gallery (ফ্রেন্ডস গ্যালারি) - Project Documentation & Developer Guide

## 🌟 Overview
Friends Gallery is a premium E-commerce platform built for the Ramadan season. It has been migrated from a static Vite application to a high-performance **Next.js 14 (App Router)** site with a **Supabase** backend.

---

## 🏗 Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Database/Auth**: Supabase (PostgreSQL + Auth)
- **Library**: `@supabase/ssr` (Latest standard for Next.js)
- **Styling**: Tailwind CSS (Custom Theme)
- **Icons**: Lucide React
- **Slider**: Swiper.js

---

## 🛠 Recent Core Updates (Migration Notes)

### 1. Framework Migration (Vite -> Next.js 14)
The project was completely moved from a Client-Side Rendered (CSR) Vite app to a **Server-Side Rendered (SSR/ISR)** structure. 
- **Benefit**: Faster SEO, better performance, and secure backend operations via Server Actions.
- **Action**: All original pages like `Shop.tsx`, `Home.tsx`, and `ProductDetails.tsx` have been split into **Server Components** (for data fetching) and **Client Components** (for interactivity).

### 2. Supabase & Auth Setup
- **Server/Client Utils**: Located in `src/lib/supabase/`. We use `createServerClient` for Server Components and `createBrowserClient` for interactive hooks.
- **Proxy Security**: `proxy.ts` handles active session checks. It protects the `/admin` route—unauthenticated users are automatically redirected to `/login`.

### 3. Server Actions (Backend Replacement)
We replaced the old `databaseService` with **Next.js Server Actions** (`src/lib/actions/`):
- **`orders.ts`**: Handles the `placeOrder` logic. It calls a custom PostgreSQL function (`place_order_with_stock_check`) to ensure stock reduction is atomic and secure.
- **`products.ts`**: Handles Admin CRUD operations (Add/Edit/Delete).

### 4. POS-Style Stock Management
A critical update for this project is the **Atomic Transaction logic**. In a busy market, multiple people might buy the same item at once.
- **Developer Note**: Never update stock via a simple `UPDATE products SET stock = stock - 1`. Always use the RPC function documented in `SUPABASE_GUIDE.md` to prevent "Double Spending" or negative stock.

---

## 📂 Project Structure Guide

```text
/app
  ├── admin/            # High-level Admin Dashboard (Orders, Products)
  ├── cart/             # Shopping Cart UI
  ├── checkout/         # Secure Order Submission
  ├── login/            # Admin Authentication Page
  ├── product/[id]/     # Dynamic Product Details (Server Fetched)
  ├── shop/             # Product Listing with Category Filters
  └── test-db/          # Connection testing page (Debug only)
/components
  ├── ProductCard.tsx   # Premium product display with hover effects
  ├── NavbarWrapper.tsx # Manages MiniCart state on client-side
  └── AdminOrders.tsx   # POS-style order listing for admins
/src/lib/actions        # The "Backend" core (Server-side logic)
/src/context            # Cart & Wishlist Global State
```

---

## 📝 Note for the Next Developer

Welcome to Friends Gallery! Here are a few things to keep in mind:

1.  **Hydration Awareness**: Since we use `localStorage` for the cart, always use an `isLoaded` or `useEffect` check in `CartContext.tsx` to prevent hydration mismatch errors between server and client.
2.  **Server Components First**: Always try to fetch data at the page level (Server Component) and pass it down as props. Only use `'use client'` where event listeners (onClick, onChange) or hooks are required.
3.  **Supabase RLS**: Ensure Row Level Security is ON in the Supabase Dashboard. Public should only have `SELECT` on products.
4.  **Revalidation**: When adding or updating products via the Admin panel, we use `revalidatePath('/shop')` to clear the Next.js cache so the user sees the new data immediately.
5.  **Environment Keys**: Use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for client-side, but for sensitive tasks, always use Server Actions.

---
© 2026 Friends Gallery Team | Optimized for Performance & Scalability.
