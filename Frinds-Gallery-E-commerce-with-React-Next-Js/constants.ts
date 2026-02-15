import type { Product, Category, Review, ProductReview, Order, Customer } from './types';

export const districts = [
  'ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'সিলেট', 'বরিশাল', 'রংপুর', 'ময়মনসিংহ'
];

export const upazilas: { [key: string]: string[] } = {
  'ঢাকা': ['ধানমন্ডি', 'গুলশান', 'বনানী', 'উত্তরা', 'মিরপুর'],
  'চট্টগ্রাম': ['কোতোয়ালী', 'পাহাড়তলী', 'ডবলমুরিং', 'বন্দর'],
  'রাজশাহী': ['বোয়ালিয়া', 'রাজপাড়া', 'মতিহার', 'শাহমখদুম'],
  'খুলনা': ['খুলনা সদর', 'সোনাডাঙ্গা', 'দৌলতপুর'],
  'সিলেট': ['সিলেট সদর', 'শাহপরাণ', 'জালালাবাদ'],
  'বরিশাল': ['বরিশাল সদর', 'কাউনিয়া', 'বন্দর'],
  'রংপুর': ['রংপুর সদর', 'হারাগাছ', 'তাজহাট'],
  'ময়মনসিংহ': ['ময়মনসিংহ সদর', 'ত্রিশাল', 'মুক্তাগাছা'],
};

export const categories: Category[] = [
    { id: 'all', name: 'সকল', imageUrl: '' },
    { id: 'long-khimar', name: 'লং খিমার কালেকশন', imageUrl: '/images/category/category-image (1).png' },
    { id: 'three-piece', name: 'থ্রি-পিস', imageUrl: '/images/category/category-image (2).png' },
    { id: 'hijab', name: 'হিজাব কালেকশন', imageUrl: '/images/category/category-image (3).png' },
    { id: 'innar-collection', name: 'ইনার কালেকশন', imageUrl: '/images/category/category-image (4).png' },
    { id: 'islamic-item', name: 'ইসলামিক আইটেম', imageUrl: '/images/category/category-image (5).png' },
];

export const mockProductReviews: ProductReview[] = [
    { id: 'rev1', productId: 'prod_1', author: 'আমিনা বেগম', email: 'amina@example.com', rating: 5, comment: 'খুবই সুন্দর একটি খিমার। কাপড়টা অনেক সফট এবং আরামদায়ক।', date: '2024-07-20T10:00:00Z' },
    { id: 'rev2', productId: 'prod_1', author: 'ফারিয়া সুলতানা', email: 'faria@example.com', rating: 4, comment: 'রঙটা ছবিতে যেমন দেখেছি তেমনই। ডেলিভারিও দ্রুত পেয়েছি।', date: '2024-07-18T15:30:00Z' },
    { id: 'rev3', productId: 'prod_2', author: 'জান্নাতুল ফেরদৌস', email: 'jannat@example.com', rating: 5, comment: 'এই হিজাবটা আমার কালেকশনের সেরা। খুবই প্রিমিয়াম কোয়ালিটি।', date: '2024-07-21T09:00:00Z' },
    { id: 'rev4', productId: 'prod_4', author: 'সাদিয়া আফরিন', email: 'sadia@example.com', rating: 5, comment: 'থ্রি-পিসটা অসাধারণ। ডিজাইন এবং কাপড়ের মান দুটোই খুব ভালো।', date: '2024-07-19T12:00:00Z' },
    { id: 'rev5', productId: 'prod_4', author: 'নুসরাত জাহান', email: 'nusrat@example.com', rating: 4, comment: 'যেমনটা আশা করেছিলাম তেমনই পেয়েছি। ধন্যবাদ।', date: '2024-07-15T18:45:00Z' },
];


export const mockReviews: Review[] = [
    { id: 1, quote: 'ফ্রেন্ডস গ্যালির কালেকশন অসাধারণ। তাদের ব্যবহার এবং ডেলিভারি দুটোই খুব ভালো।', author: 'তাসনিয়া আহমেদ', location: 'ঢাকা', rating: 5, avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { id: 2, quote: 'আমি এখান থেকে একটা কুর্তি কিনেছি, কাপড়ের মান খুবই উন্নত। ধন্যবাদ!', author: 'রাবেয়া খাতুন', location: 'খুলনা', rating: 4, avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
    { id: 3, quote: 'খুব দ্রুত ডেলিভারি পেয়েছি। প্রোডাক্টের কোয়ালিটিও খুব ভালো। আমি সন্তুষ্ট।', author: 'মরিয়ম আক্তার', location: 'সিলেট', rating: 5, avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
];

export const brands = [
    { name: 'Premium Quality', logoUrl: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' },
    { name: 'Fast Delivery', logoUrl: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png' },
    { name: 'Secure Payment', logoUrl: 'https://cdn-icons-png.flaticon.com/512/4108/4108833.png' },
    { name: 'Customer Support', logoUrl: 'https://cdn-icons-png.flaticon.com/512/3079/3079178.png' },
    { name: 'Easy Returns', logoUrl: 'https://cdn-icons-png.flaticon.com/512/2769/2769339.png' },
    { name: 'Best Price', logoUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135706.png' },
];

export const paymentMethods = [
    { id: 'cod', name: 'ক্যাশ অন ডেলিভারি', icon: 'https://cdn-icons-png.flaticon.com/512/4108/4108042.png' },
    { id: 'bkash', name: 'বিকাশ', icon: '/images/logo/bkash.png' },
    { id: 'nagad', name: 'নগদ', icon: '/images/logo/nagad.png' },
];
