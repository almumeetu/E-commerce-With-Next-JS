-- Add image_url to categories table
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS image_url text;

-- Ensure storage bucket for category images exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('categories', 'categories', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public access to categories bucket (if not already set)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'categories');
CREATE POLICY "Authenticated Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'categories' AND auth.role() = 'authenticated');
