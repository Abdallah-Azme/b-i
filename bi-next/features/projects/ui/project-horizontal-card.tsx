'use client';

import React from 'react';
import { Project, Language } from '@/shared/types';
import { Money } from '@/shared/ui/money';
import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { Lock, Unlock, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import Image from 'next/image';


interface ProjectHorizontalCardProps {
  project: Project;
}

export const ProjectHorizontalCard: React.FC<ProjectHorizontalCardProps> = ({ project }) => {
  const locale = useLocale() as Language;
  const { user, toggleFavorite } = useAuth();
  const unlocked = user?.unlockedProjects?.includes(project.id) || false;
  const isFavorite = user?.favorites.includes(project.id);
  
  const tCommon = useTranslations('common');
  const tFilters = useTranslations('filters');

  const FALLBACK_IMAGE = "https://b3businessbrokers.com/wp-content/uploads/2024/05/AdobeStock_157565392-min.jpeg";

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(project.id);
  };

  return (
    <div className="bg-brand-gray/50 hover:bg-brand-gray border border-white/5 hover:border-brand-gold/30 rounded-xl overflow-hidden transition-all group relative">
      <div className="flex flex-col md:flex-row">
        {/* Thumbnail Image */}
        <div className="w-full md:w-1/3 h-48 md:h-auto relative overflow-hidden">
          <Image 
            src={project.image || FALLBACK_IMAGE} 
            alt={project.name[locale]} 
            fill
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
          />
          
          <div className={`absolute top-0 p-3 flex items-center gap-2 ${locale === 'ar' ? 'left-0 flex-row-reverse' : 'right-0'}`}>
            <button 
                onClick={handleFavorite}
                className={`p-1.5 rounded-full backdrop-blur-md border border-white/10 transition-all ${isFavorite ? 'bg-brand-gold text-black border-brand-gold' : 'bg-black/60 text-white hover:bg-black/80'}`}
            >
                <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
            </button>

            {unlocked ? (
              <span className="flex items-center gap-1 text-black text-[10px] font-bold uppercase tracking-wider bg-green-400 px-2 py-1 rounded">
                <Unlock size={10} /> {tCommon('unlocked')}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-white text-[10px] font-bold uppercase tracking-wider bg-black/60 px-2 py-1 rounded backdrop-blur-md">
                <Lock size={10} /> {tCommon('locked')}
              </span>
            )}
          </div>
        </div>


        {/* Content */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-brand-gold text-xs font-bold uppercase tracking-widest block">{project.category[locale]}</span>
              <span className="w-1 h-1 rounded-full bg-gray-600"></span>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-widest block">
                {project.listingPurpose === 'sale' ? tFilters('forSale') : tFilters('forInvestment')}
              </span>
            </div>
            
            <h3 className="text-xl font-bold mb-2 group-hover:text-white text-gray-100">{project.name[locale]}</h3>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
              <span className="bg-black/20 px-3 py-1 rounded-full border border-white/5">{tCommon('price')}: <Money value={project.askingPrice} className="text-white font-sans" /></span>
              <span className="bg-black/20 px-3 py-1 rounded-full border border-white/5">{tCommon('share')}: <span className="text-white font-sans">{project.shareOffered}%</span></span>
            </div>
            <p className="text-gray-400 text-sm max-w-xl line-clamp-2">{project.descriptionShort[locale]}</p>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <span className="text-xs text-gray-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-gold"></span> {project.location[locale]}</span>
            <Link 
              href={`/projects/${project.id}`} 
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition text-sm ${unlocked ? 'bg-brand-white text-black hover:bg-gray-200' : 'bg-brand-gold text-black hover:bg-yellow-500'}`}
            >
              {locale === 'en' ? 'View Details' : 'عرض التفاصيل'}
              <ArrowRight size={16} className={locale === 'ar' ? 'rotate-180' : ''} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
