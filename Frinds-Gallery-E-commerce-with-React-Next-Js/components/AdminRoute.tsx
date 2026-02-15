import React from 'react';
import { useAuthAndAdmin } from '../hooks/useAuthAndAdmin';
import Auth from './Auth'; // The login form

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps): React.ReactElement {
  const { user, isAdmin, loading } = useAuthAndAdmin();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  if (!user) {
    // If not logged in, show the Auth component.
    return <Auth />;
  }

  if (!isAdmin) {
    // If logged in but NOT an admin, show access denied.
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="p-10 bg-white rounded-lg shadow-xl text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-700">You do not have permission to view this page.</p>
            <p className="text-sm text-gray-500 mt-2">
                This area is restricted to administrators. Your current account is logged in but does not have admin privileges.
            </p>
        </div>
      </div>
    );
  }

  // If logged in AND an admin, show the children.
  return <>{children}</>;
}
