# 🚀 RojarHat Supabase Setup Guide (সম্পূর্ণ গাইড)

এই গাইড অনুসরণ করে আপনি ৫ মিনিটে Supabase সেটআপ শেষ করতে পারবেন।

---

## 📋 Step 1: Supabase Project তৈরি করুন

1. **Supabase-এ যান**: [https://supabase.com](https://supabase.com)
2. **Sign in** করুন (GitHub দিয়ে সাইন-ইন সবচেয়ে সহজ)
3. **"New Project"** বাটনে ক্লিক করুন
4. নিচের তথ্য দিন:
   - **Project Name**: `RojarHat` (বা যেকোনো নাম)
   - **Database Password**: একটা শক্তিশালী পাসওয়ার্ড দিন এবং **অবশ্যই সেভ করে রাখুন**
   - **Region**: `Southeast Asia (Singapore)` সিলেক্ট করুন
5. **"Create new project"** এ ক্লিক করুন
6. ২-৩ মিনিট অপেক্ষা করুন প্রজেক্ট সেটআপ হওয়ার জন্য

---

## 🔑 Step 2: API Keys কপি করুন

1. Supabase Dashboard-এ আপনার প্রজেক্টে ক্লিক করুন
2. বাম সাইডবারে **Settings (⚙️)** > **API** এ যান
3. নিচের দুইটা key কপি করুন:
   - **Project URL** (যেমন: `https://xxxxx.supabase.co`)
   - **anon public** key (long string)

---

## 📝 Step 3: Environment Variables যোগ করুন

1. আপনার প্রজেক্টের root folder-এ `.env.local` ফাইল খুলুন (না থাকলে তৈরি করুন)
2. নিচের লাইনগুলো পেস্ট করুন এবং আপনার keys বসান:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**গুরুত্বপূর্ণ**: `xxxxx` এবং `your_anon_key_here` এর জায়গায় আপনার আসল keys বসান!

---

## 🗄️ Step 4: Database Setup করুন (সবচেয়ে গুরুত্বপূর্ণ!)

1. Supabase Dashboard-এ **SQL Editor** এ যান (বাম সাইডবারে)
2. **"New query"** বাটনে ক্লিক করুন
3. আপনার প্রজেক্টে `supabase-setup.sql` ফাইলটি খুলুন
4. **পুরো ফাইলের সব SQL কপি** করুন
5. Supabase SQL Editor-এ **পেস্ট** করুন
6. **"Run"** বাটনে ক্লিক করুন (অথবা Ctrl+Enter / Cmd+Enter)
7. ✅ Success মেসেজ দেখলে সফল!

এই একটা SQL স্ক্রিপ্ট দিয়ে:
- ✅ সব টেবিল তৈরি হবে (products, categories, orders, order_items)
- ✅ সব ক্যাটাগরি যোগ হবে (৫টি)
- ✅ সব প্রোডাক্ট যোগ হবে (১৮টি)
- ✅ Stock management function সেটআপ হবে

---

## 🔄 Step 5: Dev Server Restart করুন

Terminal-এ যান এবং:

```bash
# Dev server বন্ধ করুন (Ctrl+C চাপুন)
# তারপর আবার চালু করুন:
pnpm dev
```

---

## ✅ Step 6: টেস্ট করুন

1. Browser-এ `http://localhost:3000` খুলুন
2. **Home page** এ products দেখা যাচ্ছে কিনা চেক করুন
3. **Shop page** (`/shop`) এ গিয়ে categories এবং products দেখুন
4. একটা product cart-এ add করে checkout করে দেখুন

---

## 🛠️ Troubleshooting (সমস্যা সমাধান)

### ❌ Products দেখা যাচ্ছে না?

**চেক করুন:**
1. `.env.local` ফাইলে সঠিক URL এবং key আছে কিনা
2. Dev server restart করেছেন কিনা
3. Supabase SQL Editor-এ query সফলভাবে রান হয়েছে কিনা

**Verify করুন:**
- Supabase Dashboard > **Table Editor** এ যান
- `products` table-এ ১৮টি row আছে কিনা দেখুন
- `categories` table-এ ৫টি row আছে কিনা দেখুন

### ❌ "relation already exists" error?

কোনো সমস্যা নেই! SQL script idempotent, তাই আবার রান করলে কোনো ক্ষতি হবে না।

---

## 📊 Database Tables Overview

### Tables তৈরি হবে:

1. **`products`** - সব পণ্যের তথ্য (১৮টি product)
2. **`categories`** - পণ্যের ক্যাটাগরি (৫টি category)
3. **`orders`** - কাস্টমার অর্ডার
4. **`order_items`** - অর্ডারের প্রতিটি আইটেম

---

## 🎯 Admin Panel এ Products/Orders দেখুন

1. **Products দেখতে**: Supabase Dashboard > **Table Editor** > `products`
2. **Orders দেখতে**: Supabase Dashboard > **Table Editor** > `orders`
3. **Manually Edit**: যেকোনো row-তে ক্লিক করে edit করা যায়

---

## 🔐 Security (Row Level Security) - Optional

বর্তমানে RLS disabled আছে, যার মানে:
- ✅ কেউই products/categories দেখতে পারবে (public access)
- ✅ যেকোনো user checkout করতে পারবে
- ⚠️ কেউই সরাসরি database modify করতে পারবে না (Supabase API দিয়ে)

যদি RLS enable করতে চান, `supabase-setup.sql` এর শেষে commented code আন-কমেন্ট করে রান করুন।

---

## 📈 পরবর্তী পদক্ষেপ

1. ✅ **Product Image Upload**: `public/images/` folder-এ আরও images যোগ করুন
2. ✅ **Add More Products**: Supabase Table Editor দিয়ে নতুন product manually add করুন
3. ✅ **Test Checkout**: Cart-এ product add করে order place করে দেখুন
4. ✅ **Admin Dashboard**: `/admin` route-এ orders manage করুন

---

## 💡 Tips

- **Local Fallback**: Supabase down থাকলেও site চলবে (constants.ts থেকে fallback data)
- **Stock Management**: Checkout করলে automatic stock কমে যাবে (atomic transaction)
- **Backup**: Supabase Dashboard > **Database** > **Backups** এ গিয়ে daily backup নিন

---

## 🆘 সহায়তা প্রয়োজন?

- Supabase Docs: [https://supabase.com/docs](https://supabase.com/docs)
- কোনো error দেখলে: Browser Console (F12) এ error message দেখুন
- Database check করুন: Supabase > **Table Editor**

---

## 📚 Reference: Table Structure

যদি manually table দেখতে চান বা customize করতে চান:

### 🏷️ Products Table
```sql
create table products (
  id uuid primary key,
  name text not null,
  description text,
  price numeric(12, 2) not null,
  stock integer not null default 0,
  category text,
  image_url text,
  isPopular boolean default false,
  isNew boolean default false,
  status text check (status in ('active', 'out_of_stock')) default 'active',
  created_at timestamp with time zone default now()
);
```

### 📦 Categories Table
```sql
create table categories (
  id text primary key,
  name text not null,
  icon text
);
```

### 📋 Orders Table
```sql
create table orders (
  id uuid primary key,
  customer_name text not null,
  phone text not null,
  address text not null,
  total_price numeric(12, 2) not null,
  payment_method text default 'COD',
  status text check (status in ('pending', 'processing', 'delivered', 'cancelled')),
  created_at timestamp with time zone default now()
);
```

### 🛒 Order Items Table
```sql
create table order_items (
  id uuid primary key,
  order_id uuid references orders(id),
  product_id uuid references products(id),
  quantity integer not null,
  price numeric(12, 2) not null
);
```

---

**সব তথ্য `supabase-setup.sql` ফাইলে আছে। সেটা একবার রান করলেই সব সেটআপ হয়ে যাবে!** 🎉
