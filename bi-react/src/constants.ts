
import { Project, SubscriptionPlan, PublicInvestor, FinancialStatus, AdStatus, IncomingRequest, SentInterest, OngoingRequest, VerificationInfo } from './types';

// Global Fallback Image
export const FALLBACK_IMAGE = "https://b3businessbrokers.com/wp-content/uploads/2024/05/AdobeStock_157565392-min.jpeg";

// Mock Statistics Data
export const EXTRA_STATS = {
  companyOwners: 142,
  proposedDeals: 89,
  successfulDeals: 34
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

const PROJECT_IMAGES = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80", // Restaurants
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80", // Startup
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80", // Retail
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80", // Tech
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80", // Gym
  "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=800&q=80", // Beauty
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80", // Cafe
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80", // Real Estate
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80", // Food
  "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=800&q=80", // Auto
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80", // Education
  "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=800&q=80", // Ecommerce
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80", // Logistics
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80", // Medical
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80", // Manufacturing
];

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

// Generating 30 Realistic Sample Projects
export const SAMPLE_PROJECTS: Project[] = Array.from({ length: 30 }, (_, i) => {
  const healths: FinancialStatus[] = ['Very Strong', 'Strong', 'Stable', 'Moderate', 'Needs Improvement', 'Weak', 'Critical', 'Not Disclosed', 'Unknown'];
  
  const legalEntities = [
    { en: 'LLC', ar: 'ذ.م.م' },
    { en: 'Sole Proprietorship', ar: 'مؤسسة فردية' },
    { en: 'Partnership', ar: 'شركة تضامن' },
    { en: 'Shareholding', ar: 'شركة مساهمة' }
  ];
  const companyTypes = [
    { en: 'Startup', ar: 'شركة ناشئة' },
    { en: 'SME', ar: 'مشروع صغير/متوسط' },
    { en: 'Franchise', ar: 'فرنشايز' },
    { en: 'Established Brand', ar: 'علامة تجارية قائمة' }
  ];
  
  const locations = [
    { en: 'Kuwait City', ar: 'مدينة الكويت' },
    { en: 'Salmiya', ar: 'السالمية' },
    { en: 'Hawally', ar: 'حولي' },
    { en: 'Fahaheel', ar: 'الفحيحيل' },
    { en: 'Jahra', ar: 'الجهراء' },
    { en: 'Shuwaikh', ar: 'الشويخ' }
  ];

  const cat = CATEGORIES[i % CATEGORIES.length];
  const loc = locations[i % locations.length];
  const legal = legalEntities[i % legalEntities.length];
  const type = companyTypes[i % companyTypes.length];
  const stage = COMPANY_STAGES[i % COMPANY_STAGES.length]; // Random stage
  const ageVal = Math.floor(Math.random() * 5) + 1;

  // listingPurpose randomization (approx. half and half)
  const listingPurpose = i % 2 === 0 ? 'investment' : 'sale';

  // Demo ownership for first 5 projects
  const ownerId = i < 5 ? 'USR-DEMO-OWNER' : `USR-${Math.floor(Math.random() * 9000) + 1000}`;

  // Generate stats with logic: Views > Interests > Purchases
  const views = Math.floor(Math.random() * 2000) + 100;
  const interests = Math.floor(views * (Math.random() * 0.15 + 0.05)); // 5-20% of views
  const purchases = Math.floor(interests * (Math.random() * 0.5)); // 0-50% of interests

  return {
    id: `PROJ-${1000 + i}`,
    ownerId: ownerId,
    listingPurpose: listingPurpose,
    name: {
       en: `${cat.en} Opportunity #${i + 1}`,
       ar: `فرصة ${cat.ar} رقم ${i + 1}`
    },
    category: cat,
    image: PROJECT_IMAGES[i % PROJECT_IMAGES.length],
    capital: (Math.floor(Math.random() * 50) + 10) * 1000,
    age: {
      en: `${ageVal} Years`,
      ar: `${ageVal} سنوات`
    },
    shareOffered: [10, 15, 20, 25, 49, 50, 100][i % 7],
    askingPrice: (Math.floor(Math.random() * 100) + 20) * 1000,
    location: loc,
    descriptionShort: {
      en: `A high-potential ${cat.en} business looking for strategic investment to expand operations in ${loc.en}.`,
      ar: `مشروع ${cat.ar} ذو إمكانيات عالية يبحث عن استثمار استراتيجي لتوسيع العمليات في ${loc.ar}.`
    },
    descriptionFull: {
      en: `This represents a verified investment opportunity in the ${cat.en} sector. The business has shown consistent performance over the last few years. We are seeking a partner to inject liquidity for regional expansion. Full financial audits, legal documents, and growth projections are available in this file.`,
      ar: `هذه فرصة استثمارية موثقة في قطاع ${cat.ar}. أظهرت الأعمال أداءً متسقاً خلال السنوات القليلة الماضية. نحن نسعى للحصول على شريك لضخ السيولة للتوسع الإقليمي. تتوفر التدقيقات المالية الكاملة والوثائق القانونية وتوقعات النمو في هذا الملف.`
    },
    financialHealth: healths[i % 9],
    status: (['draft', 'under_review', 'needs_revision', 'approved', 'published', 'rejected', 'suspended'] as AdStatus[])[i % 7],
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    legalEntity: legal,
    companyType: type,
    companyStage: stage.label,
    investmentReason: {
      en: "Expansion to new locations and upgrading equipment.",
      ar: "التوسع في مواقع جديدة وتحديث المعدات."
    },
    viewsCount: views,
    interestsCount: interests,
    bookletPurchasesCount: purchases
  };
});

// Generating 10 Realistic Sample Investors
export const SAMPLE_INVESTORS: PublicInvestor[] = Array.from({ length: 10 }, (_, i) => {
  const types: Array<'company' | 'angel' | 'crowdfunding'> = ['company', 'angel', 'crowdfunding'];
  const experiences: Array<'beginner' | 'intermediate' | 'expert'> = ['beginner', 'intermediate', 'expert'];
  const cat = CATEGORIES[i % CATEGORIES.length];
  
  return {
    id: `USR-${8920 + i}`,
    investorType: types[i % 3],
    capital: (Math.floor(Math.random() * 90) + 10) * 10000, // 100k - 1M
    preferredField: cat.en,
    experience: experiences[i % 3],
    joinedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  };
});

export const SAMPLE_INCOMING_REQUESTS: IncomingRequest[] = [
  { id: 'req-1', projectName: { ar: 'مطعم البيت', en: 'Al-Bayt Restaurant' }, investorName: 'محمد أحمد', date: '2026-04-01', status: 'new' },
  { id: 'req-2', projectName: { ar: 'متجر إلكتروني', en: 'E-commerce Store' }, investorName: 'سارة خالد', date: '2026-03-28', status: 'processing' },
  { id: 'req-3', projectName: { ar: 'عيادة طبية', en: 'Medical Clinic' }, investorName: 'علي حسن', date: '2026-03-25', status: 'replied' },
];

export const SAMPLE_SENT_INTERESTS: SentInterest[] = [
  { id: 'int-1', projectName: { ar: 'شركة تقنية', en: 'Tech Company' }, image: PROJECT_IMAGES[3], date: '2026-04-03', status: 'sent' },
  { id: 'int-2', projectName: { ar: 'مقهى', en: 'Coffee Shop' }, image: PROJECT_IMAGES[6], date: '2026-03-30', status: 'accepted' },
];

export const SAMPLE_ONGOING_REQUESTS: OngoingRequest[] = [
  { id: 'deal-1', projectName: { ar: 'مطعم البيت', en: 'Al-Bayt Restaurant' }, counterparty: 'محمد أحمد', status: 'negotiation', lastUpdate: '2026-04-04' },
  { id: 'deal-2', projectName: { ar: 'شركة تقنية', en: 'Tech Company' }, counterparty: 'شركة الاستثمار الأولى', status: 'pending', lastUpdate: '2026-04-02' },
];

export const SAMPLE_VERIFICATION_INFO: VerificationInfo = {
  accountStatus: 'review',
  companyName: 'شركة النخبة التجارية',
  licenseNumber: '123456789',
  verificationStatus: 'review',
};
