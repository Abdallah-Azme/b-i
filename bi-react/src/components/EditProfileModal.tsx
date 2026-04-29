import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Camera, Lock, Loader2 } from 'lucide-react';
import { useUpdateProfile } from '../features/auth/hooks/useAuth';
import { useInvestorTypes, useInvestorExperiences, usePreferredSectors } from '../features/general/hooks/useGeneralLookups';

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

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    country_code: user?.country_code || '',
    phone: user?.phone || '',
    
    // Investor specific
    investor_type: user?.investor_type || '',
    capital: user?.capital || '',
    available_capital: user?.available_capital || '',
    preferred_sector_id: user?.preferred_sector_id || '',
    experience_level: user?.experience_level || '',
    previous_investments_count: user?.previous_investments_count || '',
  });

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
    if (digits.length < 8 || digits.length > 16) {
      setPhoneError(t('errors.invalidPhone') || 'Invalid phone length');
      return;
    }
    setPhoneError('');
    
    const data = new FormData();
    data.append('first_name', formData.first_name);
    data.append('last_name', formData.last_name);
    data.append('country_code', formData.country_code);
    data.append('phone', formData.phone);
    data.append('_method', 'PATCH'); // Laravel method spoofing

    if (profileImageFile) {
      data.append('image', profileImageFile);
    }

    if (user?.role === 'investor') {
      if (formData.investor_type) data.append('investor_type', formData.investor_type);
      if (formData.capital) data.append('capital', formData.capital.toString());
      if (formData.available_capital) data.append('available_capital', formData.available_capital.toString());
      if (formData.preferred_sector_id) data.append('preferred_sector_id', formData.preferred_sector_id.toString());
      if (formData.experience_level) data.append('experience_level', formData.experience_level.toString());
      if (formData.previous_investments_count) data.append('previous_investments_count', formData.previous_investments_count.toString());
    }

    updateProfile.mutate(data, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-brand-gray border border-white/10 rounded-2xl w-full max-w-md p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">{t('auth.editProfile')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">{t('auth.firstName')}</label>
              <input type="text" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-3 text-white focus:border-brand-gold outline-none" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">{t('auth.lastName')}</label>
              <input type="text" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-3 text-white focus:border-brand-gold outline-none" required />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">{t('auth.countryCode')}</label>
              <input type="text" value={formData.country_code} onChange={(e) => setFormData({...formData, country_code: e.target.value})} className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-3 text-white focus:border-brand-gold outline-none" placeholder="965" required />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm text-gray-400">{t('auth.phone')}</label>
              <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={`w-full bg-[#121212] border ${phoneError ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold outline-none`} required />
              {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
            </div>
          </div>

          {user?.role === 'investor' && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-lg font-semibold text-white">{t('auth.investmentInfo')}</h3>
              
              <div className="grid grid-cols-2 gap-4">
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
                    <option key={t.id} value={t.type}>{t.name}</option>
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
    </div>
  );
};
