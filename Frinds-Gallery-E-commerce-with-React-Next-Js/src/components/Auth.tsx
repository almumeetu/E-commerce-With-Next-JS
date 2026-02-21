
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { BiLogIn, BiMoon, BiLoaderAlt } from 'react-icons/bi';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
      // Success - useAuthAndAdmin hook will detect session change
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[48px] shadow-2xl p-10 md:p-14 animate-fade-in relative overflow-hidden border border-stone-100">
        <div className="absolute top-0 inset-x-0 h-2 bg-emerald-600" />

        <div className="flex flex-col items-center mb-10">
          <div className="bg-emerald-600 p-4 rounded-3xl mb-6 shadow-xl shadow-emerald-600/20">
            <BiMoon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">অ্যাডমিন লগইন</h1>
          <p className="text-stone-500 mt-2 font-medium">ড্যাশবোর্ড এক্সেস করুন</p>
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
              placeholder="admin@example.com"
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
            className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 active:scale-95"
          >
            {loading ? <BiLoaderAlt className="animate-spin" /> : <><BiLogIn size={24} /> প্রবেশ করুন</>}
          </button>
        </form>

        <p className="text-center text-xs text-stone-400 mt-10 font-medium italic">
          সুরক্ষিত এলাকা. অননুমোদিত প্রবেশ নিষিদ্ধ।
        </p>
      </div>
    </div>
  );
}
