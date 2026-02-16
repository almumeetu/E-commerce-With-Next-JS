import React from 'react';
import { BiGridAlt, BiCart, BiPackage, BiGroup, BiCog, BiLogOut, BiMoon, BiBox, BiCalculator, BiTag } from 'react-icons/bi';

interface AdminDashboardMenuProps {
    activeView: string;
    setActiveView: (view: string) => void;
}

export const AdminDashboardMenu: React.FC<AdminDashboardMenuProps> = ({ activeView, setActiveView }) => {
    const menuItems = [
        { id: 'dashboard', label: 'ওভারভিউ', icon: BiGridAlt },
        { id: 'orders', label: 'অর্ডারসমূহ', icon: BiCart },
        { id: 'products', label: 'পণ্য ম্যানেজমেন্ট', icon: BiPackage },
        { id: 'categories', label: 'ক্যাটাগরি', icon: BiTag }, // New Category Menu
        { id: 'customers', label: 'গ্রাহকবৃন্দ', icon: BiGroup },
        { id: 'inventory', label: 'ইনভেন্টরি', icon: BiBox },
        { id: 'pos', label: 'POS সিস্টেম', icon: BiCalculator },
        { id: 'settings', label: 'সেটিংস', icon: BiCog },
    ];

    return (
        <aside className="w-64 bg-emerald-950 text-white hidden md:flex flex-col h-screen sticky top-0 shadow-2xl">
            <div className="p-6 border-b border-emerald-800 flex items-center gap-3">
                <div className="bg-yellow-500 p-1.5 rounded-lg">
                    <BiMoon className="h-5 w-5 text-emerald-950" />
                </div>
                <span className="text-xl font-bold tracking-tight">অ্যাডমিন প্যানেল</span>
            </div>

            <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeView === item.id
                            ? 'bg-emerald-800 text-white shadow-lg shadow-emerald-900/20'
                            : 'text-emerald-100 hover:bg-emerald-900'
                            }`}
                    >
                        <item.icon size={20} />
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-emerald-800">
                <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-900/20 text-red-400 font-medium transition-all">
                    <BiLogOut size={20} /> লগ আউট
                </button>
            </div>
        </aside>
    );
};