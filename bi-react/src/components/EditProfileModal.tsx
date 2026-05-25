import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Lock, Loader2 } from 'lucide-react';
import { useUpdateProfile } from '../features/auth/hooks/useAuth';
import { useInvestorTypes, useInvestorExperiences, usePreferredSectors } from '../features/general/hooks/useGeneralLookups';
import { PhoneInputField } from '../features/auth/ui/PhoneInputField';
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
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>(user?.image || '');
  const [phoneError, setPhoneError] = useState<string>('');

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
    
    // Investor specific
    investor_type: user?.investor_type || '',
    capital: user?.capital || '',
    available_capital: user?.available_capital || '',
    preferred_sector_id: user?.preferred_sector_id || '',
    experience_level: user?.experience_level || '',
    previous_investments_count: user?.previous_investments_count || '',
  };

  const [formData, setFormData] = useState(initialFormData);

  const { data: investorTypesData } = useInvestorTypes();
  const { data: experiencesData } = useInvestorExperiences();
  const { data: sectorsData } = usePreferredSectors();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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

    if (user?.role === 'investor') {
      if (formData.investor_type) data.append('investor_type', formData.investor_type);
      if (formData.capital) data.append('capital', formData.capital.toString());
      if (formData.available_capital) data.append('available_capital', formData.available_capital.toString());
      if (formData.preferred_sector_id) data.append('preferred_sector_id', formData.preferred_sector_id.toString());
      // experience_level must be sent as a number; skip if empty/null
      const expLevel = Number(formData.experience_level);
      if (formData.experience_level !== '' && !isNaN(expLevel)) data.append('experience_level', expLevel.toString());
      if (formData.previous_investments_count) data.append('previous_investments_count', formData.previous_investments_count.toString());
    }

    updateProfile.mutate(data, {
      onSuccess: () => {
        onClose();
      },
      onError: () => {
        setFormData(initialFormData);
        setProfileImageFile(null);
        setProfileImagePreview(user?.image || '');
        setPhoneError('');
      }
    });
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[85dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">{t('auth.editProfile')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">{t('auth.firstName')}</label>
              <input type="text" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-3 text-white focus:border-brand-gold outline-none" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">{t('auth.lastName')}</label>
              <input type="text" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-3 text-white focus:border-brand-gold outline-none" required />
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
                  <input type="number" value={formData.capital} onChange={(e) => setFormData({...formData, capital: e.target.value})} className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-3 text-white focus:border-brand-gold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">{t('auth.availableCapital')}</label>
                  <input type="number" value={formData.available_capital} onChange={(e) => setFormData({...formData, available_capital: e.target.value})} className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-3 text-white focus:border-brand-gold outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">{t('auth.investorSector')}</label>
                <select value={formData.preferred_sector_id} onChange={(e) => setFormData({...formData, preferred_sector_id: e.target.value})} className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-3 text-white focus:border-brand-gold outline-none">
                  <option value="">{t('common.select')}</option>
                  {sectorsData?.data?.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">{t('auth.investorExperience')}</label>
                <select value={formData.experience_level} onChange={(e) => setFormData({...formData, experience_level: e.target.value})} className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-3 text-white focus:border-brand-gold outline-none">
                  <option value="">{t('common.select')}</option>
                  {experiencesData?.data?.map((exp: any) => (
                    <option key={exp.id} value={exp.id}>{exp.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">{t('auth.investorType')}</label>
                <select value={formData.investor_type} onChange={(e) => setFormData({...formData, investor_type: e.target.value})} className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-3 text-white focus:border-brand-gold outline-none">
                  <option value="">{t('common.select')}</option>
                  {investorTypesData?.data?.map((t: any) => (
                    <option key={t.value} value={t.value}>{t.name}</option>
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
      </DialogContent>
    </Dialog>
  );
};
