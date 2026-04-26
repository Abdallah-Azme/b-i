
import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePackages } from '../features/general/hooks/usePackages';
import { Check } from 'lucide-react';
import { Money } from '../components/Money';

export const Pricing: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading } = usePackages();
  const packages = data?.data?.packages ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">
          {data?.data?.pageSettings?.title ?? t('pricing.title')}
        </h1>
        <p className="text-gray-400">
          {data?.data?.pageSettings?.description ?? t('pricing.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-8 rounded-2xl border border-white/10 bg-white/5 animate-pulse flex flex-col gap-4">
                <div className="h-6 w-32 rounded bg-white/10" />
                <div className="h-10 w-24 rounded bg-white/10" />
                <div className="space-y-3 flex-1">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-4 rounded bg-white/10" />
                  ))}
                </div>
                <div className="h-10 rounded bg-white/10" />
              </div>
            ))
          : packages.map((plan, idx) => {
              const isMiddle = idx === 1;
              return (
                <div
                  key={plan.id}
                  className={`relative p-8 rounded-2xl border flex flex-col ${
                    isMiddle
                      ? 'bg-brand-gray border-brand-gold shadow-2xl shadow-brand-gold/10 transform md:-translate-y-4'
                      : 'bg-brand-dark border-white/10'
                  }`}
                >
                  {isMiddle && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-gold text-black text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                      {t('pricing.popular')}
                    </div>
                  )}

                  <h3 className="text-xl font-bold mb-2 text-white">{plan.name}</h3>
                  <div className="mb-6 flex items-baseline gap-1">
                    <Money value={Number(plan.price_monthly)} className="text-4xl font-bold" />
                    <span className="text-sm text-gray-400 ml-1">/ {t('pricing.month')}</span>
                  </div>

                  {/* API returns HTML description */}
                  <div
                    className="text-sm text-gray-300 mb-8 flex-grow prose prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: plan.description }}
                  />

                  <button
                    disabled={plan.is_subscribed || !plan.can_register}
                    className={`w-full py-3 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed ${
                      isMiddle
                        ? 'bg-brand-gold text-black hover:bg-yellow-500'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {plan.is_subscribed ? t('pricing.subscribed') : t('pricing.getStarted')}
                  </button>
                </div>
              );
            })}
      </div>
    </div>
  );
};
