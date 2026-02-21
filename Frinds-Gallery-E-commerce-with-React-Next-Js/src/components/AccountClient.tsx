'use client';

import React from 'react';
import { AccountPage as AccountPageCore } from '@/core-pages/AccountPage';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { Customer, Order } from '@/types';
import * as api from '@/services/api';

interface AccountClientProps {
  initialOrders: Order[];
}

export default function AccountClient({ initialOrders }: AccountClientProps) {
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  const navigateTo = (page: string) => {
    router.push(`/${page === 'home' ? '' : page}`);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // If not logged in, redirect to auth page
  if (!loading && !user) {
    router.push('/auth');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AccountPageCore 
      navigateTo={navigateTo}
      currentUser={user}
      orders={initialOrders}
      onLogout={handleLogout}
    />
  );
}
