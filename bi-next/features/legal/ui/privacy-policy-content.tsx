'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Language } from '@/shared/types';

export const PrivacyPolicyContent: React.FC = () => {
  const locale = useLocale() as Language;
  const isAr = locale === 'ar';
  const tAuth = useTranslations('auth');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <div className="mb-8 flex items-center gap-2">
        <Link href="/" className="text-gray-400 hover:text-white transition">
           {isAr ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
        </Link>
        <span className="text-gray-500">/</span>
        <span className="text-brand-gold">{tAuth('privacyPolicy')}</span>
      </div>

      <div className="bg-brand-gray/20 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
          <Lock className="text-brand-gold w-10 h-10" />
          <h1 className="text-3xl font-bold text-white">{isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</h1>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {isAr ? 'البيانات التي نجمعها' : 'Information We Collect'}
             </h2>
             <p>{isAr ? 
               'نقوم بجمع المعلومات الشخصية مثل الاسم وعنوان البريد الإلكتروني ورقم الهاتف وتفاصيل العمل (للشركات) أو تفضيلات الاستثمار (للمستثمرين) لتسهيل الخدمة.' : 
               'We collect personal information such as name, email address, phone number, and business details (for companies) or investment preferences (for investors) to facilitate the service.'}
             </p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {isAr ? 'كيف نستخدم البيانات' : 'How We Use Information'}
             </h2>
             <p>{isAr ? 
               'تُستخدم بياناتك للتحقق من هويتك، ومطابقتك مع الفرص المناسبة، والتواصل بشأن تحديثات المنصة، وضمان بيئة آمنة لجميع المستخدمين.' : 
               'Your data is used to verify your identity, match you with suitable opportunities, communicate platform updates, and ensure a secure environment for all users.'}
             </p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {isAr ? 'حماية البيانات والتخزين' : 'Data Protection & Storage'}
             </h2>
             <p>{isAr ? 
               'نطبق تدابير أمنية متوافقة مع معايير الصناعة لحماية بياناتك. يتم تخزين جميع المستندات الحساسة (مثل تراخيص الشركة) بشكل آمن ولا يمكن الوصول إليها إلا من قبل الموظفين المصرح لهم.' : 
               'We implement industry-standard security measures to protect your data. All sensitive documents (like company licenses) are stored securely and accessible only to authorized personnel.'}
             </p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {isAr ? 'عدم مشاركة بيانات التواصل بين الأطراف' : 'No Unauthorized Sharing'}
             </h2>
             <p>{isAr ? 
               'نحن لا نشارك تفاصيل الاتصال الخاصة بك بشكل صارم مع مستخدمين آخرين دون موافقتك الصريحة. يتم التعامل مع الاتصالات في البداية من خلال المنصة أو وسطاء الإدارة.' : 
               'We strictly do not share your contact details with other users without your explicit consent. Communication is initially handled through the platform or admin intermediaries.'}
             </p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {isAr ? 'ملفات تعريف الارتباط' : 'Cookies'}
             </h2>
             <p>{isAr ? 
               'يستخدم موقعنا ملفات تعريف الارتباط لتحسين تجربة المستخدم، وتحليل استخدام الموقع، والمساعدة في جهودنا التسويقية. يمكنك إدارة تفضيلات ملفات تعريف الارتباط من خلال إعدادات المتصفح الخاص بك.' : 
               'Our website uses cookies to enhance user experience, analyze site usage, and assist in our marketing efforts. You can manage your cookie preferences through your browser settings.'}
             </p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {isAr ? 'حقوق المستخدم' : 'User Rights'}
             </h2>
             <p>{isAr ? 
               'لديك الحق في الوصول إلى بياناتك الشخصية أو تصحيحها أو طلب حذفها. يرجى الاتصال بالدعم إذا كنت ترغب في ممارسة هذه الحقوق.' : 
               'You have the right to access, correct, or request deletion of your personal data. Please contact support if you wish to exercise these rights.'}
             </p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {isAr ? 'التواصل مع الإدارة' : 'Contact Administration'}
             </h2>
             <p>{isAr ? 
               'لأية مخاوف أو استفسارات تتعلق بالخصوصية، يرجى الاتصال بإدارتنا على privacy@bi.com.' : 
               'For any privacy-related concerns or inquiries, please contact our administration at privacy@bi.com.'}
             </p>
          </section>
        </div>
      </div>
    </div>
  );
};
