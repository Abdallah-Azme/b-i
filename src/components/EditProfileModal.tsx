import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Lock, Loader2, FileText, Eye } from 'lucide-react';
import { useUpdateProfile } from '../features/auth/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { useInvestorTypes, useInvestorExperiences, usePreferredSectors } from '../features/general/hooks/useGeneralLookups';
import { PhoneInputField } from '../features/auth/ui/PhoneInputField';
import { MAX_MONEY_AMOUNT, formatNumberWithCommas, parseLimitedIntegerInput } from '@/lib/number-format';
import { FileUpload } from '@/components/ui/FileUpload';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditProfileModalProps {
  user: any;
  onClose: () => void;
  onSave?: (data: any) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose }) => {
  const { t } = useTranslation();
  const updateProfile = useUpdateProfile();
  const queryClient = useQueryClient();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [companyLicenseFile, setCompanyLicenseFile] = useState<File | null>(null);
  const resolveImageUrl = (value: any) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value?.url || value?.src || value?.path || '';
  };

  const resolveLookupValue = (value: any) => {
    if (!value) return '';
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    return String(value?.value ?? value?.id ?? value?.key ?? value?.code ?? '');
  };

  const resolveExperienceId = (value: any) => {
    if (!value) return '';
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    if (typeof value === 'string' && /^\d+$/.test(value)) return value;
    if (typeof value === 'object') {
      return String(value?.id ?? value?.value ?? value?.key ?? '');
    }
    return '';
  };

  const resolveLookupLabel = (value: any) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value?.label ?? value?.name ?? value?.ar ?? value?.en ?? '';
  };

  const [profileImagePreview, setProfileImagePreview] = useState<string>(
    resolveImageUrl(user?.image || user?.photo || user?.avatar || user?.profile_image),
  );
  const [phoneError, setPhoneError] = useState<string>('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  // Clean phone and country code
  const cleanPhone = (phoneStr: string, codeStr: string) => {
    let phone = (phoneStr || '').replace(/\D/g, '');
    const code = (codeStr || '').replace(/\D/g, '');
    if (code && phone.startsWith(code)) {
      phone = phone.slice(code.length);
    }
    return phone;
  };

  const initialCountryCode = (user?.country_code || '').replace(/\D/g, '') || '965';
  const initialPhone = cleanPhone(user?.phone || '', initialCountryCode);

  const initialFormData = {
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    country_code: initialCountryCode,
    phone: initialPhone,
    image: user?.image || user?.photo || user?.avatar || user?.profile_image || '',
    
    // Investor specific
    investor_type: resolveLookupValue(user?.investor_type),
    capital: user?.capital || '',
    available_capital: user?.available_capital || '',
    preferred_sector_id: String(user?.preferred_sector_id || user?.focus_sector?.id || ''),
    experience_level: resolveExperienceId(user?.experience_level),
    investor_experience: resolveLookupValue(
      user?.investment_experience ||
      user?.investor_experience ||
      '',
    ),
    previous_investments_count: user?.previous_investments_count || '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [companyLicensePreview, setCompanyLicensePreview] = useState<string>(
    user?.company_license_url || user?.company_license || '',
  );

  useEffect(() => {
    setProfileImagePreview(resolveImageUrl(user?.image || user?.photo || user?.avatar || user?.profile_image));
    setCompanyLicensePreview(user?.company_license_url || user?.company_license || '');
    setFormData(initialFormData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const { data: investorTypesData } = useInvestorTypes();
  const { data: experiencesData } = useInvestorExperiences();
  const { data: sectorsData } = usePreferredSectors();

  useEffect(() => {
    setFormData((prev) => {
      const sectorOptions = sectorsData?.data ?? [];
      const experienceOptions = experiencesData?.data ?? [];
      const investorTypeOptions = investorTypesData?.data ?? [];

      const normalizedSector =
        String(prev.preferred_sector_id || '') ||
        String(user?.preferred_sector_id || user?.focus_sector?.id || '');

      const currentExperience = String(prev.experience_level || '');
      const matchedExperience =
        experienceOptions.find((exp: any) => String(exp.value) === currentExperience || String(exp.id) === currentExperience) ||
        experienceOptions.find((exp: any) =>
          [exp.name, exp.label].filter(Boolean).map(String).includes(currentExperience),
        );

      const matchedInvestorType =
        investorTypeOptions.find((item: any) => String(item.value) === String(prev.investor_type)) ||
        investorTypeOptions.find((item: any) =>
          [item.name, item.label].filter(Boolean).map(String).includes(String(prev.investor_type)),
        );

      return {
        ...prev,
        preferred_sector_id: normalizedSector,
        experience_level: matchedExperience
          ? String(matchedExperience.id ?? matchedExperience.value ?? prev.experience_level)
          : String(prev.experience_level || ''),
        investor_type: matchedInvestorType
          ? String(matchedInvestorType.value ?? prev.investor_type)
          : String(prev.investor_type || ''),
        investor_experience: String(prev.investor_experience || user?.investor_experience || user?.investment_experience || ''),
      };
    });
  }, [investorTypesData, experiencesData, sectorsData, user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCompanyLicenseChange = (file: File | null) => {
    setCompanyLicenseFile(file);
    if (!file) {
      setCompanyLicensePreview(user?.company_license_url || user?.company_license || '');
      return;
    }
    if (file.type.startsWith('image/')) {
      setCompanyLicensePreview(URL.createObjectURL(file));
    } else {
      setCompanyLicensePreview(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    if (!formData.first_name.trim()) {
      setFirstNameError(t('errors.firstNameRequired'));
      hasError = true;
    } else {
      setFirstNameError('');
    }
    if (!formData.last_name.trim()) {
      setLastNameError(t('errors.lastNameRequired'));
      hasError = true;
    } else {
      setLastNameError('');
    }
    if (hasError) return;
    
    const digits = formData.phone.replace(/\D/g, '');
    const lengths: Record<string, number> = {
      '965': 8, '966': 8, '971': 8, '974': 8, '973': 8, '968': 8, '20': 8, '962': 8
    };
    const expected = lengths[formData.country_code] || 8;
    if (digits.length !== expected) {
      setPhoneError(t('errors.invalidPhoneLength', { length: expected }) || `Must be ${expected} digits`);
      return;
    }
    setPhoneError('');
    
    const data = new FormData();
    data.append('first_name', formData.first_name);
    data.append('last_name', formData.last_name);
    data.append('country_code', formData.country_code.replace(/\D/g, ''));
    data.append('phone', digits);
    data.append('_method', 'PATCH'); // Laravel method spoofing

    if (profileImageFile) {
      data.append('image', profileImageFile);
    }

    if (user?.role === 'advertiser' && companyLicenseFile) {
      data.append('company_license', companyLicenseFile);
    }

    if (user?.role === 'investor') {
      if (formData.investor_type) data.append('investor_type', formData.investor_type);
      if (formData.capital) data.append('capital', formData.capital.toString());
      if (formData.available_capital) data.append('available_capital', formData.available_capital.toString());
      if (formData.preferred_sector_id) data.append('preferred_sector_id', formData.preferred_sector_id.toString());
      if (formData.investor_experience) data.append('investor_experience', formData.investor_experience);
      if (formData.experience_level !== '') {
        const experienceId = Number(formData.experience_level);
        if (Number.isFinite(experienceId)) data.append('experience_level', String(experienceId));
      }
      if (formData.previous_investments_count) data.append('previous_investments_count', formData.previous_investments_count.toString());
    }

    updateProfile.mutate(data, {
      onSuccess: async (response) => {
        if (response?.data) {
          queryClient.setQueryData(['profile'], response);
        }
        await queryClient.invalidateQueries({ queryKey: ['profile'] });
        await queryClient.invalidateQueries({ queryKey: ['profile-update-request-latest'] });
        await queryClient.invalidateQueries({ queryKey: ['notifications'] });
        onClose();
      },
      onError: () => {
        setFormData(initialFormData);
        setProfileImageFile(null);
        setProfileImagePreview(user?.image || '');
        setCompanyLicenseFile(null);
        setCompanyLicensePreview(user?.company_license_url || user?.company_license || '');
        setPhoneError('');
      }
    });
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">{t('auth.editProfile')}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 max-h-[calc(85dvh-5rem)] overflow-y-auto overscroll-contain pr-1">
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24 rounded-full border-2 border-brand-gold p-1 bg-black">
              <div 
                className="w-full h-full rounded-full overflow-hidden bg-brand-gray flex items-center justify-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {profileImagePreview ? (
                  <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="text-gray-500" size={32} />
                )}
              </div>
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-brand-gold text-black p-2 rounded-full border-4 border-black hover:bg-white transition"
              >
                <Camera size={16} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
          </div>

          {user?.role === 'advertiser' && (
            <div className="space-y-2 pt-2">
              <label className="text-sm text-gray-400 flex items-center gap-2">
                <FileText size={14} /> {t('auth.companyLicense')}
              </label>
              <FileUpload
                label={t('auth.companyLicense')}
                value={companyLicenseFile}
                onChange={handleCompanyLicenseChange}
                accept=".pdf,.jpg,.jpeg,.png,.webp"
              />
              {!companyLicenseFile && companyLicensePreview && typeof companyLicensePreview === 'string' && (
                <div className="text-xs text-gray-500 break-all flex items-center gap-2">
                  <Eye size={12} />
                  <span>{typeof companyLicensePreview === 'string' ? companyLicensePreview : ''}</span>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={`text-sm ${firstNameError ? 'text-red-500' : 'text-gray-400'}`}>{t('auth.firstName')}</label>
              <input type="text" value={formData.first_name} onChange={(e) => { setFormData({...formData, first_name: e.target.value}); if (firstNameError) setFirstNameError(''); }} className={`w-full bg-[#121212] border rounded-lg px-4 py-3 text-white focus:border-brand-gold outline-none ${firstNameError ? 'border-red-500' : 'border-white/15'}`} />
              {firstNameError && <p className="text-sm text-red-500">{firstNameError}</p>}
            </div>
            <div className="space-y-2">
              <label className={`text-sm ${lastNameError ? 'text-red-500' : 'text-gray-400'}`}>{t('auth.lastName')}</label>
              <input type="text" value={formData.last_name} onChange={(e) => { setFormData({...formData, last_name: e.target.value}); if (lastNameError) setLastNameError(''); }} className={`w-full bg-[#121212] border rounded-lg px-4 py-3 text-white focus:border-brand-gold outline-none ${lastNameError ? 'border-red-500' : 'border-white/15'}`} />
              {lastNameError && <p className="text-sm text-red-500">{lastNameError}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-2">
            <PhoneInputField
              value={formData.phone}
              onChange={(val) => setFormData({...formData, phone: val})}
              countryCodeValue={formData.country_code}
              onCountryCodeChange={(val) => setFormData({...formData, country_code: val})}
              error={phoneError}
            />
          </div>

          {user?.role === 'investor' && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-lg font-semibold text-white">{t('auth.investmentInfo')}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">{t('auth.investorCapital')}</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatNumberWithCommas(formData.capital)}
                    onChange={(e) => setFormData({...formData, capital: parseLimitedIntegerInput(e.target.value, MAX_MONEY_AMOUNT)})}
                    className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-3 text-white focus:border-brand-gold outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">{t('auth.availableCapital')}</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatNumberWithCommas(formData.available_capital)}
                    onChange={(e) => setFormData({...formData, available_capital: parseLimitedIntegerInput(e.target.value, MAX_MONEY_AMOUNT)})}
                    className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-3 text-white focus:border-brand-gold outline-none"
                  />
                </div>
              </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">{t('auth.investorSector')}</label>
                <select value={String(formData.preferred_sector_id || '')} onChange={(e) => setFormData({...formData, preferred_sector_id: e.target.value})} className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-3 text-white focus:border-brand-gold outline-none">
                  <option value="">{t('common.select')}</option>
                  {sectorsData?.data?.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
            </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">{t('auth.investorExperience')}</label>
                <select value={String(formData.investor_experience || '')} onChange={(e) => setFormData({...formData, investor_experience: e.target.value})} className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-3 text-white focus:border-brand-gold outline-none">
                  <option value="">{t('common.select')}</option>
                  {experiencesData?.data?.map((exp: any) => (
                    <option key={exp.value ?? exp.id} value={exp.value ?? exp.id}>{resolveLookupLabel(exp)}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">{t('auth.investorType')}</label>
                <select value={String(formData.investor_type || '')} onChange={(e) => setFormData({...formData, investor_type: e.target.value})} className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-3 text-white focus:border-brand-gold outline-none">
                  <option value="">{t('common.select')}</option>
                  {investorTypesData?.data?.map((t: any) => (
                    <option key={t.value} value={t.value}>{resolveLookupLabel(t)}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="space-y-2 opacity-50 cursor-not-allowed pt-4">
            <label className="text-sm text-gray-400 flex items-center gap-2">
              <Lock size={14} /> {t('auth.readOnlyField')}
            </label>
            <input type="text" disabled value={user?.email} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed" />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-white/10 text-white font-bold py-3 rounded-lg hover:bg-white/20 transition">{t('auth.cancel')}</button>
            <button type="submit" disabled={updateProfile.isPending} className="flex-1 flex justify-center items-center bg-brand-gold text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50">
              {updateProfile.isPending ? <Loader2 className="animate-spin w-5 h-5" /> : t('auth.saveChanges')}
            </button>
          </div>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
