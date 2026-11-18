import React, { useEffect, useState } from 'react';
import { Minus, Plus, ShoppingBag, Tag, Trash2, X } from 'lucide-react';
import { CartItem } from '../types/shop';
import { formatPKR } from '../data/products';
import { ResilientImage } from './ResilientImage';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  promoCode: string;
  onApplyPromo: (code: string) => void;
  onClose: () => void;
  onUpdateQuantity: (key: string, quantity: number) => void;
  onRemoveItem: (key: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  promoCode,
  onApplyPromo,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const [promoInput, setPromoInput] = useState(promoCode);
  const [promoFeedback, setPromoFeedback] = useState<string | null>(null);

  useEffect(() => {
    setPromoInput(promoCode);
    if (!promoCode) setPromoFeedback(null);
  }, [promoCode]);

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

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 5000;
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);
  const discount = promoCode.toUpperCase() === 'ZARIYAH10' ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : 250;
  const total = Math.max(0, subtotal - discount + shipping);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = promoInput.trim().toUpperCase();
    if (!cleaned) {
      onApplyPromo('');
      setPromoFeedback(null);
      return;
    }
    if (cleaned === 'ZARIYAH10') {
      onApplyPromo('ZARIYAH10');
      setPromoFeedback('10% seasonal privilege applied');
    } else {
      setPromoFeedback('Try code ZARIYAH10 for 10% off');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping Bag">
      <div
        className="fixed inset-0 bg-[#151413]/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className="relative z-10 w-full max-w-md bg-[#FAF8F5] h-full flex flex-col border-l border-[#E5DEC9] shadow-2xl">
        {/* Header */}
        <div className="px-6 py-5 bg-white border-b border-[#E5DEC9] flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#151413]">Shopping Bag</h2>
            <p className="text-xs text-[#4A4642] tabular-nums">
              {items.reduce((acc, i) => acc + i.quantity, 0)} items selected
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping bag"
            className="p-2 text-[#4A4642] hover:text-[#151413] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Progress */}
        {items.length > 0 && (
          <div className="px-6 py-3 bg-[#F2EDE4] border-b border-[#E5DEC9] text-xs text-[#151413]">
            {remainingForFree === 0 ? (
              <span>You qualify for complimentary nationwide Cash on Delivery shipping.</span>
            ) : (
              <span>
                Add <strong className="tabular-nums">{formatPKR(remainingForFree)}</strong> more for complimentary nationwide delivery.
              </span>
            )}
          </div>
        )}

        {/* Itemized List */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <ShoppingBag className="w-10 h-10 text-[#A68342] stroke-[1.3] mb-3" />
              <p className="font-display text-2xl font-semibold text-[#151413]">Your bag is empty</p>
              <p className="text-xs text-[#4A4642] mt-1 max-w-xs">
                Explore our unstitched lawn, tailored cambric, and luxury pret collections to begin.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 px-6 py-2.5 bg-[#151413] text-white text-xs font-medium hover:bg-[#A68342] transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.key}
                className="flex gap-4 p-3.5 bg-white border border-[#E5DEC9]"
              >
                <ResilientImage
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-24 object-cover object-top shrink-0 bg-[#F2EDE4]"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-[#151413] truncate">
                        {item.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.key)}
                        aria-label={`Remove ${item.name}`}
                        className="text-[#4A4642] hover:text-red-700 p-0.5 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-[#4A4642] mt-0.5">
                      {item.size} <span aria-hidden="true">·</span> {item.color}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-3">
                    <div className="flex items-center border border-[#E5DEC9]">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.key, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="min-w-[36px] min-h-[36px] flex items-center justify-center text-[#151413] hover:bg-[#F2EDE4]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-medium tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.key, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="min-w-[36px] min-h-[36px] flex items-center justify-center text-[#151413] hover:bg-[#F2EDE4]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-sm font-semibold text-[#151413] tabular-nums">
                      {formatPKR(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Totals & Checkout */}
        {items.length > 0 && (
          <div className="p-5 sm:p-6 bg-white border-t border-[#E5DEC9] space-y-4">
            <form onSubmit={handlePromoSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-[#4A4642] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Promo code (try ZARIYAH10)"
                  className="w-full min-h-[42px] pl-8 pr-3 py-2 text-base sm:text-xs border border-[#E5DEC9] bg-[#FAF8F5] focus:border-[#A68342] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="min-h-[42px] px-4 py-2 border border-[#151413] text-xs font-medium text-[#151413] hover:bg-[#151413] hover:text-white transition-colors"
              >
                Apply
              </button>
            </form>
            {promoFeedback && <p className="text-xs text-[#8C6D32]">{promoFeedback}</p>}

            <div className="space-y-1.5 text-xs text-[#4A4642] pt-2 border-t border-[#F2EDE4]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums font-medium text-[#151413]">
                  {formatPKR(subtotal)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#8C6D32]">
                  <span>Privilege Discount (ZARIYAH10)</span>
                  <span className="tabular-nums">-{formatPKR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Nationwide Delivery</span>
                <span className="tabular-nums">
                  {shipping === 0 ? 'Complimentary' : formatPKR(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#151413] pt-2 border-t border-[#F2EDE4]">
                <span>Estimated Total</span>
                <span className="tabular-nums">{formatPKR(total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onCheckout}
              className="w-full py-3.5 bg-[#151413] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#A68342] transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};
