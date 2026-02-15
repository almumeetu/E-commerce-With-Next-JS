import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import type { Page } from '../App';

interface TermsPageProps {
    navigateTo: (page: Page) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ navigateTo }) => {
    return (
        <div className="bg-white py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumbs items={[{ label: 'হোম', onClick: () => navigateTo('home') }, { label: 'শর্তাবলী' }]} />
                <div className="mt-8 prose prose-lg max-w-none text-gray-700">
                    <h1 className="text-3xl font-bold text-gray-900">শর্তাবলী</h1>
                    <p>ফ্রেন্ডস গ্যালারি ০.৭ ওয়েবসাইট ব্যবহার করার জন্য আপনাকে ধন্যবাদ। এই ওয়েবসাইট ব্যবহার করার আগে দয়া করে নিম্নলিখিত শর্তাবলী মনোযোগ সহকারে পড়ুন।</p>
                    
                    <h2>১. সাধারণ শর্তাবলী</h2>
                    <p>আমাদের ওয়েবসাইটে প্রবেশ বা ব্যবহার করার মাধ্যমে, আপনি এই শর্তাবলীর সাথে আবদ্ধ হতে সম্মত হচ্ছেন। আপনি যদি এই শর্তাবলীর কোনো অংশের সাথে একমত না হন, তবে আমাদের পরিষেবা ব্যবহার করা থেকে বিরত থাকুন।</p>
                    
                    <h2>২. পণ্যের তথ্য</h2>
                    <p>আমরা আমাদের ওয়েবসাইটে পণ্যের সঠিক তথ্য এবং ছবি দেওয়ার জন্য সর্বদা সচেষ্ট থাকি। তবে, ডিসপ্লের ভিন্নতার কারণে পণ্যের রঙে সামান্য তারতম্য হতে পারে।</p>
                    
                    <h2>৩. মূল্য এবং পেমেন্ট</h2>
                    <p>সকল পণ্যের মূল্য বাংলাদেশী টাকায় (BDT) দেখানো হয়। মূল্য পরিবর্তন করার অধিকার ফ্রেন্ডস গ্যালারি ০.৭ সংরক্ষণ করে।</p>
                </div>
            </div>
        </div>
    );
};