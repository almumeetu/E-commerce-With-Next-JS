import React from 'react';
import { ChartBarIcon, CubeIcon, ShoppingBagIcon, UsersIcon, Cog6ToothIcon } from './icons';
import { Calculator, Box } from 'lucide-react';

const menuItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: <ChartBarIcon /> },
    { id: 'pos', label: 'POS সিস্টেম', icon: <Calculator size={20} /> },
    { id: 'inventory', label: 'ইনভেন্টরি', icon: <Box size={20} /> },
    { id: 'orders', label: 'অর্ডারসমূহ', icon: <CubeIcon /> },
    { id: 'products', label: 'পণ্যসমূহ', icon: <ShoppingBagIcon /> },
    { id: 'customers', label: 'গ্রাহক তালিকা', icon: <UsersIcon /> },
    { id: 'settings', label: 'সেটিংস', icon: <Cog6ToothIcon /> },
];

interface AdminDashboardMenuProps {
    activeView: string;
    setActiveView: (view: string) => void;
}

export const AdminDashboardMenu: React.FC<AdminDashboardMenuProps> = ({ activeView, setActiveView }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">মেনু</h3>
            <ul className="space-y-1">
                {menuItems.map(item => (
                    <li key={item.id}>
                        <button
                            onClick={() => setActiveView(item.id)}
                            className={`w-full flex items-center text-left px-3 py-2.5 rounded-md text-sm transition-colors ${activeView === item.id
                                    ? 'bg-brand-green text-white font-semibold shadow'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            <span className="mr-3 w-5 h-5">{item.icon}</span>
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}