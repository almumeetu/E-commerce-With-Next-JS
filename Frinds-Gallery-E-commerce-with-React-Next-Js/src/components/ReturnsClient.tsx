'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ReturnsPage } from '@/core-pages/ReturnsPage';

export default function ReturnsClient() {
  const router = useRouter();

  const navigateTo = (page: string) => {
    router.push(`/${page === 'home' ? '' : page}`);
  };

  return <ReturnsPage navigateTo={navigateTo as any} />;
}
