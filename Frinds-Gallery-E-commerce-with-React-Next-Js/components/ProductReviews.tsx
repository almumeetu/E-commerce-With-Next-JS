import React, { useState } from 'react';
import type { ProductReview } from '../types';

const StarIcon: React.FC<{ className: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const StarRatingDisplay: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <StarIcon key={i} className={`w-5 h-5 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  );
};

const StarRatingInput: React.FC<{ rating: number; setRating: (r: number) => void }> = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => {
        const starValue = i + 1;
        return (
          <button
            type="button"
            key={starValue}
            className="cursor-pointer"
            onClick={() => setRating(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`Rate ${starValue} star`}
          >
            <StarIcon className={`w-6 h-6 transition-colors ${starValue <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
          </button>
        );
      })}
    </div>
  );
};

interface ProductReviewsProps {
  productId: string;
  reviews: ProductReview[];
  onSubmitReview: (review: Omit<ProductReview, 'id' | 'date'>) => void;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, reviews, onSubmitReview }) => {
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !email.trim() || rating === 0 || !comment.trim()) {
      alert('অনুগ্রহ করে সকল ঘর পূরণ করুন এবং একটি রেটিং দিন।');
      return;
    }
    onSubmitReview({ productId, author, email, rating, comment });
    setAuthor('');
    setEmail('');
    setRating(0);
    setComment('');
  };

  const averageRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;

  return (
    <section className="bg-gray-50 py-12 rounded-lg border">
      <div className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">ক্রেতাদের মতামত</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Review List & Summary */}
          <div className="lg:col-span-2">
            {reviews.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
                <h3 className="text-lg font-semibold text-gray-800">গড় রেটিং</h3>
                <div className="flex items-center mt-2">
                  <span className="text-3xl font-bold text-gray-800 mr-2">{averageRating.toFixed(1)}</span>
                  <StarRatingDisplay rating={averageRating} />
                  <span className="ml-3 text-gray-600">({reviews.length} টি রিভিউ)</span>
                </div>
              </div>
            )}
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map(review => (
                  <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center mb-2">
                      <p className="font-semibold text-gray-800">{review.author}</p>
                      <span className="text-gray-400 mx-2">•</span>
                      <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString('bn-BD')}</p>
                    </div>
                    <StarRatingDisplay rating={review.rating} />
                    <p className="mt-3 text-gray-600">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-white rounded-lg border">
                    <p className="text-gray-600">এই পণ্যের জন্য এখনো কোনো রিভিউ নেই।</p>
                </div>
              )}
            </div>
          </div>

          {/* Review Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-24">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">আপনার মতামত দিন</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">আপনার নাম *</label>
                  <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">আপনার ইমেইল *</label>
                  <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">আপনার রেটিং *</label>
                  <StarRatingInput rating={rating} setRating={setRating} />
                </div>
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">আপনার মন্তব্য *</label>
                  <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} required rows={4}></textarea>
                </div>
                <button type="submit" className="w-full bg-brand-green text-white py-2.5 rounded-lg font-semibold hover:bg-brand-green-dark transition-all">
                  মতামত জমা দিন
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};