import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCategories } from '../features/general/hooks/useCategories';

export const AllCategories: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { data, isLoading } = useCategories({ per_page: 100 });
  const categories = data?.data?.categories ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
         <Link to="/" className="p-2 bg-brand-gray/20 rounded-full text-gray-400 hover:text-white hover:bg-brand-gray/50 transition">
            {lang === 'ar' ? <ArrowRight size={24} /> : <ArrowLeft size={24} />}
         </Link>
         <h1 className="text-3xl font-bold text-white">{t('allCategories')}</h1>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-white/5 animate-pulse" />
            ))
          ) : (
            categories.map((cat) => (
              <Link 
                to="/projects" 
                search={{ cat: cat.id.toString() }}
                key={cat.id} 
                className="group relative overflow-hidden rounded-xl aspect-square bg-brand-gray border border-white/5 hover:border-brand-gold/50 transition flex items-center justify-center p-4 text-center shadow-lg shadow-black/30"
              >
                <div className="relative z-10 flex flex-col items-center">
                  <span className="font-semibold text-gray-200 group-hover:text-white transition text-sm md:text-base leading-snug">
                    {cat.name}
                  </span>
                  <span className="text-xs text-brand-gold mt-2 font-bold font-sans">
                    ({cat.opportunities_count})
                  </span>
                </div>
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="absolute inset-0 bg-brand-gold/5 opacity-0 group-hover:opacity-100 transition duration-300"></div>
              </Link>
            ))
          )}
      </div>
    </div>
  );
};
