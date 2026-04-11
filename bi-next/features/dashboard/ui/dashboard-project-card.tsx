'use client';

import React from 'react';
import { Project } from '@/shared/types';
import Image from 'next/image';
import { Star, FileText, ArrowRight, MapPin, Unlock } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Money } from '@/shared/ui/money';
import { AD_STATUS_CONFIG, FALLBACK_IMAGE } from '@/features/projects/services/project-api';

const formatCompact = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1
  }).format(num);
};

const getDemoStats = (project: Project) => {
  const seed = parseInt(project.id.replace(/\D/g, '') || '123');
  const isHighValue = project.askingPrice > 500000;
  const views = isHighValue ? 300 + (seed % 2000) : 2000 + (seed % 13000);
  const purchases = isHighValue ? 20 + (seed % 100) : 5 + (seed % 30);
  const interest = isHighValue ? 50 + (seed % 250) : 10 + (seed % 100);
  return { views, purchases, interest };
};

export const DashboardProjectCard: React.FC<{ project: Project, locale: string, type: 'ad' | 'booklet' }> = ({ project, locale, type }) => {
  const isAr = locale === 'ar';
  const stats = getDemoStats(project);

  return (
    <Link href={`/projects/${project.id}`} className="block group bg-brand-gray/20 rounded-xl overflow-hidden border border-white/5 hover:border-brand-gold/30 transition-all hover:scale-[1.02] shadow-md">
      <div className="aspect-4/3 bg-gray-800 relative overflow-hidden">
          <Image 
            src={project.image || FALLBACK_IMAGE} 
            alt={project.name[locale as keyof typeof project.name]} 
            fill
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80 group-hover:opacity-100" 
          />
          {type === 'ad' 
            ? <div className={`absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold text-white flex items-center gap-1 ${(AD_STATUS_CONFIG as unknown as Record<string, Record<string, string>>)[project.status]?.color}`}>
                {(AD_STATUS_CONFIG as unknown as Record<string, Record<string, string>>)[project.status]?.[locale] || project.status}
              </div>
            : <div className="absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold bg-black/60 backdrop-blur text-white flex items-center gap-1">
                <Unlock size={10} className="text-brand-gold" /> {isAr ? 'مفتوح' : 'Unlocked'}
              </div>
          }
          
          {/* Stats Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/85 to-transparent flex items-center justify-end gap-4 text-white backdrop-blur-[2px] transition-opacity duration-300">
            <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5" title={isAr ? 'عدد المهتمين' : 'Interest'}>
                   <span>{formatCompact(stats.interest)}</span> <Star size={14} className="text-white/80" />
                </div>
                <div className="flex items-center gap-1.5" title={isAr ? 'عدد شراء الكراسة' : 'Booklet Purchases'}>
                   <span>{formatCompact(stats.purchases)}</span> <FileText size={14} className="text-white/80" />
                </div>
                <div className="flex items-center gap-1.5" title={isAr ? 'عدد المشاهدات' : 'Views'}>
                   <span>{formatCompact(stats.views)}</span> <ArrowRight size={14} className="text-white/80" />
                </div>
            </div>
          </div>
      </div>
      <div className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-brand-gold uppercase tracking-wider font-bold">{project.category[locale as keyof typeof project.category]}</span>
          </div>
          <h3 className="font-bold text-white mb-3 line-clamp-1 group-hover:text-brand-gold transition text-sm md:text-base">{project.name[locale as keyof typeof project.name]}</h3>
          
          <div className="flex justify-between items-center pt-3 border-t border-white/5">
             <div className="flex items-center gap-1 text-gray-500 text-xs">
                <MapPin size={12} />
                <span>{project.location[locale as keyof typeof project.location]}</span>
             </div>
             <div className="text-right">
                <span className="block text-[10px] text-gray-500 uppercase">{isAr ? 'القيمة' : 'Value'}</span>
                <Money value={project.askingPrice} className="font-bold text-white text-sm" />
             </div>
          </div>
      </div>
    </Link>
  );
};
