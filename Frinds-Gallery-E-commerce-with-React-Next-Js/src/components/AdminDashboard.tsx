import React from 'react';
import ProductForm from './ProductForm';
import ProductsList from './ProductsList';

export default function AdminDashboard() {

  const handleAddProduct = (newProduct: Omit<any, 'id' | 'rating' | 'reviewCount'>) => {
    console.log("Product added:", newProduct);
  };

  const handleUpdateProduct = (updatedProduct: any) => {
    console.log("Product updated:", updatedProduct);
  };

  const handleCloseForm = () => {
    console.log("Form closed");
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900">Product Management</h2>
      <ProductForm 
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onClose={handleCloseForm}
      />
      <ProductsList />
    </div>
  );
}
