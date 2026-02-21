'use client';

import React from 'react';
import { AdminDashboardPage as AdminDashboardPageCore } from '@/core-pages/AdminDashboardPage';
import { useRouter } from 'next/navigation';

export default function AdminClient() {
  const router = useRouter();

  const navigateTo = (page: string) => {
    router.push(`/${page === 'home' ? '' : page}`);
  };

  return (
    <AdminDashboardPageCore navigateTo={navigateTo} />
  );
}
