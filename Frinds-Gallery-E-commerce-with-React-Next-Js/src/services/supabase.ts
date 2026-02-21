import { createClient } from '@supabase/supabase-js';

// Use environment variables (no hardcoded fallbacks in production)
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  '';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'public-anon-key'
);

export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey && supabaseAnonKey !== 'public-anon-key';
};
