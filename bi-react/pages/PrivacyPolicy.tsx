
import React from 'react';
import { useStore } from '../context/Store';
import { Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TRANSLATIONS } from '../constants';

export const PrivacyPolicy: React.FC = () => {
  const { lang } = useStore();
  const t = TRANSLATIONS[lang];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8 flex items-center gap-2">
        <Link to="/" className="text-gray-400 hover:text-white transition">
           {lang === 'ar' ? <ArrowRight /> : <ArrowLeft />}
        </Link>
        <span className="text-gray-500">/</span>
        <span className="text-brand-gold">{t.auth.privacyPolicy}</span>
      </div>

      <div className="bg-brand-gray/20 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
          <Lock className="text-brand-gold w-10 h-10" />
          <h1 className="text-3xl font-bold text-white">{lang === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية'}</h1>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {lang === 'en' ? 'Information We Collect' : 'البيانات التي نجمعها'}
             </h2>
             <p>{lang === 'en' ? 
               'We collect personal information such as name, email address, phone number, and business details (for companies) or investment preferences (for investors) to facilitate the service.' : 
               'نقوم بجمع المعلومات الشخصية مثل الاسم وعنوان البريد الإلكتروني ورقم الهاتف وتفاصيل العمل (للشركات) أو تفضيلات الاستثمار (للمستثمرين) لتسهيل الخدمة.'}
             </p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {lang === 'en' ? 'How We Use Information' : 'كيف نستخدم البيانات'}
             </h2>
             <p>{lang === 'en' ? 
               'Your data is used to verify your identity, match you with suitable opportunities, communicate platform updates, and ensure a secure environment for all users.' : 
               'تُستخدم بياناتك للتحقق من هويتك، ومطابقتك مع الفرص المناسبة، والتواصل بشأن تحديثات المنصة، وضمان بيئة آمنة لجميع المستخدمين.'}
             </p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {lang === 'en' ? 'Data Protection & Storage' : 'حماية البيانات والتخزين'}
             </h2>
             <p>{lang === 'en' ? 
               'We implement industry-standard security measures to protect your data. All sensitive documents (like company licenses) are stored securely and accessible only to authorized personnel.' : 
               'نطبق تدابير أمنية متوافقة مع معايير الصناعة لحماية بياناتك. يتم تخزين جميع المستندات الحساسة (مثل تراخيص الشركة) بشكل آمن ولا يمكن الوصول إليها إلا من قبل الموظفين المصرح لهم.'}
             </p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {lang === 'en' ? 'No Unauthorized Sharing' : 'عدم مشاركة بيانات التواصل بين الأطراف'}
             </h2>
             <p>{lang === 'en' ? 
               'We strictly do not share your contact details with other users without your explicit consent. Communication is initially handled through the platform or admin intermediaries.' : 
               'نحن لا نشارك تفاصيل الاتصال الخاصة بك بشكل صارم مع مستخدمين آخرين دون موافقتك الصريحة. يتم التعامل مع الاتصالات في البداية من خلال المنصة أو وسطاء الإدارة.'}
             </p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {lang === 'en' ? 'Cookies' : 'ملفات تعريف الارتباط'}
             </h2>
             <p>{lang === 'en' ? 
               'Our website uses cookies to enhance user experience, analyze site usage, and assist in our marketing efforts. You can manage your cookie preferences through your browser settings.' : 
               'يستخدم موقعنا ملفات تعريف الارتباط لتحسين تجربة المستخدم، وتحليل استخدام الموقع، والمساعدة في جهودنا التسويقية. يمكنك إدارة تفضيلات ملفات تعريف الارتباط من خلال إعدادات المتصفح الخاص بك.'}
             </p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {lang === 'en' ? 'User Rights' : 'حقوق المستخدم'}
             </h2>
             <p>{lang === 'en' ? 
               'You have the right to access, correct, or request deletion of your personal data. Please contact support if you wish to exercise these rights.' : 
               'لديك الحق في الوصول إلى بياناتك الشخصية أو تصحيحها أو طلب حذفها. يرجى الاتصال بالدعم إذا كنت ترغب في ممارسة هذه الحقوق.'}
             </p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
               {lang === 'en' ? 'Contact Administration' : 'التواصل مع الإدارة'}
             </h2>
             <p>{lang === 'en' ? 
               'For any privacy-related concerns or inquiries, please contact our administration at privacy@bi.com.' : 
               'لأية مخاوف أو استفسارات تتعلق بالخصوصية، يرجى الاتصال بإدارتنا على privacy@bi.com.'}
             </p>
          </section>
        </div>
      </div>
    </div>
  );
};
