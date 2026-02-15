'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { Moon, LogIn } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert(error.message);
            setLoading(false);
        } else {
            router.push('/admin');
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen bg-emerald-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-[48px] shadow-2xl p-10 md:p-14 animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-2 bg-gold-500" />

                <div className="flex flex-col items-center mb-10">
                    <div className="bg-emerald-950 p-4 rounded-3xl mb-6 shadow-xl">
                        <Moon className="h-10 w-10 text-gold-400" fill="currentColor" />
                    </div>
                    <h1 className="text-3xl font-black text-emerald-950 tracking-tight">অ্যাডমিন লগইন</h1>
                    <p className="text-stone-500 mt-2 font-medium">রোজারহাট ড্যাশবোর্ড এক্সেস করুন</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-stone-700 ml-1">ইমেইল অ্যাড্রেস</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-6 py-4 rounded-2xl border border-stone-200 focus:border-emerald-500 outline-none transition-all text-lg"
                            placeholder="admin@rojarhat.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-stone-700 ml-1">পাসওয়ার্ড</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-6 py-4 rounded-2xl border border-stone-200 focus:border-emerald-500 outline-none transition-all text-lg"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-emerald-950 text-white py-5 rounded-2xl font-black text-xl hover:bg-black transition-all shadow-xl shadow-emerald-950/20 flex items-center justify-center gap-3"
                    >
                        {loading ? 'প্রবেশ করা হচ্ছে...' : <><LogIn size={24} /> প্রবেশ করুন</>}
                    </button>
                </form>

                <p className="text-center text-xs text-stone-400 mt-10 font-medium">
                    © ২০২৪ রোজারহাট লিমিটেড। সর্বস্বত্ব সংরক্ষিত।
                </p>
            </div>
        </div>
    );
}
