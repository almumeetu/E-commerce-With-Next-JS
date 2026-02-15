# Supabase Storage Setup Guide

To fix the image upload issue, you need to create a **Storage Bucket** in your Supabase project and configure the correct permissions.

### Step 1: Create the Storage Bucket

1.  Go to your **Supabase Dashboard**.
2.  Click on **Storage** (the folder icon) in the left sidebar.
3.  Click on **"New Bucket"**.
4.  Enter the name: `products` (This MUST match the code).
5.  **IMPORTANT:** Toggle **"Public Bucket"** to ON.
6.  Click **"Save"** or **"Create Bucket"**.

### Step 2: Configure Storage Policies (RLS)

By default, even public buckets might require policies for *uploads*. You need to allow anyone (or at least authenticated users) to upload files.

1.  In the **Storage** page, click on the **Policies** tab (or "Configuration" > "Policies").
2.  Find the `products` bucket under "Storage Policies".
3.  Click **"New Policy"**.
4.  Choose **"For full customization"**.
5.  Enter a name, e.g., "Allow Public Access".
6.  For **Allowed operations**, check:
    *   `SELECT` (Read)
    *   `INSERT` (Upload)
    *   `UPDATE` (Update/Replace)
    *   `DELETE` (Remove)
7.  Click **"Review"** and then **"Save"**.

> **Pro Tip:** If you want to use SQL instead, run this in the **SQL Editor**:

```sql
-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to the bucket
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'products' );

create policy "Public Insert"
  on storage.objects for insert
  with check ( bucket_id = 'products' );

create policy "Public Update"
  on storage.objects for update
  using ( bucket_id = 'products' );

create policy "Public Delete"
  on storage.objects for delete
  using ( bucket_id = 'products' );
```

### Step 3: Verify Integration

1.  Go back to your Admin Panel (`/admin/products`).
2.  Click "New Product".
3.  Try uploading an image again.
4.  It should now work!

### Troubleshooting

*   **Error: "new row violates row-level security policy"**: This means the "INSERT" policy is missing.
*   **Images not showing**: Make sure the bucket is set to "Public".
