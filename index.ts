export type CategoryType = 
  | 'Koylaklar'
  | 'Futbolkalar'
  | 'Shimlar'
  | 'Jinsilar'
  | 'Kostyumlar'
  | 'Kurtkalar'
  | 'Sviterlar'
  | 'Sport'
  | 'OyoqKiyimlar'
  | 'Soatlar'
  | 'Atirlar'
  | 'Aksessuarlar'
  | 'TayyorObrazlar'
  | 'Boshqa';

export interface ProductColor {
  name: string; // e.g. "Qora", "Oq", "To'q ko'k", "Kulrang", "Jigarrang"
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: CategoryType;
  categoryNameUz: string;
  price: number;
  oldPrice?: number;
  isNew?: boolean;
  isPopular?: boolean;
  inStock: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  layerType?: 'outerwear' | 'top' | 'bottom' | 'shoes' | 'accessories';
  isActive: boolean;
  createdAt: string;
  details: {
    fabric: string;
    care: string;
    origin: string;
  };
}

export interface CartItem {
  id: string; // unique item key: productId + color + size
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  color: ProductColor;
  size: string;
  quantity: number;
  image: string;
  category: CategoryType;
}

export type OrderStatus =
  | 'Yangi'
  | 'Tasdiqlandi'
  | 'Tayyorlanmoqda'
  | 'Yetkazilmoqda'
  | 'Yetkazib berildi'
  | 'Bekor qilindi';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  colorName: string;
  colorHex: string;
  size: string;
  quantity: number;
  image: string;
}

export interface OrderHistoryItem {
  status: OrderStatus;
  timestamp: string;
  comment?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "SHU-2026-9812"
  customerName: string;
  phone: string;
  region: string;
  city: string;
  address: string;
  yandexMapUrl?: string;
  note?: string;
  paymentMethod: 'cash' | 'card_agreement';
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  history: OrderHistoryItem[];
  telegramSent: boolean;
  idempotencyKey?: string;
}

export interface ReadyLook {
  id: string;
  name: string;
  style: 'Kundalik' | 'Klassik' | 'Sport' | 'Ish uchun' | 'Bayramona' | 'Yozgi' | 'Qishki';
  description: string;
  image: string;
  totalEstimate: number;
  discountPrice?: number;
  productIds: string[];
  tags: string[];
  isActive: boolean;
}

// -------------------------------------------------------------
// STORE CONFIGURATION & ADMIN SETTINGS TYPES
// -------------------------------------------------------------

export interface StoreInfoSettings {
  name: string;
  tagline: string;
  phone: string;
  secondaryPhone?: string;
  address: string;
  city: string;
  mapUrl?: string;
  telegramUsername: string;
  telegramChannelUrl?: string;
  instagramUsername: string;
  instagramUrl?: string;
  workingHours: string;
  contactNote: string;
}

export interface DeliverySettings {
  tashkentCityPrice: number;
  tashkentRegionPrice: number;
  otherRegionsPrice: number;
  freeDeliveryThreshold: number;
  minOrderAmount: number;
  deliveryNotice: string;
  isDeliveryEnabled: boolean;
}

export interface HomeTextsSettings {
  announcementBanner: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImageUrl: string;
  aboutText: string;
  footerText: string;
}

export interface AppSettings {
  storeInfo: StoreInfoSettings;
  delivery: DeliverySettings;
  homeTexts: HomeTextsSettings;
}

export interface AdminCredentialsPayload {
  currentPassword: string;
  newUsername: string;
  newPassword: string;
  confirmPassword: string;
}
