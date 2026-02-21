import OrderSuccessClient from '@/components/OrderSuccessClient';
import { MainLayout } from '@/components/MainLayout';
import { Suspense } from 'react';

export default function Page() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <OrderSuccessClient />
      </Suspense>
    </MainLayout>
  );
}
