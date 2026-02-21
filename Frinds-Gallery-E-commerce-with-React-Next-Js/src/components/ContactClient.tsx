'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ContactPage } from '@/core-pages/ContactPage';

export default function ContactClient() {
  const router = useRouter();

  const navigateTo = (page: string) => {
    router.push(`/${page === 'home' ? '' : page}`);
  };

  return <ContactPage navigateTo={navigateTo as any} />;
}
