import React from 'react';
import ProductForm from './ProductForm';
import ProductsList from './ProductsList';

export default function AdminDashboard() {

  // The onSaved callback is passed to ProductForm.
  // When a product is saved, the realtime subscription in ProductsList
  // will automatically detect the change and refresh the list.
  // We could manually add the new product to a local state here
  // for an even faster UI update, but realtime is usually fast enough.
  const handleSaved = () => {
    console.log("Product saved. The list will update via realtime subscription.");
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900">Product Management</h2>
      <ProductForm onSaved={handleSaved} />
      <ProductsList />
    </div>
  );
}
