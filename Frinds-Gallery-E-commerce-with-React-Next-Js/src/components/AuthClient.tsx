'use client';

import React from 'react';
import { AuthPage as AuthPageCore } from '@/core-pages/AuthPage';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { Customer } from '@/types';
import * as api from '@/services/api';

export default function AuthClient() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const navigateTo = (page: string) => {
    router.push(`/${page === 'home' ? '' : page}`);
  };

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    const customer = await api.login(email, password);
    if (customer) {
      router.refresh();
      router.push('/account');
      return true;
    }
    return false;
  };

  const handleRegister = async (newCustomerData: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'joinDate' | 'orderIds'>): Promise<boolean> => {
    try {
      await api.register(newCustomerData);
      router.refresh();
      router.push('/account');
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  return (
    <AuthPageCore 
      navigateTo={navigateTo}
      onLogin={handleLogin}
      onRegister={handleRegister}
    />
  );
}
