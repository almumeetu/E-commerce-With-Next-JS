import AuthClient from '@/components/AuthClient';
import { MainLayout } from '@/components/MainLayout';

export const metadata = {
  title: 'Login or Register | Friends Gallery',
  description: 'Login or create a new account at Friends Gallery',
};

export default function Page() {
  return (
    <MainLayout>
      <AuthClient />
    </MainLayout>
  );
}
