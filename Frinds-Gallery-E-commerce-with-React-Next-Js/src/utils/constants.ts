/**
 * Constants and enums for the application
 */

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'নেটওয়ার্ক সংযোগ ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।',
  SERVER_ERROR: 'সার্ভারে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।',
  VALIDATION_ERROR: 'অনুগ্রহ করে সঠিক তথ্য প্রবেশ করুন।',
  NOT_FOUND: 'পণ্য বা পৃষ্ঠা পাওয়া যায়নি।',
  UNAUTHORIZED: 'অনুমতি প্রদান করা হয়নি।',
  FORBIDDEN: 'এই অ্যাকশন অনুমোদিত নয়।',
} as const;

export const SUCCESS_MESSAGES = {
  ADDED_TO_CART: 'পণ্য কার্টে যুক্ত হয়েছে',
  ADDED_TO_WISHLIST: 'পণ্য উইশলিস্টে যুক্ত হয়েছে',
  REMOVED_FROM_WISHLIST: 'পণ্য উইশলিস্ট থেকে সরানো হয়েছে',
  ORDER_PLACED: 'আপনার অর্ডার সফলভাবে তৈরি হয়েছে',
  QUANTITY_UPDATED: 'পরিমাণ আপডেট হয়েছে',
} as const;

export const VALIDATION_RULES = {
  MIN_PHONE_LENGTH: 10,
  MAX_PHONE_LENGTH: 15,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_ADDRESS_LENGTH: 5,
  MAX_ADDRESS_LENGTH: 200,
} as const;

export const API_TIMEOUTS = {
  DEFAULT: 10000,
  SHORT: 5000,
  LONG: 30000,
} as const;

export const CACHE_DURATIONS = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 24 * 60 * 60 * 1000, // 24 hours
} as const;

export const ROUTE_PATHS = {
  HOME: '/',
  SHOP: '/shop',
  PRODUCT_DETAILS: '/product/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: '/order-success',
  WISHLIST: '/wishlist',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  PRIVACY: '/privacy-policy',
  TERMS: '/terms-conditions',
} as const;

export const DELIVERY_OPTIONS = [
  {
    id: 'inside-dhaka',
    name: 'ঢাকার মধ্যে',
    cost: 60,
    days: '১-২ দিন',
  },
  {
    id: 'outside-dhaka',
    name: 'ঢাকার বাহিরে',
    cost: 120,
    days: '৩-৪ দিন',
  },
  {
    id: 'all-bangladesh',
    name: 'সারা বাংলাদেশ',
    cost: 150,
    days: '৪-৭ দিন',
  },
] as const;

export const PRODUCT_CATEGORIES = {
  DATES: 'dates',
  IFTAR: 'iftar',
  SEHRI: 'sehri',
  ISLAMIC: 'islamic',
  DRINKS: 'drinks',
} as const;
