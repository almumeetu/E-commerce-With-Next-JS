import React from 'react';
import type { Page } from '../App';
import type { OrderDetails } from '../types';
import { CheckCircleIcon } from '../components/icons';

interface OrderSuccessPageProps {
  orderDetails: OrderDetails | null;
  navigateTo: (page: Page) => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ orderDetails, navigateTo }) => {
  if (!orderDetails) {
    // Handle case where someone lands here directly without an order
    return (
        <div className="bg-gray-50 py-12 text-center">
            <h2 className="text-xl">কোনো অর্ডার পাওয়া যায়নি।</h2>
            <button
              onClick={() => navigateTo('home')}
              className="mt-6 bg-brand-green text-white py-2 px-6 rounded-md font-semibold hover:bg-brand-green-dark"
            >
              হোম পেজে ফিরে যান
            </button>
        </div>
    )
  }
    
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-md border text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <CheckCircleIcon className="h-12 w-12 text-brand-green" />
            </div>
          <h1 className="text-2xl font-bold text-gray-800">প্রিয়, {orderDetails.customerName}</h1>
          <p className="mt-2 text-gray-600">আপনার অর্ডারটি গ্রহণ করা হয়েছে।</p>
          <div className="mt-6 bg-gray-100 p-4 rounded-md inline-block">
            <p className="text-gray-700">আপনার অর্ডার নাম্বার - <strong className="text-brand-green">{orderDetails.orderId}</strong></p>
            <p className="text-gray-700">মোট মূল্য - <strong className="text-brand-green">৳{orderDetails.totalAmount.toLocaleString('bn-BD')}</strong></p>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            অর্ডারটি শীঘ্রই পাঠিয়ে দেওয়া হবে। একটি ফোন কল করে অর্ডার কনফার্ম করার জন্য।
            <br />
            যেকোনো প্রয়োজনে আমাদের হেল্পলাইন নাম্বারে ফোন করুন অথবা ইনবক্স করুন।
          </p>
          <div className="mt-8">
            <p className="font-semibold text-gray-700">ধন্যবাদান্তে</p>
            <p className="text-brand-green font-bold">friendsgallery0.7.com</p>
          </div>
          <div className="mt-10">
            <button
              onClick={() => navigateTo('home')}
              className="w-full sm:w-auto bg-brand-green text-white py-3 px-8 rounded-lg font-bold hover:bg-brand-green-dark transition-colors"
            >
              কেনাকাটা চালিয়ে যান
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};