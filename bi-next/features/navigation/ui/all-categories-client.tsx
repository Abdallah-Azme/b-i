'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { CATEGORIES } from '@/features/projects/services/project-api';
import { Project, Language } from '@/shared/types';
import { Link } from '@/i18n/routing';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface AllCategoriesClientProps {
  projects: Project[];
}

export const AllCategoriesClient: React.FC<AllCategoriesClientProps> = ({ projects }) => {
  const locale = useLocale() as Language;
  const t = useTranslations();
  const isAr = locale === 'ar';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
         <Link href="/" className="p-2 bg-brand-gray/20 rounded-full text-gray-400 hover:text-white hover:bg-brand-gray/50 transition">
            {isAr ? <ArrowRight size={24} /> : <ArrowLeft size={24} />}
         </Link>
         <h1 className="text-3xl font-bold text-white">{t('allCategories')}</h1>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.map((cat, idx) => {
            const count = projects.filter(p => p.category.en === cat.en && (p.status === 'published' || p.status === 'approved')).length;
            return (
              <Link 
                href={`/projects?cat=${cat.en}`} 
                key={idx} 
                className="group relative overflow-hidden rounded-xl aspect-square bg-brand-gray border border-white/5 hover:border-brand-gold/50 transition-all flex items-center justify-center p-4 text-center shadow-lg shadow-black/30"
              >
                <div className="relative z-10 flex flex-col items-center">
                  <span className="font-semibold text-gray-200 group-hover:text-white transition text-sm md:text-base leading-snug">
                    {cat[locale]}
                  </span>
                  <span className="text-xs text-brand-gold mt-2 font-bold font-sans">
                    ({count})
                  </span>
                </div>
                {/* Hover Effects matching React */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="absolute inset-0 bg-brand-gold/5 opacity-0 group-hover:opacity-100 transition duration-300"></div>
              </Link>
            );
          })}
      </div>
    </div>
  );
};
