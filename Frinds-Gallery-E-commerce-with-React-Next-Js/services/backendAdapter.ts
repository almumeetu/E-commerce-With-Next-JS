// Backend Adapter - Simplified to only use Supabase
import { productService as supabaseProductService } from './productService';
import { databaseService } from './databaseService';
import { categories } from '../constants';
import type { Product, Category } from '../types';

/**
 * Unified Product Service - Uses Supabase
 */
export const productServiceAdapter = {
  async getAllProducts(limit?: number): Promise<Product[]> {
    try {
      return await supabaseProductService.getAllProducts();
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  async getProductsByCategory(category: string, limit?: number): Promise<Product[]> {
    try {
      return await supabaseProductService.getProductsByCategory(category);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      return await supabaseProductService.getProductById(id);
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  async searchProducts(query: string, limit?: number): Promise<Product[]> {
    try {
      return await supabaseProductService.searchProducts(query);
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  },

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    return await supabaseProductService.createProduct(product);
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    return await supabaseProductService.updateProduct(id, updates);
  },

  async deleteProduct(id: string): Promise<void> {
    return await supabaseProductService.deleteProduct(id);
  },
};

/**
 * Unified Category Service
 */
export const categoryServiceAdapter = {
  async getAllCategories(): Promise<Category[]> {
    try {
      // Prefer Supabase databaseService if available, otherwise fallback to constants
      const supabaseCategories = await databaseService.getCategories();
      if (supabaseCategories && supabaseCategories.length > 0) {
        return supabaseCategories.map((c: any) => ({
          id: c.id,
          name: c.name,
          icon: c.icon || '📦'
        }));
      }
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return categories;
    }
  },
};

/**
 * Unified Order Service
 */
export const orderServiceAdapter = {
  async getCustomerOrders(customerId?: string): Promise<any[]> {
    try {
      if (customerId) {
        return await databaseService.getOrdersWithItems();
      }
      return [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },
};

// Export current backend status
export const getBackendStatus = () => {
  return {
    isWordPress: false,
    backend: 'Supabase',
    endpoint: 'Supabase Database',
  };
};
