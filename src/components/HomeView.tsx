import React, { useState } from 'react';
import { ArrowRight, Check, Star } from 'lucide-react';
import { CategoryName, CollectionGroup, Product, SeasonTag } from '../types/shop';
import { ALL_CATEGORIES, FEATURED_CATEGORY_CARDS, IMAGES, LATEST_2026_IDS } from '../data/products';
import { ResilientImage } from './ResilientImage';
import { ProductCard } from './ProductCard';

interface HomeViewProps {
  products: Product[];
  wishlistIds: string[];
  onNavigateCatalog: (category?: CategoryName | 'All', season?: SeasonTag | 'All', saleOnly?: boolean) => void;
  onOpenProduct: (productId: string) => void;
  onToggleWishlist: (productId: string) => void;
  onQuickAdd: (product: Product) => void;
}

const COLLECTION_TABS: { id: CollectionGroup; label: string }[] = [
  { id: 'new-arrivals', label: 'New Arrivals' },
  { id: 'best-sellers', label: 'Best Sellers' },
  { id: 'unstitched-lawn', label: 'Unstitched Lawn' },
  { id: 'ready-to-wear', label: 'Ready-to-Wear' },
  { id: 'luxury-pret', label: 'Luxury Pret' },
  { id: 'festive-formal', label: 'Festive & Formal' },
];

const CLIENT_TESTIMONIALS = [
  {
    name: 'Ayesha Kamran',
    city: 'Lahore',
    garment: 'Noor-e-Sahar Chikankari Ensemble',
    quote:
      'The ivory chikankari weight and hand-finished organza dupatta drape like custom bridalwear. Delivery arrived in Gulberg within 24 hours.',
  },
  {
    name: 'Hira Mansoor',
    city: 'Karachi',
    garment: 'Bagh-e-Gul Botanical Lawn',
    quote:
      'True 80-count Swiss voile that stays breathable in humid Karachi afternoons without losing its crisp silhouette after washing.',
  },
  {
    name: 'Zoya Siddiqui',
    city: 'Islamabad',
    garment: 'Meher-e-Zari Chiffon Peshwas',
    quote:
      'Exceptional tailoring on the 16-kali flare and understated antique gold detailing—no harsh synthetic sheen.',
  },
];

const INSTAGRAM_GALLERY = [
  { id: 'zry-noor-sahar-01', image: IMAGES.heroPret, handle: '@zariyah.atelier', caption: 'Noor-e-Sahar in Lahore' },
  { id: 'zry-shab-e-noor-03', image: IMAGES.luxuryPret, handle: '@zariyah.atelier', caption: 'Shab-e-Noor Raw Silk' },
  { id: 'zry-bagh-lawn-02', image: IMAGES.lawnUnstitched, handle: '@zariyah.atelier', caption: 'Botanical Summer Lawn' },
  { id: 'zry-mahrukh-chiffon-07', image: IMAGES.chiffonCrimson, handle: '@zariyah.atelier', caption: 'Festive Crimson Chiffon' },
];

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  wishlistIds,
  onNavigateCatalog,
  onOpenProduct,
  onToggleWishlist,
  onQuickAdd,
}) => {
  const [activeTab, setActiveTab] = useState<CollectionGroup>('new-arrivals');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSaved, setNewsletterSaved] = useState(false);

  const latest2026Products = products.filter((p) =>
    (LATEST_2026_IDS as readonly string[]).includes(p.id)
  );

  const activeProducts = products
    .filter((p) => p.collectionGroup.includes(activeTab))
    .slice(0, 6);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSaved(true);
    setNewsletterEmail('');
  };

  return (
    <div>
      {/* 1. Hero Campaign Banner */}
      <section className="relative w-full min-h-[460px] sm:min-h-[540px] lg:min-h-[650px] flex items-end lg:items-center overflow-hidden bg-[#151413]">
        <ResilientImage
          src={IMAGES.heroPret}
          alt="Zariyah Noor-e-Sahar Pakistani Luxury Pret Campaign"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover object-top sm:object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#151413]/85 via-[#151413]/45 to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#151413]/85 via-[#151413]/30 to-transparent lg:hidden"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-[1440px] mx-auto w-full px-4 sm:px-8 py-10 sm:py-16 lg:py-20">
          <div className="max-w-xl space-y-4 sm:space-y-5 text-[#FAF8F5]">
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#E5DEC9]">
              Autumn / Festive Atelier Edit 2026
            </p>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-semibold leading-[1.08] text-balance">
              Crafted in Ivory, Threadwork & Heritage Silk
            </h1>
            <p className="text-sm sm:text-base text-[#E5DEC9]/90 leading-relaxed max-w-md">
              Discover hand-finished Pakistani chikankari pret, 80-count Swiss voile unstitched lawn, and pure chiffon evening silhouettes.
            </p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigateCatalog('Luxury Pret')}
                className="min-h-[44px] px-7 py-3.5 bg-[#FAF8F5] text-[#151413] text-xs font-semibold uppercase tracking-widest hover:bg-[#A68342] hover:text-white transition-colors inline-flex items-center justify-center gap-2"
              >
                <span>Explore Luxury Pret</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateCatalog("Women's Unstitched Suits")}
                className="min-h-[44px] px-6 py-3.5 border border-[#FAF8F5]/60 text-[#FAF8F5] text-xs font-semibold uppercase tracking-widest hover:bg-[#FAF8F5]/10 transition-colors inline-flex items-center justify-center"
              >
                Shop Unstitched Lawn
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 1B. ia.B – Latest Collection 2026 Featured Edit */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-14 sm:pt-18 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#E5DEC9]">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#8C6D32] font-semibold">
              Featured Drop 2026
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#151413] mt-1">
              ia.B – Latest Collection 2026
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigateCatalog('Embroidered Suits')}
            className="text-xs font-semibold uppercase tracking-wider text-[#151413] border-b border-[#151413] pb-1 hover:text-[#8C6D32] hover:border-[#8C6D32] transition-colors self-start sm:self-auto"
          >
            Shop Latest Edit
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latest2026Products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistIds.includes(product.id)}
              onOpenProduct={onOpenProduct}
              onToggleWishlist={onToggleWishlist}
              onQuickAdd={onQuickAdd}
            />
          ))}
        </div>
      </section>

      {/* 2. Shop by Category + All 11 Category Index */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-14 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#8C6D32] font-medium">
              Curated Silhouettes
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#151413] mt-1">
              Shop by Category
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigateCatalog('All')}
            className="text-xs font-semibold uppercase tracking-wider text-[#151413] border-b border-[#151413] pb-1 hover:text-[#8C6D32] hover:border-[#8C6D32] transition-colors self-start sm:self-auto"
          >
            View All 11 Categories
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_CATEGORY_CARDS.map((card) => (
            <button
              key={card.title}
              type="button"
              onClick={() => onNavigateCatalog(card.title)}
              className="group text-left bg-white border border-[#E5DEC9] overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="aspect-[3/4] overflow-hidden bg-[#F2EDE4]">
                <ResilientImage
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-4 sm:p-5 border-t border-[#F2EDE4]">
                <p className="text-[11px] uppercase tracking-[0.08em] text-[#4A4642]">
                  {card.pieceLabel}
                </p>
                <h3 className="font-display text-2xl font-semibold text-[#151413] mt-1 group-hover:text-[#8C6D32] transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-[#4A4642] mt-1">{card.caption}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Clean Horizontal Directory for Remaining Categories */}
        <div className="mt-8 pt-6 border-t border-[#E5DEC9] flex flex-wrap items-center gap-x-6 gap-y-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#4A4642]">
            Browse by Fabric & Cut:
          </span>
          {ALL_CATEGORIES.slice(3).map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onNavigateCatalog(category)}
              className="text-xs font-medium text-[#151413] hover:text-[#8C6D32] underline-offset-4 hover:underline transition-colors whitespace-nowrap"
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Tabbed Collections Showcase (New Arrivals, Best Sellers, Lawn, RTW, Luxury Pret, Festive) */}
      <section id="collections" className="bg-white border-y border-[#E5DEC9]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-14 sm:py-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#8C6D32] font-medium">
                Signature Releases
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#151413] mt-1">
                Explore the Atelier Collections
              </h2>
            </div>

            <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap items-center gap-1.5 bg-[#FAF8F5] p-1 border border-[#E5DEC9] -mx-4 px-4 sm:mx-0 sm:px-1">
              {COLLECTION_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-h-[40px] px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#151413] text-[#FAF8F5]'
                      : 'text-[#4A4642] hover:text-[#151413]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {activeProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                onOpenProduct={onOpenProduct}
                onToggleWishlist={onToggleWishlist}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => onNavigateCatalog('All')}
              className="px-8 py-3.5 bg-[#151413] text-[#FAF8F5] text-xs font-semibold uppercase tracking-widest hover:bg-[#A68342] transition-colors inline-flex items-center gap-2"
            >
              <span>Explore Complete Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Seasonal Summer & Winter Collections + Seasonal Sale Split */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 border border-[#E5DEC9] bg-white items-stretch">
          <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 flex flex-col justify-between gap-8">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[#8C6D32] font-semibold">
                Seasonal Archive · Summer Lawn & Winter Cambric
              </p>
              <h2 className="font-display text-3xl sm:text-5xl font-semibold text-[#151413] leading-tight text-balance">
                Woven for Every Pakistani Season
              </h2>
              <p className="text-sm text-[#4A4642] leading-relaxed max-w-lg">
                From breathable 80-count summer Swiss voile to brushed winter cotton cambric and hand-loomed wool shawls. Enjoy up to 20% off select archive pieces while quantities remain.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#F2EDE4]">
              <button
                type="button"
                onClick={() => onNavigateCatalog('All', 'Summer', false)}
                className="py-3 px-4 border border-[#E5DEC9] text-left hover:border-[#A68342] transition-colors"
              >
                <span className="block text-[11px] uppercase tracking-wider text-[#4A4642]">
                  Summer Edit
                </span>
                <span className="block text-sm font-semibold text-[#151413] mt-0.5">
                  Lawn & Voile →
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateCatalog('All', 'Winter', false)}
                className="py-3 px-4 border border-[#E5DEC9] text-left hover:border-[#A68342] transition-colors"
              >
                <span className="block text-[11px] uppercase tracking-wider text-[#4A4642]">
                  Winter Edit
                </span>
                <span className="block text-sm font-semibold text-[#151413] mt-0.5">
                  Cambric & Shawls →
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateCatalog('All', 'All', true)}
                className="py-3 px-4 bg-[#151413] text-[#FAF8F5] text-left hover:bg-[#A68342] transition-colors"
              >
                <span className="block text-[11px] uppercase tracking-wider text-[#E5DEC9]">
                  Limited Privilege
                </span>
                <span className="block text-sm font-semibold mt-0.5">
                  Seasonal Sale →
                </span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 min-h-[340px] bg-[#F2EDE4]">
            <ResilientImage
              src={IMAGES.dupattaShawl}
              alt="Hand-loomed Pakistani silk jacquard dupattas and winter shawls"
              loading="lazy"
              className="w-full h-full lg:h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 5. Client Testimonials, Instagram Gallery & Newsletter */}
      <section className="bg-[#F2EDE4]/65 border-t border-[#E5DEC9]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-14 sm:py-20 space-y-16">
          {/* Client Reviews */}
          <div>
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.18em] text-[#8C6D32] font-medium">
                Client Perspectives
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#151413] mt-1">
                Worn Across Lahore, Karachi & Islamabad
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CLIENT_TESTIMONIALS.map((item) => (
                <blockquote
                  key={item.name}
                  className="bg-white border border-[#E5DEC9] p-6 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-0.5 text-[#A68342] mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#A68342]" />
                      ))}
                    </div>
                    <p className="text-sm text-[#4A4642] leading-relaxed">“{item.quote}”</p>
                  </div>
                  <footer className="pt-3 border-t border-[#F2EDE4] text-xs">
                    <p className="font-semibold text-[#151413]">
                      {item.name} <span className="font-normal text-[#4A4642]">· {item.city}</span>
                    </p>
                    <p className="text-[#8C6D32] mt-0.5">{item.garment}</p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>

          {/* Instagram Fashion Gallery */}
          <div id="instagram-gallery">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#8C6D32] font-medium">
                  @zariyah.atelier
                </p>
                <h2 className="font-display text-3xl font-semibold text-[#151413] mt-1">
                  Styled in Zariyah
                </h2>
              </div>
              <p className="text-xs text-[#4A4642]">
                Select any look to view garment details and sizing
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {INSTAGRAM_GALLERY.map((post) => (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => onOpenProduct(post.id)}
                  className="group relative aspect-[3/4] overflow-hidden bg-[#E5DEC9] text-left"
                >
                  <ResilientImage
                    src={post.image}
                    alt={post.caption}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151413]/80 via-[#151413]/15 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3 sm:p-4">
                    <span className="text-xs font-medium text-white">
                      Shop {post.caption} →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-white border border-[#E5DEC9] p-6 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
            <div className="max-w-lg">
              <p className="text-xs uppercase tracking-[0.18em] text-[#8C6D32] font-medium">
                Private Atelier Dispatches
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#151413] mt-1">
                Receive Early Access to Lawn & Festive Launches
              </h2>
              <p className="text-xs text-[#4A4642] mt-2">
                Join our list for seasonal lookbooks and private sale previews. Use privilege code{' '}
                <strong className="text-[#151413]">ZARIYAH10</strong> at checkout for 10% off your bag.
              </p>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => {
                  setNewsletterEmail(e.target.value);
                  setNewsletterSaved(false);
                }}
                placeholder="Enter your email address"
                aria-label="Email address for newsletter"
                className="sm:w-72 min-h-[44px] px-4 py-3 text-base sm:text-sm bg-[#FAF8F5] border border-[#E5DEC9] focus:border-[#A68342] focus:outline-none"
              />
              <button
                type="submit"
                className="min-h-[44px] px-6 py-3 bg-[#151413] text-[#FAF8F5] text-xs font-semibold uppercase tracking-widest hover:bg-[#A68342] transition-colors whitespace-nowrap inline-flex items-center justify-center gap-2"
              >
                {newsletterSaved ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
