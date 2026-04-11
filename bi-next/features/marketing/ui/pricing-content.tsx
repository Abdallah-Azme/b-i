'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { Money } from '@/shared/ui/money';
import { SUBSCRIPTION_PLANS } from '@/features/pricing/services/billing';
import { Language } from '@/shared/types';

export const PricingContent: React.FC = () => {
  const locale = useLocale() as Language;
  const t = useTranslations('pricing');
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">
          {t('heroTitle')}
        </h1>
        <p className="text-gray-400">
          {t('heroSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <div 
            key={plan.id} 
            className={`relative p-8 rounded-2xl border flex flex-col ${plan.isPopular ? 'bg-brand-gray border-brand-gold shadow-2xl shadow-brand-gold/10 transform md:-translate-y-4' : 'bg-brand-dark border-white/10'}`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-gold text-black text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                {t('mostPopular')}
              </div>
            )}

            <h3 className="text-xl font-bold mb-2 text-white">{plan.name[locale]}</h3>
            <div className="mb-6 flex items-baseline gap-1">
               <Money value={plan.price} className="text-4xl font-bold" />
               <span className="text-sm text-gray-400 ml-1">/ {t('perMonth')}</span>
            </div>

            <ul className="space-y-4 mb-8 grow">
              {plan.features[locale].map((feat: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <Check size={18} className="text-brand-gold shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <button 
              className={`w-full py-3 rounded-lg font-bold transition ${plan.isPopular ? 'bg-brand-gold text-black hover:bg-yellow-500' : 'bg-white/10 hover:bg-white/20 text-white'}`}
            >
              {t('getStarted')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
