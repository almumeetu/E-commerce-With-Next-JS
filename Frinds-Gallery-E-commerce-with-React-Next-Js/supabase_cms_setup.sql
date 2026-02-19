-- Create the site_settings table for dynamic content management
CREATE TABLE IF NOT EXISTS public.site_settings (
    key text PRIMARY KEY,
    value jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone,
    
    CONSTRAINT site_settings_key_check CHECK (char_length(key) < 255)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON public.site_settings
    FOR SELECT
    USING (true);

-- Create policy to allow authenticated users (admin) to insert/update
CREATE POLICY "Allow authenticated update access" ON public.site_settings
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Create an index on the key for faster lookups (though PK is indexed by default)
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON public.site_settings(key);

-- Add comment
COMMENT ON TABLE public.site_settings IS 'Stores dynamic site configuration (hero slides, features, deals, testimonials)';
