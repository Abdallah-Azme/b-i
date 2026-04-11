
import React from 'react';
import { useStore } from '../context/Store';
import { TRANSLATIONS, SUBSCRIPTION_PLANS } from '../constants';
import { Check } from 'lucide-react';
import { Money } from '../components/Money';

export const Pricing: React.FC = () => {
  const { lang, login } = useStore();
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">{lang === 'en' ? 'Choose Your Access Level' : 'اختر مستوى الوصول'}</h1>
        <p className="text-gray-400">
          {lang === 'en' 
            ? 'Unlock verified investment opportunities with a plan that suits your portfolio goals.' 
            : 'افتح فرص الاستثمار الموثقة بخطة تناسب أهداف محفظتك.'}
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
                {lang === 'en' ? 'Most Popular' : 'الأكثر شيوعاً'}
              </div>
            )}

            <h3 className="text-xl font-bold mb-2 text-white">{plan.name[lang]}</h3>
            <div className="mb-6 flex items-baseline gap-1">
               <Money value={plan.price} className="text-4xl font-bold" />
               <span className="text-sm text-gray-400 ml-1">/ {lang === 'en' ? 'mo' : 'شهر'}</span>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              {plan.features[lang].map((feat, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <Check size={18} className="text-brand-gold flex-shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => login('investor')} // Mock subscription triggering login
              className={`w-full py-3 rounded-lg font-bold transition ${plan.isPopular ? 'bg-brand-gold text-black hover:bg-yellow-500' : 'bg-white/10 hover:bg-white/20 text-white'}`}
            >
              {lang === 'en' ? 'Get Started' : 'ابدأ الآن'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
