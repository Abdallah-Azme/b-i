'use client';

import React from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Link, useRouter } from '@/i18n/routing';
import { User as UserIcon, Bell, Heart, Globe2, Info, Mail, FileText, Shield, LogOut, Lock } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Language } from '@/shared/types';

export const MoreMenuClient: React.FC = () => {
  const { user, logout } = useAuth();
  const locale = useLocale() as Language;
  const router = useRouter();
  const t = useTranslations();

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    router.replace('/more', { locale: nextLocale });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 animate-fade-in relative pb-32">
        <h1 className="text-3xl font-bold mb-10 text-white tracking-tighter">{t('tabs.more')}</h1>

        <div className="space-y-4">
            {user && (
              <div className="mb-10 bg-brand-gray/30 p-4 rounded-xl border border-white/5 flex items-center gap-4 shadow-lg relative overflow-hidden group">
                 <div className="absolute inset-0 bg-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="w-12 h-12 bg-brand-gold/10 rounded-xl flex items-center justify-center text-brand-gold border border-brand-gold/20 shadow-inner group-hover:rotate-12 transition-transform">
                    <UserIcon size={24} strokeWidth={2.5} />
                 </div>
                 <div className="relative z-10">
                    <h3 className="font-bold text-lg text-white tracking-tight">{user.name}</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1 opacity-60 font-sans">{user.email}</p>
                 </div>
              </div>
            )}

            <Link href="/notifications" className="w-full flex items-center gap-6 p-4 bg-brand-gray/20 rounded-xl border border-white/5 hover:bg-brand-gray/40 transition-all hover:border-brand-gold/30 shadow-lg">
              <Bell className="text-brand-gold" size={24} />
              <span className="font-bold text-lg tracking-tight">{t('moreMenu.notifications')}</span>
            </Link>

            <Link href="/favorites" className="w-full flex items-center gap-6 p-4 bg-brand-gray/20 rounded-xl border border-white/5 hover:bg-brand-gray/40 transition-all hover:border-brand-gold/30 shadow-lg">
              <Heart className="text-brand-gold" size={24} />
              <span className="font-bold text-lg tracking-tight">{t('moreMenu.favorites')}</span>
            </Link>

            <button onClick={toggleLanguage} className="w-full flex items-center gap-6 p-4 bg-brand-gray/20 rounded-xl border border-white/5 hover:bg-brand-gray/40 transition-all hover:border-brand-gold/30 shadow-lg">
              <Globe2 className="text-brand-gold" size={24} />
              <div className="flex-1 text-left rtl:text-right flex justify-between items-center">
                 <span className="font-bold text-lg tracking-tight">{t('moreMenu.language')}</span>
                 <span className="text-[10px] font-bold text-gray-400">
                    {locale === 'en' ? 'English' : 'العربية'}
                 </span>
              </div>
            </button>

            <div className="h-px bg-white/10 my-8"></div>

            <Link href="/about" className="w-full flex items-center gap-6 p-4 hover:bg-brand-gray/20 rounded-xl transition-all group">
              <Info className="text-gray-600 group-hover:text-white transition-colors" size={24} />
              <span className="font-bold text-gray-400 group-hover:text-white transition-colors">{t('moreMenu.about')}</span>
            </Link>
            <a href="mailto:support@bi.com" className="w-full flex items-center gap-6 p-4 hover:bg-brand-gray/20 rounded-xl transition-all group">
              <Mail className="text-gray-400 group-hover:text-white transition-colors" size={24} />
              <span className="font-bold text-gray-400 group-hover:text-white transition-colors">{t('moreMenu.contact')}</span>
            </a>
            <Link href="/terms-of-use" className="w-full flex items-center gap-6 p-4 hover:bg-brand-gray/20 rounded-xl transition-all group">
              <FileText className="text-gray-400 group-hover:text-white transition-colors" size={24} />
              <span className="font-bold text-gray-400 group-hover:text-white transition-colors">{t('moreMenu.terms')}</span>
            </Link>
            <Link href="/privacy-policy" className="w-full flex items-center gap-6 p-4 hover:bg-brand-gray/20 rounded-xl transition-all group">
              <Shield className="text-gray-400 group-hover:text-white transition-colors" size={24} />
              <span className="font-bold text-gray-400 group-hover:text-white transition-colors">{t('moreMenu.privacy')}</span>
            </Link>

            {user && (
              <>
                <button className="w-full flex items-center gap-6 p-4 hover:bg-brand-gray/20 rounded-xl transition-all group">
                  <Lock size={24} className="text-gray-400 group-hover:text-white transition-colors" />
                  <span className="font-bold text-gray-400 group-hover:text-white transition-colors">{locale === 'en' ? 'Change Password' : 'تغيير كلمة المرور'}</span>
                </button>
                <div className="h-px bg-white/10 my-8"></div>
                <button onClick={() => { logout(); router.push('/'); }} className="w-full flex items-center gap-6 p-4 text-red-500 hover:bg-red-500/10 rounded-xl transition-all group">
                  <LogOut size={24} className="group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-lg tracking-tight">{t('moreMenu.logout')}</span>
                </button>
              </>
            )}
        </div>
        
        <div className="p-8 text-center mt-12 bg-black/10 rounded-[3rem] border border-white/5 opacity-50">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] font-sans">App Version 1.0.3</p>
        </div>
    </div>
  );
};
