import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../context/Store';
import { Link } from '@tanstack/react-router';
import { User as UserIcon, Bell, Heart, Globe2, Info, Mail, FileText, Shield, Lock, LogOut } from 'lucide-react';
import { useWhoWeAre } from '../features/general/hooks/useGeneralLookups';
import { useAuth } from '../features/auth/hooks/useAuth';

export const More: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { toggleLanguage } = useStore();
  const { isAuthenticated, user: apiUser, logout: apiLogout } = useAuth();
  const { data: whoWeAreData } = useWhoWeAre();
  const contactEmail = whoWeAreData?.data?.contact_email || 'support@bi.com';
  const displayName = apiUser?.name ?? apiUser?.display_name ?? '';
  const displayEmail = apiUser?.email ?? '';

  return (
    <div className="max-w-md mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-8 text-white">{t('tabs.more')}</h1>

        <div className="space-y-2">
            {isAuthenticated && (
              <div className="mb-6 bg-brand-gray/50 p-4 rounded-xl border border-white/5 flex items-center gap-4">
                 <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center text-brand-gold">
                    <UserIcon size={24} />
                 </div>
                 <div>
                    <h3 className="font-bold">{displayName}</h3>
                    <p className="text-xs text-gray-400">{displayEmail}</p>
                 </div>
              </div>
            )}

            <Link to="/notifications" className="w-full flex items-center gap-4 p-4 bg-brand-gray/20 rounded-xl hover:bg-brand-gray/40 transition">
              <Bell className="text-brand-gold" size={20} />
              <span className="font-medium">{t('moreMenu.notifications')}</span>
            </Link>

            <Link to="/favorites" className="w-full flex items-center gap-4 p-4 bg-brand-gray/20 rounded-xl hover:bg-brand-gray/40 transition">
              <Heart className="text-brand-gold" size={20} />
              <span className="font-medium">{t('moreMenu.favorites')}</span>
            </Link>

            <button onClick={toggleLanguage} className="w-full flex items-center gap-4 p-4 bg-brand-gray/20 rounded-xl hover:bg-brand-gray/40 transition">
              <Globe2 className="text-brand-gold" size={20} />
              <div className="flex-1 text-left rtl:text-right flex justify-between items-center">
                 <span className="font-medium">{t('moreMenu.language')}</span>
                 <span className="text-xs text-gray-400 bg-black/50 px-2 py-1 rounded">{t('common.currentLanguage')}</span>
              </div>
            </button>

            <div className="h-px bg-white/10 my-4"></div>

            <Link to="/about" className="w-full flex items-center gap-4 p-4 hover:bg-brand-gray/20 rounded-xl transition">
              <Info className="text-gray-400" size={20} />
              <span>{t('moreMenu.about')}</span>
            </Link>
            <a href={`mailto:${contactEmail}`} className="w-full flex items-center gap-4 p-4 hover:bg-brand-gray/20 rounded-xl transition">
              <Mail className="text-gray-400" size={20} />
              <span>{t('moreMenu.contact')}</span>
            </a>
            <Link to="/terms-of-use" className="w-full flex items-center gap-4 p-4 hover:bg-brand-gray/20 rounded-xl transition">
              <FileText className="text-gray-400" size={20} />
              <span>{t('moreMenu.terms')}</span>
            </Link>
            <Link to="/privacy-policy" className="w-full flex items-center gap-4 p-4 hover:bg-brand-gray/20 rounded-xl transition">
              <Shield className="text-gray-400" size={20} />
              <span>{t('moreMenu.privacy')}</span>
            </Link>

            {isAuthenticated && (
              <>
                <div className="h-px bg-white/10 my-4"></div>
                <Link to="/dashboard" search={{ tab: 'settings' }} className="w-full flex items-center gap-4 p-4 hover:bg-brand-gray/20 rounded-xl transition">
                  <Lock className="text-gray-400" size={20} />
                  <span>{t('moreMenu.password')}</span>
                </Link>
                <button onClick={() => { apiLogout(); }} className="w-full flex items-center gap-4 p-4 text-red-400 hover:bg-red-500/10 rounded-xl transition mt-2">
                  <LogOut size={20} />
                  <span>{t('moreMenu.logout')}</span>
                </button>
              </>
            )}
        </div>
        
        <div className="p-4 border-t border-white/10 text-center mt-6">
            <p className="text-xs text-gray-500">App Version 1.0.3</p>
        </div>
    </div>
  );
};
