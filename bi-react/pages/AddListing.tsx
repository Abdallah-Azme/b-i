
import React, { useState } from 'react';
import { useStore } from '../context/Store';
import { Navigate, useNavigate } from 'react-router-dom';
import { TRANSLATIONS, CATEGORIES, COMPANY_STAGES, FINANCIAL_STATUS_ORDER, FINANCIAL_HEALTH_MAP, AD_STATUS_CONFIG } from '../constants';
import { ArrowLeft, ArrowRight, TrendingUp, Store, Info, CheckCircle, AlertCircle, Lock, Globe, FileText } from 'lucide-react';
import { ListingPurpose, FinancialStatus, AdStatus } from '../types';

export const AddListing: React.FC = () => {
  const { user, lang, addProject } = useStore();
  const navigate = useNavigate();
  const t = TRANSLATIONS[lang];
  
  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState<ListingPurpose | null>(null);
  const [purposeError, setPurposeError] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    fullName: '',
    phone: '',
    email: '',
    adminCompanyName: '',
    companyOwnerName: '',
    licenseNumber: '',
    sector: '',
    companyAge: '',
    legalEntity: '',
    companyType: '',
    companyStage: 'seed',
    financialHealth: 'Stable' as FinancialStatus,
    requestedInvestment: '', // Reused for Sales Price based on context
    investmentReason: '',
    shareToSell: '',
    fullDetails: ''
  });

  const fillDemoData = () => {
    setFormData({
      companyName: 'فرصة مطاعم رقم 10',
      fullName: 'أحمد محمد',
      phone: '80808080',
      email: 'test@demo.com',
      adminCompanyName: 'شركة النخبة التجارية',
      companyOwnerName: 'أحمد محمد',
      licenseNumber: 'LIC-123456',
      sector: 'Restaurants',
      companyAge: '3',
      legalEntity: 'شركة ذات مسؤولية محدودة',
      companyType: 'تشغيل فعلي',
      companyStage: 'seed',
      financialHealth: 'Stable',
      requestedInvestment: '65000',
      investmentReason: 'توسيع النشاط وفتح فرعين جديدين في مناطق حيوية.',
      shareToSell: '20',
      fullDetails: 'مشروع مطاعم قائم يحقق أرباح مستقرة، مع خطة توسع واضحة خلال 12 شهر.'
    });
  };

  React.useEffect(() => {
    fillDemoData();
  }, []);

  if (!user || user.role !== 'advertiser') return <Navigate to="/dashboard" />;


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = t.auth.required;
    if (!formData.phone.trim()) newErrors.phone = t.auth.required;
    if (!formData.email.trim()) newErrors.email = t.auth.required;
    if (!formData.adminCompanyName.trim()) newErrors.adminCompanyName = t.auth.required;
    if (!formData.companyOwnerName.trim()) newErrors.companyOwnerName = t.auth.required;
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = t.auth.required;
    if (!formData.companyName.trim()) newErrors.companyName = t.auth.required;
    if (!formData.sector.trim()) newErrors.sector = t.auth.required;
    if (!formData.companyAge.trim()) newErrors.companyAge = t.auth.required;
    if (!formData.legalEntity.trim()) newErrors.legalEntity = t.auth.required;
    if (!formData.companyType.trim()) newErrors.companyType = t.auth.required;
    if (!formData.financialHealth.trim()) newErrors.financialHealth = t.auth.required;
    if (!formData.requestedInvestment.trim()) newErrors.requestedInvestment = t.auth.required;
    // Share percentage is only required for investment listings
    if (purpose === 'investment' && !formData.shareToSell.trim()) {
        newErrors.shareToSell = t.auth.required;
    }
    if (!formData.fullDetails.trim()) newErrors.fullDetails = t.auth.required;
    if (!formData.investmentReason.trim()) newErrors.investmentReason = t.auth.required;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
        setTermsError(true);
        return;
    }
    if (validateStep2()) {
        setIsSubmitting(true);
        
        // Construct Project Object
        // In a real app, this would be an API call
        setTimeout(() => {
          addProject({
              listingPurpose: purpose,
              name: { ar: formData.companyName, en: formData.companyName },
              category: { ar: CATEGORIES.find(c => c.en === formData.sector)?.ar || 'عام', en: formData.sector },
              askingPrice: parseFloat(formData.requestedInvestment),
              age: { ar: `${formData.companyAge} سنوات`, en: `${formData.companyAge} Years` },
              shareOffered: purpose === 'sale' ? 100 : parseFloat(formData.shareToSell),
              legalEntity: { ar: formData.legalEntity, en: formData.legalEntity },
              companyType: { ar: formData.companyType, en: formData.companyType },
              companyStage: { 
                  ar: COMPANY_STAGES.find(s => s.id === formData.companyStage)?.label.ar || '', 
                  en: COMPANY_STAGES.find(s => s.id === formData.companyStage)?.label.en || '' 
              },
              financialHealth: formData.financialHealth,
              investmentReason: { ar: formData.investmentReason, en: formData.investmentReason },
              descriptionShort: { ar: formData.investmentReason.substring(0, 100) + '...', en: formData.investmentReason.substring(0, 100) + '...' },
              descriptionFull: { ar: formData.fullDetails, en: formData.fullDetails },
              status: 'under_review'
          });
          
          setIsSubmitting(false);
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            navigate('/dashboard');
          }, 2000);
        }, 1500);
      }
    };

  const selectedStageData = COMPANY_STAGES.find(s => s.id === formData.companyStage);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      
      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
         <h1 className="text-2xl font-bold">{t.listing.title}</h1>
         <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className={step === 1 ? 'text-brand-gold font-bold' : ''}>1. {t.listing.step1}</span>
            <span>&rarr;</span>
            <span className={step === 2 ? 'text-brand-gold font-bold' : ''}>2. {t.listing.step2}</span>
         </div>
      </div>

      <div className="bg-brand-gray/20 border border-white/10 rounded-2xl p-8 backdrop-blur-sm animate-fade-in">
        
        {step === 1 && (
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-center mb-6">{t.listing.purposeTitle}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                        onClick={() => { setPurpose('investment'); setPurposeError(false); }}
                        className={`p-6 rounded-xl border text-left transition-all group ${purpose === 'investment' ? 'bg-brand-gold text-black border-brand-gold' : 'bg-black/40 border-white/10 hover:border-brand-gold/50'}`}
                    >
                        <TrendingUp size={32} className={`mb-4 ${purpose === 'investment' ? 'text-black' : 'text-brand-gold'}`} />
                        <h3 className="font-bold text-lg mb-1">{t.listing.investment}</h3>
                        <p className={`text-sm ${purpose === 'investment' ? 'text-black/70' : 'text-gray-400'}`}>{t.listing.investmentDesc}</p>
                    </button>

                    <button 
                        onClick={() => { setPurpose('sale'); setPurposeError(false); }}
                        className={`p-6 rounded-xl border text-left transition-all group ${purpose === 'sale' ? 'bg-brand-gold text-black border-brand-gold' : 'bg-black/40 border-white/10 hover:border-brand-gold/50'}`}
                    >
                        <Store size={32} className={`mb-4 ${purpose === 'sale' ? 'text-black' : 'text-brand-gold'}`} />
                        <h3 className="font-bold text-lg mb-1">{t.listing.sale}</h3>
                        <p className={`text-sm ${purpose === 'sale' ? 'text-black/70' : 'text-gray-400'}`}>{t.listing.saleDesc}</p>
                    </button>
                </div>
                
                {purposeError && (
                    <p className="text-red-500 text-center font-medium animate-fade-in">
                        {lang === 'ar' ? 'يرجى اختيار الهدف أولاً' : 'Please select a goal first'}
                    </p>
                )}
                
                <div className="flex justify-end pt-6">
                    <button onClick={() => {
                        if (!purpose) {
                            setPurposeError(true);
                        } else {
                            setPurposeError(false);
                            setStep(2);
                        }
                    }} className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition flex items-center gap-2">
                        {t.listing.next} {lang === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                    </button>
                </div>
            </div>
        )}

        {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
                
                <div className="flex justify-end">
                    <button type="button" onClick={fillDemoData} className="text-xs bg-brand-gold/10 text-brand-gold px-3 py-1.5 rounded-md hover:bg-brand-gold/20 transition">
                        {lang === 'ar' ? 'تعبئة بيانات تجريبية' : 'Fill Demo Data'}
                    </button>
                </div>

                {/* SECTION 1: Admin Only */}
                <div className="bg-black/20 border border-red-500/20 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-500/10 rounded-lg text-red-500"><Lock size={20} /></div>
                        <div>
                            <h3 className="font-bold text-lg">معلومات خاصة بالإدارة</h3>
                            <p className="text-xs text-gray-400">هذه المعلومات لا تظهر لأي مستخدم، وتستخدم فقط من قبل إدارة المنصة للتواصل والتحقق.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">الاسم الكامل <span className="text-brand-gold">*</span></label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.fullName ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">رقم الهاتف <span className="text-brand-gold">*</span></label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.phone ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">البريد الإلكتروني <span className="text-brand-gold">*</span></label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.email ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">{t.auth.adminCompanyName} <span className="text-brand-gold">*</span></label>
                            <input type="text" name="adminCompanyName" value={formData.adminCompanyName} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.adminCompanyName ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">{t.auth.companyOwnerName} <span className="text-brand-gold">*</span></label>
                            <input type="text" name="companyOwnerName" value={formData.companyOwnerName} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.companyOwnerName ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">{t.auth.licenseNumber} <span className="text-brand-gold">*</span></label>
                        <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.licenseNumber ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                    </div>
                </div>

                {/* SECTION 2: Public Information */}
                <div className="bg-black/20 border border-brand-gold/20 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-brand-gold/10 rounded-lg text-brand-gold"><Globe size={20} /></div>
                        <div>
                            <h3 className="font-bold text-lg">معلومات تظهر لجميع الأعضاء</h3>
                            <p className="text-xs text-gray-400">هذه المعلومات ستكون ظاهرة لكل المستخدمين داخل الإعلان.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">{t.auth.companyName} <span className="text-brand-gold">*</span></label>
                            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.companyName ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">{t.auth.sector} <span className="text-brand-gold">*</span></label>
                                <select name="sector" value={formData.sector} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.sector ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}>
                                    <option value="">{lang === 'en' ? 'Select Sector' : 'اختر القطاع'}</option>
                                    {CATEGORIES.map(c => <option key={c.en} value={c.en}>{c[lang]}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">{t.auth.companyAge} <span className="text-brand-gold">*</span></label>
                                <input type="number" name="companyAge" value={formData.companyAge} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.companyAge ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">{t.auth.companyType} <span className="text-brand-gold">*</span></label>
                                <input type="text" name="companyType" value={formData.companyType} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.companyType ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">{purpose === 'sale' ? t.auth.salePrice : t.auth.requestedInvestment} <span className="text-brand-gold">*</span></label>
                                <input type="number" name="requestedInvestment" value={formData.requestedInvestment} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.requestedInvestment ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                            </div>
                        </div>
                        {purpose === 'investment' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">{t.auth.shareToSell} <span className="text-brand-gold">*</span></label>
                                <input type="number" name="shareToSell" max="100" value={formData.shareToSell} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.shareToSell ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                            </div>
                        )}
                    </div>
                </div>

                {/* SECTION 3: Premium / Booklet Info */}
                <div className="bg-black/20 border border-blue-500/20 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><FileText size={20} /></div>
                        <div>
                            <h3 className="font-bold text-lg">معلومات للمهتمين فقط (داخل كراسة الاستثمار)</h3>
                            <p className="text-xs text-gray-400">هذه المعلومات تظهر فقط للمستخدمين الذين قاموا بشراء كراسة المشروع.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">{t.auth.legalEntity} <span className="text-brand-gold">*</span></label>
                            <input type="text" name="legalEntity" value={formData.legalEntity} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.legalEntity ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">{t.common.financial} <span className="text-brand-gold">*</span></label>
                            <select name="financialHealth" value={formData.financialHealth} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.financialHealth ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}>
                                {FINANCIAL_STATUS_ORDER.map(status => <option key={status} value={status}>{FINANCIAL_HEALTH_MAP[status][lang]}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">{t.auth.investmentReason} <span className="text-brand-gold">*</span></label>
                            <textarea name="investmentReason" rows={3} value={formData.investmentReason} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.investmentReason ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">{t.auth.fullDetails} <span className="text-brand-gold">*</span></label>
                            <textarea name="fullDetails" rows={5} value={formData.fullDetails} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.fullDetails ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={termsAccepted} onChange={(e) => { setTermsAccepted(e.target.checked); setTermsError(false); }} className="accent-brand-gold" />
                        <span className="text-sm text-gray-300">
                            {lang === 'ar' ? (
                                <>
                                    أوافق على <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-brand-gold underline">الشروط والأحكام</a>
                                </>
                            ) : (
                                <>
                                    I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-brand-gold underline">Terms & Conditions</a>
                                </>
                            )}
                        </span>
                    </label>
                    {termsError && <p className="text-red-500 text-sm">{t.auth.termsErrorListing}</p>}
                </div>

                <div className="flex gap-4 pt-4">
                     <button type="button" onClick={() => setStep(1)} className="flex-1 bg-white/10 text-white font-bold py-4 rounded-xl hover:bg-white/20 transition">
                        {lang === 'ar' ? 'السابق' : 'Back'}
                     </button>
                     <button type="submit" disabled={isSubmitting} className="flex-[2] bg-brand-gold text-black font-bold text-lg py-4 rounded-xl hover:bg-yellow-500 transition shadow-lg shadow-brand-gold/20 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                            <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                            {t.listing.processing}
                            </span>
                        ) : t.listing.submit}
                    </button>
                </div>

            </form>
        )}
        {showSuccess && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in p-4">
                <div className="bg-[#121212] border border-brand-gold/20 p-8 rounded-2xl max-w-md text-center space-y-4">
                    <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{lang === 'ar' ? 'تم الإرسال!' : 'Submitted!'}</h2>
                    <p className="text-gray-300">
                        {t.listing.success}
                    </p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
