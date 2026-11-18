import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../types/shop';
import { formatPKR } from '../data/products';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onOpenProduct: (productId: string) => void;
  onToggleWishlist: (productId: string) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onOpenProduct,
  onToggleWishlist,
  onQuickAdd,
}) => {
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <article className="group flex flex-col bg-white border border-[#E5DEC9]/80 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-14px_rgba(21,20,19,0.16)]">
      {/* Portrait Image Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F2EDE4]">
        <button
          type="button"
          onClick={() => onOpenProduct(product.id)}
          className="block w-full h-full text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#A68342]"
          aria-label={`View ${product.name}`}
        >
          <ResilientImage
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-top transition-transform duration-500 ease-out lg:group-hover:scale-[1.03]"
          />
          {product.images[1] && (
            <ResilientImage
              src={product.images[1]}
              alt={`${product.name} alternate view`}
              loading="lazy"
              className="hidden lg:block absolute inset-0 w-full h-full object-cover object-top opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}
        </button>

        {/* Wishlist Action (44px touch target) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className="absolute top-3 right-3 w-11 h-11 bg-white/95 backdrop-blur-sm flex items-center justify-center text-[#151413] hover:text-[#A68342] active:scale-95 transition-all border border-[#E5DEC9]/80"
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? 'fill-[#A68342] text-[#A68342]' : 'stroke-[1.6]'}`}
          />
        </button>

        {/* Desktop Hover Quick Add Bar */}
        <div className="hidden lg:block absolute inset-x-3 bottom-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product);
            }}
            className="w-full py-2.5 px-4 bg-[#151413]/95 text-[#FAF8F5] text-xs font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-[#A68342] transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add · {product.sizes[0]}</span>
          </button>
        </div>
      </div>

      {/* Clean Unboxed Metadata & Pricing */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.08em] text-[#4A4642]">
            <span className="truncate">
              {product.category} <span aria-hidden="true">·</span> {product.pieceCount}
            </span>
            {discountPercent > 0 && (
              <span className="text-[#8C6D32] font-semibold shrink-0 tabular-nums">
                {discountPercent}% Off
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => onOpenProduct(product.id)}
            className="mt-1.5 text-left block w-full"
          >
            <h3 className="font-display text-xl font-semibold leading-snug text-[#151413] group-hover:text-[#8C6D32] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </button>

          <p className="text-xs text-[#4A4642] mt-0.5 line-clamp-1">{product.subtitle}</p>
        </div>

        <div className="pt-2 border-t border-[#F2EDE4] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-2 tabular-nums">
              <span className="text-[15px] font-semibold text-[#151413]">
                {formatPKR(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-[#4A4642]/70 line-through">
                  {formatPKR(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5" aria-label="Available colors">
              {product.colors.slice(0, 3).map((color) => (
                <span
                  key={color.name}
                  title={color.name}
                  className="w-3 h-3 rounded-full border border-[#151413]/20"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>

          {/* Mobile / Tablet Direct Tap Quick-Add Button */}
          <button
            type="button"
            onClick={() => onQuickAdd(product)}
            className="lg:hidden w-full min-h-[44px] py-2.5 px-4 bg-[#151413] text-[#FAF8F5] text-xs font-medium tracking-wide flex items-center justify-center gap-2 active:bg-[#A68342] transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag · {product.sizes[0]}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
