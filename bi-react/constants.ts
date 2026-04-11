
import { Project, SubscriptionPlan, PublicInvestor, FinancialStatus, IncomingRequest, SentInterest, OngoingRequest, VerificationInfo } from './types';

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
    label: { ar: 'ما قبل البذرة', en: 'Pre-seed' },
    desc: { 
      ar: 'فكرة مشروع فقط، لم يبدأ النشاط بعد.', 
      en: 'Idea stage, not operating yet.' 
    },
    age: { ar: 'لم يبدأ بعد', en: 'Not started yet' }
  },
  {
    id: 'seed',
    label: { ar: 'البذرة', en: 'Seed' },
    desc: { 
      ar: 'مرحلة ناشئة، تم تحويل الفكرة إلى مشروع مع إطلاق تجريبي (Soft Launch)، عمر النشاط أقل من سنة.', 
      en: 'Early-stage with a soft launch / MVP, operating for less than 1 year.' 
    },
    age: { ar: 'أقل من سنة', en: 'Less than 1 year' }
  },
  {
    id: 'series_a',
    label: { ar: 'السلسلة A', en: 'Series A' },
    desc: { 
      ar: 'المشروع يعمل لكنه يحتاج للنمو، عمر النشاط أقل من سنتين.', 
      en: 'Operating and needs growth, operating for less than 2 years.' 
    },
    age: { ar: 'أقل من سنتين', en: 'Less than 2 years' }
  },
  {
    id: 'series_b',
    label: { ar: 'السلسلة B', en: 'Series B' },
    desc: { 
      ar: 'الشركة في مرحلة نمو واضح، عمر النشاط بين 2 إلى 4 سنوات.', 
      en: 'Clear growth stage, operating for 2–4 years.' 
    },
    age: { ar: 'بين 2 إلى 4 سنوات', en: 'Between 2 to 4 years' }
  },
  {
    id: 'series_c',
    label: { ar: 'السلسلة C', en: 'Series C' },
    desc: { 
      ar: 'الشركة ناجحة بالفعل، عمر النشاط 4 سنوات وأكثر.', 
      en: 'Established and successful, operating for 4+ years.' 
    },
    age: { ar: '4 سنوات وأكثر', en: '4 years and more' }
  },
  {
    id: 'series_d',
    label: { ar: 'السلسلة D وما بعدها', en: 'Series D+' },
    desc: { 
      ar: 'مرحلة متقدمة جداً، استعداد للطرح العام أو الاستحواذ.', 
      en: 'Very advanced stage, preparing for IPO or acquisition.' 
    },
    age: { ar: 'أكثر من 5 سنوات', en: 'More than 5 years' }
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

export const FINANCIAL_HEALTH_MAP: Record<FinancialStatus, { en: string; ar: string; desc: { en: string; ar: string } }> = {
  'Very Strong': { 
    en: 'Very Strong', 
    ar: 'ممتاز',
    desc: {
      en: 'Excellent financial performance, strong cash position, clear growth, and obligations under control.',
      ar: 'الشركة تحقق نتائج مالية ممتازة وسيولة قوية، ونمو واضح، مع التزامات تحت السيطرة.'
    }
  },
  'Strong': { 
    en: 'Strong', 
    ar: 'قوي',
    desc: {
      en: 'Strong and highly stable performance, good profitability, and solid ability to cover expenses and obligations.',
      ar: 'الأداء المالي قوي ومستقر جدًا، أرباح جيدة، وقدرة عالية على تغطية المصاريف والالتزامات.'
    }
  },
  'Stable': { 
    en: 'Stable', 
    ar: 'مستقر',
    desc: {
      en: 'Balanced financial state; revenue covers operations comfortably with no major stress indicators.',
      ar: 'الوضع المالي متوازن، الإيرادات تغطي التشغيل بشكل مريح، ولا توجد مؤشرات ضغط كبيرة.'
    }
  },
  'Moderate': { 
    en: 'Moderate', 
    ar: 'متوسط',
    desc: {
      en: 'Acceptable but fluctuating performance; stronger and weaker periods, needs better cost or sales control.',
      ar: 'الأداء مقبول لكن به تذبذب، وقد تظهر أشهر قوية وأخرى ضعيفة، ويحتاج ضبط أفضل للتكاليف أو المبيعات.'
    }
  },
  'Needs Improvement': { 
    en: 'Needs Improvement', 
    ar: 'يحتاج تحسين',
    desc: {
      en: 'Noticeable weakness in a key area (sales, margins, or liquidity) and requires a short-term improvement plan.',
      ar: 'يوجد ضعف واضح في أحد الجوانب (المبيعات، الهامش، السيولة)، ويتطلب خطة تحسين قصيرة المدى.'
    }
  },
  'Weak': { 
    en: 'Weak', 
    ar: 'ضعيف',
    desc: {
      en: 'Significant financial pressure; difficulty covering expenses or obligations consistently, needs urgent fixes.',
      ar: 'ضغط مالي ملحوظ، صعوبة في تغطية المصاريف أو الالتزامات بشكل منتظم، والحاجة لإصلاحات عاجلة.'
    }
  },
  'Critical': { 
    en: 'Critical', 
    ar: 'حرج',
    desc: {
      en: 'Severe indicators such as major deficit, distressed debt, or continuous cash burn; may require restructuring or emergency funding.',
      ar: 'مؤشرات خطيرة مثل عجز كبير أو ديون متعثرة أو نزيف نقدي مستمر، وقد يتطلب إعادة هيكلة أو تمويل طارئ.'
    }
  },
  'Not Disclosed': { 
    en: 'Not Disclosed / Not Available', 
    ar: 'غير متاح / غير مُصرّح',
    desc: {
      en: 'Financial information is not shared or insufficient data was provided for evaluation.',
      ar: 'الشركة لا تعرض بياناتها المالية أو لم تُقدّم معلومات كافية للتقييم.'
    }
  },
  'Unknown': { 
    en: 'Unknown', 
    ar: 'غير معروف',
    desc: {
      en: 'Not enough reliable data to determine the status accurately.',
      ar: 'لا تتوفر بيانات كافية أو المصادر غير موثوقة، لذلك لا يمكن تحديد الحالة بدقة.'
    }
  }
};

export const AD_STATUS_CONFIG: Record<AdStatus, { en: string; ar: string; color: string; desc: { en: string; ar: string } }> = {
  'draft': { en: 'Draft', ar: 'مسودة', color: 'bg-gray-500', desc: { en: 'Listing is in draft mode.', ar: 'الإعلان في وضع المسودة.' } },
  'under_review': { en: 'Under Review', ar: 'قيد المراجعة', color: 'bg-blue-500', desc: { en: 'Listing is being reviewed by admin.', ar: 'الإعلان قيد المراجعة من قبل الإدارة.' } },
  'needs_revision': { en: 'Needs Revision', ar: 'يحتاج تعديل', color: 'bg-orange-500', desc: { en: 'Listing needs some changes.', ar: 'الإعلان يحتاج إلى بعض التعديلات.' } },
  'approved': { en: 'Approved', ar: 'مقبول', color: 'bg-green-400', desc: { en: 'Listing is approved.', ar: 'تم قبول الإعلان.' } },
  'published': { en: 'Published', ar: 'منشور', color: 'bg-green-600', desc: { en: 'Listing is live.', ar: 'الإعلان منشور حالياً.' } },
  'rejected': { en: 'Rejected', ar: 'مرفوض', color: 'bg-red-500', desc: { en: 'Listing was rejected.', ar: 'تم رفض الإعلان.' } },
  'suspended': { en: 'Suspended', ar: 'موقوف', color: 'bg-red-800', desc: { en: 'Listing is suspended.', ar: 'الإعلان موقوف.' } },
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

export const TRANSLATIONS = {
  en: {
    nav: { home: 'Home', projects: 'Projects', investors: 'Investors', pricing: 'Pricing', about: 'About', login: 'Login', register: 'Register', dashboard: 'My Account', logout: 'Logout', stats: 'Stats' },
    tabs: { home: 'Home', projects: 'Projects', favorites: 'Favorites', investors: 'Investors', dashboard: 'My Account', more: 'More', notifications: 'Notifications' },
    allCategories: 'All Categories',
    moreMenu: { 
      notifications: 'Notifications', 
      favorites: 'My Favorites',
      about: 'About Us', 
      contact: 'Contact Us', 
      terms: 'Terms of Use', 
      privacy: 'Privacy Policy', 
      language: 'Language Settings', 
      password: 'Change Password', 
      logout: 'Logout' 
    },
    hero: {
      title: 'Where Vision Meets Capital',
      subtitle: 'The exclusive ecosystem for secure business investments.',
      cta: 'Explore Opportunities'
    },
    stats: {
      title: 'Platform Statistics',
      subtitle: 'Real-time metrics showing the growth and trust within our ecosystem.',
      projects: 'Projects',
      investors: 'Investors',
      owners: 'Company Owners',
      proposed: 'Proposed Deals',
      successful: 'Successful Deals'
    },
    common: {
      buyFile: 'Purchase Project File',
      interested: 'I’m Interested',
      locked: 'File Locked',
      unlocked: 'Access Granted',
      currency: 'KWD',
      share: 'Share',
      price: 'Price',
      capital: 'Capital',
      location: 'Location',
      age: 'Company Age',
      financial: 'Company Financial Status',
      commission: 'Note: A 2.5% commission applies on completed deals.',
      lockedDetails: 'These details are available after purchasing the Project File'
    },
    filters: {
      title: 'Filter Projects',
      category: 'Category',
      listingType: 'Listing Type',
      forSale: 'Companies for Sale',
      forInvestment: 'Investment Opportunities',
      allTypes: 'All Types',
      sort: 'Sort By',
      priceLow: 'Price: Low to High',
      priceHigh: 'Price: High to Low',
      newest: 'Newest',
      reset: 'Reset Filters'
    },
    investorsPage: {
      title: 'Investors',
      subtitle: 'Browse registered investors and find the right partner for your business.',
      filterTitle: 'Filter Investors',
      filterType: 'Investor Type',
      filterCapital: 'Capital Available',
      filterExp: 'Experience Level',
      filterField: 'Preferred Field',
      allTypes: 'All Types',
      allExp: 'Any Experience',
      allFields: 'All Fields',
      reset: 'Reset Filters'
    },
    listing: {
      title: 'Add New Listing',
      step1: 'Purpose',
      step2: 'Details',
      purposeTitle: 'What is your goal?',
      investment: 'Seek Investment',
      investmentDesc: 'I am looking for partners or capital to grow my business.',
      sale: 'Sell Business',
      saleDesc: 'I want to sell my business or a branch completely.',
      next: 'Next Step',
      submit: 'Publish Listing',
      processing: 'Publishing...',
      success: 'Your listing has been submitted successfully and is now under review. It will be published after admin approval.',
      investorTypesTitle: 'Investor Types',
      companyType: 'Company (Investor)',
      angelType: 'Angel Investor',
      crowdType: 'Crowdfunding',
      prefField: 'Preferred Field',
      exp: 'Experience',
      years: 'years',
      tech: 'Tech',
      techFood: 'Tech & Food',
      realEstate: 'Real Estate'
    },
    auth: {
      registerTitle: 'Register new account in B&I',
      loginTitle: 'Login to B&I',
      selectType: 'Select your account type to continue',
      investor: 'Investor',
      advertiser: 'Business Owner',
      investorDesc: 'I want to buy equity and invest in companies',
      advertiserDesc: 'I want funding by selling a share of the company',
      noAccount: "Don't have an account? Register",
      alreadyHaveAccount: "Already have an account? Login",
      loginBtn: 'Login',
      createAccount: 'Create Account',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      password: 'Password',
      phone: 'Phone Number',
      companyName: 'Company Name',
      adminCompanyName: 'Company Name (Admin)',
      companyOwnerName: 'Company Owner Name',
      licenseNumber: 'License Number',
      companyAge: 'Business Age',
      companyAgeLabel: 'Business Age',
      sector: 'Company Field',
      valuation: 'Market Valuation (KWD)',
      investorSubtitle: 'Create an investor account to explore verified opportunities.',
      advertiserSubtitle: 'Create a business owner account. You can add listings after registration.',
      verifyTitle: 'Verify Your Email',
      verifyDesc: 'We have sent a verification link to your email address. Please check your inbox to activate your account.',
      backToLogin: 'Back to Login',
      required: 'Required',
      invalidEmail: 'Invalid email',
      invalidPhone: 'Must be 8 digits',
      fillDemo: 'Fill Demo Data',
      investorType: 'Investor Type',
      individual: 'Individual (Angel)',
      institution: 'Company / Institution',
      angelType: 'Angel Investor',
      companyType: 'Company / Institution',
      crowdType: 'Crowdfunding',
      descCapital: 'Capital',
      descField: 'Preferred field',
      descExp: 'Experience',
      selectedTypeDetails: 'Selected Investor Type Details: {TYPE}',
      valCap100: '100K & above',
      valCap10: '10K & above',
      valFieldTech: 'Tech',
      valFieldTechFood: 'Tech & Food',
      valFieldRE: 'Real Estate',
      valExp7: '7 years',
      valExp4: '4 years',
      valExp2: '2 years',
      legalEntity: 'Legal Entity',
      companyTypeLabel: 'Type of Company',
      companyStage: 'Company Stage',
      investmentReason: 'Reason for Investment',
      requestedInvestment: 'Requested Investment Amount (KWD)',
      salePrice: 'Selling Price (KWD)',
      capital: 'Capital (KWD)',
      revenue: 'Revenue (KWD)',
      utilities: 'Utilities / Resources',
      description: 'Description',
      fullDetails: 'Full Description',
      shareToSell: 'Equity/Share to Sell (%)',
      companyLicense: 'Company License (Verification)',
      uploadLicense: 'Upload image or PDF for company license',
      licenseErrorSize: 'File must be less than 10MB',
      licenseErrorType: 'Only JPG, PNG, PDF allowed',
      viewLicense: 'View License',
      replaceLicense: 'Replace License',
      investorSector: 'Focus Sector',
      investorCapital: 'Capital Available (KWD)',
      investmentCount: 'Previous Investments',
      investorExperience: 'Investment Experience',
      expBeginner: 'Beginner',
      expIntermediate: 'Intermediate',
      expExpert: 'Expert',
      other: 'Other',
      agreeToTerms: 'I agree to the ',
      termsOfUse: 'Terms of Use',
      and: ' and ',
      privacyPolicy: 'Privacy Policy',
      termsError: 'You must agree to the terms and privacy policy',
      agreeToTermsListing: 'I agree to the Terms & Conditions',
      termsErrorListing: 'You must agree to the Terms & Conditions first',
      editProfile: 'Edit My Account',
      saveChanges: 'Save Changes',
      cancel: 'Cancel',
      successMessage: 'Changes saved successfully',
      displayName: 'Display Name',
      bio: 'Bio',
      tagline: 'Tagline',
      profileImage: 'Profile Image',
      readOnlyField: 'This data cannot be edited',
      raiseCapital: 'Add Listing',
      raiseCapitalDesc: 'Submit a new project or business for sale.',
      addProject: 'Add Listing'
    },
    aboutPage: {
      title: 'من نحن',
      intro: 'الأعمال والاستثمارات منصة كويتية تربط المستثمرين بأصحاب الفرص بشكل آمن وموثوق، مع أعلى مستوى من الخصوصية وإخفاء الهوية.',
      sections: [
        { title: 'لماذا نحن؟', body: 'نحن لسنا مجرد موقع إعلاني، بل وسيط رقمي يضمن جودة العروض من خلال مراجعة إدارية دقيقة وحماية بيانات جميع الأطراف.' },
        { title: 'كيف تعمل المنصة؟', body: 'يتم عرض المشاريع ببيانات أولية. لفتح التفاصيل الكاملة، يقوم المستثمر بشراء كراسة المشروع. عند الجدية، يتم تنسيق الاجتماعات عبر الإدارة.' },
        { title: 'سياسة الخصوصية وإخفاء الهوية', body: 'يظهر الأعضاء بأرقام تعريفية (ID) فقط في المراحل الأولى. لا يتم كشف الهوية إلا عند الضرورة وبموافقة الأطراف.' },
        { title: 'العمولة', body: 'تطبق عمولة نجاح بنسبة 2.5% على إجمالي قيمة الصفقة عند إتمامها بنجاح.' }
      ],
      cta: 'استكشف المشاريع'
    }
  },
  ar: {
    nav: { home: 'الرئيسية', projects: 'المشاريع', investors: 'المستثمرون', pricing: 'الباقات', about: 'من نحن', login: 'دخول', register: 'تسجيل', dashboard: 'حسابي', logout: 'خروج', stats: 'الإحصائيات' },
    tabs: { home: 'الرئيسية', projects: 'المشاريع', favorites: 'المفضلة', investors: 'المستثمرون', dashboard: 'حسابي', more: 'المزيد', notifications: 'الإشعارات' },
    allCategories: 'جميع الفئات',
    moreMenu: { 
      notifications: 'الإشعارات', 
      favorites: 'المفضلة',
      about: 'من نحن', 
      contact: 'اتصل بنا', 
      terms: 'شروط الاستخدام', 
      privacy: 'سياسة الخصوصية', 
      language: 'اللغة', 
      password: 'تغيير كلمة المرور', 
      logout: 'تسجيل الخروج' 
    },
    hero: {
      title: 'حيث تلتقي الرؤية برأس المال',
      subtitle: 'النظام البيئي الرقمي الحصري لربط أصحاب الأعمال والمستثمرين بخصوصية وأمان.',
      cta: 'استكشف الفرص'
    },
    stats: {
      title: 'إحصائيات المنصة',
      subtitle: 'مؤشرات حية تظهر النمو والثقة داخل نظامنا البيئي.',
      projects: 'المشاريع',
      investors: 'المستثمرون',
      owners: 'أصحاب الشركات',
      proposed: 'صفقات مقترحة',
      successful: 'صفقات ناجحة'
    },
    common: {
      buyFile: 'شراء كراسة المشروع',
      interested: 'أنا مهتم',
      locked: 'الملف مقفل',
      unlocked: 'تم الوصول',
      currency: 'د.ك',
      share: 'الحصة',
      price: 'السعر',
      capital: 'رأس المال',
      location: 'الموقع',
      age: 'عمر الشركة',
      financial: 'وضع الشركة المالي',
      commission: 'ملاحظة: تطبق عمولة 2.5% على الصفقات المكتملة.',
      lockedDetails: 'هذه التفاصيل متاحة بعد شراء ملف المشروع'
    },
    filters: {
      title: 'تصفية المشاريع',
      category: 'القطاع',
      listingType: 'نوع القائمة',
      forSale: 'شركات للبيع',
      forInvestment: 'فرص استثمارية',
      allTypes: 'الكل',
      sort: 'الترتيب حسب',
      priceLow: 'السعر: الأقل إلى الأعلى',
      priceHigh: 'السعر: الأعلى إلى الأقل',
      newest: 'الأحدث',
      reset: 'إعادة تعيين'
    },
    investorsPage: {
      title: 'المستثمرون',
      subtitle: 'تصفح المستثمرين المسجلين وابحث عن الشريك المناسب لعملك.',
      filterTitle: 'تصفية المستثمرين',
      filterType: 'نوع المستثمر',
      filterCapital: 'رأس المال المتاح',
      filterExp: 'مستوى الخبرة',
      filterField: 'المجال المفضل',
      allTypes: 'الكل',
      allExp: 'أي خبرة',
      allFields: 'كل المجالات',
      reset: 'إعادة تعيين'
    },
    listing: {
      title: 'إضافة إعلان جديدة',
      step1: 'الهدف',
      step2: 'التفاصيل',
      purposeTitle: 'ما هو هدفك؟',
      investment: 'طلب استثمار',
      investmentDesc: 'أبحث عن شركاء أو رأس مال لتنمية عملي.',
      sale: 'بيع نشاط تجاري',
      saleDesc: 'أرغب في بيع عملي أو فرع بالكامل.',
      next: 'الخطوة التالية',
      submit: 'نشر الإعلان',
      processing: 'جاري النشر...',
      success: 'تم استلام إعلانك بنجاح، وهو الآن قيد المراجعة. سيتم نشره بعد موافقة الإدارة عليه.',
      investorTypesTitle: 'أنواع المستثمرين',
      companyType: 'شركة (مستثمر)',
      angelType: 'مستثمر ملاك',
      crowdType: 'تمويل جماعي',
      prefField: 'المجال المفضل',
      exp: 'الخبرة',
      years: 'سنوات',
      tech: 'تكنولوجيا',
      techFood: 'تكنولوجيا وغذاء',
      realEstate: 'عقارات'
    },
    auth: {
      registerTitle: 'تسجيل حساب جديد في B&I',
      loginTitle: 'تسجيل الدخول إلى B&I',
      selectType: 'اختر نوع حسابك للمتابعة',
      investor: 'مستثمر',
      advertiser: 'صاحب شركة',
      investorDesc: 'أرغب في شراء حصص والاستثمار في الشركات',
      advertiserDesc: 'أرغب في التمويل عن طريق بيع حصة من الشركة',
      noAccount: "ليس لديك حساب؟ سجل الآن",
      alreadyHaveAccount: "لديك حساب بالفعل؟ تسجيل الدخول",
      loginBtn: 'دخول',
      createAccount: 'إنشاء حساب',
      firstName: 'الاسم الأول',
      lastName: 'اسم العائلة',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      phone: 'رقم الهاتف',
      companyName: 'اسم الشركة',
      adminCompanyName: 'اسم الشركة (للإدارة)',
      companyOwnerName: 'اسم صاحب الشركة',
      licenseNumber: 'رقم الترخيص',
      companyAge: 'عمر النشاط',
      companyAgeLabel: 'عمر النشاط',
      sector: 'مجال الشركة',
      valuation: 'التقييم السوقي (د.ك)',
      investorSubtitle: 'أنشئ حساب مستثمر لاستكشاف الفرص الموثقة.',
      advertiserSubtitle: 'أنشئ حساب صاحب شركة. يمكنك إضافة القوائم بعد التسجيل.',
      verifyTitle: 'تحقق من بريدك الإلكتروني',
      verifyDesc: 'لقد أرسلنا رابط التحقق إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد لتفعيل حسابك.',
      backToLogin: 'العودة لتسجيل الدخول',
      required: 'مطلوب',
      invalidEmail: 'بريد إلكتروني غير صالح',
      invalidPhone: 'يجب أن يكون 8 أرقام',
      fillDemo: 'ملء بيانات تجريبية',
      investorType: 'نوع المستثمر',
      individual: 'فرد (ملائكي)',
      institution: 'شركة / مؤسسة',
      angelType: 'مستثمر ملاك',
      companyType: 'شركة / مؤسسة',
      crowdType: 'تمويل جماعي',
      descCapital: 'رأس المال',
      descField: 'المجال المفضل',
      descExp: 'الخبرة',
      selectedTypeDetails: 'تفاصيل نوع المستثمر المختار: {TYPE}',
      valCap100: '100 ألف وأكثر',
      valCap10: '10 آلاف وأكثر',
      valFieldTech: 'تكنولوجيا',
      valFieldTechFood: 'تكنولوجيا وأغذية',
      valFieldRE: 'عقارات',
      valExp7: '7 سنوات',
      valExp4: '4 سنوات',
      valExp2: 'سنتين',
      legalEntity: 'الكيان القانوني',
      companyTypeLabel: 'نوع الشركة',
      companyStage: 'مرحلة الشركة',
      investmentReason: 'سبب الاستثمار',
      requestedInvestment: 'مبلغ الاستثمار المطلوب (د.ك)',
      salePrice: 'سعر البيع (د.ك)',
      capital: 'رأس المال (د.ك)',
      revenue: 'الإيرادات (د.ك)',
      utilities: 'المرافق / الموارد',
      description: 'الوصف',
      fullDetails: 'الوصف الكامل',
      shareToSell: 'الحصة للبيع (%)',
      companyLicense: 'ترخيص الشركة (تحقق)',
      uploadLicense: 'رفع صورة أو PDF لترخيص الشركة',
      licenseErrorSize: 'يجب أن يكون الملف أقل من 10 ميجابايت',
      licenseErrorType: 'مسموح فقط بـ JPG, PNG, PDF',
      viewLicense: 'عرض الترخيص',
      replaceLicense: 'استبدال الترخيص',
      investorSector: 'قطاع التركيز',
      investorCapital: 'رأس المال المتاح (د.ك)',
      investmentCount: 'الاستثمارات السابقة',
      investorExperience: 'خبرة الاستثمار',
      expBeginner: 'مبتدئ',
      expIntermediate: 'متوسط',
      expExpert: 'خبير',
      other: 'أخرى',
      agreeToTerms: 'أوافق على ',
      termsOfUse: 'شروط الاستخدام',
      and: ' و ',
      privacyPolicy: 'سياسة الخصوصية',
      termsError: 'يجب الموافقة على الشروط وسياسة الخصوصية',
      agreeToTermsListing: 'أوافق على الشروط والأحكام',
      termsErrorListing: 'يجب الموافقة على الشروط والأحكام أولاً',
      editProfile: 'تعديل حسابي',
      saveChanges: 'حفظ التعديلات',
      cancel: 'إلغاء',
      successMessage: 'تم حفظ التعديلات بنجاح',
      displayName: 'اسم العرض',
      bio: 'نبذة',
      tagline: 'الوصف المختصر',
      profileImage: 'صورة الملف الشخصي',
      readOnlyField: 'لا يمكن تعديل هذه البيانات',
      raiseCapital: 'إضافة إعلان',
      raiseCapitalDesc: 'أضف إعلان مشروع جديد.',
      addProject: 'إضافة إعلان'
    },
    aboutPage: {
      title: 'من نحن',
      intro: 'الأعمال والاستثمارات منصة كويتية تربط المستثمرين بأصحاب الفرص بشكل آمن وموثوق، مع أعلى مستوى من الخصوصية وإخفاء الهوية.',
      sections: [
        { title: 'لماذا نحن؟', body: 'نحن لسنا مجرد موقع إعلاني، بل وسيط رقمي يضمن جودة العروض من خلال مراجعة إدارية دقيقة وحماية بيانات جميع الأطراف.' },
        { title: 'كيف تعمل المنصة؟', body: 'يتم عرض المشاريع ببيانات أولية. لفتح التفاصيل الكاملة، يقوم المستثمر بشراء كراسة المشروع. عند الجدية، يتم تنسيق الاجتماعات عبر الإدارة.' },
        { title: 'سياسة الخصوصية وإخفاء الهوية', body: 'يظهر الأعضاء بأرقام تعريفية (ID) فقط في المراحل الأولى. لا يتم كشف الهوية إلا عند الضرورة وبموافقة الأطراف.' },
        { title: 'العمولة', body: 'تطبق عمولة نجاح بنسبة 2.5% على إجمالي قيمة الصفقة عند إتمامها بنجاح.' }
      ],
      cta: 'استكشف المشاريع'
    }
  }
};

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
    companyStage: { ar: stage.label.ar, en: stage.label.en },
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
