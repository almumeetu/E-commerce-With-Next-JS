import React, { useState, useEffect } from 'react';
import { useSiteContent, HeroSlide, Feature, DealOfTheDayConfig, Testimonial } from '../context/SiteContentContext';
import { Product } from '../types';
import { Trash, Plus, Save, Image as ImageIcon, Edit, Check, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import * as api from '../services/api';
import { ImageUpload } from './ImageUpload';

interface AdminContentManagerProps { }

export const AdminContentManager: React.FC<AdminContentManagerProps> = () => {
    const { content, updateContent, loading } = useSiteContent();
    const [activeTab, setActiveTab] = useState<'hero' | 'features' | 'deals' | 'testimonials'>('hero');
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await api.getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products for deal selector", error);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <div>Loading content settings...</div>;

    const renderTabButton = (id: 'hero' | 'features' | 'deals' | 'testimonials', label: string) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === id
                    ? 'bg-brand-green-deep text-brand-yellow'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Content Management</h2>

            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 border-b border-slate-100">
                {renderTabButton('hero', 'Hero Banner')}
                {renderTabButton('features', 'Features')}
                {renderTabButton('deals', 'Deal of the Day')}
                {renderTabButton('testimonials', 'Testimonials')}
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'hero' && <HeroEditor slides={content.heroSlides} onUpdate={(data) => updateContent('heroSlides', data)} />}
                {activeTab === 'features' && <FeaturesEditor features={content.features} onUpdate={(data) => updateContent('features', data)} />}
                {activeTab === 'deals' && (
                    <DealsEditor
                        config={content.dealOfTheDay}
                        products={products}
                        onUpdate={(data) => updateContent('dealOfTheDay', data)}
                    />
                )}
                {activeTab === 'testimonials' && <TestimonialsEditor testimonials={content.testimonials} onUpdate={(data) => updateContent('testimonials', data)} />}
            </div>
        </div>
    );
};

// --- Sub-Editors ---

const HeroEditor: React.FC<{ slides: HeroSlide[], onUpdate: (data: HeroSlide[]) => void }> = ({ slides, onUpdate }) => {
    const handleChange = (index: number, field: keyof HeroSlide, value: any) => {
        const newSlides = [...slides];
        newSlides[index] = { ...newSlides[index], [field]: value };
        onUpdate(newSlides);
    };

    const addSlide = () => {
        const newSlide: HeroSlide = {
            id: Date.now(),
            image: '/images/banner/banner.webp',
            subtitle: 'New Subtitle',
            title: 'New Title',
            titleHighlight: 'Highlight',
            description: 'Description here...',
            primaryBtn: 'Button 1',
            secondaryBtn: 'Button 2',
            primaryLink: 'shop',
            secondaryLink: 'hotDeals'
        };
        onUpdate([...slides, newSlide]);
    };

    const removeSlide = (index: number) => {
        const newSlides = slides.filter((_, i) => i !== index);
        onUpdate(newSlides);
    };

    return (
        <div className="space-y-6">
            {slides.map((slide, index) => (
                <div key={slide.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 relative group">
                    <button
                        onClick={() => removeSlide(index)}
                        className="absolute top-2 right-2 p-2 text-red-500 bg-white rounded-full shadow-sm hover:bg-red-50"
                        title="Remove Slide"
                    >
                        <Trash size={16} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <ImageUpload
                                label="Hero Image"
                                value={slide.image}
                                onChange={(url) => handleChange(index, 'image', url)}
                                bucketName="site-assets"
                            />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle</label>
                                <input
                                    type="text"
                                    value={slide.subtitle}
                                    onChange={e => handleChange(index, 'subtitle', e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Title (Start)</label>
                                <input
                                    type="text"
                                    value={slide.title}
                                    onChange={e => handleChange(index, 'title', e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Title Highlight</label>
                                <input
                                    type="text"
                                    value={slide.titleHighlight}
                                    onChange={e => handleChange(index, 'titleHighlight', e.target.value)}
                                    className="w-full p-2 border rounded-lg text-brand-golden"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <textarea
                                value={slide.description}
                                onChange={e => handleChange(index, 'description', e.target.value)}
                                className="w-full p-2 border rounded-lg"
                                rows={2}
                            />
                        </div>
                    </div>
                </div>
            ))}
            <button
                onClick={addSlide}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-brand-green hover:text-brand-green transition-colors flex items-center justify-center gap-2"
            >
                <Plus size={20} /> Add New Slide
            </button>
        </div>
    );
};

const FeaturesEditor: React.FC<{ features: Feature[], onUpdate: (data: Feature[]) => void }> = ({ features, onUpdate }) => {
    const handleChange = (index: number, field: keyof Feature, value: any) => {
        const newFeatures = [...features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        onUpdate(newFeatures);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
                <div key={feature.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={feature.title}
                                onChange={e => handleChange(index, 'title', e.target.value)}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <input
                                type="text"
                                value={feature.description}
                                onChange={e => handleChange(index, 'description', e.target.value)}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Icon Name</label>
                            <select
                                value={feature.icon}
                                onChange={e => handleChange(index, 'icon', e.target.value)}
                                className="w-full p-2 border rounded-lg"
                            >
                                <option value="SparklesIcon">Sparkles</option>
                                <option value="FireIcon">Fire</option>
                                <option value="TruckIcon">Truck</option>
                                <option value="ChatBubbleLeftRightIcon">Chat</option>
                            </select>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const DealsEditor: React.FC<{ config: DealOfTheDayConfig, products: Product[], onUpdate: (data: DealOfTheDayConfig) => void }> = ({ config, products, onUpdate }) => {
    const handleChange = (field: keyof DealOfTheDayConfig, value: any) => {
        onUpdate({ ...config, [field]: value });
    };

    return (
        <div className="max-w-2xl mx-auto border border-slate-200 rounded-xl p-6 bg-slate-50">
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Select Product for Deal</label>
                    <select
                        value={config.productId}
                        onChange={e => handleChange('productId', e.target.value)}
                        className="w-full p-2 border rounded-lg"
                    >
                        <option value="">Select a product...</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name} - ৳{p.price}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <input
                        type="text"
                        value={config.title}
                        onChange={e => handleChange('title', e.target.value)}
                        className="w-full p-2 border rounded-lg"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle</label>
                    <textarea
                        value={config.subtitle}
                        onChange={e => handleChange('subtitle', e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        rows={2}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                    <input
                        type="datetime-local"
                        value={config.endTime ? new Date(config.endTime).toISOString().slice(0, 16) : ''}
                        onChange={e => handleChange('endTime', new Date(e.target.value).toISOString())}
                        className="w-full p-2 border rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
};


const TestimonialsEditor: React.FC<{ testimonials: Testimonial[], onUpdate: (data: Testimonial[]) => void }> = ({ testimonials, onUpdate }) => {
    const handleChange = (index: number, field: keyof Testimonial, value: any) => {
        const newTestimonials = [...testimonials];
        newTestimonials[index] = { ...newTestimonials[index], [field]: value };
        onUpdate(newTestimonials);
    };

    const addTestimonial = () => {
        const newItem: Testimonial = {
            id: Date.now(),
            name: "New Reviewer",
            role: "Customer",
            comment: "Great service!",
            rating: 5,
            image: "https://via.placeholder.com/150"
        };
        onUpdate([...testimonials, newItem]);
    };

    const removeTestimonial = (index: number) => {
        const newItems = testimonials.filter((_, i) => i !== index);
        onUpdate(newItems);
    };

    return (
        <div className="space-y-6">
            {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 relative">
                    <button
                        onClick={() => removeTestimonial(index)}
                        className="absolute top-2 right-2 p-2 text-red-500 bg-white rounded-full shadow-sm hover:bg-red-50"
                        title="Remove"
                    >
                        <Trash size={16} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={testimonial.name}
                                onChange={e => handleChange(index, 'name', e.target.value)}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Role/Location</label>
                            <input
                                type="text"
                                value={testimonial.role}
                                onChange={e => handleChange(index, 'role', e.target.value)}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Comment</label>
                            <textarea
                                value={testimonial.comment}
                                onChange={e => handleChange(index, 'comment', e.target.value)}
                                className="w-full p-2 border rounded-lg"
                                rows={2}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Rating (1-5)</label>
                            <input
                                type="number"
                                min="1" max="5"
                                value={testimonial.rating}
                                onChange={e => handleChange(index, 'rating', Number(e.target.value))}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <ImageUpload
                                label="Profile Image"
                                value={testimonial.image}
                                onChange={(url) => handleChange(index, 'image', url)}
                                bucketName="site-assets"
                            />
                        </div>
                    </div>
                </div>
            ))}
            <button
                onClick={addTestimonial}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-brand-green hover:text-brand-green transition-colors flex items-center justify-center gap-2"
            >
                <Plus size={20} /> Add New Testimonial
            </button>
        </div>
    );
};
