import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { Briefcase, TrendingUp } from 'lucide-react';

export const RegisterType: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSelection = (role: 'investor' | 'advertiser') => {
    // Navigate to signup with the selected role
    navigate({ to: '/signup', search: { role } });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            {t('auth.registerTitle')}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {t('auth.selectType')}
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <button 
            onClick={() => handleSelection('investor')}
            className="group relative w-full flex items-center p-4 border border-white/10 rounded-xl hover:bg-brand-gray transition hover:border-brand-gold/50"
          >
            <div className="flex-shrink-0 h-12 w-12 bg-brand-gold/10 rounded-full flex items-center justify-center text-brand-gold">
               <TrendingUp size={24} />
            </div>
            <div className="ml-4 rtl:mr-4 rtl:ml-0 text-left rtl:text-right flex-1">
              <h3 className="text-lg font-medium text-white group-hover:text-brand-gold transition">
                {t('auth.investor')}
              </h3>
              <p className="text-sm text-gray-500">
                {t('auth.investorDesc')}
              </p>
            </div>
          </button>

          <button 
            onClick={() => handleSelection('advertiser')}
            className="group relative w-full flex items-center p-4 border border-white/10 rounded-xl hover:bg-brand-gray transition hover:border-brand-gold/50"
          >
            <div className="flex-shrink-0 h-12 w-12 bg-brand-gold/10 rounded-full flex items-center justify-center text-brand-gold">
               <Briefcase size={24} />
            </div>
            <div className="ml-4 rtl:mr-4 rtl:ml-0 text-left rtl:text-right flex-1">
              <h3 className="text-lg font-medium text-white group-hover:text-brand-gold transition">
                {t('auth.advertiser')}
              </h3>
              <p className="text-sm text-gray-500">
                {t('auth.advertiserDesc')}
              </p>
            </div>
          </button>
        </div>

        <div className="text-center mt-6">
          <button onClick={() => navigate({ to: '/login-type' })} className="text-sm text-brand-gold hover:text-white transition font-medium">
            {t('auth.alreadyHaveAccount')}
          </button>
        </div>
      </div>
    </div>
  );
};
