import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { OrderTrackingWidget } from '../components/OrderTrackingWidget';
import type { Page } from '../App';

interface UtilityPageProps {
    navigateTo: (page: Page) => void;
}

export const UtilityPage: React.FC<UtilityPageProps> = ({ navigateTo }) => {
    return (
        <div className="bg-white min-h-[50vh]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* FIX: Replaced `href` with `onClick` to match the `BreadcrumbItem` type definition. */}
                <Breadcrumbs items={[{ label: 'হোম', onClick: () => navigateTo('home') }, { label: 'অর্ডার ট্র্যাকিং' }]} />
                <div className="mt-6 max-w-2xl mx-auto">
                    <OrderTrackingWidget />
                </div>
            </div>
        </div>
    );
}