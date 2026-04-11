
import React from 'react';
import { useStore } from '../context/Store';
import { TRANSLATIONS, CATEGORIES } from '../constants';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const AllCategories: React.FC = () => {
  const { lang, projects } = useStore();
  const t = TRANSLATIONS[lang];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
         <Link to="/" className="p-2 bg-brand-gray/20 rounded-full text-gray-400 hover:text-white hover:bg-brand-gray/50 transition">
            {lang === 'ar' ? <ArrowRight size={24} /> : <ArrowLeft size={24} />}
         </Link>
         <h1 className="text-3xl font-bold text-white">{t.allCategories}</h1>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.map((cat, idx) => {
            const count = projects.filter(p => p.category.en === cat.en && p.status === 'active').length;
            return (
              <Link 
                to={`/projects?cat=${cat.en}`} 
                key={idx} 
                className="group relative overflow-hidden rounded-xl aspect-square bg-brand-gray border border-white/5 hover:border-brand-gold/50 transition flex items-center justify-center p-4 text-center shadow-lg shadow-black/30"
              >
                <div className="relative z-10 flex flex-col items-center">
                  <span className="font-semibold text-gray-200 group-hover:text-white transition text-sm md:text-base leading-snug">
                    {cat[lang]}
                  </span>
                  <span className="text-xs text-brand-gold mt-2 font-bold font-sans">
                    ({count})
                  </span>
                </div>
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="absolute inset-0 bg-brand-gold/5 opacity-0 group-hover:opacity-100 transition duration-300"></div>
              </Link>
            );
          })}
      </div>
    </div>
  );
};
