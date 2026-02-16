# Friends Gallery Backend Setup Guide

This guide will help you finalize the migration of the Admin Dashboard and E-commerce backend from **RojarHat** to **Friends Gallery**, while keeping your existing products safe.

## ✅ What Has Been Done
1. **Admin Components**: We replaced the "Clone" components with fully functional Admin pages for Products, Orders, and Users.
2. **Backend Logic**: We connected these components to Supabase using a clean service layer/
3. **Smart Migration**: We prepared a database script that upgrades your database without deleting your existing products.

---

## 🚀 Step-by-Step Instructions

### Step 1: Update Your Database (Crucial!)
You need to run the SQL script we created to support the new features (like order tracking and analytics).

1.  Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Select your project: `Frinds-Gallery`.
3.  Go to the **SQL Editor** section (on the left sidebar).
4.  Click **New Query**.
5.  Copy the entire content of the file:
    `Frinds-Gallery-E-commerce-with-React-Next-Js/setup_rojarhat_backend.sql`
6.  Paste it into the SQL Editor and click **Run**.

> **Note:** This script is **safe**. It uses `ADD COLUMN IF NOT EXISTS`, so your existing products (like "Lehengga", "Hijab") will remain untouched. It simply adds new capabilities to them.

### Step 2: Verify Supabase Storage
The product image upload feature requires a storage bucket named `products`.

1.  In Supabase Dashboard, go to **Storage** via the left sidebar.
2.  Check if a bucket named `products` exists.
3.  If not, create a new public bucket named `products`.
4.  Ensure the policy allows public **SELECT** and authenticated **INSERT/UPDATE** (or just allow public uploads for simplicity during dev).

### Step 3: Check Environment Variables
Ensure your `.env.local` file in the `Frinds-Gallery` project root has the correct Supabase keys:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 4: Restart Development Server
To see the changes, stop your running server and start it again:

```bash
cd /Users/almumeetusaikat/GitHuB/E-commerce-With-Next-JS/Frinds-Gallery-E-commerce-with-React-Next-Js
npm run dev
```

---

## 🔍 How to Test
1.  **Go to Admin Dashboard**: Navigate to `/admin`.
2.  **Check Products**: You should see your old products ("Lehengga", "Hijab") listed there.
    *   *Note*: Some fields like "Stock" might be `0` or `null` initially. You can now use the **Edit** button to update their stock levels!
3.  **Place an Order**: Go to the shop, add items to the cart, and checkout.
4.  **Check Orders**: Go back to `/admin/orders` to see the new order appear in real-time with the correct status (Pending).

---

## 🛠 Features Now Available
*   **Real Inventory Management**: Stock decreases automatically when an order is placed.
*   **Order Workflow**: Move orders from Pending -> Processing -> Delivered.
*   **Analytics**: See total revenue and daily sales on the dashboard.
*   **Customer Insights**: See who your top customers are.

**You are all set! 🚀**
