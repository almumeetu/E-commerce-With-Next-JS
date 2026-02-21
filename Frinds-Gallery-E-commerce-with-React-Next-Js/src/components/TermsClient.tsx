'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { TermsPage } from '@/core-pages/TermsPage';

export default function TermsClient() {
  const router = useRouter();

  const navigateTo = (page: string) => {
    router.push(`/${page === 'home' ? '' : page}`);
  };

  return <TermsPage navigateTo={navigateTo as any} />;
}
