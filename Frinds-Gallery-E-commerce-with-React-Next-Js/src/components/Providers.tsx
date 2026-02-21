'use client';

import React from 'react';
import { CartProvider } from '@/context/CartContext';
import { SiteContentProvider } from '@/context/SiteContentContext';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SiteContentProvider>
      <CartProvider>
        {children}
        <Toaster position="top-right" />
      </CartProvider>
    </SiteContentProvider>
  );
}
