import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Heart,
  Minus,
  Plus,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react';
import { Product, ProductReview } from '../types/shop';
import { formatPKR } from '../data/products';
import { ResilientImage } from './ResilientImage';
import { ProductCard } from './ProductCard';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
  wishlistIds: string[];
  isWishlisted: boolean;
  onBack: () => void;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
  onToggleWishlist: (productId: string) => void;
  onOpenProduct: (productId: string) => void;
  onAddReview: (productId: string, review: Omit<ProductReview, 'id' | 'date' | 'verified'>) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  relatedProducts,
  wishlistIds,
  isWishlisted,
  onBack,
  onAddToCart,
  onToggleWishlist,
  onOpenProduct,
  onAddReview,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Review form state
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewCity, setReviewCity] = useState('Lahore');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;
    onAddReview(product.id, {
      author: reviewAuthor.trim(),
      city: reviewCity,
      rating: reviewRating,
      sizePurchased: selectedSize,
      comment: reviewComment.trim(),
    });
    setReviewAuthor('');
    setReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-medium text-[#4A4642] hover:text-[#151413] mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Collection</span>
      </button>

      {/* Main Split: Sticky Left Gallery + Sticky Right Contiguous Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Gallery */}
        <div className="lg:col-span-7 flex flex-col sm:flex-row gap-4">
          {/* Thumbnails (below main image on mobile, left column on sm+) */}
          <div className="order-2 sm:order-1 flex sm:flex-col gap-3 overflow-x-auto no-scrollbar sm:w-24 shrink-0">
            {product.images.map((img, idx) => (
              <button
                key={`${product.id}-img-${idx}`}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                aria-label={`View angle ${idx + 1} of ${product.name}`}
                className={`aspect-[3/4] w-20 sm:w-full overflow-hidden border transition-all shrink-0 ${
                  activeImageIndex === idx
                    ? 'border-[#151413] ring-1 ring-[#151413]'
                    : 'border-[#E5DEC9] opacity-70 hover:opacity-100'
                }`}
              >
                <ResilientImage
                  src={img}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover object-top"
                />
              </button>
            ))}
          </div>

          {/* Primary Showcase Image */}
          <div className="order-1 sm:order-2 flex-1 aspect-[3/4] bg-[#F2EDE4] border border-[#E5DEC9] overflow-hidden">
            <ResilientImage
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              fetchPriority="high"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        {/* Right Contiguous Purchase Module */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6 bg-white border border-[#E5DEC9] p-5 sm:p-8">
          <div className="border-b border-[#F2EDE4] pb-5">
            <div className="flex items-center justify-between gap-4 text-xs text-[#4A4642]">
              <span>
                {product.category} <span aria-hidden="true">·</span> {product.pieceCount}
              </span>
              <span className="tabular-nums">SKU: {product.sku}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#151413] mt-2 leading-tight">
              {product.name}
            </h1>
            <p className="text-sm text-[#4A4642] mt-1.5">{product.subtitle}</p>

            {/* Rating Summary */}
            <a
              href="#reviews-section"
              className="inline-flex items-center gap-2 mt-3 text-xs text-[#4A4642] hover:text-[#151413]"
            >
              <div className="flex items-center gap-0.5 text-[#A68342]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.round(product.rating) ? 'fill-[#A68342]' : 'text-[#E5DEC9]'
                    }`}
                  />
                ))}
              </div>
              <span className="tabular-nums font-medium text-[#151413]">{product.rating.toFixed(1)}</span>
              <span>({product.reviewCount} verified reviews)</span>
            </a>

            {/* Pricing */}
            <div className="mt-5 flex items-baseline gap-3 tabular-nums">
              <span className="text-2xl font-semibold text-[#151413]">
                {formatPKR(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-base text-[#4A4642]/70 line-through">
                    {formatPKR(product.originalPrice)}
                  </span>
                  <span className="text-xs font-semibold text-[#8C6D32]">
                    Save {discountPercent}% ({formatPKR(product.originalPrice - product.price)})
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-[#4A4642] mt-1">
              Inclusive of taxes <span aria-hidden="true">·</span> Cash on Delivery available nationwide
            </p>
          </div>

          {/* Color Option Selector */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2.5">
              <span className="font-medium text-[#151413]">
                Color: <span className="text-[#4A4642] font-normal">{selectedColor}</span>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.name)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs border transition-colors ${
                    selectedColor === color.name
                      ? 'border-[#151413] bg-[#FAF8F5] text-[#151413] font-medium'
                      : 'border-[#E5DEC9] text-[#4A4642] hover:border-[#A68342]'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-[#151413]/20 shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2.5">
              <span className="font-medium text-[#151413]">Select Size</span>
              <button
                type="button"
                onClick={() => setShowSizeGuide((prev) => !prev)}
                className="inline-flex items-center gap-1.5 text-[#8C6D32] hover:text-[#151413] font-medium"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>{showSizeGuide ? 'Hide Size Guide' : 'Size Guide'}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[48px] px-4 py-2.5 text-xs font-medium border transition-colors ${
                    selectedSize === size
                      ? 'bg-[#151413] text-[#FAF8F5] border-[#151413]'
                      : 'bg-white text-[#151413] border-[#E5DEC9] hover:border-[#A68342]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {showSizeGuide && (
              <div className="mt-3 p-4 bg-[#FAF8F5] border border-[#E5DEC9] text-xs overflow-x-auto">
                <p className="font-semibold text-[#151413] mb-2">
                  Standard Pakistani Pret Measurements (Inches)
                </p>
                <div className="min-w-[260px]">
                  <div className="grid grid-cols-4 gap-2 text-[#4A4642] tabular-nums border-b border-[#E5DEC9] pb-1.5 font-medium">
                    <span>Size</span>
                    <span>Chest</span>
                    <span>Waist</span>
                    <span>Hip</span>
                  </div>
                  {[
                    ['XS', '18.5"', '17.0"', '20.0"'],
                    ['S', '19.5"', '18.0"', '21.0"'],
                    ['M', '21.0"', '19.5"', '22.5"'],
                    ['L', '22.5"', '21.0"', '24.0"'],
                    ['XL', '24.0"', '22.5"', '25.5"'],
                  ].map(([s, c, w, h]) => (
                    <div
                      key={s}
                      className="grid grid-cols-4 gap-2 py-1.5 text-[#4A4642] tabular-nums border-b border-[#F2EDE4] last:border-0"
                    >
                      <span className="font-medium text-[#151413]">{s}</span>
                      <span>{c}</span>
                      <span>{w}</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quantity + Primary CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex items-stretch gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-[#E5DEC9] bg-[#FAF8F5]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="px-3 py-3 text-[#151413] hover:bg-[#F2EDE4] transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-medium tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="px-3 py-3 text-[#151413] hover:bg-[#F2EDE4] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Bag CTA */}
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 py-3 px-6 bg-[#151413] text-[#FAF8F5] text-xs font-semibold tracking-wider uppercase hover:bg-[#A68342] transition-colors flex items-center justify-center gap-2"
              >
                {addedFeedback ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag · {formatPKR(product.price * quantity)}</span>
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => onToggleWishlist(product.id)}
              className="w-full py-2.5 px-4 border border-[#E5DEC9] text-xs font-medium text-[#151413] hover:border-[#A68342] transition-colors flex items-center justify-center gap-2"
            >
              <Heart
                className={`w-4 h-4 ${
                  isWishlisted ? 'fill-[#A68342] text-[#A68342]' : 'stroke-[1.6]'
                }`}
              />
              <span>{isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
            </button>
          </div>

          {/* Description & Fabric Details */}
          <div className="pt-4 border-t border-[#F2EDE4] space-y-4">
            <p className="text-sm leading-relaxed text-[#4A4642]">{product.description}</p>

            <dl className="space-y-2.5 text-xs border-t border-[#F2EDE4] pt-4">
              <div>
                <dt className="font-semibold text-[#151413]">Shirt / Primary Piece</dt>
                <dd className="text-[#4A4642] mt-0.5">{product.specifications.shirt}</dd>
              </div>
              {product.specifications.trouser && (
                <div>
                  <dt className="font-semibold text-[#151413]">Trouser</dt>
                  <dd className="text-[#4A4642] mt-0.5">{product.specifications.trouser}</dd>
                </div>
              )}
              {product.specifications.dupatta && (
                <div>
                  <dt className="font-semibold text-[#151413]">Dupatta / Shawl</dt>
                  <dd className="text-[#4A4642] mt-0.5">{product.specifications.dupatta}</dd>
                </div>
              )}
              <div>
                <dt className="font-semibold text-[#151413]">Care Instructions</dt>
                <dd className="text-[#4A4642] mt-0.5">{product.specifications.care}</dd>
              </div>
            </dl>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#F2EDE4] text-xs text-[#4A4642]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#A68342] shrink-0" />
                <span>{product.specifications.dispatch}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#A68342] shrink-0" />
                <span>7-Day Easy Exchange Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section id="reviews-section" className="mt-16 pt-12 border-t border-[#E5DEC9]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-4">
            <h2 className="font-display text-3xl font-semibold text-[#151413]">
              Client Reviews
            </h2>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl font-semibold text-[#151413] tabular-nums">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-xs text-[#4A4642]">
                out of 5 ({product.reviews.length} published reviews)
              </span>
            </div>

            {/* Write a Review Form */}
            <form
              onSubmit={handleReviewSubmit}
              className="mt-6 p-5 bg-white border border-[#E5DEC9] space-y-4"
            >
              <h3 className="text-sm font-semibold text-[#151413]">Share Your Experience</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  placeholder="Your Name"
                  className="min-h-[42px] px-3 py-2 text-base sm:text-xs border border-[#E5DEC9] bg-[#FAF8F5] focus:border-[#A68342] focus:outline-none"
                />
                <input
                  type="text"
                  required
                  value={reviewCity}
                  onChange={(e) => setReviewCity(e.target.value)}
                  placeholder="City (e.g., Lahore)"
                  className="min-h-[42px] px-3 py-2 text-base sm:text-xs border border-[#E5DEC9] bg-[#FAF8F5] focus:border-[#A68342] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#4A4642]">Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      aria-label={`Rate ${star} stars`}
                      className="p-1.5"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= reviewRating ? 'fill-[#A68342] text-[#A68342]' : 'text-[#E5DEC9]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={3}
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Comment on fabric weight, embroidery finish, and sizing..."
                className="w-full px-3 py-2 text-base sm:text-xs border border-[#E5DEC9] bg-[#FAF8F5] focus:border-[#A68342] focus:outline-none"
              />

              <button
                type="submit"
                className="w-full min-h-[44px] py-2.5 bg-[#151413] text-white text-xs font-medium hover:bg-[#A68342] transition-colors"
              >
                {reviewSubmitted ? 'Thank You — Review Added' : 'Submit Review'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-8 space-y-4">
            {product.reviews.map((rev) => (
              <div key={rev.id} className="p-6 bg-white border border-[#E5DEC9]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-[#151413]">
                      {rev.author} <span className="text-[#4A4642] font-normal">· {rev.city}</span>
                    </p>
                    <p className="text-xs text-[#4A4642] mt-0.5">
                      Size: {rev.sizePurchased} <span aria-hidden="true">·</span> {rev.date}
                      {rev.verified && (
                        <>
                          {' '}
                          <span aria-hidden="true">·</span>{' '}
                          <span className="text-[#8C6D32]">Verified Purchase</span>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5 text-[#A68342]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-[#A68342]' : 'text-[#E5DEC9]'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-[#4A4642] mt-3 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Outfits */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-[#E5DEC9]">
          <h2 className="font-display text-3xl font-semibold text-[#151413] mb-8">
            Complete Your Wardrobe
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {relatedProducts.slice(0, 3).map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                isWishlisted={wishlistIds.includes(rel.id)}
                onOpenProduct={onOpenProduct}
                onToggleWishlist={onToggleWishlist}
                onQuickAdd={(item) => onAddToCart(item, item.sizes[0], item.colors[0].name, 1)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
