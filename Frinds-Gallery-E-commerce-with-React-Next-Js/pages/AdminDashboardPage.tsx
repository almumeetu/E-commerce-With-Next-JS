import React, { useState, useEffect } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import SalesSummaryWidgetClone from '../components/SalesSummaryWidgetClone';
import { AdminDashboardMenu } from '../components/AdminDashboardMenu';
import AdminOrdersClone from '../components/AdminOrdersClone';
import AdminUsersClone from '../components/AdminUsersClone';
import { SettingsManagement } from '../components/SettingsManagement';
import AdminRoute from '../components/AdminRoute';
import AdminProductsClone from '../components/AdminProductsClone';
import POSSystem from '../components/POSSystem';
import InventoryManagement from '../components/InventoryManagement';
import type { Page } from '../App';

interface AdminDashboardPageProps {
    navigateTo: (page: Page) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ navigateTo }) => {
    const [activeView, setActiveView] = useState('dashboard');

    const renderContent = () => {
        switch (activeView) {
            case 'pos':
                return <POSSystem />;
            case 'inventory':
                return <InventoryManagement />;
            case 'products':
                return <AdminProductsClone />;
            case 'orders':
                return <AdminOrdersClone />;
            case 'customers':
                return <AdminUsersClone />;
            case 'settings':
                return <SettingsManagement />;
            case 'dashboard':
            default:
                return <SalesSummaryWidgetClone />;
        }
    };

    return (
        <AdminRoute>
            <div className="bg-gray-50 min-h-screen">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Breadcrumbs items={[{ label: 'Home', onClick: () => navigateTo('home') }, { label: 'Admin Dashboard' }]} />
                    <h1 className="text-3xl font-black text-gray-900 my-6 tracking-tight">অ্যাডমিন ড্যাশবোর্ড</h1>

                    <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                        <aside className="lg:col-span-1 mb-8 lg:mb-0">
                            <AdminDashboardMenu activeView={activeView} setActiveView={setActiveView} />
                        </aside>

                        <main className="lg:col-span-3">
                            <div className="space-y-8">
                                {renderContent()}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </AdminRoute>
    );
};