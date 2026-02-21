'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AboutUsPage } from '@/core-pages/AboutUsPage';

export default function AboutClient() {
  const router = useRouter();

  const navigateTo = (page: string) => {
    router.push(`/${page === 'home' ? '' : page}`);
  };

  return <AboutUsPage navigateTo={navigateTo as any} />;
}
