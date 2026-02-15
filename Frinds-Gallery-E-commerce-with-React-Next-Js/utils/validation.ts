/**
 * Validation utilities for form inputs and data
 */

import { VALIDATION_RULES, ERROR_MESSAGES } from './constants';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return (
    cleaned.length >= VALIDATION_RULES.MIN_PHONE_LENGTH &&
    cleaned.length <= VALIDATION_RULES.MAX_PHONE_LENGTH
  );
};

export const validateName = (name: string): boolean => {
  return (
    name.trim().length >= VALIDATION_RULES.MIN_NAME_LENGTH &&
    name.trim().length <= VALIDATION_RULES.MAX_NAME_LENGTH
  );
};

export const validateAddress = (address: string): boolean => {
  return (
    address.trim().length >= VALIDATION_RULES.MIN_ADDRESS_LENGTH &&
    address.trim().length <= VALIDATION_RULES.MAX_ADDRESS_LENGTH
  );
};

export const validateCheckoutForm = (formData: {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!formData.name || !validateName(formData.name)) {
    errors.push({
      field: 'name',
      message: 'নাম অবশ্যই ২-৫০ অক্ষরের মধ্যে হতে হবে',
    });
  }

  if (!formData.phone || !validatePhoneNumber(formData.phone)) {
    errors.push({
      field: 'phone',
      message: 'সঠিক ফোন নম্বর প্রবেশ করুন (১০-১৫ সংখ্যা)',
    });
  }

  if (formData.email && !validateEmail(formData.email)) {
    errors.push({
      field: 'email',
      message: 'সঠিক ইমেইল ঠিকানা প্রবেশ করুন',
    });
  }

  if (!formData.address || !validateAddress(formData.address)) {
    errors.push({
      field: 'address',
      message: 'ঠিকানা অবশ্যই ৫-২০০ অক্ষরের মধ্যে হতে হবে',
    });
  }

  return errors;
};

export const formatPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '').slice(-10);
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
