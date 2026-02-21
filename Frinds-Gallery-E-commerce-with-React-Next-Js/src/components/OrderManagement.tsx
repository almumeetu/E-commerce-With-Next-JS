import React, { useState } from 'react';
import type { Order, Product } from '../types';
import { OrderStatus } from '../types';

interface OrderManagementProps {
    orders: Order[];
    products: Product[];
    onUpdateStatus: (orderId: string, status: Order['status']) => void;
}

// FIX: Using OrderStatus enum members for options.
const statusOptions: OrderStatus[] = [OrderStatus.Processing, OrderStatus.Shipped, OrderStatus.Delivered, OrderStatus.Cancelled];

// FIX: Updated switch cases to use OrderStatus enum members.
const getStatusColor = (status: Order['status']) => {
    switch (status) {
        case OrderStatus.Processing: return 'bg-yellow-100 text-yellow-800';
        case OrderStatus.Shipped: return 'bg-blue-100 text-blue-800';
        case OrderStatus.Delivered: return 'bg-green-100 text-green-800';
        case OrderStatus.Cancelled: return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const OrderDetailsModal: React.FC<{ order: Order; products: Product[]; onClose: () => void; }> = ({ order, products, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex justify-between items-center border-b pb-3 mb-5">
                        <h3 className="text-xl font-semibold text-gray-800">অর্ডার বিস্তারিত - {order.orderId}</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close modal">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                    <div className="space-y-4 text-sm">
                        <p><strong>গ্রাহকের নাম:</strong> {order.customerName}</p>
                        <p><strong>ডেলিভারি ঠিকানা:</strong> {order.shippingAddress}</p>
                        <p><strong>তারিখ:</strong> {new Date(order.date).toLocaleDateString('bn-BD')}</p>
                        <p><strong>মোট মূল্য:</strong> ৳{order.totalAmount.toLocaleString('bn-BD')}</p>
                        <div className="flex items-center">
                            <strong>স্ট্যাটাস:</strong> 
                            <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h4 className="font-semibold text-gray-800 mb-2">অর্ডারকৃত পণ্যসমূহ</h4>
                        <ul className="space-y-3">
                            {order.items.map(item => {
                                const product = products.find(p => p.id === item.productId);
                                return (
                                    <li key={item.productId} className="flex items-center space-x-4 p-2 bg-gray-50 rounded-md">
                                        <img src={product?.imageUrl} alt={product?.name} className="w-12 h-12 object-cover rounded"/>
                                        <div className="flex-grow">
                                            <p className="font-medium text-gray-900">{product?.name || 'Unknown Product'}</p>
                                            <p className="text-sm text-gray-500">পরিমাণ: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-800">৳{(item.price * item.quantity).toLocaleString('bn-BD')}</p>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const OrderManagement: React.FC<OrderManagementProps> = ({ orders, products, onUpdateStatus }) => {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">অর্ডার ম্যানেজমেন্ট</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">অর্ডার আইডি</th>
                            <th scope="col" className="px-6 py-3">গ্রাহক</th>
                            <th scope="col" className="px-6 py-3">তারিখ</th>
                            <th scope="col" className="px-6 py-3">মোট</th>
                            <th scope="col" className="px-6 py-3">স্ট্যাটাস</th>
                            <th scope="col" className="px-6 py-3">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900">{order.orderId}</th>
                                <td className="px-6 py-4">{order.customerName}</td>
                                <td className="px-6 py-4">{new Date(order.date).toLocaleDateString('bn-BD')}</td>
                                <td className="px-6 py-4">৳{order.totalAmount.toLocaleString('bn-BD')}</td>
                                <td className="px-6 py-4">
                                     <select
                                        value={order.status}
                                        onChange={(e) => onUpdateStatus(order.id, e.target.value as Order['status'])}
                                        className={`text-xs font-semibold border-none rounded-md p-1.5 focus:ring-2 focus:ring-opacity-50 ${getStatusColor(order.status)}`}
                                    >
                                        {statusOptions.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    <button onClick={() => setSelectedOrder(order)} className="font-medium text-blue-600 hover:underline">বিস্তারিত</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {selectedOrder && (
                <OrderDetailsModal order={selectedOrder} products={products} onClose={() => setSelectedOrder(null)} />
            )}
        </div>
    );
};
