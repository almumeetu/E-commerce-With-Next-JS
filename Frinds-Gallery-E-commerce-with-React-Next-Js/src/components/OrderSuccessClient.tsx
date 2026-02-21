'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { OrderSuccessPage } from '@/core-pages/OrderSuccessPage';
import type { OrderDetails } from '@/types';

export default function OrderSuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    // Try to get order details from URL params or localStorage
    const orderId = searchParams.get('orderId');
    const customerName = searchParams.get('customerName') || 'গ্রাহক';
    const totalAmount = searchParams.get('totalAmount');

    if (orderId) {
      setOrderDetails({
        orderId,
        customerName,
        totalAmount: totalAmount ? parseFloat(totalAmount) : 0,
      });
    } else {
      // Try localStorage
      const stored = localStorage.getItem('lastOrder');
      if (stored) {
        try {
          setOrderDetails(JSON.parse(stored));
        } catch (e) {
          setOrderDetails(null);
        }
      }
    }
  }, [searchParams]);

  const navigateTo = (page: string) => {
    router.push(`/${page === 'home' ? '' : page}`);
  };

  return <OrderSuccessPage orderDetails={orderDetails} navigateTo={navigateTo as any} />;
}
