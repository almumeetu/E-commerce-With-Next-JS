import { createClient } from '@supabase/supabase-js';

// Use environment variables from any common prefix
const supabaseUrl =
	import.meta.env.VITE_SUPABASE_URL ||
	import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
	'https://sbhmnnxgvpffohooglvt.supabase.co';

const supabaseAnonKey =
	import.meta.env.VITE_SUPABASE_ANON_KEY ||
	import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wZWxjdnd5cWp2dHp1ZHFuZ25lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MDc2NTgsImV4cCI6MjA4NjQ4MzY1OH0.KqGE9MicpVes2OO7MSNTLR1xdSTbGoAuWJfY0WkaKco';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
