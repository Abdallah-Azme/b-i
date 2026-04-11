'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Briefcase, TrendingUp } from 'lucide-react';

export const LoginTypeClient: React.FC = () => {
  const router = useRouter();
  const t = useTranslations('auth');

  const handleSelection = (role: 'investor' | 'advertiser') => {
    router.push(`/login?role=${role}`);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            {t('loginTitle')}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {t('selectType')}
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <button 
            onClick={() => handleSelection('investor')}
            className="group relative w-full flex items-center p-4 border border-white/10 rounded-xl hover:bg-brand-gray transition hover:border-brand-gold/50"
          >
            <div className="shrink-0 h-12 w-12 bg-brand-gold/10 rounded-full flex items-center justify-center text-brand-gold">
               <TrendingUp size={24} />
            </div>
            <div className="ml-4 rtl:mr-4 rtl:ml-0 text-left rtl:text-right flex-1">
              <h3 className="text-lg font-medium text-white group-hover:text-brand-gold transition">
                {t('investor')}
              </h3>
              <p className="text-sm text-gray-500">
                {t('investorDesc')}
              </p>
            </div>
          </button>

          <button 
            onClick={() => handleSelection('advertiser')}
            className="group relative w-full flex items-center p-4 border border-white/10 rounded-xl hover:bg-brand-gray transition hover:border-brand-gold/50"
          >
            <div className="shrink-0 h-12 w-12 bg-brand-gold/10 rounded-full flex items-center justify-center text-brand-gold">
               <Briefcase size={24} />
            </div>
            <div className="ml-4 rtl:mr-4 rtl:ml-0 text-left rtl:text-right flex-1">
              <h3 className="text-lg font-medium text-white group-hover:text-brand-gold transition">
                {t('advertiser')}
              </h3>
              <p className="text-sm text-gray-500">
                {t('advertiserDesc')}
              </p>
            </div>
          </button>
        </div>

        <div className="text-center mt-6">
          <button onClick={() => router.push('/register-type')} className="text-sm text-brand-gold hover:text-white transition font-medium">
            {t('noAccount')}
          </button>
        </div>
      </div>
    </div>
  );
};
