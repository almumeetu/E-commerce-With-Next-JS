import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import type { Page } from '../types';

interface AboutUsPageProps {
    navigateTo: (page: Page) => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ navigateTo }) => {
    return (
        <div className="bg-white py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumbs items={[{ label: 'হোম', onClick: () => navigateTo('home') }, { label: 'আমাদের সম্পর্কে' }]} />
                <div className="mt-8 prose prose-lg max-w-none text-gray-700">
                    <h1 className="text-3xl font-bold text-gray-900">আমাদের সম্পর্কে</h1>
                    <p>
                        ফ্রেন্ডস গ্যালারি ০.৭-এ আপনাকে স্বাগতম! আমরা বাংলাদেশের নারীদের জন্য একটি বিশ্বস্ত এবং আধুনিক ই-কমার্স প্ল্যাটফর্ম। আমাদের লক্ষ্য হলো, সেরা মানের পোশাক এবং আনুষাঙ্গিক পণ্য আপনাদের দোরগোড়ায় পৌঁছে দেওয়া।
                    </p>
                    <figure>
                        <img className="w-full rounded-lg shadow-lg" src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop" alt="Store photo"/>
                        <figcaption className="text-center text-sm text-gray-500 mt-2">আমাদের স্টোর</figcaption>
                    </figure>
                    <h2>আমাদের গল্প</h2>
                    <p>
                        ফ্রেন্ডস গ্যালারি ০.৭ এর যাত্রা শুরু হয় কয়েকজন বন্ধুর হাত ধরে, যাদের স্বপ্ন ছিল একটি নির্ভরযোগ্য অনলাইন শপ তৈরি করা যেখানে নারীরা তাদের পছন্দের পোশাক সহজেই খুঁজে পাবেন। গুণগত মান এবং গ্রাহক সন্তুষ্টিই আমাদের প্রধান চালিকাশক্তি।
                    </p>
                    <h2>আমাদের লক্ষ্য</h2>
                    <p>
                        আমরা বিশ্বাস করি, প্রতিটি নারীরই তার নিজস্ব স্টাইল প্রকাশ করার অধিকার আছে। আমরা সেই প্রকাশকে আরও সহজ করে তুলতে চাই। আমাদের প্রতিটি পণ্য যত্ন সহকারে বাছাই করা হয়, যাতে আপনি সেরা মানের এবং ট্রেন্ডি পোশাক পান।
                    </p>
                </div>
            </div>
        </div>
    );
};