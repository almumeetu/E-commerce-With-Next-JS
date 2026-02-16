import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Search, Package, Loader2, Save } from 'lucide-react';
import * as api from '../services/api';
import { supabase } from '../services/supabase';
import type { Category } from '../types';

const AdminCategories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        setUploadingImage(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `cat_${Math.random()}.${fileExt}`;
            const filePath = `category-images/${fileName}`;

            const { data, error } = await supabase.storage
                .from('categories')
                .upload(filePath, file);

            if (error) {
                // If categories bucket fails (policy etc), try products bucket as fallback
                console.warn("Categories bucket upload failed, trying products bucket...", error);
                const { data: prodData, error: prodError } = await supabase.storage
                    .from('products')
                    .upload(`categories/${fileName}`, file);

                if (prodError) throw prodError;

                const { data: { publicUrl } } = supabase.storage
                    .from('products')
                    .getPublicUrl(`categories/${fileName}`);
                setPreviewUrl(publicUrl);
                return;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('categories')
                .getPublicUrl(filePath);

            setPreviewUrl(publicUrl);
        } catch (error: any) {
            console.error('Error uploading image:', error);
            alert('ইমেজ আপলোড করতে সমস্যা হয়েছে: ' + error.message);
        } finally {
            setUploadingImage(false);
        }
    };

    useEffect(() => {
        loadCategories();

        const channel = supabase
            .channel('category-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'categories'
                },
                (payload) => {
                    console.log('Category update received!', payload);
                    loadCategories();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        }
    }, []);

    const loadCategories = async () => {
        setIsLoading(true);
        try {
            const data = await api.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setPreviewUrl(category.image_url || null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('আপনি কি নিশ্চিত যে আপনি এই ক্যাটাগরি ডিলিট করতে চান?')) {
            try {
                await api.deleteCategory(id);
                setCategories(categories.filter(c => c.id !== id));
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('ক্যাটাগরি ডিলিট করতে সমস্যা হয়েছে');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        const categoryData = {
            name: formData.get('name') as string,
            icon: formData.get('icon') as string,
            image_url: previewUrl || editingCategory?.image_url,
            slug: (formData.get('name') as string).toLowerCase().replace(/\s+/g, '-')
        };

        try {
            if (editingCategory) {
                await api.updateCategory(editingCategory.id, categoryData);
            } else {
                await api.addCategory(categoryData);
            }
            await loadCategories();
            setIsModalOpen(false);
            setEditingCategory(null);
        } catch (error) {
            console.error('Error saving category:', error);
            alert('ক্যাটাগরি সেভ করতে সমস্যা হয়েছে');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-emerald-950">ক্যাটাগরি ম্যানেজমেন্ট</h2>
                    <p className="text-stone-500 font-medium mt-1">মোট {categories.length} টি ক্যাটাগরি</p>
                </div>
                <button
                    onClick={() => { setEditingCategory(null); setPreviewUrl(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 active:scale-95"
                >
                    <Plus size={20} /> নতুন ক্যাটাগরি
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-3">
                <Search className="text-stone-400" size={20} />
                <input
                    type="text"
                    placeholder="ক্যাটাগরি খুঁজুন..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 outline-none text-stone-600 font-medium placeholder:text-stone-300"
                />
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-emerald-600" size={40} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCategories.map((category) => (
                        <div key={category.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-all group relative overflow-hidden">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button onClick={() => handleEdit(category)} className="p-2 hover:bg-stone-100 rounded-lg text-emerald-600 transition-colors">
                                    <Edit2 size={18} />
                                </button>
                                <button onClick={() => handleDelete(category.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-stone-50 flex items-center justify-center text-3xl shadow-inner border border-stone-100">
                                    {category.icon || <Package />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-emerald-950">{category.name}</h3>
                                    <p className="text-stone-400 text-xs font-mono mt-1 opacity-50">{category.id.slice(0, 8)}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredCategories.length === 0 && (
                        <div className="col-span-full py-16 text-center">
                            <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="text-stone-300" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-stone-400">কোনো ক্যাটাগরি পাওয়া যায়নি</h3>
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-32 bg-emerald-600/10 -skew-y-6 transform origin-top-left -translate-y-10"></div>

                        <div className="p-8 relative">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black text-emerald-950">
                                    {editingCategory ? 'ক্যাটাগরি এডিট করুন' : 'নতুন ক্যাটাগরি'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors relative z-10">
                                    <X size={24} className="text-stone-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-stone-400 uppercase tracking-widest leading-loose">ক্যাটাগরি ছবি (অপশনাল)</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center overflow-hidden relative group">
                                            {previewUrl || editingCategory?.image_url ? (
                                                <img src={previewUrl || editingCategory?.image_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <Package className="text-stone-300" size={32} />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                                            />
                                            {uploadingImage && <p className="text-xs text-emerald-600 mt-1 font-medium animate-pulse">আপলোড হচ্ছে...</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-stone-400 uppercase tracking-widest leading-loose">ক্যাটাগরির নাম</label>
                                    <input
                                        name="name"
                                        defaultValue={editingCategory?.name}
                                        required
                                        className="w-full px-6 py-4 rounded-2xl bg-stone-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 outline-none font-bold text-stone-700 transition-all placeholder:text-stone-300"
                                        placeholder="যেমন: পানীয়"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-stone-400 uppercase tracking-widest leading-loose">আইকন (Emoji)</label>
                                    <input
                                        name="icon"
                                        defaultValue={editingCategory?.icon || '📦'}
                                        className="w-full px-6 py-4 rounded-2xl bg-stone-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 outline-none font-bold text-stone-700 transition-all placeholder:text-stone-300"
                                        placeholder="Example: 🥤"
                                    />
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-6 py-4 rounded-2xl font-bold text-stone-500 hover:bg-stone-50 transition-colors"
                                    >
                                        বাতিল
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || uploadingImage}
                                        className="flex-[2] bg-emerald-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />
                                                সেভ হচ্ছে...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={20} />
                                                সেভ করুন
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
