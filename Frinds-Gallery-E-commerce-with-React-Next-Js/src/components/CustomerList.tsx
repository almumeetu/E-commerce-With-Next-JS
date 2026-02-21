import React from 'react';
import type { Customer } from '../types';

interface CustomerListProps {
    customers: Customer[];
}

export const CustomerList: React.FC<CustomerListProps> = ({ customers }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">গ্রাহক তালিকা</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">নাম</th>
                            <th scope="col" className="px-6 py-3">যোগাযোগ</th>
                            <th scope="col" className="px-6 py-3">মোট অর্ডার</th>
                            <th scope="col" className="px-6 py-3">মোট খরচ</th>
                            <th scope="col" className="px-6 py-3">নিবন্ধনের তারিখ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(customer => (
                            <tr key={customer.id} className="bg-white border-b hover:bg-gray-50">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900">{customer.name}</th>
                                <td className="px-6 py-4">
                                    <div>{customer.email}</div>
                                    <div className="text-xs text-gray-600">{customer.phone}</div>
                                </td>
                                <td className="px-6 py-4 text-center">{customer.totalOrders}</td>
                                <td className="px-6 py-4">৳{customer.totalSpent.toLocaleString('bn-BD')}</td>
                                <td className="px-6 py-4">{new Date(customer.joinDate).toLocaleDateString('bn-BD')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};