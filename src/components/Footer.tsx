import React from 'react';
import { Facebook, Instagram, MapPin, Phone, Youtube } from 'lucide-react';
import { CategoryName } from '../types/shop';
import { WHATSAPP_BUSINESS_CONFIG } from '../config/whatsapp';

interface FooterProps {
  onNavigateHome: () => void;
  onNavigateCatalog: (category: CategoryName | 'All') => void;
  onNavigateTrack: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateHome,
  onNavigateCatalog,
  onNavigateTrack,
}) => {
  return (
    <footer className="bg-[#151413] text-[#FAF8F5] border-t border-[#2C2926]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <button
              type="button"
              onClick={onNavigateHome}
              className="font-display text-3xl font-semibold tracking-[0.14em] text-white"
            >
              ZARIYAH
            </button>
            <p className="text-xs leading-relaxed text-[#E5DEC9]/80 max-w-sm">
              Contemporary Pakistani luxury pret, heirloom unstitched lawn, and hand-worked formal attire crafted between our Lahore textile mills and Karachi atelier.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#E5DEC9]">
              <a
                href="#instagram-gallery"
                aria-label="Zariyah Instagram Gallery"
                className="w-11 h-11 inline-flex items-center justify-center border border-white/15 hover:border-[#A68342] hover:text-[#A68342] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#collections"
                aria-label="Zariyah Facebook"
                className="w-11 h-11 inline-flex items-center justify-center border border-white/15 hover:border-[#A68342] hover:text-[#A68342] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#collections"
                aria-label="Zariyah Lookbook Films"
                className="w-11 h-11 inline-flex items-center justify-center border border-white/15 hover:border-[#A68342] hover:text-[#A68342] transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div className="lg:col-span-3 space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#A68342]">
              Collections
            </h3>
            <ul className="space-y-1 text-xs text-[#E5DEC9]/85">
              {(
                [
                  "Women's Unstitched Suits",
                  "Women's Ready-to-Wear",
                  'Luxury Pret',
                  'Formal & Party Wear',
                  'Lawn Collection',
                  'Cambric Collection',
                  'Dupattas and Accessories',
                ] as CategoryName[]
              ).map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => onNavigateCatalog(cat)}
                    className="min-h-[36px] inline-flex items-center hover:text-white transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Care */}
          <div className="lg:col-span-2 space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#A68342]">
              Client Care
            </h3>
            <ul className="space-y-1 text-xs text-[#E5DEC9]/85">
              <li>
                <button
                  type="button"
                  onClick={onNavigateTrack}
                  className="min-h-[36px] inline-flex items-center hover:text-white transition-colors text-left"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateCatalog('All')}
                  className="min-h-[36px] inline-flex items-center hover:text-white transition-colors text-left"
                >
                  Seasonal Archive Sale
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateCatalog('2-Piece Suits')}
                  className="min-h-[36px] inline-flex items-center hover:text-white transition-colors text-left"
                >
                  2-Piece & 3-Piece Edit
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateCatalog('Chiffon Collection')}
                  className="min-h-[36px] inline-flex items-center hover:text-white transition-colors text-left"
                >
                  Chiffon & Bridal Trousseau
                </button>
              </li>
            </ul>
          </div>

          {/* Boutiques */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#A68342]">
              Flagship Ateliers
            </h3>
            <div className="space-y-2.5 text-xs text-[#E5DEC9]/85">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#A68342] shrink-0 mt-0.5" />
                <span>
                  Gulshan-e-Iqbal ({WHATSAPP_BUSINESS_CONFIG.businessPostalCode}), Karachi · Gulberg III, Lahore · F-7 Markaz, Islamabad
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#A68342] shrink-0" />
                <span className="tabular-nums">
                  WhatsApp: {WHATSAPP_BUSINESS_CONFIG.displayNumber} (Mon–Sat, 10 AM – 8 PM)
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Payment Trust Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left text-[11px] text-[#E5DEC9]/65">
          <p>© 2026 ZARIYAH Atelier Pakistan. All rights reserved.</p>
          <p className="tracking-wide">
            Cash on Delivery · Visa & Mastercard · JazzCash · Easypaisa
          </p>
        </div>
      </div>
    </footer>
  );
};
