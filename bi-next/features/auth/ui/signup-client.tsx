'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { Briefcase, TrendingUp, CheckCircle, AlertCircle, Upload, FileText } from 'lucide-react';
import { CATEGORIES } from '@/features/projects/services/project-api';
import { Language } from '@/shared/types';
import { Link } from '@/i18n/routing';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/shared/services/api-client';

export const SignupClient: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale() as Language;
  const t = useTranslations('auth');
  
  const roleParam = searchParams.get('role');
  const role = (roleParam === 'company' || roleParam === 'advertiser') ? 'advertiser' : 'investor';

  const getDefaults = (currentRole: string) => {
    if (currentRole === 'advertiser') {
      return {
        firstName: locale === 'ar' ? 'محمد' : 'Mohamed',
        lastName: locale === 'ar' ? 'العتيبي' : 'Al-Otaibi',
        email: 'advertiser.test@bi.com',
        phone: '88880000',
        password: '',
        investorSector: '',
        investorCapital: '',
        investmentCount: '',
        investorExperience: ''
      };
    }
    return {
      firstName: locale === 'ar' ? 'أحمد' : 'Ahmed',
      lastName: locale === 'ar' ? 'الشمري' : 'Al-Shammeri',
      email: 'investor.test@bi.com',
      phone: '80808080',
      password: '',
      investorType: 'angel',
      investorSector: 'Real Estate',
      investorCapital: '100000',
      investmentCount: '3',
      investorExperience: 'intermediate'
    };
  };

  const [formData, setFormData] = useState(getDefaults(role));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isOtherSector, setIsOtherSector] = useState(false);
  const [agreed, setAgreed] = useState(false);
  
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [licensePreview, setLicensePreview] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFormData(getDefaults(role));
      setErrors({});
      setIsOtherSector(false);
      setLicenseFile(null);
      setLicensePreview(null);
      setAgreed(false);
    }, 0);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 8) return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({...prev, license: t('licenseErrorSize')}));
        return;
    }
    if (!['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(file.type)) {
         setErrors(prev => ({...prev, license: t('licenseErrorType')}));
         return;
    }

    setLicenseFile(file);
    if (file.type.startsWith('image/')) {
        setLicensePreview(URL.createObjectURL(file));
    } else {
        setLicensePreview(null);
    }
    setErrors(prev => ({...prev, license: ''}));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = t('required');
    if (!formData.lastName.trim()) newErrors.lastName = t('required');
    if (!formData.email.trim()) {
      newErrors.email = t('required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('invalidEmail');
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = t('required');
    } else if (formData.phone.length !== 8) {
      newErrors.phone = t('invalidPhone');
    }

    if (role === 'advertiser') {
      if (!licenseFile) newErrors.license = t('required');
    }
    
    if (role === 'investor') {
       if (!formData.investorType) newErrors.investorType = t('required');
       if (!formData.investorSector.trim()) newErrors.investorSector = t('required');
       if (!formData.investorCapital.trim()) {
          newErrors.investorCapital = t('required');
       }
       if (!formData.investmentCount.trim()) {
          newErrors.investmentCount = t('required');
       }
       if (!formData.investorExperience) newErrors.investorExperience = t('required');
    }

    if (!agreed) newErrors.agreement = t('termsError');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const registerMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append('first_name', formData.firstName);
      fd.append('last_name', formData.lastName);
      fd.append('email', formData.email);
      fd.append('phone', formData.phone);
      fd.append('password', formData.password);
      fd.append('agreed_to_terms', '1');

      if (role === 'investor') {
        fd.append('investor_type', formData.investorType!);
        fd.append('investor_experience', formData.investorExperience!);
        fd.append('capital', formData.investorCapital);
        fd.append('available_capital', formData.investorCapital);
        fd.append('previous_investments_count', formData.investmentCount);
        fd.append('preferred_sector_id', '1'); // Requires dynamic mapping to actual DB IDs
        fd.append('category_id', '1'); // Requires dynamic mapping to actual DB IDs
        
        return api.post('/v1/auth/register/investor', fd);
      } else {
        if (licenseFile) {
          fd.append('company_license_file', licenseFile);
        }
        return api.post('/v1/auth/register/advertiser', fd);
      }
    },
    onSuccess: () => {
      router.push('/verify-email');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      registerMutation.mutate();
    }
  };

  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'Other') {
      setIsOtherSector(true);
      setFormData(prev => ({...prev, investorSector: ''}));
    } else {
      setIsOtherSector(false);
      setFormData(prev => ({...prev, investorSector: val}));
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-brand-gray/20 border border-white/10 rounded-2xl p-8 backdrop-blur-sm animate-fade-in">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gold/10 text-brand-gold mb-4">
             {role === 'advertiser' ? <Briefcase size={32} /> : <TrendingUp size={32} />}
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {role === 'advertiser' ? t('advertiser') : t('investor')}
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            {role === 'advertiser' ? t('advertiserSubtitle') : t('investorSubtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Investor Type Segmented Control */}
          {role === 'investor' && (
            <div className="space-y-6 animate-fade-in">
               <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">{t('investorType')} <span className="text-brand-gold">*</span></label>
                <div className="grid grid-cols-3 gap-2 bg-black/50 p-1 rounded-xl border border-white/10">
                  {['angel', 'company', 'crowdfunding'].map((type) => {
                    const isSelected = formData.investorType === type;
                    return (
                    <button
                        key={type}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, investorType: type }))}
                        className={`relative py-3 rounded-lg text-xs md:text-sm font-bold transition-all duration-300 ${isSelected ? 'bg-brand-gold text-black shadow-lg shadow-brand-gold/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        {type === 'angel' ? t('angelType') : type === 'company' ? t('companyType') : t('crowdType')}
                        {isSelected && (
                           <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-brand-gold translate-y-1 z-10"></div>
                        )}
                    </button>
                    )
                  })}
                </div>

                {/* Description Panel */}
                <div className="bg-brand-gray/20 border border-white/10 rounded-xl p-6 mt-4 relative animate-fade-in">
                   <h3 className="text-brand-gold font-bold text-sm uppercase tracking-wider mb-4 border-b border-white/10 pb-3">
                      {t('selectedTypeDetails', { 
                        TYPE: formData.investorType === 'angel' ? t('angelType') : 
                              formData.investorType === 'company' ? t('companyType') : t('crowdType')
                      })}
                   </h3>

                   <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                         <span className="text-gray-400 text-sm">{t('descCapital')}</span>
                         <span className="font-bold text-white text-sm">
                            {formData.investorType === 'company' || formData.investorType === 'crowdfunding' ? t('valCap100') : t('valCap10')}
                         </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                         <span className="text-gray-400 text-sm">{t('descField')}</span>
                         <span className="font-bold text-white text-sm">
                             {formData.investorType === 'company' ? t('valFieldTech') :
                              formData.investorType === 'angel' ? t('valFieldTechFood') :
                              t('valFieldRE')}
                         </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                         <span className="text-gray-400 text-sm">{t('descExp')}</span>
                         <span className="font-bold text-white text-sm">
                             {formData.investorType === 'company' ? t('valExp7') :
                              formData.investorType === 'angel' ? t('valExp2') :
                              t('valExp4')}
                         </span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* Common Fields - Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">{t('firstName')} <span className="text-brand-gold">*</span></label>
              <input 
                type="text" 
                name="firstName" 
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full bg-[#121212] border ${errors.firstName ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
              />
              {errors.firstName && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} /> {errors.firstName}</span>}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">{t('lastName')} <span className="text-brand-gold">*</span></label>
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full bg-[#121212] border ${errors.lastName ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
              />
              {errors.lastName && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} /> {errors.lastName}</span>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">{t('email')} <span className="text-brand-gold">*</span></label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full bg-[#121212] border ${errors.email ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
            />
            {errors.email && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} /> {errors.email}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">{t('phone')} <span className="text-brand-gold">*</span></label>
            <div className={`flex bg-[#121212] border ${errors.phone ? 'border-red-500' : 'border-white/15'} rounded-lg overflow-hidden transition focus-within:border-brand-gold focus-within:ring-2 focus-within:ring-brand-gold/20`}>
               <div className="px-4 py-3 bg-white/5 border-r border-white/10 text-gray-400 select-none ltr:border-r rtl:border-l rtl:border-r-0 font-sans">
                 +965
               </div>
               <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="xxxxxxxx"
                  maxLength={8}
                  className="w-full bg-transparent border-none px-4 py-3 text-white outline-none placeholder-gray-600 font-sans"
                />
            </div>
            {errors.phone && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} /> {errors.phone}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">{t('password')} <span className="text-brand-gold">*</span></label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full bg-[#121212] border ${errors.password ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
            />
          </div>

          {/* New Investor Specific Fields */}
          {role === 'investor' && (
            <div className="space-y-6 pt-4 border-t border-white/10 animate-fade-in">
              <h3 className="text-brand-gold font-bold uppercase tracking-widest text-sm border-b border-white/10 pb-2">Investor Profile</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">{t('investorSector')} <span className="text-brand-gold">*</span></label>
                <select 
                  onChange={handleSectorChange}
                  value={isOtherSector ? 'Other' : formData.investorSector}
                  className={`w-full bg-[#121212] border ${errors.investorSector ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
                >
                  <option value="">{locale === 'en' ? 'Select Sector' : 'اختر المجال'}</option>
                  {CATEGORIES.map(c => <option key={c.en} value={c.en}>{c[locale]}</option>)}
                  <option value="Other">{t('other')}</option>
                </select>
                {isOtherSector && (
                  <input 
                    type="text"
                    name="investorSector"
                    placeholder={t('other')}
                    value={formData.investorSector}
                    onChange={handleChange}
                    className="w-full mt-2 bg-black/50 border border-brand-gold rounded-lg px-4 py-3 text-white focus:outline-none"
                  />
                )}
                {errors.investorSector && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} /> {errors.investorSector}</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">{t('investorCapital')} <span className="text-brand-gold">*</span></label>
                  <input 
                    type="number" 
                    name="investorCapital"
                    value={formData.investorCapital}
                    onChange={handleChange}
                    min="0"
                    className={`w-full bg-[#121212] border ${errors.investorCapital ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition font-sans`}
                  />
                  {errors.investorCapital && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} /> {errors.investorCapital}</span>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">{t('investmentCount')} <span className="text-brand-gold">*</span></label>
                  <input 
                    type="number" 
                    name="investmentCount"
                    value={formData.investmentCount}
                    onChange={handleChange}
                    min="0"
                    className={`w-full bg-[#121212] border ${errors.investmentCount ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition font-sans`}
                  />
                  {errors.investmentCount && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} /> {errors.investmentCount}</span>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">{t('investorExperience')} <span className="text-brand-gold">*</span></label>
                <div className="flex bg-black/50 p-1 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, investorExperience: 'beginner' }))}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${formData.investorExperience === 'beginner' ? 'bg-brand-gold text-black shadow-lg shadow-brand-gold/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                    {t('expBeginner')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, investorExperience: 'intermediate' }))}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${formData.investorExperience === 'intermediate' ? 'bg-brand-gold text-black shadow-lg shadow-brand-gold/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                    {t('expIntermediate')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, investorExperience: 'expert' }))}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${formData.investorExperience === 'expert' ? 'bg-brand-gold text-black shadow-lg shadow-brand-gold/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                    {t('expExpert')}
                  </button>
                </div>
                {errors.investorExperience && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} /> {errors.investorExperience}</span>}
              </div>
            </div>
          )}

          {/* Advertiser Specific Fields - License Upload */}
          {role === 'advertiser' && (
            <div className="space-y-6 pt-4 border-t border-white/10 animate-fade-in">
              <h3 className="text-brand-gold font-bold uppercase tracking-widest text-sm border-b border-white/10 pb-2">Business Verification</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">{t('companyLicense')} <span className="text-brand-gold">*</span></label>
                <div className={`relative w-full border-2 border-dashed ${errors.license ? 'border-red-500' : 'border-white/10'} rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-brand-gold/50 transition bg-black/30 group cursor-pointer`}>
                   <input 
                      type="file" 
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                   />
                   
                   {licenseFile ? (
                      <div className="flex flex-col items-center">
                         {licensePreview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img 
                               src={licensePreview} 
                               alt="Preview" 
                               className="h-32 object-contain mb-3 rounded border border-white/20" 
                            />
                         ) : (
                            <FileText size={48} className="text-gray-400 mb-3" />
                         )}
                         <span className="text-brand-gold font-bold text-sm truncate max-w-[200px]">{licenseFile.name}</span>
                         <span className="text-xs text-gray-500 mt-1">{(licenseFile.size / 1024 / 1024).toFixed(2)} MB</span>
                         <span className="text-xs text-white/50 mt-2 bg-black/50 px-2 py-1 rounded">{t('replaceLicense')}</span>
                      </div>
                   ) : (
                      <>
                         <Upload size={32} className="text-gray-400 mb-3 group-hover:text-brand-gold transition" />
                         <span className="text-sm text-gray-300 font-medium">{t('uploadLicense')}</span>
                         <span className="text-xs text-gray-500 mt-1 font-sans">MAX 10MB (JPG, PNG, PDF)</span>
                      </>
                   )}
                </div>
                {errors.license && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} /> {errors.license}</span>}
              </div>
            </div>
          )}
          
          {/* Terms & Conditions Consent */}
          <div className="pt-4 border-t border-white/10">
             <div className="flex items-start gap-3">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    id="termsAgreement"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-white/30 bg-black/30 checked:border-brand-gold checked:bg-brand-gold transition-all"
                  />
                  <CheckCircle size={14} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <label htmlFor="termsAgreement" className="text-sm text-gray-300 cursor-pointer select-none leading-tight">
                  {t('agreeToTerms')} <Link href="/terms-of-use" target="_blank" className="text-brand-gold hover:underline">{t('termsOfUse')}</Link> {t('and')} <Link href="/privacy-policy" target="_blank" className="text-brand-gold hover:underline">{t('privacyPolicy')}</Link>
                </label>
             </div>
             {errors.agreement && <span className="text-xs text-red-500 flex items-center gap-1 mt-2"><AlertCircle size={12} /> {errors.agreement}</span>}
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={registerMutation.isPending}
              className="w-full bg-brand-gold text-black font-bold text-lg py-4 rounded-xl hover:bg-yellow-500 transition shadow-lg shadow-brand-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {registerMutation.isPending ? (
                 <span className="flex items-center justify-center gap-2">
                   <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                   {locale === 'en' ? 'Processing...' : 'جاري المعالجة...'}
                 </span>
              ) : t('createAccount')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
