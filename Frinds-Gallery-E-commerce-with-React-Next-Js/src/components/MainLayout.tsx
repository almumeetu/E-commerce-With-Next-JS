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
import { useAuth } from '@/hooks/useAuth';
import * as api from '@/services/api';
import type { Category } from '@/types';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const { cart, wishlist } = useCart();
  const { content } = useSiteContent();
  const { user, logout } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Fetch categories for Header and Footer
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await api.getCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

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
          categories={categories}
        />
      )}

      <main className="flex-grow w-full pb-20 lg:pb-0">
        {children}
      </main>

      {!isAdmin && (
        <Footer 
          navigateTo={navigateTo} 
          navigateToShop={navigateToShop} 
          categories={categories}
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
