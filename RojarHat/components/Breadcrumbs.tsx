'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs: React.FC = () => {
    const pathname = usePathname();
    const pathnames = pathname.split('/').filter((x) => x);

    // Don't show breadcrumbs on home page
    if (pathnames.length === 0) return null;

    // Don't show on admin pages
    if (pathnames[0] === 'admin') return null;

    const routeMap: { [key: string]: string } = {
        'shop': 'শপ',
        'cart': 'কার্ট',
        'wishlist': 'উইশলিস্ট',
        'checkout': 'চেকআউট',
        'order-success': 'অর্ডার সফল',
        'about': 'আমাদের সম্পর্কে',
        'contact': 'যোগাযোগ',
        'product': 'পণ্য'
    };

    return (
        <div className="bg-emerald-950/5 border-b border-emerald-900/5 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center text-sm font-medium">
                    <Link
                        href="/"
                        className="text-stone-500 hover:text-emerald-700 transition-colors flex items-center"
                    >
                        <Home size={16} className="mr-1" />
                        <span>প্রচ্ছদ</span>
                    </Link>

                    {pathnames.map((name, index) => {
                        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                        const isLast = index === pathnames.length - 1;
                        const displayName = routeMap[name.toLowerCase()] || name;

                        return (
                            <React.Fragment key={name}>
                                <ChevronRight size={14} className="mx-2 text-stone-400" />
                                {isLast ? (
                                    <span className="text-emerald-800 font-bold truncate max-w-[200px]">
                                        {displayName}
                                    </span>
                                ) : (
                                    <Link
                                        href={routeTo}
                                        className="text-stone-500 hover:text-emerald-700 transition-colors capitalize"
                                    >
                                        {displayName}
                                    </Link>
                                )}
                            </React.Fragment>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};

export default Breadcrumbs;
