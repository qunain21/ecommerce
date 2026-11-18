export type CategoryName =
  | "Women's Unstitched Suits"
  | "Women's Ready-to-Wear"
  | "Luxury Pret"
  | "2-Piece Suits"
  | "3-Piece Suits"
  | "Lawn Collection"
  | "Chiffon Collection"
  | "Cambric Collection"
  | "Embroidered Suits"
  | "Formal & Party Wear"
  | "Dupattas and Accessories";

export type SeasonTag = 'Summer' | 'Winter' | 'Festive' | 'All-Season';

export type CollectionGroup =
  | 'new-arrivals'
  | 'best-sellers'
  | 'unstitched-lawn'
  | 'ready-to-wear'
  | 'luxury-pret'
  | 'festive-formal'
  | 'seasonal-edit';

export interface ProductColorOption {
  name: string;
  hex: string;
}

export interface ProductReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  sizePurchased: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  category: CategoryName;
  categories: CategoryName[];
  collectionGroup: CollectionGroup[];
  season: SeasonTag;
  pieceCount: '1-Piece' | '2-Piece' | '3-Piece';
  fabric: string;
  craftDetail: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  popularityScore: number;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  inStock: boolean;
  sizes: string[];
  colors: ProductColorOption[];
  images: string[];
  description: string;
  specifications: {
    shirt: string;
    trouser?: string;
    dupatta?: string;
    care: string;
    dispatch: string;
  };
  reviews: ProductReview[];
}

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  sku: string;
  image: string;
  price: number;
  originalPrice?: number;
  size: string;
  color: string;
  quantity: number;
}

export type PaymentMethod = 'cod' | 'card' | 'wallet' | 'whatsapp';

export type OrderStage =
  | 'Order Confirmed'
  | 'Quality & Pressing'
  | 'Dispatched'
  | 'Out for Delivery'
  | 'Delivered';

export interface OrderRecord {
  orderId: string;
  createdAt: string;
  customerName: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  postalCode?: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Pending COD Collection' | 'Paid Online' | 'Pending WhatsApp Confirmation';
  courier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  currentStageIndex: number;
  stages: {
    title: OrderStage;
    timestamp: string;
    location: string;
  }[];
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}
