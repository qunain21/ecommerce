import React, { useMemo } from 'react';
import { ArrowLeft, Search, SlidersHorizontal, X } from 'lucide-react';
import { CategoryName, Product, SeasonTag } from '../types/shop';
import { ALL_CATEGORIES } from '../data/products';
import { ProductCard } from './ProductCard';

export type SortOption = 'popularity' | 'newest' | 'price-asc' | 'price-desc';

interface CatalogViewProps {
  products: Product[];
  selectedCategory: CategoryName | 'All';
  selectedSeason: SeasonTag | 'All';
  searchQuery: string;
  sortBy: SortOption;
  saleOnly: boolean;
  wishlistIds: string[];
  onCategoryChange: (cat: CategoryName | 'All') => void;
  onSeasonChange: (season: SeasonTag | 'All') => void;
  onSearchChange: (q: string) => void;
  onSortChange: (sort: SortOption) => void;
  onSaleOnlyChange: (saleOnly: boolean) => void;
  onBackHome: () => void;
  onOpenProduct: (productId: string) => void;
  onToggleWishlist: (productId: string) => void;
  onQuickAdd: (product: Product) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  selectedCategory,
  selectedSeason,
  searchQuery,
  sortBy,
  saleOnly,
  wishlistIds,
  onCategoryChange,
  onSeasonChange,
  onSearchChange,
  onSortChange,
  onSaleOnlyChange,
  onBackHome,
  onOpenProduct,
  onToggleWishlist,
  onQuickAdd,
}) => {
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = products.filter((p) => {
      const matchesCat =
        selectedCategory === 'All' ||
        p.category === selectedCategory ||
        p.categories.includes(selectedCategory);

      const matchesSeason = selectedSeason === 'All' || p.season === selectedSeason;

      const matchesSale = !saleOnly || (p.originalPrice !== undefined && p.originalPrice > p.price);

      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q);

      return matchesCat && matchesSeason && matchesSale && matchesQuery;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return Number(Boolean(b.isNewArrival)) - Number(Boolean(a.isNewArrival));
      return b.popularityScore - a.popularityScore;
    });
  }, [products, selectedCategory, selectedSeason, searchQuery, sortBy, saleOnly]);

  const clearAllFilters = () => {
    onCategoryChange('All');
    onSeasonChange('All');
    onSearchChange('');
    onSaleOnlyChange(false);
    onSortChange('popularity');
  };

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-10 sm:py-14">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E5DEC9]">
        <div>
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#4A4642] hover:text-[#151413] mb-3 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#151413] tracking-tight">
            {selectedCategory === 'All' ? 'All Collections' : selectedCategory}
          </h1>
          <p className="text-sm text-[#4A4642] mt-2">
            Showing <span className="tabular-nums font-medium text-[#151413]">{filteredProducts.length}</span>{' '}
            {filteredProducts.length === 1 ? 'piece' : 'pieces'} crafted in Pakistan
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-[#4A4642] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search styles or fabrics..."
              aria-label="Filter products by keyword"
              className="w-full min-h-[44px] pl-9 pr-9 py-2.5 bg-white border border-[#E5DEC9] text-base sm:text-xs text-[#151413] placeholder-[#4A4642]/60 focus:border-[#A68342] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search query"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#4A4642] hover:text-[#151413]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#4A4642] shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              aria-label="Sort products"
              className="flex-1 sm:flex-none min-h-[44px] py-2.5 px-3 bg-white border border-[#E5DEC9] text-base sm:text-xs font-medium text-[#151413] focus:border-[#A68342] focus:outline-none cursor-pointer"
            >
              <option value="popularity">Sort: Popularity</option>
              <option value="newest">Sort: Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter Strip (All 11 Categories - Swipeable on Mobile) */}
      <div className="py-5 sm:py-6 border-b border-[#E5DEC9]/70 space-y-4">
        <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap items-center gap-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            type="button"
            onClick={() => onCategoryChange('All')}
            className={`min-h-[40px] px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors border ${
              selectedCategory === 'All'
                ? 'bg-[#151413] text-[#FAF8F5] border-[#151413]'
                : 'bg-white text-[#4A4642] border-[#E5DEC9] hover:border-[#A68342] hover:text-[#151413]'
            }`}
          >
            All Categories
          </button>
          {ALL_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`min-h-[40px] px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors border ${
                selectedCategory === category
                  ? 'bg-[#151413] text-[#FAF8F5] border-[#151413]'
                  : 'bg-white text-[#4A4642] border-[#E5DEC9] hover:border-[#A68342] hover:text-[#151413]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Season & Sale Secondary Filter Row */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-3 sm:gap-4 pt-1">
          <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap items-center gap-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <span className="text-xs text-[#4A4642] mr-1 shrink-0">Season:</span>
            {(['All', 'Summer', 'Winter', 'Festive', 'All-Season'] as const).map((season) => (
              <button
                key={season}
                type="button"
                onClick={() => onSeasonChange(season)}
                className={`min-h-[36px] px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  selectedSeason === season
                    ? 'bg-[#F2EDE4] text-[#151413] border border-[#A68342]'
                    : 'text-[#4A4642] hover:text-[#151413] border border-transparent'
                }`}
              >
                {season}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4">
            <label className="inline-flex items-center gap-2 text-xs font-medium text-[#151413] cursor-pointer min-h-[36px]">
              <input
                type="checkbox"
                checked={saleOnly}
                onChange={(e) => onSaleOnlyChange(e.target.checked)}
                className="accent-[#A68342] w-4 h-4"
              />
              <span>Seasonal Sale Items Only</span>
            </label>

            {(selectedCategory !== 'All' || selectedSeason !== 'All' || searchQuery || saleOnly) && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-medium text-[#8C6D32] underline underline-offset-4 hover:text-[#151413] whitespace-nowrap"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
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
      ) : (
        <div className="py-20 text-center border border-[#E5DEC9] bg-white mt-8 px-6">
          <h2 className="font-display text-2xl font-semibold text-[#151413]">
            No matching garments found
          </h2>
          <p className="text-sm text-[#4A4642] mt-2 max-w-md mx-auto">
            Adjust your category, season, or search keywords to explore our full Pakistani luxury collection.
          </p>
          <button
            type="button"
            onClick={clearAllFilters}
            className="mt-6 px-6 py-2.5 bg-[#151413] text-white text-xs font-medium hover:bg-[#A68342] transition-colors"
          >
            View All Collections
          </button>
        </div>
      )}
    </section>
  );
};
