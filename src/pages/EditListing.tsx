import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../hooks/useStore';
import { Navigate, useNavigate, Link, useParams } from '@tanstack/react-router';
import { CATEGORIES, COMPANY_STAGES, FINANCIAL_STATUS_ORDER, FINANCIAL_HEALTH_MAP } from '../constants';
import { ArrowLeft, ArrowRight, TrendingUp, Store, Lock, Globe, FileText, CheckCircle } from 'lucide-react';
import { ListingPurpose, FinancialStatus } from '../types';
import { useCategories } from '../features/general/hooks/useCategories';
import { useMyOpportunityDetail, useUpdateOpportunity } from '../features/company/hooks/useOpportunities';
import { useAuth } from '../features/auth/hooks/useAuth';
import { PhoneInputField } from '../features/auth/ui/PhoneInputField';
import { MAX_MONEY_AMOUNT, formatNumberWithCommas, parseLimitedIntegerInput } from '../lib/number-format';
import { toast } from '@/lib/toast';

export const EditListing: React.FC = () => {
  const { id } = useParams({ from: '/advertiser/edit-listing/$id' });
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'ar' | 'en';
  const { user: apiUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: categoriesData } = useCategories({ per_page: 100 });
  const categories = categoriesData?.data?.categories ?? [];
  const updateOpportunity = useUpdateOpportunity(id);
  const { data: detailData, isLoading } = useMyOpportunityDetail(id);
  const existingProject = detailData?.data;
  
  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState<'request_investment' | 'sell_business' | undefined>(undefined);
  const [purposeError, setPurposeError] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingExistingData, setLoadingExistingData] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    fullName: '',
    country_code: '965',
    phone: '',
    email: '',
    adminCompanyName: '',
    companyOwnerName: '',
    licenseNumber: '',
    sector: '', // category_id as string
    companyAge: '',
    legalEntity: '',
    companyType: '',
    companyStage: 'seed',
    financialHealth: 'Stable' as FinancialStatus,
    requestedInvestment: '', 
    investmentReason: '',
    shareToSell: '',
    fullDetails: ''
  });

  const [files, setFiles] = useState<{
    image?: File;
    license_file?: File;
    commercial_record_file?: File;
    tax_certificate_file?: File;
    financial_statements_file?: File;
  }>({});

  const cleanPhone = (phoneStr: string, codeStr: string) => {
    let phone = (phoneStr || '').replace(/\D/g, '');
    const code = (codeStr || '').replace(/\D/g, '');
    if (code && phone.startsWith(code)) {
      phone = phone.slice(code.length);
    }
    return phone;
  };

  React.useEffect(() => {
    if (existingProject) {
      const normalizedGoal = existingProject.goal === 'sell_business'
        ? 'sell_business'
        : 'request_investment';
      setPurpose(normalizedGoal);
      const code = existingProject.country_code || '965';
      setFormData({
        companyName: existingProject.company_name || '',
        fullName: existingProject.contact_name || '',
        country_code: code,
        phone: cleanPhone(existingProject.contact_phone || '', code),
        email: existingProject.contact_email || '',
        adminCompanyName: existingProject.admin_company_name || '',
        companyOwnerName: existingProject.owner_name || '',
        licenseNumber: existingProject.license_number || '',
        sector: (existingProject.category_id ?? existingProject.category?.id ?? '').toString(),
        companyAge: existingProject.business_age_years?.toString() || '',
        legalEntity: existingProject.legal_entity || '',
        companyType: (existingProject as any).company_type || existingProject.legal_entity || '',
        companyStage: existingProject.business_stage || 'seed',
        financialHealth: (existingProject.financial_status as FinancialStatus) || 'Stable',
        requestedInvestment: existingProject.investment_required?.toString() || '',
        investmentReason: existingProject.investment_reason || '',
        shareToSell: existingProject.sale_percentage?.toString() || '',
        fullDetails: existingProject.full_description || ''
      });
      setTermsAccepted(true);
      setLoadingExistingData(false);
    }
  }, [existingProject]);

  React.useEffect(() => {
    if (!isLoading) {
      setLoadingExistingData(false);
    }
  }, [isLoading]);

  if (isLoading || authLoading || loadingExistingData) {
    return <div className="p-12 text-center text-white">{t('common.loading')}</div>;
  }

  const storedRole = localStorage.getItem("auth_role");
  const userRole = (apiUser?.role as any)?.key ?? apiUser?.role ?? storedRole;

  if (!isAuthenticated || userRole !== "advertiser") {
    return <Navigate to="/dashboard" />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numericLimits: Record<string, number> = {
      companyAge: 100,
      requestedInvestment: MAX_MONEY_AMOUNT,
      shareToSell: 100,
    };
    const nextValue =
      name in numericLimits
        ? parseLimitedIntegerInput(value, numericLimits[name])
        : value;

    setFormData(prev => ({ ...prev, [name]: nextValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    const requiredStr = t('auth.required');
    if (!formData.fullName.trim()) newErrors.fullName = requiredStr;
    if (!formData.phone.trim()) {
      newErrors.phone = requiredStr;
    } else {
      const lengths: Record<string, number> = {
        '965': 8, '966': 8, '971': 8, '974': 8, '973': 8, '968': 8, '20': 8, '962': 8
      };
      const expected = lengths[formData.country_code] || 8;
      if (formData.phone.length !== expected) {
        newErrors.phone = t('errors.invalidPhoneLength', { length: expected }) || 'Invalid phone length';
      }
    }
    if (!formData.email.trim()) newErrors.email = requiredStr;
    if (!formData.adminCompanyName.trim()) newErrors.adminCompanyName = requiredStr;
    if (!formData.companyOwnerName.trim()) newErrors.companyOwnerName = requiredStr;
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = requiredStr;
    if (!formData.companyName.trim()) newErrors.companyName = requiredStr;
    if (!formData.sector.trim()) newErrors.sector = requiredStr;
    if (!formData.companyAge.trim()) newErrors.companyAge = requiredStr;
    if (!formData.legalEntity.trim()) newErrors.legalEntity = requiredStr;
    if (!formData.companyType.trim()) newErrors.companyType = requiredStr;
    if (!formData.financialHealth.trim()) newErrors.financialHealth = requiredStr;
    if (!formData.requestedInvestment.trim()) newErrors.requestedInvestment = requiredStr;
    if (purpose === 'request_investment' && !formData.shareToSell.trim()) {
        newErrors.shareToSell = requiredStr;
    }
    if (!formData.fullDetails.trim()) newErrors.fullDetails = requiredStr;
    if (!formData.investmentReason.trim()) newErrors.investmentReason = requiredStr;

    // File validation
    if (!files.image) newErrors.image = requiredStr;
    if (!files.license_file) newErrors.license_file = requiredStr;
    if (!files.commercial_record_file) newErrors.commercial_record_file = requiredStr;
    if (!files.tax_certificate_file) newErrors.tax_certificate_file = requiredStr;
    if (!files.financial_statements_file) newErrors.financial_statements_file = requiredStr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<{
      goal: 'request_investment' | 'sell_business';
      category_id: number;
      company_name: string;
      business_age_years: number;
      legal_entity: string;
      investment_required: number;
      sale_percentage?: number;
      business_stage: string;
      financial_status: string;
      investment_reason: string;
      full_description: string;
      image?: File;
    }> = {
      goal: purpose!,
      category_id: Number(formData.sector || existingProject?.category?.id || 0),
      company_name: formData.companyName,
      business_age_years: Number(formData.companyAge),
      legal_entity: formData.legalEntity,
      investment_required: parseFloat(formData.requestedInvestment),
      sale_percentage: purpose === 'sell_business' ? 100 : parseFloat(formData.shareToSell),
      business_stage: formData.companyStage,
      financial_status: formData.financialHealth,
      investment_reason: formData.investmentReason,
      full_description: formData.fullDetails,
    };
    
    if (files.image) payload.image = files.image;

    updateOpportunity.mutate(
      payload,
      {
        onSuccess: () => {
          toast.success(t('listing.editSubmitted'), {
            id: 'edit-listing-success',
          });
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            navigate({ to: '/dashboard' });
          }, 2000);
        },
        onError: (err) => {
          console.error('Failed to update opportunity', err);
        }
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      
      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
         <h1 className="text-2xl font-bold">{t('listing.title')}</h1>
         <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className={step === 1 ? 'text-brand-gold font-bold' : ''}>1. {t('listing.step1')}</span>
            <span>&rarr;</span>
            <span className={step === 2 ? 'text-brand-gold font-bold' : ''}>2. {t('listing.step2')}</span>
         </div>
      </div>

      <div className="bg-brand-gray/20 border border-white/10 rounded-2xl p-8 backdrop-blur-sm animate-fade-in">
        
        {step === 1 && (
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-center mb-6">{t('listing.purposeTitle')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                        onClick={() => { setPurpose('request_investment'); setPurposeError(false); }}
                        className={`p-6 rounded-xl border text-start transition-all group ${purpose === 'request_investment' ? 'bg-brand-gold text-black border-brand-gold' : 'bg-black/40 border-white/10 hover:border-brand-gold/50'}`}
                    >
                        <TrendingUp size={32} className={`mb-4 ${purpose === 'request_investment' ? 'text-black' : 'text-brand-gold'}`} />
                        <h3 className="font-bold text-lg mb-1">{t('listing.investment')}</h3>
                        <p className={`text-sm ${purpose === 'request_investment' ? 'text-black/70' : 'text-gray-400'}`}>{t('listing.investmentDesc')}</p>
                    </button>
                    <button 
                        onClick={() => { setPurpose('sell_business'); setPurposeError(false); }}
                        className={`p-6 rounded-xl border text-start transition-all group ${purpose === 'sell_business' ? 'bg-brand-gold text-black border-brand-gold' : 'bg-black/40 border-white/10 hover:border-brand-gold/50'}`}
                    >
                        <Store size={32} className={`mb-4 ${purpose === 'sell_business' ? 'text-black' : 'text-brand-gold'}`} />
                        <h3 className="font-bold text-lg mb-1">{t('listing.sale')}</h3>
                        <p className={`text-sm ${purpose === 'sell_business' ? 'text-black/70' : 'text-gray-400'}`}>{t('listing.saleDesc')}</p>
                    </button>
                </div>
                {purposeError && (
                    <p className="text-red-500 text-center font-medium animate-fade-in">
                        {t('listing.selectGoalFirst')}
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
                        {t('listing.next')} {lang === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                    </button>
                </div>
            </div>
        )}

        {step === 2 && (
            <form onSubmit={handleSubmit} noValidate className="space-y-8 animate-fade-in">
                {/* SECTION 1: Admin Only */}
                    <div className="bg-black/20 border border-red-500/20 rounded-xl p-6 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-red-500/10 rounded-lg text-red-500"><Lock size={20} /></div>
                            <div>
                                <h3 className="font-bold text-lg">{t('listing.adminOnlyInfo')}</h3>
                                <p className="text-xs text-gray-400">{t('listing.adminOnlyInfoDesc')}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">{t('auth.firstName')} <span className="text-brand-gold">*</span></label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.fullName ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                        </div>
                        <div className="md:col-span-2">
                            <PhoneInputField
                              value={formData.phone}
                              onChange={(val) => setFormData(prev => ({ ...prev, phone: val }))}
                              countryCodeValue={formData.country_code}
                              onCountryCodeChange={(val) => setFormData(prev => ({ ...prev, country_code: val }))}
                              error={errors.phone}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">{t('auth.email')} <span className="text-brand-gold">*</span></label>
                        <input type="text" inputMode="email" autoComplete="email" name="email" value={formData.email} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.email ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">{t('auth.adminCompanyName')} <span className="text-brand-gold">*</span></label>
                            <input type="text" name="adminCompanyName" value={formData.adminCompanyName} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.adminCompanyName ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">{t('auth.companyOwnerName')} <span className="text-brand-gold">*</span></label>
                            <input type="text" name="companyOwnerName" value={formData.companyOwnerName} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.companyOwnerName ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">{t('auth.licenseNumber')} <span className="text-brand-gold">*</span></label>
                        <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.licenseNumber ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                    </div>
                </div>

                {/* SECTION 2: Public Information */}
                    <div className="bg-black/20 border border-brand-gold/20 rounded-xl p-6 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-brand-gold/10 rounded-lg text-brand-gold"><Globe size={20} /></div>
                            <div>
                                <h3 className="font-bold text-lg">{t('listing.publicInfo')}</h3>
                            <p className="text-xs text-gray-400">{t('listing.publicInfoDesc')}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">{t('auth.companyName')} <span className="text-brand-gold">*</span></label>
                            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.companyName ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">{t('auth.sector')} <span className="text-brand-gold">*</span></label>
                                <select name="sector" value={formData.sector} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.sector ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}>
                                    <option value="">{t('listing.selectSector')}</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">{t('auth.companyAge')} <span className="text-brand-gold">*</span></label>
                                <input type="tel" inputMode="numeric" pattern="[0-9]*" name="companyAge" value={formData.companyAge} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.companyAge ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">{t('auth.companyType')} <span className="text-brand-gold">*</span></label>
                            <input type="text" name="companyType" value={formData.companyType} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.companyType ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">{purpose === 'sell_business' ? t('auth.salePrice') : t('auth.requestedInvestment')} <span className="text-brand-gold">*</span></label>
                            <input type="tel" inputMode="numeric" pattern="[0-9]*" name="requestedInvestment" value={formatNumberWithCommas(formData.requestedInvestment)} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.requestedInvestment ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                        </div>
                        </div>
                        {purpose === 'request_investment' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">{t('auth.shareToSell')} <span className="text-brand-gold">*</span></label>
                                <input type="tel" inputMode="numeric" pattern="[0-9]*" name="shareToSell" value={formData.shareToSell} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.shareToSell ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                            </div>
                        )}
                    </div>
                </div>

                {/* SECTION 3: Premium / Booklet Info */}
                <div className="bg-black/20 border border-blue-500/20 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><FileText size={20} /></div>
                        <div>
                            <h3 className="font-bold text-lg">{t('listing.bookletInfo')}</h3>
                            <p className="text-xs text-gray-400">{t('listing.bookletInfoDesc')}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">{t('auth.legalEntity')} <span className="text-brand-gold">*</span></label>
                            <input type="text" name="legalEntity" value={formData.legalEntity} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.legalEntity ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">{t('common.financial')} <span className="text-brand-gold">*</span></label>
                            <select name="financialHealth" value={formData.financialHealth} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.financialHealth ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}>
                                {FINANCIAL_STATUS_ORDER.map(status => <option key={status} value={status}>{t(FINANCIAL_HEALTH_MAP[status].labelKey)}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">{t('auth.investmentReason')} <span className="text-brand-gold">*</span></label>
                            <textarea name="investmentReason" rows={3} value={formData.investmentReason} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.investmentReason ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">{t('auth.fullDetails')} <span className="text-brand-gold">*</span></label>
                            <textarea name="fullDetails" rows={5} value={formData.fullDetails} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.fullDetails ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                        </div>
                        
                        {/* Optional file upload for image only; backend update currently validates the core ad fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">{t('auth.projectImage')} <span className="text-brand-gold">*</span></label>
                                <input type="file" name="image" accept="image/*" onChange={handleFileChange} className={`w-full text-sm text-gray-400 file:me-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-gold file:text-black hover:file:bg-brand-gold/90 border ${errors.image ? 'border-red-500' : 'border-transparent'}`} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={termsAccepted} onChange={(e) => { setTermsAccepted(e.target.checked); setTermsError(false); }} className="accent-brand-gold" />
                        <span className="text-sm text-gray-300">
                             {t('auth.agreeToTerms')} <Link to="/terms-of-use" target="_blank" className="text-brand-gold underline">{t('auth.termsAndConditions')}</Link>
                        </span>
                    </label>
                    {termsError && <p className="text-red-500 text-sm">{t('auth.termsErrorListing')}</p>}
                </div>

                <div className="flex gap-4 pt-4">
                     <button type="button" onClick={() => setStep(1)} className="flex-1 bg-white/10 text-white font-bold py-4 rounded-xl hover:bg-white/20 transition">
                        {t('listing.back')}
                     </button>
                     <button type="submit" disabled={updateOpportunity.isPending} className="flex-[2] bg-brand-gold text-black font-bold text-lg py-4 rounded-xl hover:bg-yellow-500 transition shadow-lg shadow-brand-gold/20 disabled:opacity-50 disabled:cursor-not-allowed">
                        {updateOpportunity.isPending ? (
                            <span className="flex items-center justify-center gap-2">
                            <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                            {t('listing.processing')}
                            </span>
                        ) : t('auth.saveChanges')}
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
                    <h2 className="text-2xl font-bold text-white">{t('listing.submitted')}</h2>
                    <p className="text-gray-300">
                        {t('listing.success')}
                    </p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
