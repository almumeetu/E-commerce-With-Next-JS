import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Camera, Upload, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
    bucketName?: 'product-images' | 'site-assets';
    className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    label = "Image Upload",
    bucketName = 'site-assets',
    className
}) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            setError(null);

            if (!event.target.files || event.target.files.length === 0) {
                return;
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload using standard Supabase storage
            const { error: uploadError, data } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file);

            if (uploadError) {
                // Determine if error is likely due to missing bucket
                if (uploadError.message.includes("Bucket not found") || uploadError.message.includes("row-level security")) {
                    throw new Error(`Storage bucket '${bucketName}' not configured or missing permissions.`);
                }
                throw uploadError;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            onChange(publicUrl);
        } catch (error: any) {
            console.error('Error uploading image:', error);
            setError(error.message || 'Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        onChange('');
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}

            <div className="flex items-start gap-4">
                {value ? (
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-lg overflow-hidden border border-slate-200">
                            <img
                                src={value}
                                alt="Uploaded preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button
                            onClick={handleRemove}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
                            type="button"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <div className="w-32 h-32 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors relative">
                        {uploading ? (
                            <div className="text-center">
                                <Loader2 className="animate-spin text-brand-green mx-auto mb-1" size={24} />
                                <span className="text-xs text-slate-500">Uploading...</span>
                            </div>
                        ) : (
                            <>
                                <Upload className="text-slate-400" size={24} />
                                <span className="sr-only">Upload</span>
                            </>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={uploading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                    </div>
                )}

                <div className="flex-1 space-y-2">
                    <p className="text-xs text-slate-500">
                        সরাসরি ইমেজ আপলোড করুন অথবা URL ব্যবহার করুন।
                    </p>
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Or enter image URL..."
                        className="w-full text-sm border-slate-200 rounded-md focus:border-brand-green focus:ring-brand-green"
                    />
                    {error && (
                        <p className="text-xs text-red-500 bg-red-50 p-2 rounded border border-red-100">
                            {error} <br />
                            <span className="italic opacity-75">Check Supabase storage settings.</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
