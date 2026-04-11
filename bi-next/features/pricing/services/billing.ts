
import { SubscriptionPlan } from '@/shared/types';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: { en: 'Starter', ar: 'المبتدئ' },
    price: 49,
    features: {
      en: [
        'Access to basic project listings',
        'Direct contact with 3 advertisers/mo',
        'Standard dashboard access',
        'Basic support'
      ],
      ar: [
        'الوصول إلى قوائم المشاريع الأساسية',
        'الاتصال المباشر بـ 3 معلنين شهرياً',
        'وصول قياسي إلى لوحة التحكم',
        'دعم أساسي'
      ]
    }
  },
  {
    id: 'pro',
    name: { en: 'Professional', ar: 'المحترف' },
    price: 149,
    isPopular: true,
    features: {
      en: [
        'Unlimited access to all verified deals',
        'Priority interest confirmation',
        'Full operational analysis included',
        'Direct communication channel with Admin',
        'Ad-free experience'
      ],
      ar: [
        'وصول غير محدود لجميع الصفقات الموثقة',
        'أولوية تأكيد الاهتمام',
        'تضمين التحليل التشغيلي الكامل',
        'قناة اتصال مباشرة مع الإدارة',
        'تجربة خالية من الإعلانات'
      ]
    }
  },
  {
    id: 'enterprise',
    name: { en: 'Enterprise / VIP', ar: 'المؤسسات / VIP' },
    price: 499,
    features: {
      en: [
        'Offline deal sourcing on request',
        'Dedicated account manager',
        'Institutional capital matching',
        'Customized market reporting',
        'Executive legal support'
      ],
      ar: [
        'البحث عن صفقات خارجية عند الطلب',
        'مدير حساب مخصص',
        'مطابقة رأس مال مؤسسي',
        'تقارير سوق مخصصة',
        'دعم قانوني تنفيذي'
      ]
    }
  }
];
