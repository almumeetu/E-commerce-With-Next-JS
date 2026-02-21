import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import type { Product } from '../types';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onAddProduct: (newProduct: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => void;
  onUpdateProduct: (updatedProduct: Product) => void;
}

const initialFormState = {
    name: '',
    price: '',
    category: '',
    sku: '',
    stock: '0',
    description: ''
};

export default function ProductForm({ product, onClose, onAddProduct, onUpdateProduct }: ProductFormProps) {
  const [form, setForm] = useState(initialFormState);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (error) {
      throw new Error(`Image upload failed: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);
      
    if (!publicUrl) {
        throw new Error("Could not get public URL for uploaded image.");
    }

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      let imageUrl: string | null = null;
      if (file) {
        imageUrl = await uploadImage(file);
      }

      const payload = {
        name: form.name,
        price: parseFloat(form.price || '0'),
        category: form.category,
        sku: form.sku,
        stock: parseInt(form.stock || '0', 10),
        description: form.description,
        image_url: imageUrl,
        // Default values for fields not in form
        rating: 0,
        review_count: 0,
      };

      const { data, error: insertError } = await supabase
        .from('products')
        .insert([payload])
        .select()
        .single();

      if (insertError) throw insertError;

      onAddProduct({
        name: form.name,
        price: parseFloat(form.price),
        category: form.category,
        sku: form.sku,
        stock: parseInt(form.stock || '0', 10),
        description: form.description,
        imageUrl: imageUrl || '',
      });
      setForm(initialFormState);
      setFile(null);
      onClose();
      // Clear the file input
      const fileInput = document.getElementById('product-image-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Add New Product</h3>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              placeholder="Price"
              required
              step="0.01"
              min="0"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Category"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="SKU"
              value={form.sku}
              onChange={e => setForm({ ...form, sku: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              placeholder="Stock Quantity"
              min="0"
              value={form.stock}
              onChange={e => setForm({ ...form, stock: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
        </div>
        <textarea
          placeholder="Product Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
            </label>
            <input
              id="product-image-file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-cream file:text-brand-green hover:file:bg-green-100"
            />
            {file && <p className="text-sm text-gray-500 mt-2">Selected: {file.name}</p>}
        </div>

        <button type="submit" disabled={saving} className="w-full bg-brand-green text-white py-2 px-4 rounded-md hover:bg-brand-green-dark disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Product'}
        </button>
      </form>
    </div>
  );
}
