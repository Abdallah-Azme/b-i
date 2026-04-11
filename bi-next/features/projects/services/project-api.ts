import { Project, AdStatus, FinancialStatus } from '@/shared/types';

// Global Fallback Image
export const FALLBACK_IMAGE = "https://b3businessbrokers.com/wp-content/uploads/2024/05/AdobeStock_157565392-min.jpeg";

export interface Category {
  en: string;
  ar: string;
}

export const CATEGORIES: Category[] = [
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

export interface CompanyStageConfig {
  id: string;
  label: { ar: string; en: string };
  age: { ar: string; en: string };
  desc: { ar: string; en: string };
}

export const COMPANY_STAGES: CompanyStageConfig[] = [
  { id: 'pre_seed', label: { ar: 'ما قبل البذرة', en: 'Pre-seed' }, age: { ar: 'لم يبدأ بعد', en: 'Not started yet' }, desc: { ar: 'المرحلة الأولية حيث يتم تطوير الفكرة والتحقق من صحتها.', en: 'The initial stage where the idea is being developed and validated.' } },
  { id: 'seed', label: { ar: 'البذرة', en: 'Seed' }, age: { ar: 'أقل من سنة', en: 'Less than 1 year' }, desc: { ar: 'التركيز على ملاءمة المنتج للسوق وتوسيع نطاق الفريق.', en: 'Focusing on product-market fit and expanding the core team.' } },
  { id: 'series_a', label: { ar: 'السلسلة A', en: 'Series A' }, age: { ar: 'أقل من سنتين', en: 'Less than 2 years' }, desc: { ar: 'تحسين نموذج العمل وجذب قاعدة مستخدمين أوسع.', en: 'Optimizing the business model and attracting a broader user base.' } },
  { id: 'series_b', label: { ar: 'السلسلة B', en: 'Series B' }, age: { ar: 'بين 2 إلى 4 سنوات', en: 'Between 2 to 4 years' }, desc: { ar: 'التوسع في أسواق جديدة والنمو السريع للعمليات.', en: 'Expanding into new markets and rapid operational growth.' } },
  { id: 'series_c', label: { ar: 'السلسلة C', en: 'Series C' }, age: { ar: '4 سنوات وأكثر', en: '4 years and more' }, desc: { ar: 'تعزيز السوق، الاستحواذات، أو التحضير للاكتتاب العام.', en: 'Market consolidation, acquisitions, or preparing for IPO.' } },
  { id: 'series_d', label: { ar: 'السلسلة D وما بعدها', en: 'Series D+' }, age: { ar: 'أكثر من 5 سنوات', en: 'More than 5 years' }, desc: { ar: 'شركات ناضجة تسعى لتوسع دولي أو تمويل استراتيجي ضخم.', en: 'Mature companies seeking international expansion or major strategic funding.' } }
];

const PROJECT_IMAGES = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
];

export const SAMPLE_PROJECTS: Project[] = Array.from({ length: 30 }, (_, i) => {
  const healths: FinancialStatus[] = ['Very Strong', 'Strong', 'Stable', 'Moderate', 'Needs Improvement', 'Weak', 'Critical', 'Not Disclosed', 'Unknown'];
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
  const stage = COMPANY_STAGES[i % COMPANY_STAGES.length];
  const ageVal = Math.floor(Math.random() * 5) + 1;
  const listingPurpose = i % 2 === 0 ? 'investment' : 'sale';
  const ownerId = i < 5 ? 'USR-DEMO-OWNER' : `USR-${Math.floor(Math.random() * 9000) + 1000}`;
  
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
    age: { en: `${ageVal} Years`, ar: `${ageVal} سنوات` },
    shareOffered: [10, 15, 20, 25, 49, 50, 100][i % 7],
    askingPrice: (Math.floor(Math.random() * 100) + 20) * 1000,
    location: loc,
    descriptionShort: {
      en: `A high-potential ${cat.en} business looking for strategic investment to expand operations in ${loc.en}.`,
      ar: `مشروع ${cat.ar} ذو إمكانيات عالية يبحث عن استثمار استراتيجي لتوسيع العمليات في ${loc.ar}.`
    },
    descriptionFull: {
      en: `This represents a verified investment opportunity in the ${cat.en} sector. The business has shown consistent performance over the last few years.`,
      ar: `هذه فرصة استثمارية موثقة في قطاع ${cat.ar}. أظهرت الأعمال أداءً مستقراً خلال السنوات القليلة الماضية.`
    },
    financialHealth: healths[i % 9],
    status: (i % 7 === 4 || i % 7 === 3) ? 'published' : 'approved', // Simulating active projects
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    companyStage: { ar: stage.label.ar, en: stage.label.en },
    viewsCount: Math.floor(Math.random() * 2000) + 100
  };
});


interface StatusConfig {
  en: string;
  ar: string;
  color: string;
  desc: { en: string; ar: string };
}

export const FINANCIAL_HEALTH_MAP: Record<FinancialStatus, StatusConfig> = {
  'Very Strong': { en: 'Very Strong', ar: 'قوي جداً', color: 'text-emerald-400', desc: { en: 'Consistently profitable with high reserves.', ar: 'مربح باستمرار مع احتياطيات عالية.' } },
  'Strong': { en: 'Strong', ar: 'قوي', color: 'text-green-400', desc: { en: 'Profitable with good cash flow.', ar: 'مربح مع تدفق نقدي جيد.' } },
  'Stable': { en: 'Stable', ar: 'مستقر', color: 'text-blue-400', desc: { en: 'Steady performance and reliable growth.', ar: 'أداء ثابت ونمو موثوق.' } },
  'Moderate': { en: 'Moderate', ar: 'متوسط', color: 'text-yellow-400', desc: { en: 'Sustainable performance with some volatility.', ar: 'أداء مستدام مع بعض التقلبات.' } },
  'Needs Improvement': { en: 'Needs Improvement', ar: 'يحتاج تحسين', color: 'text-orange-400', desc: { en: 'Functioning but requires operational optimization.', ar: 'يعمل ولكنه يتطلب تحسيناً تشغيلياً.' } },
  'Weak': { en: 'Weak', ar: 'ضعيف', color: 'text-red-400', desc: { en: 'Struggling with profitability or debt.', ar: 'يعاني من الربحية أو الديون.' } },
  'Critical': { en: 'Critical', ar: 'حرج', color: 'text-red-600', desc: { en: 'At high risk without immediate intervention.', ar: 'معرض لخطر كبير دون تدخل فوري.' } },
  'Not Disclosed': { en: 'Not Disclosed', ar: 'غير معلن', color: 'text-gray-400', desc: { en: 'Financial details not publicly available.', ar: 'التفاصيل المالية غير متاحة للعلن.' } },
  'Unknown': { en: 'Unknown', ar: 'غير معروف', color: 'text-gray-500', desc: { en: 'Awaiting verification or more data.', ar: 'في انتظار التحقق أو المزيد من البيانات.' } }
};

export const AD_STATUS_CONFIG: Record<AdStatus, StatusConfig> = {
  'draft': { en: 'Draft', ar: 'مسودة', color: 'bg-gray-500', desc: { en: 'Being edited.', ar: 'قيد التحرير.' } },
  'under_review': { en: 'Review', ar: 'قيد المراجعة', color: 'bg-blue-500', desc: { en: 'Pending admin approval.', ar: 'في انتظار موافقة الإدارة.' } },
  'needs_revision': { en: 'Revision', ar: 'تعديلات', color: 'bg-orange-500', desc: { en: 'Admin requested changes.', ar: 'طلبت الإدارة تغييرات.' } },
  'approved': { en: 'Approved', ar: 'مقبول', color: 'bg-green-600', desc: { en: 'Verified and ready to publish.', ar: 'مقبول وجاهز للنشر.' } },
  'published': { en: 'Published', ar: 'منشور', color: 'bg-emerald-500', desc: { en: 'Live on the platform.', ar: 'نشط على المنصة.' } },
  'rejected': { en: 'Rejected', ar: 'مرفوض', color: 'bg-red-600', desc: { en: 'Does not meet standards.', ar: 'لا يستوفي المعايير.' } },
  'suspended': { en: 'Suspended', ar: 'معلق', color: 'bg-red-800', desc: { en: 'Disabled due to policy or request.', ar: 'تم التعطيل بسبب السياسة أو الطلب.' } }
};

export const EXTRA_STATS = {
  companyOwners: 142,
  proposedDeals: 850,
  successfulDeals: 124
};

// Mocking API service
export const projectService = {
  getLatestProjects: async () => {
    return SAMPLE_PROJECTS
      .filter(p => p.status === 'published' || p.status === 'approved')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);
  },
  getAllProjects: async (category?: string) => {
    let filtered = SAMPLE_PROJECTS.filter(p => p.status === 'published' || p.status === 'approved');
    if (category) {
      filtered = filtered.filter(p => p.category.en === category);
    }
    return filtered;
  },
  getProjectById: async (id: string) => {
    return SAMPLE_PROJECTS.find(p => p.id === id);
  }
};
