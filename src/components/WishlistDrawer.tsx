import React, { useEffect } from 'react';
import { Heart, ShoppingBag, Trash2, X } from 'lucide-react';
import { Product } from '../types/shop';
import { formatPKR } from '../data/products';
import { ResilientImage } from './ResilientImage';

interface WishlistDrawerProps {
  isOpen: boolean;
  products: Product[];
  onClose: () => void;
  onRemove: (productId: string) => void;
  onMoveToBag: (product: Product) => void;
  onOpenProduct: (productId: string) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  products,
  onClose,
  onRemove,
  onMoveToBag,
  onOpenProduct,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Wishlist">
      <div
        className="fixed inset-0 bg-[#151413]/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className="relative z-10 w-full max-w-md bg-[#FAF8F5] h-full flex flex-col border-l border-[#E5DEC9] shadow-2xl">
        <div className="px-6 py-5 bg-white border-b border-[#E5DEC9] flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#151413]">Saved Wardrobe</h2>
            <p className="text-xs text-[#4A4642] tabular-nums">
              {products.length} {products.length === 1 ? 'piece' : 'pieces'} saved
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close wishlist"
            className="min-w-[40px] min-h-[40px] flex items-center justify-center text-[#4A4642] hover:text-[#151413]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {products.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <Heart className="w-10 h-10 text-[#A68342] stroke-[1.3] mb-3" />
              <p className="font-display text-2xl font-semibold text-[#151413]">
                No saved pieces yet
              </p>
              <p className="text-xs text-[#4A4642] mt-1 max-w-xs">
                Tap the heart icon on any ensemble to keep your favorite silhouettes close.
              </p>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="flex gap-4 p-3.5 bg-white border border-[#E5DEC9]">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenProduct(product.id);
                  }}
                  className="shrink-0"
                >
                  <ResilientImage
                    src={product.images[0]}
                    alt={product.name}
                    className="w-20 h-24 object-cover object-top bg-[#F2EDE4]"
                  />
                </button>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenProduct(product.id);
                        }}
                        className="text-left text-sm font-semibold text-[#151413] hover:text-[#8C6D32] truncate"
                      >
                        {product.name}
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemove(product.id)}
                        aria-label={`Remove ${product.name} from wishlist`}
                        className="text-[#4A4642] hover:text-red-700 p-0.5 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-[#4A4642] mt-0.5">{product.category}</p>
                    <p className="text-sm font-semibold text-[#151413] tabular-nums mt-1">
                      {formatPKR(product.price)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onMoveToBag(product);
                      onRemove(product.id);
                    }}
                    className="mt-3 w-full py-2 bg-[#151413] text-white text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-[#A68342] transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
};
