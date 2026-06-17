import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, Link, useParams } from '@tanstack/react-router';
import {
  Globe,
  FileText,
  LayoutDashboard,
  Briefcase,
  Mail,
  User,
  Building2,
  FileBadge,
  Calendar,
  Layers,
  Activity,
  DollarSign,
  PieChart,
  FileEdit,
  Image as ImageIcon,
} from 'lucide-react';
import { FINANCIAL_HEALTH_MAP, FINANCIAL_STATUS_ORDER, COMPANY_STAGES } from '../constants';
import { useCategories } from '../features/general/hooks/useCategories';
import { useMyOpportunityDetail, useUpdateOpportunity } from '../features/company/hooks/useOpportunities';
import { useAuth } from '../features/auth/hooks/useAuth';
import { PhoneInputField } from '../features/auth/ui/PhoneInputField';
import { MAX_MONEY_AMOUNT, formatNumberWithCommas, parseLimitedIntegerInput } from '../lib/number-format';
import { FileUpload } from '../components/ui/FileUpload';
import { toast } from '@/lib/toast';
import { FinancialStatus } from '../types';

export const EditListing: React.FC = () => {
  const { id } = useParams({ from: '/advertiser/edit-listing/$id' });
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const { user: apiUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: categoriesData } = useCategories({ per_page: 100 });
  const categories = categoriesData?.data?.categories ?? [];
  const updateOpportunity = useUpdateOpportunity(id);
  const { data: detailData, isLoading } = useMyOpportunityDetail(id);
  const existingProject = detailData?.data;

  const [step, setStep] = React.useState(1);
  const [purpose, setPurpose] = React.useState<'request_investment' | 'sell_business' | undefined>(undefined);
  const [purposeError, setPurposeError] = React.useState(false);
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [termsError, setTermsError] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loadingExistingData, setLoadingExistingData] = React.useState(true);

  const [formData, setFormData] = React.useState({
    fullName: '',
    country_code: '965',
    phone: '',
    email: '',
    adminCompanyName: '',
    companyOwnerName: '',
    licenseNumber: '',
    companyName: '',
    sector: '',
    companyAge: '',
    legalEntity: '',
    companyStage: 'seed',
    financialHealth: 'Stable' as FinancialStatus,
    requestedInvestment: '',
    investmentReason: '',
    shareToSell: '',
    fullDetails: '',
  });

  const [files, setFiles] = React.useState<{
    image?: File;
    license_file?: File;
    commercial_record_file?: File;
    financial_statements_file?: File;
  }>({});

  React.useEffect(() => {
    if (existingProject) {
      const normalizedGoal = existingProject.goal === 'sell_business' ? 'sell_business' : 'request_investment';
      setPurpose(normalizedGoal);
      const code = existingProject.country_code || '965';
      setFormData({
        companyName: existingProject.company_name || '',
        fullName: existingProject.contact_name || '',
        country_code: code,
        phone: (existingProject.contact_phone || '').replace(/\D/g, ''),
        email: existingProject.contact_email || '',
        adminCompanyName: existingProject.admin_company_name || '',
        companyOwnerName: existingProject.owner_name || '',
        licenseNumber: existingProject.license_number || '',
        sector: (existingProject.category_id ?? existingProject.category?.id ?? '').toString(),
        companyAge: existingProject.business_age_years?.toString() || '',
        legalEntity: existingProject.legal_entity || '',
        companyStage: existingProject.business_stage || 'seed',
        financialHealth: (existingProject.financial_status as FinancialStatus) || 'Stable',
        requestedInvestment: existingProject.investment_required?.toString() || '',
        investmentReason: existingProject.investment_reason || '',
        shareToSell: existingProject.sale_percentage?.toString() || '',
        fullDetails: existingProject.full_description || '',
      });
      setTermsAccepted(true);
      setLoadingExistingData(false);
    }
  }, [existingProject]);

  React.useEffect(() => {
    if (!isLoading) setLoadingExistingData(false);
  }, [isLoading]);

  if (isLoading || authLoading || loadingExistingData) {
    return <div className="p-12 text-center text-white">{t('common.loading')}</div>;
  }

  const storedRole = localStorage.getItem('auth_role');
  const userRole = (apiUser?.role as any)?.key ?? apiUser?.role ?? storedRole;
  if (!isAuthenticated || userRole !== 'advertiser') {
    return <Navigate to="/dashboard" />;
  }

  const selectedCompanyStage = COMPANY_STAGES.find((stage) => stage.id === formData.companyStage);
  const formatStageOptionLabel = (stage: (typeof COMPANY_STAGES)[number]) => {
    const stageLabel = t(stage.labelKey);
    const yearsLabel = t(`stages.${stage.id}_years`);
    return lang === 'ar' ? `${stageLabel} (${yearsLabel})` : `${stageLabel} (${yearsLabel})`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numericLimits: Record<string, number> = {
      companyAge: 100,
      requestedInvestment: MAX_MONEY_AMOUNT,
      shareToSell: 100,
    };
    const nextValue = name in numericLimits ? parseLimitedIntegerInput(value, numericLimits[name]) : value;
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateStep1 = () => {
    if (!purpose) {
      setPurposeError(true);
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    const requiredStr = t('auth.required');
    if (!formData.fullName.trim()) newErrors.fullName = requiredStr;
    if (!formData.phone.trim()) {
      newErrors.phone = requiredStr;
    }
    if (!formData.email.trim()) newErrors.email = requiredStr;
    if (!formData.adminCompanyName.trim()) newErrors.adminCompanyName = requiredStr;
    if (!formData.companyOwnerName.trim()) newErrors.companyOwnerName = requiredStr;
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = requiredStr;
    if (!formData.companyName.trim()) newErrors.companyName = requiredStr;
    if (!formData.sector.trim()) newErrors.sector = requiredStr;
    if (!formData.companyAge.trim()) newErrors.companyAge = requiredStr;
    if (!formData.legalEntity.trim()) newErrors.legalEntity = requiredStr;
    if (!formData.financialHealth.trim()) newErrors.financialHealth = requiredStr;
    if (!formData.requestedInvestment.trim()) newErrors.requestedInvestment = requiredStr;
    if (!formData.investmentReason.trim()) newErrors.investmentReason = requiredStr;
    if (!formData.fullDetails.trim()) newErrors.fullDetails = requiredStr;
    if (purpose === 'request_investment' && !formData.shareToSell.trim()) {
      newErrors.shareToSell = requiredStr;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setTermsError(true);
      return;
    }
    if (!validateStep2()) return;

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

    updateOpportunity.mutate(payload, {
      onSuccess: () => {
        toast.success(t('listing.editSubmitted'), { id: 'edit-listing-success' });
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate({ to: '/dashboard' });
        }, 2000);
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('listing.editTitle')}</h1>
            <div className="flex items-center gap-4 text-sm">
              <div className={`flex items-center gap-2 ${step === 1 ? 'text-brand-gold' : 'text-gray-500'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step === 1 ? 'border-brand-gold' : 'border-gray-500'}`}>1</span>
                {t('listing.step1')}
              </div>
              <div className="w-8 h-px bg-gray-800" />
              <div className={`flex items-center gap-2 ${step === 2 ? 'text-brand-gold' : 'text-gray-500'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step === 2 ? 'border-brand-gold' : 'border-gray-500'}`}>2</span>
                {t('listing.step2')}
              </div>
            </div>
          </div>
          <Link to="/dashboard" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition text-gray-400">
            <LayoutDashboard size={24} />
          </Link>
        </div>

        {step === 1 ? (
          <div className="bg-brand-gray/20 border border-white/10 rounded-2xl p-8 backdrop-blur-sm animate-fade-in">
            <h2 className="text-xl font-bold mb-6">{t('listing.purposeTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <button
                onClick={() => { setPurpose('request_investment'); setPurposeError(false); }}
                className={`p-6 rounded-xl border text-start transition-all group ${purpose === 'request_investment' ? 'bg-brand-gold text-black border-brand-gold' : 'bg-black/40 border-white/10 hover:border-brand-gold/50'}`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${purpose === 'request_investment' ? 'bg-black/20' : 'bg-brand-gold/10 text-brand-gold group-hover:bg-brand-gold/20'}`}>
                  <Briefcase size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">{t('listing.investment')}</h3>
                <p className={`text-sm ${purpose === 'request_investment' ? 'text-black/70' : 'text-gray-400'}`}>{t('listing.investmentDesc')}</p>
              </button>

              <button
                onClick={() => { setPurpose('sell_business'); setPurposeError(false); }}
                className={`p-6 rounded-xl border text-start transition-all group ${purpose === 'sell_business' ? 'bg-brand-gold text-black border-brand-gold' : 'bg-black/40 border-white/10 hover:border-brand-gold/50'}`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${purpose === 'sell_business' ? 'bg-black/20' : 'bg-brand-gold/10 text-brand-gold group-hover:bg-brand-gold/20'}`}>
                  <Briefcase size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">{t('listing.sale')}</h3>
                <p className={`text-sm ${purpose === 'sell_business' ? 'text-black/70' : 'text-gray-400'}`}>{t('listing.saleDesc')}</p>
              </button>
            </div>
            {purposeError && <p className="text-red-500 text-center mb-6">{t('listing.selectGoalFirst')}</p>}
            <button onClick={() => validateStep1() && setStep(2)} className="w-full bg-brand-gold text-black font-bold py-4 rounded-xl hover:bg-yellow-500 transition shadow-lg shadow-brand-gold/20">
              {t('listing.next')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="bg-brand-gray/20 border border-white/10 rounded-2xl p-8 backdrop-blur-sm animate-fade-in space-y-8">
            <div className="space-y-6">
              <div className="bg-black/20 border border-white/10 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-brand-gold/10 rounded-lg text-brand-gold"><User size={20} /></div>
                  <div>
                    <h3 className="font-bold text-lg">{t('listing.adminOnlyInfo')}</h3>
                    <p className="text-xs text-gray-400">{t('listing.adminOnlyInfoDesc')}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                      <User size={16} className="text-brand-gold" />
                      <label>{t('auth.firstName')} <span className="text-brand-gold">*</span></label>
                    </div>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.fullName ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                  </div>
                  <div className="md:col-span-2">
                    <PhoneInputField value={formData.phone} onChange={(val) => setFormData(prev => ({ ...prev, phone: val }))} countryCodeValue={formData.country_code} onCountryCodeChange={(val) => setFormData(prev => ({ ...prev, country_code: val }))} error={errors.phone} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                    <Mail size={16} className="text-brand-gold" />
                    <label>{t('auth.email')} <span className="text-brand-gold">*</span></label>
                  </div>
                  <input type="text" inputMode="email" autoComplete="email" name="email" value={formData.email} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.email ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                      <Building2 size={16} className="text-brand-gold" />
                      <label>{t('auth.adminCompanyName')} <span className="text-brand-gold">*</span></label>
                    </div>
                    <input type="text" name="adminCompanyName" value={formData.adminCompanyName} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.adminCompanyName ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                      <User size={16} className="text-brand-gold" />
                      <label>{t('auth.companyOwnerName')} <span className="text-brand-gold">*</span></label>
                    </div>
                    <input type="text" name="companyOwnerName" value={formData.companyOwnerName} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.companyOwnerName ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                    <FileBadge size={16} className="text-brand-gold" />
                    <label>{t('auth.licenseNumber')} <span className="text-brand-gold">*</span></label>
                  </div>
                  <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.licenseNumber ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                      <Briefcase size={16} className="text-brand-gold" />
                      <label>{t('auth.legalEntity')} <span className="text-brand-gold">*</span></label>
                    </div>
                    <input type="text" name="legalEntity" value={formData.legalEntity} placeholder={t('listing.placeholderWLL')} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.legalEntity ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                  </div>
                </div>
              </div>

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
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                      <Building2 size={16} className="text-brand-gold" />
                      <label>{t('auth.companyName')} <span className="text-brand-gold">*</span></label>
                    </div>
                    <input type="text" name="companyName" value={formData.companyName} placeholder={t('listing.placeholderCompany')} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.companyName ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                        <Layers size={16} className="text-brand-gold" />
                        <label>{t('auth.sector')} <span className="text-brand-gold">*</span></label>
                      </div>
                      <select name="sector" value={formData.sector} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.sector ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}>
                        <option value="">{t('listing.selectSector')}</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                        <Calendar size={16} className="text-brand-gold" />
                        <label>{t('auth.companyAge')} <span className="text-brand-gold">*</span></label>
                      </div>
                      <input type="tel" inputMode="numeric" pattern="[0-9]*" name="companyAge" value={formData.companyAge} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.companyAge ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                        <Activity size={16} className="text-brand-gold" />
                        <label>{t('auth.companyStage')} <span className="text-brand-gold">*</span></label>
                      </div>
                      <select name="companyStage" value={formData.companyStage} onChange={handleChange} dir={lang === 'ar' ? 'rtl' : 'ltr'} className={`w-full bg-[#121212] border ${errors.companyStage ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}>
                        {COMPANY_STAGES.map((s) => (
                          <option key={s.id} value={s.id} title={t(s.descKey)} aria-label={`${t(s.labelKey)} - ${t(s.descKey)}`}>{formatStageOptionLabel(s)}</option>
                        ))}
                      </select>
                      {selectedCompanyStage && <p className="text-xs text-gray-400 leading-5">{t(selectedCompanyStage.descKey)}</p>}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                        <DollarSign size={16} className="text-brand-gold" />
                        <label>{purpose === 'sell_business' ? t('auth.salePrice') : t('auth.requestedInvestment')} <span className="text-brand-gold">*</span></label>
                      </div>
                      <input type="tel" inputMode="numeric" pattern="[0-9]*" name="requestedInvestment" value={formatNumberWithCommas(formData.requestedInvestment)} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.requestedInvestment ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                    </div>
                  </div>
                  {purpose === 'request_investment' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                        <PieChart size={16} className="text-brand-gold" />
                        <label>{t('auth.shareToSell')} <span className="text-brand-gold">*</span></label>
                      </div>
                      <input type="tel" inputMode="numeric" pattern="[0-9]*" name="shareToSell" value={formData.shareToSell} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.shareToSell ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-black/20 border border-blue-500/20 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><FileText size={20} /></div>
                  <div>
                    <h3 className="font-bold text-lg">{t('listing.bookletInfo')}</h3>
                    <p className="text-xs text-gray-400">{t('listing.bookletInfoDesc')}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                      <Activity size={16} className="text-brand-gold" />
                      <label>{t('common.financial')} <span className="text-brand-gold">*</span></label>
                    </div>
                    <select name="financialHealth" value={formData.financialHealth} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.financialHealth ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}>
                      {FINANCIAL_STATUS_ORDER.map((status) => <option key={status} value={status}>{t(FINANCIAL_HEALTH_MAP[status].labelKey)}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                      <FileEdit size={16} className="text-brand-gold" />
                      <label>{t('auth.investmentReason')} <span className="text-brand-gold">*</span></label>
                    </div>
                    <textarea name="investmentReason" rows={3} value={formData.investmentReason} placeholder={t('listing.demoReason')} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.investmentReason ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                      <FileText size={16} className="text-brand-gold" />
                      <label>{t('auth.fullDetails')} <span className="text-brand-gold">*</span></label>
                    </div>
                    <textarea name="fullDetails" rows={5} value={formData.fullDetails} placeholder={t('listing.demoDetails')} onChange={handleChange} className={`w-full bg-[#121212] border ${errors.fullDetails ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={termsAccepted} onChange={(e) => { setTermsAccepted(e.target.checked); setTermsError(false); }} className="accent-brand-gold" />
                <span className="text-sm text-gray-300">
                  {t('auth.agreeToTermsListing')}{' '}
                  <Link to="/terms-of-use" target="_blank" className="text-brand-gold underline">{t('auth.termsAndConditions')}</Link>
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
                    <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    {t('listing.updateProcessing')}
                  </span>
                ) : t('listing.updateSubmit')}
              </button>
            </div>
          </form>
        )}

        {showSuccess && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-[#121212] border border-brand-gold/20 p-8 rounded-2xl max-w-md text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
                <ImageIcon size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white">{t('listing.submitted')}</h2>
              <p className="text-gray-300">{t('listing.success')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
