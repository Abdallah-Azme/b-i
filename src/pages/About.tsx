import React from 'react';
import { useStore } from '../hooks/useStore';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { WhoWeAreContent } from '../features/general/ui/WhoWeAreContent';

export const About: React.FC = () => {
  const { lang } = useStore();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="bg-brand-dark py-20 border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-gold/10 via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-gold/10 rounded-2xl mb-6 text-brand-gold">
            <Info size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">{t('aboutPage.title')}</h1>
          <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
            {t('aboutPage.intro')}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <WhoWeAreContent />

      {/* CTA Section */}
      <div className="max-w-5xl mx-auto px-4 pb-20 text-center">
        <Link 
          to="/projects" 
          className="inline-flex items-center gap-2 bg-brand-gold text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-500 transition shadow-lg shadow-brand-gold/20"
        >
          {t('aboutPage.cta')}
          {lang === 'ar' ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
        </Link>
      </div>
    </div>
  );
};
