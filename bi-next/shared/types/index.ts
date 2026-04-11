
export type Language = 'en' | 'ar';
export type UserRole = 'investor' | 'advertiser' | 'admin' | 'guest';

export interface User {
  id: string;
  name: string; // Internal name
  displayName?: string; // Compatibility field
  email: string;
  role: UserRole;
  subscriptionPlan?: 'basic' | 'premium' | 'vip';
  unlockedProjects: string[]; // IDs of projects purchased
  favorites: string[];
  companyLicenseUrl?: string; // Kept for Account Verification (KYC)
  bio?: string;
  tagline?: string;
  // Legacy fields
  companyName?: string;
  // Investor Profile
  investorType?: 'company' | 'angel' | 'crowdfunding';
  investorSector?: string;
  investorCapital?: number;
  investmentCount?: number;
  investorExperience?: 'beginner' | 'intermediate' | 'expert';
}

export interface PublicInvestor {
  id: string;
  investorType: 'company' | 'angel' | 'crowdfunding';
  capital: number;
  preferredField: string; // Category EN
  experience: 'beginner' | 'intermediate' | 'expert';
}

export type ListingPurpose = 'investment' | 'sale';

export type FinancialStatus = 
  | 'Very Strong' 
  | 'Strong' 
  | 'Stable' 
  | 'Moderate' 
  | 'Needs Improvement' 
  | 'Weak' 
  | 'Critical' 
  | 'Not Disclosed' 
  | 'Unknown';

export type AdStatus = 'draft' | 'under_review' | 'needs_revision' | 'approved' | 'published' | 'rejected' | 'suspended';

export interface Project {
  id: string;
  ownerId?: string; // Link to the Advertiser User
  listingPurpose?: ListingPurpose; // New field
  name: { ar: string; en: string };
  category: { ar: string; en: string };
  image: string; // URL to thumbnail
  capital: number; // KWD
  age: { ar: string; en: string };
  shareOffered: number; // %
  askingPrice: number; // KWD (Requested Investment Amount or Sale Price)
  location: { ar: string; en: string };
  descriptionShort: { ar: string; en: string };
  descriptionFull: { ar: string; en: string };
  financialHealth: FinancialStatus;
  status: AdStatus;
  createdAt: string;
  // Details
  legalEntity?: { ar: string; en: string };
  companyType?: { ar: string; en: string };
  companyStage?: { ar: string; en: string }; 
  investmentReason?: { ar: string; en: string };
  // Stats
  viewsCount?: number;
  bookletPurchasesCount?: number;
  interestsCount?: number;
}

export interface SubscriptionPlan {
  id: string;
  name: { en: string; ar: string };
  price: number;
  features: { en: string[]; ar: string[] };
  isPopular?: boolean;
}

export type SortOption = 'price_asc' | 'price_desc' | 'newest' | 'share_high';

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  sort: SortOption;
}

export type NotificationType = 'deal' | 'project' | 'interest' | 'system';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: { ar: string; en: string };
  message: { ar: string; en: string };
  createdAt: string;
  isRead: boolean;
  link?: string;
}

export interface IncomingRequest {
  id: string;
  projectName: { ar: string; en: string };
  investorName: string;
  date: string;
  status: 'new' | 'replied' | 'rejected' | 'processing';
}

export interface SentInterest {
  id: string;
  projectName: { ar: string; en: string };
  image: string;
  date: string;
  status: 'sent' | 'replied' | 'rejected' | 'accepted';
}

export interface OngoingRequest {
  id: string;
  projectName: { ar: string; en: string };
  counterparty: string;
  status: 'negotiation' | 'pending' | 'completed' | 'canceled';
  lastUpdate: string;
}

export interface VerificationInfo {
  accountStatus: 'verified' | 'unverified' | 'review';
  companyName: string;
  licenseNumber: string;
  verificationStatus: 'verified' | 'review' | 'rejected';
  rejectionReason?: string;
}
