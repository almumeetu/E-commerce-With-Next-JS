import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { Footer } from './components/Footer';
import { FloatingCart } from './components/FloatingCart';
import { FloatingSocials } from './components/FloatingSocials';
import { UtilityPage } from './pages/UtilityPage';
import { QuickViewModal } from './components/QuickViewModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import type { Product, Category, CartItem, OrderDetails, Order, Customer, OrderItem } from './types';
import * as api from './services/api';

// Lazy-load non-critical pages for faster initial load
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage').then(m => ({ default: m.OrderSuccessPage })));
const WishlistPage = lazy(() => import('./pages/WishlistPage').then(m => ({ default: m.WishlistPage })));
const HotDealsPage = lazy(() => import('./pages/HotDealsPage').then(m => ({ default: m.HotDealsPage })));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage').then(m => ({ default: m.AboutUsPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const AccountPage = lazy(() => import('./pages/AccountPage').then(m => ({ default: m.AccountPage })));
const AuthPage = lazy(() => import('./pages/AuthPage').then(m => ({ default: m.AuthPage })));
const ReturnsPage = lazy(() => import('./pages/ReturnsPage').then(m => ({ default: m.ReturnsPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));


export type Page = 'home' | 'shop' | 'productDetail' | 'checkout' | 'orderSuccess' | 'wishlist' | 'admin' | 'utility' | 'hotDeals' | 'about' | 'contact' | 'account' | 'returns' | 'terms';

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 500);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-24 right-6 p-4 rounded-2xl bg-brand-green-deep text-brand-yellow shadow-2xl transition-all duration-500 z-50 transform hover:scale-110 active:scale-95 border-2 border-brand-yellow/30 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" /></svg>
    </button>
  );
};

const App: React.FC = () => {

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check URL pathname for admin
  const path = window.location.pathname;
  const initialPage = path === '/admin' ? 'admin' : 'home';

  const [currentPage, setCurrentPage] = useState<Page>(initialPage);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]); // Array of product IDs
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [initialCategory, setInitialCategory] = useState<string>('all');
  const [currentUser, setCurrentUser] = useState<Customer | null>(null);

  useEffect(() => {
    // Handle browser back/forward buttons
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        if (!api.isSupabaseConfigured()) {
          console.error("🔴 Supabase is NOT configured. Environment variables are missing.");
          alert("DATABASE CONNECTION ERROR:\n\nPlease set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel project settings or .env file.\n\nThe app is running in offline mode.");
        }
        setIsLoading(true);

        // Fetch data independently so one failure doesn't break everything
        const fetchProducts = api.getProducts().catch(e => { console.error('Products failed:', e); return []; });
        const fetchCategories = api.getCategories().catch(e => { console.error('Categories failed:', e); return []; });
        const fetchOrders = api.getOrders().catch(e => { console.error('Orders failed:', e); return []; });
        const fetchCustomers = api.getCustomers().catch(e => { console.error('Customers failed:', e); return []; });

        const [productsData, categoriesData, ordersData, customersData] = await Promise.all([
          fetchProducts,
          fetchCategories,
          fetchOrders,
          fetchCustomers,
        ]);

        setProducts(productsData || []);
        setCategories(categoriesData || []);
        setOrders(ordersData || []);
        setCustomers(customersData || []);
      } catch (error) {
        console.error("Failed to load initial data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);

    // Update URL without reloading
    const newPath = page === 'home' ? '/' : `/${page}`;
    window.history.pushState(null, '', newPath);
  };

  const navigateToShop = (categoryId: string = 'all') => {
    setInitialCategory(categoryId);
    navigateTo('shop');
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    navigateTo('productDetail');
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  const addToCart = (productId: string, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === productId);
      if (existingItem) {
        return prevCart.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { productId, quantity }];
      }
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart(prevCart => {
      if (quantity <= 0) {
        return prevCart.filter(item => item.productId !== productId);
      }
      return prevCart.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      );
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  }

  const handlePlaceOrder = async (orderData: { customerName: string; phone?: string; totalAmount: number; shippingAddress: string; items: OrderItem[] }) => {
    const newOrder = await api.createOrder(orderData, currentUser);

    setOrders(prev => [newOrder, ...prev]);

    if (currentUser) {
      const updatedUser: Customer = {
        ...currentUser,
        orderIds: [...currentUser.orderIds, newOrder.id],
        totalOrders: currentUser.totalOrders + 1,
        totalSpent: currentUser.totalSpent + newOrder.totalAmount
      };
      setCustomers(prev => prev.map(c => c.id === currentUser.id ? updatedUser : c));
      setCurrentUser(updatedUser);
    }

    setOrderDetails({
      orderId: newOrder.orderId,
      customerName: orderData.customerName,
      totalAmount: orderData.totalAmount,
    });
    clearCart();
    navigateTo('orderSuccess');
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const buyNow = (productId: string, quantity: number) => {
    // Clear cart and add only the buy now item for a streamlined checkout
    setCart([{ productId, quantity }]);
    navigateTo('checkout');
  };

  // Auth Handlers
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    const customer = await api.login(email, password);
    if (customer) {
      setCurrentUser(customer);
      navigateTo('account');
      return true;
    }
    return false;
  };

  const handleRegister = async (newCustomerData: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'joinDate' | 'orderIds'>): Promise<boolean> => {
    const existingCustomer = customers.some(c => c.email.toLowerCase() === newCustomerData.email.toLowerCase());
    if (existingCustomer) {
      return false; // Email already exists
    }
    const newCustomer = await api.register(newCustomerData);
    setCustomers(prev => [...prev, newCustomer]);
    setCurrentUser(newCustomer);
    navigateTo('account');
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigateTo('home');
  };


  const renderPage = () => {
    switch (currentPage) {
      case 'shop':
        return <ShopPage products={products} categories={categories} initialCategory={initialCategory} onProductSelect={handleProductSelect} addToCart={addToCart} buyNow={buyNow} wishlist={wishlist} toggleWishlist={toggleWishlist} onQuickView={handleQuickView} navigateTo={navigateTo} navigateToShop={navigateToShop} />;
      case 'productDetail':
        return selectedProduct ? <ProductDetailPage product={selectedProduct} allProducts={products} categories={categories} onProductSelect={handleProductSelect} addToCart={addToCart} buyNow={buyNow} wishlist={wishlist} toggleWishlist={toggleWishlist} onQuickView={handleQuickView} navigateTo={navigateTo} navigateToShop={navigateToShop} /> : <HomePage products={products} categories={categories} navigateTo={navigateTo} navigateToShop={navigateToShop} onProductSelect={handleProductSelect} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} buyNow={buyNow} onQuickView={handleQuickView} />;
      case 'checkout':
        return <CheckoutPage cart={cart} products={products} updateCartQuantity={updateCartQuantity} removeFromCart={removeFromCart} onPlaceOrder={handlePlaceOrder} navigateTo={navigateTo} currentUser={currentUser} />;
      case 'orderSuccess':
        return <OrderSuccessPage orderDetails={orderDetails} navigateTo={navigateTo} />;
      case 'wishlist':
        return <WishlistPage products={products} wishlistProductIds={wishlist} onProductSelect={handleProductSelect} addToCart={addToCart} buyNow={buyNow} toggleWishlist={toggleWishlist} navigateTo={navigateTo} onQuickView={handleQuickView} />;
      case 'admin':
        return <AdminDashboardPage navigateTo={navigateTo} />;
      case 'utility':
        return <UtilityPage navigateTo={navigateTo} />;
      case 'hotDeals':
        return <HotDealsPage products={products} onProductSelect={handleProductSelect} addToCart={addToCart} buyNow={buyNow} wishlist={wishlist} toggleWishlist={toggleWishlist} onQuickView={handleQuickView} navigateTo={navigateTo} />;
      case 'about':
        return <AboutUsPage navigateTo={navigateTo} />;
      case 'contact':
        return <ContactPage navigateTo={navigateTo} />;
      case 'account':
        return currentUser
          ? <AccountPage navigateTo={navigateTo} currentUser={currentUser} orders={orders.filter(o => currentUser.orderIds.includes(o.id))} onLogout={handleLogout} />
          : <AuthPage navigateTo={navigateTo} onLogin={handleLogin} onRegister={handleRegister} />;
      case 'returns':
        return <ReturnsPage navigateTo={navigateTo} />;
      case 'terms':
        return <TermsPage navigateTo={navigateTo} />;
      case 'home':
      default:
        return <HomePage products={products} categories={categories} navigateTo={navigateTo} navigateToShop={navigateToShop} onProductSelect={handleProductSelect} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} buyNow={buyNow} onQuickView={handleQuickView} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-green-deep flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-brand-yellow rounded-full animate-[spin_1.5s_linear_infinite] border-t-transparent shadow-[0_0_15px_rgba(251,191,36,0.3)]"></div>
          </div>
          <p className="mt-6 text-lg font-black text-brand-yellow tracking-[0.2em] uppercase animate-pulse">লোডিং...</p>
        </div>
      </div>
    );
  }

  // If on admin page, don't show header/footer
  if (currentPage === 'admin') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-brand-green-deep flex items-center justify-center"><div className="loader" /></div>}>
        {renderPage()}
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream text-brand-dark flex flex-col">
      <Header navigateTo={navigateTo} navigateToShop={navigateToShop} cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)} wishlistItemCount={wishlist.length} currentUser={currentUser} onLogout={handleLogout} categories={categories} />
      <main className="flex-grow w-full pb-20 lg:pb-0">
        <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><div className="loader" /></div>}>
          {renderPage()}
        </Suspense>
      </main>
      <Footer navigateTo={navigateTo} navigateToShop={navigateToShop} />
      <FloatingCart cart={cart} products={products} navigateTo={navigateTo} />
      <FloatingSocials />
      <MobileBottomNav currentPage={currentPage} navigateTo={navigateTo} />
      <BackToTop />
      {quickViewProduct && (

        <QuickViewModal
          product={quickViewProduct}
          onClose={closeQuickView}
          addToCart={addToCart}
          buyNow={buyNow}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
        />
      )}
    </div>
  );
};

export default App;
