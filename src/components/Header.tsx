import React, { useEffect, useState } from 'react';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { CategoryName, Product } from '../types/shop';
import { formatPKR } from '../data/products';
import { ResilientImage } from './ResilientImage';

export type ActiveRoute = 'home' | 'catalog' | 'product' | 'checkout' | 'track';

interface HeaderProps {
  route: ActiveRoute;
  cartCount: number;
  wishlistCount: number;
  products: Product[];
  onNavigateHome: () => void;
  onNavigateCatalog: (category?: CategoryName | 'All') => void;
  onNavigateTrack: () => void;
  onOpenProduct: (productId: string) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onSearchSubmit: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  route,
  cartCount,
  wishlistCount,
  products,
  onNavigateHome,
  onNavigateCatalog,
  onNavigateTrack,
  onOpenProduct,
  onOpenCart,
  onOpenWishlist,
  onSearchSubmit,
}) => {
  const [showPromo, setShowPromo] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const quickResults = searchTerm.trim()
    ? products
        .filter((p) => {
          const q = searchTerm.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.fabric.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.subtitle.toLowerCase().includes(q)
          );
        })
        .slice(0, 4)
    : [];

  const handleSearchForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(searchTerm.trim());
    setSearchOpen(false);
  };

  return (
    <div className="sticky top-0 z-40 w-full">
      {showPromo && (
        <div className="bg-[#151413] text-[#FAF8F5] h-7 sm:h-8 px-4 flex items-center justify-center relative text-[11px] sm:text-xs tracking-wide">
          <p className="truncate pr-7 text-center">
            Free Delivery Nationwide Above PKR 5,000
            <span className="hidden sm:inline mx-2 text-[#A68342]" aria-hidden="true">
              ·
            </span>
            <span className="hidden sm:inline text-[#E5DEC9]">
              Seasonal Sale: Up to 20% Off Select Collections
            </span>
          </p>
          <button
            type="button"
            onClick={() => setShowPromo(false)}
            aria-label="Dismiss announcement"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#E5DEC9] hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <header className="bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E5DEC9]">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-8 h-14 sm:h-16 flex items-center justify-between gap-3 sm:gap-6 lg:gap-8">
          {/* Zone 1: Single-element Brand Wordmark */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setMobileMenuOpen((prev) => !prev);
              }}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="lg:hidden min-w-[40px] min-h-[40px] flex items-center justify-center -ml-1 text-[#151413] hover:text-[#A68342] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchOpen(false);
                onNavigateHome();
              }}
              className="font-display text-xl sm:text-[28px] font-semibold tracking-[0.12em] sm:tracking-[0.14em] text-[#151413] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A68342]"
            >
              ZARIYAH
            </button>
          </div>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-7 text-[13px] font-medium tracking-wide text-[#4A4642]"
          >
            <button
              type="button"
              onClick={() => onNavigateCatalog('All')}
              className={`whitespace-nowrap shrink-0 py-1 border-b transition-colors ${
                route === 'catalog'
                  ? 'text-[#151413] border-[#A68342]'
                  : 'border-transparent hover:text-[#151413] hover:border-[#A68342]/50'
              }`}
            >
              Collections
            </button>
            <button
              type="button"
              onClick={() => onNavigateCatalog("Women's Unstitched Suits")}
              className="whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:text-[#151413] hover:border-[#A68342]/50 transition-colors"
            >
              Unstitched
            </button>
            <button
              type="button"
              onClick={() => onNavigateCatalog("Women's Ready-to-Wear")}
              className="whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:text-[#151413] hover:border-[#A68342]/50 transition-colors"
            >
              Ready-to-Wear
            </button>
            <button
              type="button"
              onClick={() => onNavigateCatalog('Luxury Pret')}
              className="whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:text-[#151413] hover:border-[#A68342]/50 transition-colors"
            >
              Luxury Pret
            </button>
            <button
              type="button"
              onClick={onNavigateTrack}
              className={`whitespace-nowrap shrink-0 py-1 border-b transition-colors ${
                route === 'track'
                  ? 'text-[#151413] border-[#A68342]'
                  : 'border-transparent hover:text-[#151413] hover:border-[#A68342]/50'
              }`}
            >
              Track Order
            </button>
          </nav>

          {/* Zone 3: Interactive Search, Wishlist & Bag */}
          <div className="flex items-center gap-1 sm:gap-4 shrink-0">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchOpen((prev) => !prev);
              }}
              aria-expanded={searchOpen}
              aria-label="Search catalog"
              className="min-w-[40px] min-h-[40px] px-2 text-[#151413] hover:text-[#A68342] transition-colors flex items-center justify-center gap-1.5 text-xs font-medium whitespace-nowrap shrink-0"
            >
              <Search className="w-[18px] h-[18px] stroke-[1.6]" />
              <span className="hidden sm:inline">Search</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchOpen(false);
                onOpenWishlist();
              }}
              aria-label={`Open wishlist (${wishlistCount} saved items)`}
              className="min-w-[40px] min-h-[40px] px-2 text-[#151413] hover:text-[#A68342] transition-colors flex items-center justify-center gap-1 text-xs font-medium whitespace-nowrap shrink-0"
            >
              <Heart className="w-[18px] h-[18px] stroke-[1.6]" />
              <span className="tabular-nums">{wishlistCount}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchOpen(false);
                onOpenCart();
              }}
              aria-label={`Open shopping bag (${cartCount} items)`}
              className="min-h-[40px] px-3 sm:px-3.5 py-2 bg-[#151413] text-[#FAF8F5] hover:bg-[#A68342] transition-colors flex items-center gap-1.5 sm:gap-2 text-xs font-medium whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4 stroke-[1.6]" />
              <span className="hidden xs:inline sm:inline">Bag</span>
              <span className="tabular-nums text-[#E5DEC9]">({cartCount})</span>
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="border-t border-[#E5DEC9] bg-white max-h-[75dvh] overflow-y-auto shadow-lg">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-4">
              <form onSubmit={handleSearchForm} className="flex items-center gap-2 sm:gap-3">
                <Search className="w-4 h-4 text-[#4A4642] shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Chikankari, Lawn, Chiffon, Pastel..."
                  className="w-full py-2 text-base sm:text-sm text-[#151413] placeholder-[#4A4642]/60 bg-transparent border-b border-[#E5DEC9] focus:border-[#A68342] focus:outline-none"
                />
                <button
                  type="submit"
                  className="min-h-[40px] px-4 py-2 bg-[#151413] text-white text-xs font-medium whitespace-nowrap shrink-0 hover:bg-[#A68342] transition-colors"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  className="min-w-[40px] min-h-[40px] flex items-center justify-center text-[#4A4642] hover:text-[#151413]"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>

              {quickResults.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-[#F2EDE4]">
                  {quickResults.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSearchOpen(false);
                        onOpenProduct(item.id);
                      }}
                      className="flex items-center gap-3 text-left p-2 hover:bg-[#FAF8F5] transition-colors"
                    >
                      <ResilientImage
                        src={item.images[0]}
                        alt={item.name}
                        className="w-12 h-16 object-cover shrink-0 bg-[#F2EDE4]"
                      />
                      <div className="min-w-0">
                        <p className="text-xs text-[#4A4642] truncate">{item.category}</p>
                        <p className="text-sm font-medium text-[#151413] truncate">{item.name}</p>
                        <p className="text-xs font-semibold text-[#A68342] tabular-nums mt-0.5">
                          {formatPKR(item.price)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile Navigation"
            className="lg:hidden border-t border-[#E5DEC9] bg-[#FAF8F5] px-4 py-3 max-h-[75dvh] overflow-y-auto shadow-lg"
          >
            {[
              { label: 'All Collections', action: () => onNavigateCatalog('All') },
              {
                label: "Women's Unstitched Suits",
                action: () => onNavigateCatalog("Women's Unstitched Suits"),
              },
              {
                label: "Women's Ready-to-Wear",
                action: () => onNavigateCatalog("Women's Ready-to-Wear"),
              },
              { label: 'Luxury Pret', action: () => onNavigateCatalog('Luxury Pret') },
              {
                label: 'Embroidered Suits',
                action: () => onNavigateCatalog('Embroidered Suits'),
              },
              {
                label: 'Formal & Party Wear',
                action: () => onNavigateCatalog('Formal & Party Wear'),
              },
              {
                label: 'Dupattas and Accessories',
                action: () => onNavigateCatalog('Dupattas and Accessories'),
              },
              { label: 'Track Order', action: onNavigateTrack },
            ].map((navItem) => (
              <button
                key={navItem.label}
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navItem.action();
                }}
                className="flex items-center justify-between w-full min-h-[44px] text-left py-2.5 text-sm font-medium text-[#151413] border-b border-[#E5DEC9]/60 last:border-b-0 hover:text-[#A68342] transition-colors"
              >
                <span>{navItem.label}</span>
                <span className="text-xs text-[#4A4642]" aria-hidden="true">
                  →
                </span>
              </button>
            ))}
          </nav>
        )}
      </header>
    </div>
  );
};
