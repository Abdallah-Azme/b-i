'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Language } from '@/shared/types';

export const VerifyEmailContent: React.FC = () => {
  const locale = useLocale() as Language;
  const t = useTranslations('auth');
  const isAr = locale === 'ar';

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
        <div className="w-24 h-24 bg-brand-gray rounded-full flex items-center justify-center mx-auto mb-6 relative border border-white/5">
          <Mail size={40} className="text-brand-gold" />
          <div className="absolute top-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-black"></div>
        </div>
        
        <h1 className="text-3xl font-bold text-white">{t('verifyTitle')}</h1>
        <p className="text-gray-400 leading-relaxed">
          {t('verifyDesc')}
        </p>
        
        <div className="pt-8">
           <Link href="/login" className="inline-flex items-center gap-2 text-brand-gold hover:text-white font-bold transition">
             {isAr ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
             {t('backToLogin')}
           </Link>
        </div>
      </div>
    </div>
  );
};
