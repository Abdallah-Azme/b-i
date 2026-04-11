'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Shield, Layers, Lock, DollarSign, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Language } from '@/shared/types';

interface Section {
  title: string;
  body: string;
}

interface AboutContentProps {
  sections: Section[];
}

export const AboutContent: React.FC<AboutContentProps> = ({ sections }) => {
  const locale = useLocale() as Language;
  const t = useTranslations('aboutPage');

  const icons = [Shield, Layers, Lock, DollarSign];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="bg-brand-dark py-20 border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-brand-gold/10 via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-brand-gold">{t('title')}</h1>
          <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
            {t('intro')}
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {sections.map((section: Section, index: number) => {
            const Icon = icons[index % icons.length];
            return (
              <div key={index} className="bg-brand-gray/30 border border-white/5 p-8 rounded-2xl hover:border-brand-gold/30 transition duration-300">
                <div className="w-12 h-12 bg-brand-gold/10 rounded-xl flex items-center justify-center text-brand-gold mb-6">
                  <Icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{section.title}</h3>
                <p className="text-gray-400 leading-relaxed text-lg">
                  {section.body}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Link 
            href="/projects" 
            className="inline-flex items-center gap-2 bg-brand-gold text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-500 transition shadow-lg shadow-brand-gold/20"
          >
            {t('cta')}
            {locale === 'ar' ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
          </Link>
        </div>
      </section>
    </div>
  );
};
