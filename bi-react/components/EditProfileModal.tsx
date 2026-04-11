import React, { useState } from 'react';
import { X, Save, Lock, Camera } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface EditProfileModalProps {
  user: any;
  lang: string;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, lang, onClose, onSave }) => {
  const t = TRANSLATIONS[lang].auth;
  const [formData, setFormData] = useState({
    name: user.name || user.displayName || '',
    bio: user.bio || '',
    tagline: user.tagline || '',
    profileImage: user.companyLicenseUrl || '',
    investorCapital: user.investorCapital || '',
    investorSector: user.investorSector || '',
    investorExperience: user.investorExperience || '',
    investorType: user.investorType || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      displayName: formData.name // Compatibility
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-brand-gray border border-white/10 rounded-2xl w-full max-w-md p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">{t.editProfile}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24 rounded-full border-2 border-brand-gold p-1 bg-black">
              <div className="w-full h-full rounded-full overflow-hidden bg-brand-gray flex items-center justify-center">
                <Camera className="text-gray-500" size={32} />
              </div>
              <button type="button" className="absolute bottom-0 right-0 bg-brand-gold text-black p-2 rounded-full border-4 border-black hover:bg-white transition">
                <Camera size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">{t.displayName}</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">{t.bio}</label>
            <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none" rows={3} />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">{t.tagline}</label>
            <input type="text" value={formData.tagline} onChange={(e) => setFormData({...formData, tagline: e.target.value})} className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none" />
          </div>

          {user.role === 'investor' && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-lg font-semibold text-white">{lang === 'ar' ? 'المعلومات الاستثمارية' : 'Investment Information'}</h3>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-400">{t.investorCapital}</label>
                <input type="number" value={formData.investorCapital} onChange={(e) => setFormData({...formData, investorCapital: Number(e.target.value)})} className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">{t.investorSector}</label>
                <input type="text" value={formData.investorSector} onChange={(e) => setFormData({...formData, investorSector: e.target.value})} className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">{t.investorExperience}</label>
                <select value={formData.investorExperience} onChange={(e) => setFormData({...formData, investorExperience: e.target.value})} className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none">
                  <option value="beginner">{t.expBeginner}</option>
                  <option value="intermediate">{t.expIntermediate}</option>
                  <option value="expert">{t.expExpert}</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">{t.investorType}</label>
                <select value={formData.investorType} onChange={(e) => setFormData({...formData, investorType: e.target.value})} className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none">
                  <option value="angel">{t.angelType}</option>
                  <option value="company">{t.companyType}</option>
                  <option value="crowdfunding">{t.crowdType}</option>
                </select>
              </div>
            </div>
          )}

          <div className="space-y-2 opacity-50 cursor-not-allowed pt-4">
            <label className="text-sm text-gray-400 flex items-center gap-2">
              <Lock size={14} /> {t.readOnlyField}
            </label>
            <input type="text" disabled value={user.email} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed" />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-white/10 text-white font-bold py-3 rounded-lg hover:bg-white/20 transition">{t.cancel}</button>
            <button type="submit" className="flex-1 bg-brand-gold text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition">{t.saveChanges}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
