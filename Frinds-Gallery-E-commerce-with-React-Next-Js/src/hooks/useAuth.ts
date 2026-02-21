import { useEffect, useState } from 'react';
import { supabase } from '@/services/supabase';
import type { Customer } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
          email: session.user.email || '',
          phone: session.user.phone || '',
          totalOrders: 0,
          totalSpent: 0,
          joinDate: session.user.created_at,
          orderIds: [],
        } as Customer);
      }
      setLoading(false);
    }

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
          email: session.user.email || '',
          phone: session.user.phone || '',
          totalOrders: 0,
          totalSpent: 0,
          joinDate: session.user.created_at,
          orderIds: [],
        } as Customer);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, logout, loading };
}
