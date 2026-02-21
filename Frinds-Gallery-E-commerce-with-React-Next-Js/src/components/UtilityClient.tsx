'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { UtilityPage } from '@/core-pages/UtilityPage';

export default function UtilityClient() {
  const router = useRouter();

  const navigateTo = (page: string) => {
    router.push(`/${page === 'home' ? '' : page}`);
  };

  return <UtilityPage navigateTo={navigateTo as any} />;
}
