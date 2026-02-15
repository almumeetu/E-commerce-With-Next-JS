import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Moon } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-stone-50 font-sans">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-emerald-950 text-white hidden md:flex flex-col sticky top-0 h-screen shadow-2xl">
                <div className="p-6 border-b border-emerald-800 flex items-center gap-3">
                    <div className="bg-gold-500 p-1.5 rounded-lg">
                        <Moon className="h-5 w-5 text-emerald-950" fill="currentColor" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">অ্যাডমিন প্যানেল</span>
                </div>

                <nav className="flex-grow p-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-900 transition-all text-emerald-100 font-medium">
                        <LayoutDashboard size={20} /> ওভারভিউ
                    </Link>
                    <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-900 transition-all text-emerald-100 font-medium">
                        <ShoppingCart size={20} /> অর্ডারসমূহ
                    </Link>
                    <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-900 transition-all text-emerald-100 font-medium">
                        <Package size={20} /> পণ্য ম্যানেজমেন্ট
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-900 transition-all text-emerald-100 font-medium">
                        <Users size={20} /> গ্রাহকবৃন্দ
                    </Link>
                </nav>

                <div className="p-4 border-t border-emerald-800">
                    <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-900/20 text-red-400 font-medium transition-all">
                        <LogOut size={20} /> লগ আউট
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-16 bg-white border-b border-stone-200 sticky top-0 z-30 flex items-center justify-between px-6 shadow-sm">
                    <h1 className="text-xl font-bold text-emerald-950">স্বাগতম, অ্যাডমিন!</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-stone-800">রোজারহাট টিম</p>
                            <p className="text-xs text-stone-500">অ্যাডমিন প্রিভিলেজ</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold border-2 border-emerald-200">
                            A
                        </div>
                    </div>
                </header>

                <main className="p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
