import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient(useServiceRole = false) {
    const cookieStore = await cookies();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    const supabaseKey = (useServiceRole && supabaseServiceKey) ? supabaseServiceKey : supabaseAnonKey;

    if (!supabaseUrl || !supabaseKey) {
        console.error('⚠️ Supabase credentials not found in environment variables');
        throw new Error('Supabase not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local');
    }

    return createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                async get(name: string) {
                    const cookie = await cookieStore.get(name);
                    return cookie?.value;
                },
                async set(name: string, value: string, options: CookieOptions) {
                    try {
                        await cookieStore.set({ name, value, ...options });
                    } catch (error) {
                        // The `set` method was called from a Server Component.
                        // This can be ignored if you have proxy refreshing
                        // user sessions.
                    }
                },
                async remove(name: string, options: CookieOptions) {
                    try {
                        await cookieStore.set({ name, value: '', ...options });
                    } catch (error) {
                        // The `delete` method was called from a Server Component.
                        // This can be ignored if you have proxy refreshing
                        // user sessions.
                    }
                },
            },
        }
    );
}
