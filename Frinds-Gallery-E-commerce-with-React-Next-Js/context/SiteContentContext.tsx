import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isDbConnected } from '../lib/supabase';
import { toast } from 'react-hot-toast';

// --- Types ---

export interface HeroSlide {
  id: number;
  image: string;
  subtitle: string;
  title: string;
  titleHighlight: string; // The part of the title that is highlighted
  description: string;
  primaryBtn: string;
  secondaryBtn: string;
  primaryLink: string;
  secondaryLink: string;
}

export interface Feature {
  id: number;
  icon: string; // Store icon name as string 'sparkles', 'fire', etc.
  title: string;
  description: string;
}

export interface DealOfTheDayConfig {
  productId: string; // ID of the product to show
  title: string;
  subtitle: string;
  endTime: string; // ISO date string
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  comment: string;
  rating: number;
  image: string;
}

export interface SiteContent {
  heroSlides: HeroSlide[];
  features: Feature[];
  dealOfTheDay: DealOfTheDayConfig;
  testimonials: Testimonial[];
}

export interface SiteContentContextType {
  content: SiteContent;
  updateContent: (section: keyof SiteContent, data: any) => Promise<void>;
  loading: boolean;
}

// --- Default Data ---

const defaultHeroSlides: HeroSlide[] = [
    {
        id: 1,
        image: '/images/banner/banner.webp',
        subtitle: 'নতুন কালেকশন ২০২৪',
        title: 'আপনার ',
        titleHighlight: 'ফ্যাশন', // Logic to reconstruct: <>{title} <span className="...">{titleHighlight}</span>...</>
        description: 'শৈলী আর আভিজাত্যের এক অপূর্ব সমন্বয়। আধুনিক ডিজাইনের শ্রেষ্ঠ পোশাক সম্ভার এখন আপনার নাগালে।',
        primaryBtn: 'শপ ভিজিট করুন',
        secondaryBtn: 'মেগা অফার',
        primaryLink: 'shop',
        secondaryLink: 'hotDeals'
    },
    {
        id: 2,
        image: '/images/banner/banner-2.webp',
        subtitle: 'এক্সক্লুসিভ কালেকশন',
        title: 'সেরা ',
        titleHighlight: 'ডিজাইন',
        description: 'প্রিমিয়াম কোয়ালিটির নিশ্চয়তা। আপনার পছন্দের পোশাকটি বেছে নিন আমাদের বিশাল কালেকশন থেকে।',
        primaryBtn: 'অর্ডার করুন',
        secondaryBtn: 'নতুন কালেকশন',
        primaryLink: 'shop',
        secondaryLink: 'shop'
    },
    {
        id: 3,
        image: '/images/banner/banner-3.webp',
        subtitle: 'ঈদ স্পেশাল',
        title: 'উৎসবের ',
        titleHighlight: 'রঙ',
        description: 'ঈদের কেনাকাটায় বিশেষ ছাড়। আপনার প্রিয়জনের জন্য সেরা উপহারটি কিনুন এখনই।',
        primaryBtn: 'শপ ভিজিট করুন',
        secondaryBtn: 'ডিসকাউন্ট',
        primaryLink: 'shop',
        secondaryLink: 'hotDeals'
    }
];

const defaultFeatures: Feature[] = [
    { id: 1, title: "নতুন কালেকশন", description: "সর্বশেষ ডিজাইন দেখুন", icon: "SparklesIcon" },
    { id: 2, title: "বেস্ট ডিল", description: "সেরা দামে সেরা পণ্য", icon: "FireIcon" },
    { id: 3, title: "দ্রুত ডেলিভারি", description: "সারা দেশে হোম ডেলিভারি", icon: "TruckIcon" },
    { id: 4, title: "কাস্টমার সাপোর্ট", description: "২৪/৭ হেল্পলাইন", icon: "ChatBubbleLeftRightIcon" },
];

const defaultDeal: DealOfTheDayConfig = {
    productId: 'islamic-item-1', // Needs a valid ID
    title: 'ডিল অফ দ্য ডে',
    subtitle: 'এই বিশেষ অফারটি দ্রুত ফুরিয়ে আসছে, এখনই সংগ্রহ করুন!',
    endTime: new Date(new Date().setHours(23, 59, 59, 999)).toISOString()
};

const defaultTestimonials: Testimonial[] = [
    {
        id: 1,
        name: "Sumaiya Akter",
        role: "Regular Customer",
        comment: "খুবই সুন্দর কালেকশন। আমি আবায়া অর্ডার করেছিলাম, যেমনটা ছবিতে দেখেছি ঠিক তেমনই পেয়েছি।",
        rating: 5,
        image: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
        id: 2,
        name: "Fatima Begum",
        role: "Verified Buyer",
        comment: "ডেলিভারি খুব ফাস্ট ছিল। আর কাপড়ের কোয়ালিটিও খুব ভালো। ধন্যবাদ ফ্রেন্ডস গ্যালারি।",
        rating: 5,
        image: "https://randomuser.me/api/portraits/women/2.jpg"
    }
];

const defaultContent: SiteContent = {
    heroSlides: defaultHeroSlides,
    features: defaultFeatures,
    dealOfTheDay: defaultDeal,
    testimonials: defaultTestimonials
};

// --- Context ---

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [content, setContent] = useState<SiteContent>(defaultContent);
    const [loading, setLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        const loadContent = async () => {
            setLoading(true);
            try {
                if (isDbConnected) {
                    const { data, error } = await supabase
                        .from('site_settings')
                        .select('key, value');
                    
                    if (data && !error) {
                        const newContent = { ...defaultContent };
                        data.forEach((item: any) => {
                            if (newContent[item.key as keyof SiteContent]) {
                                newContent[item.key as keyof SiteContent] = item.value;
                            }
                        });
                        setContent(newContent);
                    }
                } else {
                    // Load from LocalStorage
                    const savedContent = localStorage.getItem('site_content');
                    if (savedContent) {
                        setContent(JSON.parse(savedContent));
                    }
                }
            } catch (error) {
                console.error("Failed to load site content", error);
                toast.error("Failed to load site content");
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, []);

    // Update Function
    const updateContent = async (section: keyof SiteContent, data: any) => {
        const newContent = { ...content, [section]: data };
        setContent(newContent);

        try {
            if (isDbConnected) {
                const { error } = await supabase
                    .from('site_settings')
                    .upsert({ key: section, value: data });
                
                if (error) throw error;
            } else {
                localStorage.setItem('site_content', JSON.stringify(newContent));
            }
            toast.success("Content updated successfully!");
        } catch (error) {
            console.error("Failed to save content", error);
            toast.error("Failed to save changes");
            // Revert state if needed? For now, we assume success or user will retry.
        }
    };

    return (
        <SiteContentContext.Provider value={{ content, updateContent, loading }}>
            {children}
        </SiteContentContext.Provider>
    );
};

export const useSiteContent = () => {
    const context = useContext(SiteContentContext);
    if (context === undefined) {
        throw new Error('useSiteContent must be used within a SiteContentProvider');
    }
    return context;
};
