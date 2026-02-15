import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import type { Page } from '../App';

interface ReturnsPageProps {
    navigateTo: (page: Page) => void;
}

export const ReturnsPage: React.FC<ReturnsPageProps> = ({ navigateTo }) => {
    return (
        <div className="bg-white py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumbs items={[{ label: 'হোম', onClick: () => navigateTo('home') }, { label: 'রিটার্ন ও রিফান্ড পলিসি' }]} />
                <div className="mt-8 prose prose-lg max-w-none text-gray-700">
                    <h1 className="text-3xl font-bold text-gray-900">রিটার্ন ও রিফান্ড পলিসি</h1>
                    <h2>রিটার্ন পলিসি</h2>
                    <p>
                        ডেলিভারির সময় পণ্য চেক করে ডেলিভারিম্যানের কাছে পণ্য ফেরত দিতে পারবেন। ডেলিভারিম্যান চলে আসার পর কোনো অভিযোগ গ্রহণ করা হবে না, তবে পণ্যে কোনো ত্রুটি থাকলে ২৪ ঘণ্টার মধ্যে আমাদের সাথে যোগাযোগ করতে হবে।
                    </p>
                    <ul>
                        <li>পণ্যটি অব্যবহৃত হতে হবে।</li>
                        <li>পণ্যের মূল প্যাকেজিং অক্ষত থাকতে হবে।</li>
                        <li>ত্রুটিপূর্ণ পণ্যের ক্ষেত্রে, ছবিসহ আমাদের জানাতে হবে।</li>
                    </ul>
                    <h2>রিফান্ড পলিসি</h2>
                    <p>
                        রিটার্ন করা পণ্য আমাদের কাছে পৌঁছানোর পর এবং যাচাই করার পর ৭-১০ কার্যদিবসের মধ্যে আপনার পেমেন্ট রিফান্ড করা হবে। ক্যাশ অন ডেলিভারির ক্ষেত্রে, আপনার পছন্দের মোবাইল ব্যাংকিং সার্ভিসের মাধ্যমে রিফান্ড করা হবে।
                    </p>
                </div>
            </div>
        </div>
    );
};