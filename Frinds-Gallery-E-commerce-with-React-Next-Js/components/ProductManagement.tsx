import React, { useState } from 'react';
import type { Product } from '../types';
import { ProductForm } from './ProductForm';
import { categories } from '../constants';

interface ProductManagementProps {
    products: Product[];
    onAddProduct: (newProduct: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => void;
    onUpdateProduct: (updatedProduct: Product) => void;
    onDeleteProduct: (productId: string) => void;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleOpenForm = (product: Product | null = null) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setEditingProduct(null);
        setIsFormOpen(false);
    };

    const getCategoryName = (categoryId: string) => {
        return categories.find(c => c.id === categoryId)?.name || categoryId;
    }
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">পণ্য ম্যানেজমেন্ট</h2>
                <button
                    onClick={() => handleOpenForm()}
                    className="bg-brand-green text-white py-2 px-4 rounded-md font-semibold hover:bg-brand-green-dark transition-all"
                >
                    + নতুন পণ্য যোগ করুন
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">ছবি</th>
                            <th scope="col" className="px-6 py-3">পণ্যের নাম</th>
                            <th scope="col" className="px-6 py-3">মূল্য</th>
                            <th scope="col" className="px-6 py-3">স্টক</th>
                            <th scope="col" className="px-6 py-3">ক্যাটাগরি</th>
                            <th scope="col" className="px-6 py-3">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded"/>
                                </td>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {product.name}
                                </th>
                                <td className="px-6 py-4">৳{product.price.toLocaleString('bn-BD')}</td>
                                <td className="px-6 py-4">{product.stock > 0 ? product.stock : <span className="text-red-500 font-semibold">শেষ</span>}</td>
                                <td className="px-6 py-4">{getCategoryName(product.category)}</td>
                                <td className="px-6 py-4 flex items-center space-x-2">
                                    <button onClick={() => handleOpenForm(product)} className="font-medium text-blue-600 hover:underline">সম্পাদনা</button>
                                    <button onClick={() => window.confirm('আপনি কি নিশ্চিতভাবে এই পণ্যটি মুছে ফেলতে চান?') && onDeleteProduct(product.id)} className="font-medium text-red-600 hover:underline">মুছুন</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isFormOpen && (
                <ProductForm
                    product={editingProduct}
                    onClose={handleCloseForm}
                    onAddProduct={onAddProduct}
                    onUpdateProduct={onUpdateProduct}
                />
            )}
        </div>
    );
};
