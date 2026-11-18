import { useEffect, useState } from 'react';
import {
  CartItem,
  CategoryName,
  OrderRecord,
  Product,
  ProductReview,
  SeasonTag,
} from './types/shop';
import { INITIAL_ORDERS, PRODUCTS } from './data/products';
import { ActiveRoute, Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { CatalogView, SortOption } from './components/CatalogView';
import { ProductDetailView } from './components/ProductDetailView';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutView } from './components/CheckoutView';
import { OrderTrackingView } from './components/OrderTrackingView';
import { Footer } from './components/Footer';

const STORAGE_KEYS = {
  CART: 'zariyah_cart_v1',
  WISHLIST: 'zariyah_wishlist_v1',
  ORDERS: 'zariyah_orders_v1',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [route, setRoute] = useState<ActiveRoute>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>(PRODUCTS[0].id);

  // Catalog filter state
  const [selectedCategory, setSelectedCategory] = useState<CategoryName | 'All'>('All');
  const [selectedSeason, setSelectedSeason] = useState<SeasonTag | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [saleOnly, setSaleOnly] = useState(false);

  // Cart, Wishlist & Orders state
  const [cart, setCart] = useState<CartItem[]>(() => readStorage(STORAGE_KEYS.CART, []));
  const [wishlistIds, setWishlistIds] = useState<string[]>(() =>
    readStorage(STORAGE_KEYS.WISHLIST, [])
  );
  const [orders, setOrders] = useState<OrderRecord[]>(() =>
    readStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS)
  );
  const [trackingOrderId, setTrackingOrderId] = useState<string>(INITIAL_ORDERS[0].orderId);
  const [promoCode, setPromoCode] = useState('');

  // Drawers
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {
      // ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlistIds));
    } catch {
      // ignore storage quota errors
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {
      // ignore storage quota errors
    }
  }, [orders]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateHome = () => {
    setRoute('home');
    scrollToTop();
  };

  const navigateCatalog = (
    category: CategoryName | 'All' = 'All',
    season: SeasonTag | 'All' = 'All',
    onlySale = false
  ) => {
    setSelectedCategory(category);
    setSelectedSeason(season);
    setSaleOnly(onlySale);
    setRoute('catalog');
    scrollToTop();
  };

  const openProductDetail = (productId: string) => {
    setSelectedProductId(productId);
    setRoute('product');
    scrollToTop();
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory('All');
    setSelectedSeason('All');
    setSaleOnly(false);
    setRoute('catalog');
    scrollToTop();
  };

  const handleAddToCart = (
    product: Product,
    size: string,
    color: string,
    quantity: number
  ) => {
    const key = `${product.id}-${size}-${color}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          sku: product.sku,
          image: product.images[0],
          price: product.price,
          originalPrice: product.originalPrice,
          size,
          color,
          quantity,
        },
      ];
    });
    setCartOpen(true);
  };

  const handleQuickAdd = (product: Product) => {
    handleAddToCart(product, product.sizes[0], product.colors[0].name, 1);
  };

  const handleUpdateCartQuantity = (key: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.key !== key));
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.key === key ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (key: string) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddReview = (
    productId: string,
    reviewInput: Omit<ProductReview, 'id' | 'date' | 'verified'>
  ) => {
    const newReview: ProductReview = {
      ...reviewInput,
      id: `rev-${Date.now()}`,
      date: '17 Nov 2026',
      verified: true,
    };

    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        const updatedReviews = [newReview, ...prod.reviews];
        const avg =
          updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        return {
          ...prod,
          reviews: updatedReviews,
          reviewCount: prod.reviewCount + 1,
          rating: Number(avg.toFixed(1)),
        };
      })
    );
  };

  const handlePlaceOrder = (newOrder: OrderRecord) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setPromoCode('');
    setTrackingOrderId(newOrder.orderId);
  };

  const activeProduct =
    products.find((p) => p.id === selectedProductId) || products[0];

  const relatedProducts = products.filter(
    (p) =>
      p.id !== activeProduct.id &&
      (p.category === activeProduct.category || p.season === activeProduct.season)
  );

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#151413]">
      <Header
        route={route}
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        products={products}
        onNavigateHome={navigateHome}
        onNavigateCatalog={(cat) => navigateCatalog(cat || 'All')}
        onNavigateTrack={() => {
          setRoute('track');
          scrollToTop();
        }}
        onOpenProduct={openProductDetail}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onSearchSubmit={handleSearchSubmit}
      />

      <main className="flex-1">
        {route === 'home' && (
          <HomeView
            products={products}
            wishlistIds={wishlistIds}
            onNavigateCatalog={(cat, season, onlySale) =>
              navigateCatalog(cat || 'All', season || 'All', Boolean(onlySale))
            }
            onOpenProduct={openProductDetail}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
          />
        )}

        {route === 'catalog' && (
          <CatalogView
            products={products}
            selectedCategory={selectedCategory}
            selectedSeason={selectedSeason}
            searchQuery={searchQuery}
            sortBy={sortBy}
            saleOnly={saleOnly}
            wishlistIds={wishlistIds}
            onCategoryChange={setSelectedCategory}
            onSeasonChange={setSelectedSeason}
            onSearchChange={setSearchQuery}
            onSortChange={setSortBy}
            onSaleOnlyChange={setSaleOnly}
            onBackHome={navigateHome}
            onOpenProduct={openProductDetail}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
          />
        )}

        {route === 'product' && (
          <ProductDetailView
            key={activeProduct.id}
            product={activeProduct}
            relatedProducts={relatedProducts}
            wishlistIds={wishlistIds}
            isWishlisted={wishlistIds.includes(activeProduct.id)}
            onBack={() => navigateCatalog(selectedCategory)}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            onOpenProduct={openProductDetail}
            onAddReview={handleAddReview}
          />
        )}

        {route === 'checkout' && (
          <CheckoutView
            items={cart}
            promoCode={promoCode}
            existingOrderIds={orders.map((o) => o.orderId)}
            onBack={() => navigateCatalog('All')}
            onPlaceOrder={handlePlaceOrder}
            onTrackOrder={(orderId) => {
              setTrackingOrderId(orderId);
              setRoute('track');
              scrollToTop();
            }}
            onContinueShopping={() => navigateCatalog('All')}
          />
        )}

        {route === 'track' && (
          <OrderTrackingView
            orders={orders}
            initialOrderId={trackingOrderId}
            onBack={navigateHome}
          />
        )}
      </main>

      <Footer
        onNavigateHome={navigateHome}
        onNavigateCatalog={(cat) => navigateCatalog(cat)}
        onNavigateTrack={() => {
          setRoute('track');
          scrollToTop();
        }}
      />

      <CartDrawer
        isOpen={cartOpen}
        items={cart}
        promoCode={promoCode}
        onApplyPromo={setPromoCode}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => {
          setCartOpen(false);
          setRoute('checkout');
          scrollToTop();
        }}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        products={wishlistProducts}
        onClose={() => setWishlistOpen(false)}
        onRemove={handleToggleWishlist}
        onMoveToBag={handleQuickAdd}
        onOpenProduct={openProductDetail}
      />
    </div>
  );
}
