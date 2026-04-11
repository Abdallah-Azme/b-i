
import React from 'react';
import { useStore } from '../context/Store';
import { Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TRANSLATIONS } from '../constants';

export const TermsOfUse: React.FC = () => {
  const { lang } = useStore();
  const t = TRANSLATIONS[lang];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8 flex items-center gap-2">
        <Link to="/" className="text-gray-400 hover:text-white transition">
           {lang === 'ar' ? <ArrowRight /> : <ArrowLeft />}
        </Link>
        <span className="text-gray-500">/</span>
        <span className="text-brand-gold">{t.auth.termsOfUse}</span>
      </div>

      <div className="bg-brand-gray/20 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
          <Shield className="text-brand-gold w-10 h-10" />
          <h1 className="text-3xl font-bold text-white">{lang === 'en' ? 'Terms of Use' : 'شروط الاستخدام'}</h1>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {lang === 'en' ? 'Prohibition of Off-Platform Communication' : 'منع التواصل خارج المنصة قبل التنسيق الرسمي'}
             </h2>
             <p>{lang === 'en' ? 
               'Users are strictly prohibited from attempting to bypass the platform to communicate directly with other parties before official coordination and approval by the B&I administration. Any attempt to exchange contact information prematurely may result in immediate account suspension.' : 
               'يمنع منعاً باتاً على المستخدمين محاولة تجاوز المنصة للتواصل المباشر مع الأطراف الأخرى قبل التنسيق الرسمي والموافقة من قبل إدارة B&I. أي محاولة لتبادل معلومات الاتصال بشكل سابق لأوانه قد تؤدي إلى تعليق الحساب فوراً.'}
             </p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {lang === 'en' ? 'Platform Commission' : 'الالتزام بعمولة المنصة 2.5%'}
             </h2>
             <p>{lang === 'en' ? 
               'All parties agree to pay a success fee (commission) of 2.5% of the total deal value to B&I upon the successful conclusion of any investment or sale agreement initiated through the platform.' : 
               'توافق جميع الأطراف على دفع رسوم نجاح (عمولة) بنسبة 2.5٪ من إجمالي قيمة الصفقة لشركة B&I عند إتمام أي اتفاقية استثمار أو بيع تم بدؤها عبر المنصة بنجاح.'}
             </p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {lang === 'en' ? 'Data Confidentiality & Anonymity' : 'سرية البيانات وإخفاء الهوية'}
             </h2>
             <p>{lang === 'en' ? 
               'We prioritize user privacy. Identities remain anonymous during the initial browsing phase. Detailed verification documents are only shared through secure, admin-monitored channels.' : 
               'نحن نعطي الأولوية لخصوصية المستخدم. تظل الهويات مجهولة خلال مرحلة التصفح الأولية. لا يتم مشاركة وثائق التحقق التفصيلية إلا عبر قنوات آمنة ومراقبة من قبل الإدارة.'}
             </p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {lang === 'en' ? 'Acceptable & Prohibited Use' : 'الاستخدام المقبول والممنوع'}
             </h2>
             <p>{lang === 'en' ? 
               'The platform is intended for legitimate business investment purposes only. Fraudulent listings, spam, harassment, or data scraping are strictly prohibited.' : 
               'المنصة مخصصة لأغراض الاستثمار التجاري المشروع فقط. يمنع منعاً باتاً القوائم الاحتيالية، البريد العشوائي، المضايقات، أو استخراج البيانات.'}
             </p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {lang === 'en' ? 'Liability & Disclaimer' : 'مسؤولية المنصة وحدود الضمان'}
             </h2>
             <p>{lang === 'en' ? 
               'B&I acts as a facilitator connecting investors and companies. While we verify listings to the best of our ability, we do not guarantee the financial performance of any business. Users must conduct their own due diligence.' : 
               'تعمل B&I كميسر يربط المستثمرين والشركات. بينما نقوم بالتحقق من القوائم قدر الإمكان، لا نضمن الأداء المالي لأي عمل تجاري. يجب على المستخدمين إجراء العناية الواجبة الخاصة بهم.'}
             </p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {lang === 'en' ? 'Account Suspension' : 'إيقاف/تعليق الحساب'}
             </h2>
             <p>{lang === 'en' ? 
               'We reserve the right to suspend or terminate accounts that violate these terms, engage in suspicious activity, or fail to adhere to the code of conduct.' : 
               'نحتفظ بالحق في تعليق أو إنهاء الحسابات التي تنتهك هذه الشروط، أو تشارك في أنشطة مشبوهة، أو تفشل في الالتزام بقواعد السلوك.'}
             </p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {lang === 'en' ? 'Dispute Resolution & Governing Law' : 'آلية النزاعات والقانون المعمول به'}
             </h2>
             <p>{lang === 'en' ? 
               'Any disputes arising from the use of this platform shall be resolved amicably where possible, or subject to the laws and regulations of the State of Kuwait.' : 
               'يتم حل أي نزاعات تنشأ عن استخدام هذه المنصة ودياً حيثما أمكن، أو تخضع لقوانين ولوائح دولة الكويت.'}
             </p>
          </section>
        </div>
      </div>
    </div>
  );
};
