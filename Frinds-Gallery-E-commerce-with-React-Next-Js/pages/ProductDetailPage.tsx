import React, { useState, useEffect } from 'react';
import type { Product, ProductReview, Category } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductCarousel } from '../components/ProductCarousel';
import { mockProductReviews } from '../constants';
import type { Page } from '../App';
import { ProductReviews } from '../components/ProductReviews';
import { HeartIcon, PlusIcon, MinusIcon } from '../components/icons';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  categories: Category[]; // Add categories prop
  addToCart: (productId: string, quantity: number) => void;
  buyNow: (productId: string, quantity: number) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  onProductSelect: (product: Product) => void;
  onQuickView: (product: Product) => void;
  navigateTo: (page: Page) => void;
  navigateToShop: (categoryId: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, allProducts, categories, addToCart, buyNow, wishlist, toggleWishlist, onProductSelect, onQuickView, navigateTo, navigateToShop }) => {
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    setReviews(mockProductReviews.filter(r => r.productId === product.id));
    setQuantity(1);
    window.scrollTo(0, 0);
  }, [product]);

  const handleReviewSubmit = (newReviewData: Omit<ProductReview, 'id' | 'date'>) => {
    const newReview: ProductReview = {
      ...newReviewData,
      id: `rev_${Date.now()}`,
      date: new Date().toISOString(),
    };
    setReviews(prevReviews => [newReview, ...prevReviews]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };
  const handleMouseEnter = () => setIsZooming(true);
  const handleMouseLeave = () => setIsZooming(false);

  const isInWishlist = wishlist.includes(product.id);

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const relatedProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 8);
  const categoryName = categories.find(c => c.id === product.category)?.name || product.category;

  return (
    <div className="bg-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'হোম', onClick: () => navigateTo('home') }, { label: categoryName, onClick: () => navigateToShop(product.category) }, { label: product.name }]} />

        <div className="mt-6 md:grid md:grid-cols-2 md:gap-x-12 lg:gap-x-16">
          {/* Image gallery */}
          <div className="relative">
            <div
              className="w-full overflow-hidden rounded-xl cursor-zoom-in shadow-sm border"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-center object-cover aspect-[4/5]"
              />
            </div>
            {isZooming && (
              <div
                className="hidden lg:block absolute top-0 left-0 w-full h-full rounded-xl pointer-events-none z-10 bg-white"
                style={{
                  backgroundImage: `url(${product.imageUrl})`,
                  backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '250%',
                }}
                aria-label="Zoomed product image"
              />
            )}
          </div>

          {/* Product info */}
          <div className="mt-6 md:mt-0">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">{product.name}</h1>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-gray-500">SKU: {product.sku}</p>
              {product.stock > 0 ? (
                <p className="text-sm text-green-600 font-semibold bg-green-100 px-2 py-0.5 rounded-full">স্টকে আছে</p>
              ) : (
                <p className="text-sm text-red-600 font-semibold bg-red-100 px-2 py-0.5 rounded-full">স্টক শেষ</p>
              )}
            </div>


            <div className="mt-4">
              <div className="flex items-baseline space-x-2">
                <p className="text-4xl text-brand-green font-bold">৳{product.price.toLocaleString('bn-BD')}</p>
                {product.originalPrice && (
                  <p className="text-2xl text-gray-400 line-through">৳{product.originalPrice.toLocaleString('bn-BD')}</p>
                )}
                {discount > 0 && (
                  <span className="text-base font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">{discount}% ছাড়</span>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 space-y-4">
                <p>পণ্যের বিবরণ এখানে যোগ করা হবে। কাপড়ের মান, ডিজাইন এবং অন্যান্য প্রয়োজনীয় তথ্য এখানে থাকবে।</p>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <label htmlFor="quantity-pd" className="sr-only">পরিমাণ</label>
                  <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden h-12">
                    <button
                      type="button"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="px-4 h-full text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                    <input
                      id="quantity-pd"
                      type="text"
                      value={quantity}
                      readOnly
                      className="w-16 h-full text-center text-lg font-semibold text-brand-dark border-l border-r border-slate-300 focus:outline-none bg-white"
                      aria-live="polite"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      disabled={quantity >= product.stock}
                      className="px-4 h-full text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Increase quantity"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-100 h-12 w-12 flex items-center justify-center"
                  aria-label="Add to wishlist"
                >
                  <HeartIcon className={`w-6 h-6 ${isInWishlist ? 'text-red-500' : 'text-gray-500'}`} isFilled={isInWishlist} />
                </button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => addToCart(product.id, quantity)}
                disabled={product.stock === 0}
                className="w-full bg-brand-accent text-brand-dark py-3 px-8 rounded-lg font-bold hover:bg-amber-400 disabled:bg-gray-300 flex items-center justify-center transition-colors"
              >
                কার্টে যোগ করুন
              </button>
              <button
                onClick={() => buyNow(product.id, quantity)}
                disabled={product.stock === 0}
                className="w-full bg-brand-green text-white py-3 px-8 rounded-lg font-bold hover:bg-brand-green-dark disabled:bg-gray-400 transition-colors"
              >
                এখনই কিনুন
              </button>
            </div>
          </div>
        </div>

        <div className="mt-20 md:mt-28">
          <ProductReviews
            productId={product.id}
            reviews={reviews}
            onSubmitReview={handleReviewSubmit}
          />
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-20 md:mt-28">
            <ProductCarousel
              title="সম্পর্কিত পণ্য"
              products={relatedProducts}
              onProductSelect={onProductSelect}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              addToCart={addToCart}
              buyNow={buyNow}
              onQuickView={onQuickView}
            />
          </div>
        )}
      </div>
    </div>
  );
};