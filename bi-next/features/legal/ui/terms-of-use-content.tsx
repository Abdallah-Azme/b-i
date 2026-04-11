'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Language } from '@/shared/types';

export const TermsOfUseContent: React.FC = () => {
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
        <span className="text-brand-gold">{tAuth('termsOfUse')}</span>
      </div>

      <div className="bg-brand-gray/20 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
          <Shield className="text-brand-gold w-10 h-10" />
          <h1 className="text-3xl font-bold text-white">{isAr ? 'شروط الاستخدام' : 'Terms of Use'}</h1>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {isAr ? 'منع التواصل خارج المنصة قبل التنسيق الرسمي' : 'Prohibition of Off-Platform Communication'}
             </h2>
             <p>{isAr ? 
               'يمنع منعاً باتاً على المستخدمين محاولة تجاوز المنصة للتواصل المباشر مع الأطراف الأخرى قبل التنسيق الرسمي والموافقة من قبل إدارة B&I. أي محاولة لتبادل معلومات الاتصال بشكل سابق لأوانه قد تؤدي إلى تعليق الحساب فوراً.' : 
               'Users are strictly prohibited from attempting to bypass the platform to communicate directly with other parties before official coordination and approval by the B&I administration. Any attempt to exchange contact information prematurely may result in immediate account suspension.'}
             </p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {isAr ? 'الالتزام بعمولة المنصة 2.5%' : 'Platform Commission'}
             </h2>
             <p>{isAr ? 
               'توافق جميع الأطراف على دفع رسوم نجاح (عمولة) بنسبة 2.5٪ من إجمالي قيمة الصفقة لشركة B&I عند إتمام أي اتفاقية استثمار أو بيع تم بدؤها عبر المنصة بنجاح.' : 
               'All parties agree to pay a success fee (commission) of 2.5% of the total deal value to B&I upon the successful conclusion of any investment or sale agreement initiated through the platform.'}
             </p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {isAr ? 'سرية البيانات وإخفاء الهوية' : 'Data Confidentiality & Anonymity'}
             </h2>
             <p>{isAr ? 
               'نحن نعطي الأولوية لخصوصية المستخدم. تظل الهويات مجهولة خلال مرحلة التصفح الأولية. لا يتم مشاركة وثائق التحقق التفصيلية إلا عبر قنوات آمنة ومراقبة من قبل الإدارة.' : 
               'We prioritize user privacy. Identities remain anonymous during the initial browsing phase. Detailed verification documents are only shared through secure, admin-monitored channels.'}
             </p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {isAr ? 'الاستخدام المقبول والممنوع' : 'Acceptable & Prohibited Use'}
             </h2>
             <p>{isAr ? 
               'المنصة مخصصة لأغراض الاستثمار التجاري المشروع فقط. يمنع منعاً باتاً القوائم الاحتيالية، البريد العشوائي، المضايقات، أو استخراج البيانات.' : 
               'The platform is intended for legitimate business investment purposes only. Fraudulent listings, spam, harassment, or data scraping are strictly prohibited.'}
             </p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {isAr ? 'مسؤولية المنصة وحدود الضمان' : 'Liability & Disclaimer'}
             </h2>
             <p>{isAr ? 
               'تعمل B&I كميسر يربط المستثمرين والشركات. بينما نقوم بالتحقق من القوائم قدر الإمكان، لا نضمن الأداء المالي لأي عمل تجاري. يجب على المستخدمين إجراء العناية الواجبة الخاصة بهم.' : 
               'B&I acts as a facilitator connecting investors and companies. While we verify listings to the best of our ability, we do not guarantee the financial performance of any business. Users must conduct their own due diligence.'}
             </p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {isAr ? 'إيقاف/تعليق الحساب' : 'Account Suspension'}
             </h2>
             <p>{isAr ? 
               'نحتفظ بالحق في تعليق أو إنهاء الحسابات التي تنتهك هذه الشروط، أو تشارك في أنشطة مشبوهة، أو تفشل في الالتزام بقواعد السلوك.' : 
               'We reserve the right to suspend or terminate accounts that violate these terms, engage in suspicious activity, or fail to adhere to the code of conduct.'}
             </p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {isAr ? 'آلية النزاعات والقانون المعمول به' : 'Dispute Resolution & Governing Law'}
             </h2>
             <p>{isAr ? 
               'يتم حل أي نزاعات تنشأ عن استخدام هذه المنصة ودياً حيثما أمكن، أو تخضع لقوانين ولوائح دولة الكويت.' : 
               'Any disputes arising from the use of this platform shall be resolved amicably where possible, or subject to the laws and regulations of the State of Kuwait.'}
             </p>
          </section>
        </div>
      </div>
    </div>
  );
};
