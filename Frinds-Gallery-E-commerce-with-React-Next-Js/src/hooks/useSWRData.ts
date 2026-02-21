import useSWR from 'swr';
import { databaseService } from '../services/databaseService';

// SWR configuration for different data types
const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 2000,
};

// Fetcher functions
const fetchers = {
  orders: (page: number, pageSize: number) => databaseService.getOrdersWithItems(page, pageSize),
  products: () => databaseService.getProducts(),
  customers: () => databaseService.getCustomers(),
  categories: () => databaseService.getCategories(),
};

// Custom hooks for different data types
export function useOrders(page: number = 1, pageSize: number = 20) {
  const { data, error, isLoading, mutate } = useSWR(
    ['orders', page, pageSize],
    () => fetchers.orders(page, pageSize),
    {
      ...swrConfig,
      revalidateOnMount: true,
    }
  );

  return {
    orders: data?.orders || [],
    totalPages: data?.totalPages || 0,
    totalOrders: data?.total || 0,
    currentPage: data?.page || page,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useProducts() {
  const { data, error, isLoading, mutate } = useSWR(
    'products',
    fetchers.products,
    {
      ...swrConfig,
      revalidateOnMount: true,
    }
  );

  return {
    products: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useCustomers() {
  const { data, error, isLoading, mutate } = useSWR(
    'customers',
    fetchers.customers,
    {
      ...swrConfig,
      revalidateOnMount: true,
    }
  );

  return {
    customers: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR(
    'categories',
    fetchers.categories,
    {
      ...swrConfig,
      revalidateOnMount: true,
    }
  );

  return {
    categories: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// Combined hook for dashboard that needs multiple data sources
export function useDashboardData() {
  const { orders, isLoading: ordersLoading } = useOrders(1, 1000);
  const { products, isLoading: productsLoading } = useProducts();
  const { customers, isLoading: customersLoading } = useCustomers();

  return {
    orders,
    products,
    customers,
    isLoading: ordersLoading || productsLoading || customersLoading,
  };
}
