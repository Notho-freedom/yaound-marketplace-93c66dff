export interface Category {
  id: string;
  slug: string;
  name: { fr: string; en: string };
  icon: string;
  subcategories: Subcategory[];
  color?: string;
}

export interface Subcategory {
  id: string;
  slug: string;
  name: { fr: string; en: string };
  parentId: string;
}

export interface Region {
  id: string;
  name: string;
  cities: string[];
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  categoryId: string;
  subcategoryId: string;
  region: string;
  city: string;
  images: string[];
  condition?: 'new' | 'used';
  isPremium?: boolean;
  isUrgent?: boolean;
  createdAt: string;
  seller: Seller;
  specs?: Record<string, string | number>;
  views: number;
}

export interface Seller {
  id: string;
  name: string;
  avatar?: string;
  phone?: string;
  joinedAt: string;
  listingsCount: number;
  rating?: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  listingId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  listingId: string;
  listingTitle: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface Notification {
  id: string;
  type: 'message' | 'listing_view' | 'listing_expiry' | 'listing_approved' | 'listing_rejected';
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  region?: string;
  city?: string;
  joinedAt: string;
  language: 'fr' | 'en';
}

export type ViewMode = 'grid' | 'list';
export type SortOption = 'newest' | 'oldest' | 'price_asc' | 'price_desc';
export type ListingStatus = 'active' | 'pending' | 'expired' | 'rejected';
