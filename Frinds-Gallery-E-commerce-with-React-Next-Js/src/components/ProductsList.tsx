import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import type { Product } from '../types';

// Helper to map Supabase product data to our Product type
const mapProductData = (data: any): Product => ({
    id: data.id,
    name: data.name,
    price: data.price,
    originalPrice: data.original_price,
    imageUrl: data.image_url,
    category: data.category,
    sku: data.sku,
    stock: data.stock,
    rating: data.rating,
    reviewCount: data.review_count,
});

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching products:', fetchError);
        setError(fetchError.message);
      } else {
        setProducts((data || []).map(mapProductData));
      }
      setLoading(false);
    };

    fetchProducts();

    const channel = supabase
      .channel('products-list-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('Change received!', payload);
          // Just refetch the whole list for simplicity
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const removeProduct = async (id: string, imageUrl: string | undefined) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      // First, delete the product from the database
      const { error: deleteError } = await supabase.from('products').delete().eq('id', id);
      if (deleteError) throw deleteError;

      // If successful, and there was an image, delete it from storage
      if (imageUrl) {
        const fileName = imageUrl.split('/').pop();
        if (fileName) {
            const { error: storageError } = await supabase.storage
              .from('product-images')
              .remove([fileName]);
            if (storageError) {
              // Log the error but don't block the UI. The product is already deleted.
              console.error("Failed to delete product image from storage:", storageError.message);
            }
        }
      }
      
      // The realtime subscription will handle the UI update
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">Error loading products: {error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Product List ({products.length})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(p => (
                <div key={p.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm relative">
                    <img
                        src={p.imageUrl || '/placeholder.svg'}
                        alt={p.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                    />
                    <div className="p-4">
                        <h4 className="font-bold text-lg truncate">{p.name}</h4>
                        <p className="text-gray-600">৳{p.price}</p>
                        <p className="text-sm text-gray-500">Stock: {p.stock}</p>
                    </div>
                    <button 
                        onClick={() => removeProduct(p.id, p.imageUrl)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                        aria-label="Delete product"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    </div>
  );
}
