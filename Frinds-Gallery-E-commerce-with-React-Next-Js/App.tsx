
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
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

// Wrapper for ProductDetailPage to fetch product from ID
const ProductPageWrapper: React.FC<{
  products: Product[];
  categories: Category[];
  addToCart: (productId: string, quantity: number) => void;
  buyNow: (productId: string, quantity: number) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  onProductSelect: (product: Product) => void;
  onQuickView: (product: Product) => void;
  navigateTo: (page: Page) => void;
  navigateToShop: (categoryId: string) => void;
}> = ({ products, ...props }) => {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id.toString() === id);

  if (!product) {
    // Show a loading state or "not found" state
    return (
      <div className="min-h-screen bg-stone-50 pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">পণ্যটি পাওয়া যায়নি</h2>
          <button onClick={() => props.navigateTo('shop')} className="mt-4 text-brand-green underline">দোকানে ফিরে যান</button>
        </div>
      </div>
    );
  }

  return <ProductDetailPage product={product} allProducts={products} {...props} />;
};

const App: React.FC = () => {

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // Temporary state for maintaining selection compatibility
  // const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Replaced by URL param
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [initialCategory, setInitialCategory] = useState<string>('all'); // Still used for ShopPage initial state prop if needed
  const [currentUser, setCurrentUser] = useState<Customer | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        if (!api.isSupabaseConfigured()) {
          console.error("🔴 Supabase is NOT configured.");
        }
        setIsLoading(true);

        const fetchProducts = api.getProducts().catch(e => { console.error('Products failed:', e); return []; });
        const fetchCategories = api.getCategories().catch(e => { console.error('Categories failed:', e); return []; });

        const [productsData, categoriesData] = await Promise.all([
          fetchProducts,
          fetchCategories,
        ]);

        setProducts(productsData || []);
        setCategories(categoriesData || []);

      } catch (error) {
        console.error("Failed to load initial data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (currentUser) {
      api.getOrders(currentUser.id)
        .then(userOrders => setOrders(userOrders))
        .catch(err => console.error("Failed to fetch user orders", err));
    } else {
      setOrders([]);
    }
  }, [currentUser]);

  const navigateTo = (page: Page) => {
    window.scrollTo(0, 0);
    switch (page) {
      case 'home': navigate('/'); break;
      case 'shop': navigate('/shop'); break;
      case 'checkout': navigate('/checkout'); break;
      case 'orderSuccess': navigate('/order-success'); break;
      case 'wishlist': navigate('/wishlist'); break;
      case 'admin': navigate('/admin'); break;
      case 'utility': navigate('/utility'); break;
      case 'hotDeals': navigate('/hot-deals'); break;
      case 'about': navigate('/about'); break;
      case 'contact': navigate('/contact'); break;
      case 'account': navigate('/account'); break;
      case 'returns': navigate('/returns'); break;
      case 'terms': navigate('/terms'); break;
      default: navigate('/');
    }
  };

  const navigateToShop = (categoryId: string = 'all') => {
    setInitialCategory(categoryId); // Keep state sync if ShopPage uses it
    navigate(`/shop?category=${encodeURIComponent(categoryId)}`);
  };

  const handleProductSelect = (product: Product) => {
    // setSelectedProduct(product);
    navigate(`/product/${product.id}`);
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
      setCurrentUser(updatedUser);
    }

    setOrderDetails({
      orderId: newOrder.orderId,
      customerName: orderData.customerName,
      totalAmount: orderData.totalAmount,
    });
    clearCart();
    navigate('/order-success');
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const buyNow = (productId: string, quantity: number) => {
    setCart([{ productId, quantity }]);
    navigate('/checkout');
  };

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    const customer = await api.login(email, password);
    if (customer) {
      setCurrentUser(customer);
      navigate('/account');
      return true;
    }
    return false;
  };

  const handleRegister = async (newCustomerData: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'joinDate' | 'orderIds'>): Promise<boolean> => {
    try {
      const newCustomer = await api.register(newCustomerData);
      setCurrentUser(newCustomer);
      navigate('/account');
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
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

  // Determine if we are on admin page to hide header/footer
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-brand-cream text-brand-dark flex flex-col">
      {!isAdmin && (
        <Header
          navigateTo={navigateTo}
          navigateToShop={navigateToShop}
          cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          wishlistItemCount={wishlist.length}
          currentUser={currentUser}
          onLogout={handleLogout}
          categories={categories}
        />
      )}

      <main className="flex-grow w-full pb-20 lg:pb-0">
        <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><div className="loader" /></div>}>
          <Routes>
            <Route path="/" element={<HomePage products={products} categories={categories} navigateTo={navigateTo} navigateToShop={navigateToShop} onProductSelect={handleProductSelect} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} buyNow={buyNow} onQuickView={handleQuickView} />} />
            <Route path="/shop" element={<ShopPage products={products} categories={categories} initialCategory={initialCategory} onProductSelect={handleProductSelect} addToCart={addToCart} buyNow={buyNow} wishlist={wishlist} toggleWishlist={toggleWishlist} onQuickView={handleQuickView} navigateTo={navigateTo} navigateToShop={navigateToShop} />} />
            <Route path="/product/:id" element={<ProductPageWrapper products={products} categories={categories} addToCart={addToCart} buyNow={buyNow} wishlist={wishlist} toggleWishlist={toggleWishlist} onProductSelect={handleProductSelect} onQuickView={handleQuickView} navigateTo={navigateTo} navigateToShop={navigateToShop} />} />
            <Route path="/checkout" element={<CheckoutPage cart={cart} products={products} updateCartQuantity={updateCartQuantity} removeFromCart={removeFromCart} onPlaceOrder={handlePlaceOrder} navigateTo={navigateTo} currentUser={currentUser} />} />
            <Route path="/order-success" element={<OrderSuccessPage orderDetails={orderDetails} navigateTo={navigateTo} />} />
            <Route path="/wishlist" element={<WishlistPage products={products} wishlistProductIds={wishlist} onProductSelect={handleProductSelect} addToCart={addToCart} buyNow={buyNow} toggleWishlist={toggleWishlist} navigateTo={navigateTo} onQuickView={handleQuickView} />} />
            <Route path="/admin" element={<AdminDashboardPage navigateTo={navigateTo} />} />
            <Route path="/utility" element={<UtilityPage navigateTo={navigateTo} />} />
            <Route path="/hot-deals" element={<HotDealsPage products={products} onProductSelect={handleProductSelect} addToCart={addToCart} buyNow={buyNow} wishlist={wishlist} toggleWishlist={toggleWishlist} onQuickView={handleQuickView} navigateTo={navigateTo} />} />
            <Route path="/about" element={<AboutUsPage navigateTo={navigateTo} />} />
            <Route path="/contact" element={<ContactPage navigateTo={navigateTo} />} />
            <Route path="/account" element={currentUser ? <AccountPage navigateTo={navigateTo} currentUser={currentUser} orders={orders.filter(o => currentUser.orderIds.includes(o.id))} onLogout={handleLogout} /> : <AuthPage navigateTo={navigateTo} onLogin={handleLogin} onRegister={handleRegister} />} />
            <Route path="/returns" element={<ReturnsPage navigateTo={navigateTo} />} />
            <Route path="/terms" element={<TermsPage navigateTo={navigateTo} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {!isAdmin && <Footer navigateTo={navigateTo} navigateToShop={navigateToShop} categories={categories} />}

      <FloatingCart cart={cart} products={products} navigateTo={navigateTo} />
      <FloatingSocials />
      {/* MobileBottomNav normally needs currentPage prop. We can derive it roughly or update component to use useLocation. Passing generic 'home' or making it optional if it just uses navigateTo */}
      <MobileBottomNav currentPage={location.pathname === '/' ? 'home' : location.pathname.substring(1) as Page} navigateTo={navigateTo} />
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
