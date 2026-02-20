import React, { useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import SalesSummaryWidget from '../components/SalesSummaryWidget';
import { AdminDashboardMenu } from '../components/AdminDashboardMenu';
import AdminOrders from '../components/AdminOrders';
import AdminUsers from '../components/AdminUsers';
import { SettingsManagement } from '../components/SettingsManagement';
import { AdminContentManager } from '../components/AdminContentManager';
import AdminRoute from '../components/AdminRoute';
import AdminProducts from '../components/AdminProducts';
import AdminCategories from '../components/AdminCategories';

import InventoryManagement from '../components/InventoryManagement';
import type { Page } from '../App';
import { BiMenu, BiX } from 'react-icons/bi';

interface AdminDashboardPageProps {
    navigateTo: (page: Page) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ navigateTo }) => {
    const [activeView, setActiveView] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const renderContent = () => {
        switch (activeView) {

            case 'inventory':
                return <InventoryManagement />;
            case 'products':
                return <AdminProducts />;
            case 'categories':
                return <AdminCategories />;
            case 'orders':
                return <AdminOrders />;
            case 'customers':
                return <AdminUsers />;
            case 'content-manager':
                return <AdminContentManager />;
            case 'settings':
                return <SettingsManagement />;
            case 'dashboard':
            default:
                return (
                    <div className="space-y-6">
                        <div className="p-6 md:p-8">
                            {/* Dashboard Heading Content is now inside SalesSummaryWidget to match RojarHat */}
                            <SalesSummaryWidget setActiveView={setActiveView} />
                        </div>
                    </div>
                );
        }
    };

    return (
        <AdminRoute>
            <div className="flex min-h-screen bg-stone-50 font-sans">
                {/* Admin Sidebar - Desktop */}
                <div className="hidden md:flex">
                    <AdminDashboardMenu activeView={activeView} setActiveView={setActiveView} />
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
                )}

                {/* Mobile Sidebar */}
                <div className={`fixed inset-y-0 left-0 w-72 bg-emerald-950/95 backdrop-blur-xl z-50 transform transition-all duration-500 cubic-out shadow-2xl md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex justify-end p-4">
                        <button onClick={() => setIsMobileMenuOpen(false)} className="text-white">
                            <BiX size={24} />
                        </button>
                    </div>
                    {/* Reuse the logic inside AdminDashboardMenu component but we need to pass props slightly differently if we wanted true reuse, keeping it simple for now */}
                    <AdminDashboardMenu activeView={activeView} setActiveView={(view) => { setActiveView(view); setIsMobileMenuOpen(false); }} />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <header className="bg-white border-b border-stone-200 sticky top-0 z-30 h-16 flex items-center justify-between px-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <button className="md:hidden text-stone-600" onClick={() => setIsMobileMenuOpen(true)}>
                                <BiMenu size={24} />
                            </button>
                            <h1 className="text-xl font-bold text-emerald-950 hidden sm:block">স্বাগতম, অ্যাডমিন!</h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-stone-800">ফ্রেন্ডস গ্যালারি টিম</p>
                                <p className="text-xs text-stone-500">অ্যাডমিন প্রিভিলেজ</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold border-2 border-emerald-200 shadow-sm">
                                A
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-stone-50">
                        {activeView !== 'dashboard' && (
                            <div className="px-6 py-6 md:px-8">
                                <Breadcrumbs items={[{ label: 'Home', onClick: () => navigateTo('home') }, { label: 'Admin Dashboard' }]} />
                            </div>
                        )}
                        <div className={activeView !== 'dashboard' ? 'px-6 pb-6 md:px-8 md:pb-8' : ''}>
                            {renderContent()}
                        </div>
                    </main>
                </div>
            </div>
        </AdminRoute>
    );
};