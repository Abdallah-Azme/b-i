
import { Project, SubscriptionPlan, PublicInvestor, FinancialStatus, AdStatus, IncomingRequest, SentInterest, OngoingRequest, VerificationInfo } from './types';

// Global Fallback Image
export const FALLBACK_IMAGE = "https://b3businessbrokers.com/wp-content/uploads/2024/05/AdobeStock_157565392-min.jpeg";

// Mock Statistics Data - Keeping as placeholders but can be empty/zero
export const EXTRA_STATS = {
  companyOwners: 0,
  proposedDeals: 0,
  successfulDeals: 0
};

export const CATEGORIES = [
  { en: "Restaurants", ar: "مطاعم" },
  { en: "New Startup Ideas", ar: "أفكار مشاريع ناشئة" },
  { en: "Retail Shops", ar: "محلات تجزئة" },
  { en: "Technology & SaaS", ar: "تقنية وبرمجيات" },
  { en: "Gyms & Fitness", ar: "معاهد صحية ورياضة" },
  { en: "Beauty & Cosmetics", ar: "تجميل ومستحضرات" },
  { en: "Cafés & Coffee Shops", ar: "مقاهي وكوفي شوب" },
  { en: "Real Estate", ar: "عقارات" },
  { en: "Food Concepts", ar: "مفاهيم غذائية" },
  { en: "Automotive Services", ar: "خدمات السيارات" },
  { en: "Educational Services", ar: "خدمات تعليمية" },
  { en: "E-commerce Brands", ar: "متاجر إلكترونية" },
  { en: "Delivery & Logistics", ar: "توصيل وخدمات لوجستية" },
  { en: "Medical Clinics", ar: "عيادات طبية" },
  { en: "Manufacturing", ar: "تصنيع ومصانع" }
];

export const COMPANY_STAGES = [
  {
    id: 'pre_seed',
    labelKey: 'stages.pre_seed',
    descKey: 'stages.pre_seed_desc',
    label: { en: 'Pre-seed', ar: 'ما قبل البذرة' }
  },
  {
    id: 'seed',
    labelKey: 'stages.seed',
    descKey: 'stages.seed_desc',
    label: { en: 'Seed', ar: 'البذرة' }
  },
  {
    id: 'series_a',
    labelKey: 'stages.series_a',
    descKey: 'stages.series_a_desc',
    label: { en: 'Series A', ar: 'السلسلة A' }
  },
  {
    id: 'series_b',
    labelKey: 'stages.series_b',
    descKey: 'stages.series_b_desc',
    label: { en: 'Series B', ar: 'السلسلة B' }
  },
  {
    id: 'series_c',
    labelKey: 'stages.series_c',
    descKey: 'stages.series_c_desc',
    label: { en: 'Series C', ar: 'السلسلة C' }
  },
  {
    id: 'series_d',
    labelKey: 'stages.series_d',
    descKey: 'stages.series_d_desc',
    label: { en: 'Series D+', ar: 'السلسلة D وما بعدها' }
  }
];

export const FINANCIAL_STATUS_ORDER: FinancialStatus[] = [
  'Very Strong',
  'Strong',
  'Stable',
  'Moderate',
  'Needs Improvement',
  'Weak',
  'Critical',
  'Not Disclosed',
  'Unknown'
];

export const FINANCIAL_HEALTH_MAP: Record<FinancialStatus, { labelKey: string; descKey: string }> = {
  'Very Strong': { labelKey: 'health.Very Strong', descKey: 'health.Very Strong_desc' },
  'Strong': { labelKey: 'health.Strong', descKey: 'health.Strong_desc' },
  'Stable': { labelKey: 'health.Stable', descKey: 'health.Stable_desc' },
  'Moderate': { labelKey: 'health.Moderate', descKey: 'health.Moderate_desc' },
  'Needs Improvement': { labelKey: 'health.Needs Improvement', descKey: 'health.Needs Improvement_desc' },
  'Weak': { labelKey: 'health.Weak', descKey: 'health.Weak_desc' },
  'Critical': { labelKey: 'health.Critical', descKey: 'health.Critical_desc' },
  'Not Disclosed': { labelKey: 'health.Not Disclosed', descKey: 'health.Not Disclosed_desc' },
  'Unknown': { labelKey: 'health.Unknown', descKey: 'health.Unknown_desc' }
};

export const AD_STATUS_CONFIG: Record<AdStatus, { labelKey: string; color: string; descKey: string }> = {
  'draft': { labelKey: 'status.draft', color: 'bg-gray-500', descKey: 'status.draft_desc' },
  'under_review': { labelKey: 'status.under_review', color: 'bg-blue-500', descKey: 'status.under_review_desc' },
  'needs_revision': { labelKey: 'status.needs_revision', color: 'bg-orange-500', descKey: 'status.needs_revision_desc' },
  'approved': { labelKey: 'status.accepted', color: 'bg-green-400', descKey: 'status.accepted_desc' },
  'published': { labelKey: 'status.published', color: 'bg-green-600', descKey: 'status.published_desc' },
  'rejected': { labelKey: 'status.rejected', color: 'bg-red-500', descKey: 'status.rejected_desc' },
  'suspended': { labelKey: 'status.suspended', color: 'bg-red-800', descKey: 'status.suspended_desc' },
};

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: { en: 'Basic', ar: 'أساسي' },
    price: 19,
    features: {
      en: ['Browse Projects', 'Basic Support', '5 Favorites'],
      ar: ['تصفح المشاريع', 'دعم أساسي', '٥ مفضلة']
    }
  },
  {
    id: 'premium',
    name: { en: 'Premium', ar: 'بريميوم' },
    price: 49,
    features: {
      en: ['Priority Access', 'Advanced Analytics', 'Unlimited Favorites', 'Email Alerts'],
      ar: ['أولوية الوصول', 'تحليلات متقدمة', 'مفضلة غير محدودة', 'تنبيهات البريد']
    }
  },
  {
    id: 'vip',
    name: { en: 'VIP', ar: 'كبار الشخصيات' },
    price: 299,
    isPopular: true,
    features: {
      en: ['Direct Admin Concierge', 'Hidden Opportunities', '0% Platform Fees on First Deal', 'Full Analytics Suite'],
      ar: ['كونسيرج إداري مباشر', 'فرص مخفية', '٠٪ رسوم المنصة في الصفقة الأولى', 'باقة التحليلات الكاملة']
    }
  }
];

// All Sample Arrays Empty for Production-like Environment
export const SAMPLE_PROJECTS: Project[] = [];
export const SAMPLE_INVESTORS: PublicInvestor[] = [];
export const SAMPLE_INCOMING_REQUESTS: IncomingRequest[] = [];
export const SAMPLE_SENT_INTERESTS: SentInterest[] = [];
export const SAMPLE_ONGOING_REQUESTS: OngoingRequest[] = [];
export const SAMPLE_VERIFICATION_INFO: VerificationInfo | null = null;
