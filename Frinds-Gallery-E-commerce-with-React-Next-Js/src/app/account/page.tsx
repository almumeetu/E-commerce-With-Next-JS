import { getOrders } from '@/services/api';
import AccountClient from '@/components/AccountClient';
import { MainLayout } from '@/components/MainLayout';

export const metadata = {
  title: 'My Account | Friends Gallery',
  description: 'Manage your account and view order history',
};

export default async function Page() {
  const orders = await getOrders();

  return (
    <MainLayout>
      <AccountClient initialOrders={orders || []} />
    </MainLayout>
  );
}
