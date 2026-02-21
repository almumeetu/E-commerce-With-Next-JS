'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { FloatingCart } from './FloatingCart';
import { FloatingSocials } from './FloatingSocials';
import { MobileBottomNav } from './MobileBottomNav';
import BackToTop from './BackToTop';
import { useCart } from '@/context/CartContext';
import { useSiteContent } from '@/context/SiteContentContext';
import { useAuth } from '@/hooks/useAuth'; // We'll need to create/update this

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const { cart, wishlist } = useCart();
  const { content } = useSiteContent();
  const { user, logout } = useAuth(); // Need to implement this

  // Mocking navigate functions for compatibility
  const navigateTo = (page: string) => {
    // This will be replaced by Next.js navigation
    window.location.href = `/${page === 'home' ? '' : page}`;
  };

  const navigateToShop = (categoryId: string) => {
    window.location.href = `/shop?category=${categoryId}`;
  };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-dark flex flex-col">
      {!isAdmin && (
        <Header
          navigateTo={navigateTo}
          navigateToShop={navigateToShop}
          cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          wishlistItemCount={wishlist.length}
          currentUser={user}
          onLogout={logout}
          categories={content.features ? [] : []} // Update this to use actual categories
        />
      )}

      <main className="flex-grow w-full pb-20 lg:pb-0">
        {children}
      </main>

      {!isAdmin && (
        <Footer 
          navigateTo={navigateTo} 
          navigateToShop={navigateToShop} 
          categories={[]} // Update this
        />
      )}

      {!isAdmin && (
        <>
          <FloatingCart cart={cart} products={[]} navigateTo={navigateTo} />
          <FloatingSocials />
          <MobileBottomNav currentPage={pathname === '/' ? 'home' : pathname.substring(1) as any} navigateTo={navigateTo} />
          <BackToTop />
        </>
      )}
    </div>
  );
}
