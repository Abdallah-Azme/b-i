'use client';

import React from 'react';
import { Project, Language } from '@/shared/types';
import { Money } from '@/shared/ui/money';
import { Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/use-auth';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const locale = useLocale() as Language;
  const { user, toggleFavorite } = useAuth();
  const isFavorite = user?.favorites.includes(project.id);
  const FALLBACK_IMAGE = "https://b3businessbrokers.com/wp-content/uploads/2024/05/AdobeStock_157565392-min.jpeg";

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(project.id);
  };

  return (
    <Link 
      href={`/projects/${project.id}`} 
      className="group bg-brand-gray/30 border border-white/10 hover:border-brand-gold/50 rounded-xl overflow-hidden transition-all hover:-translate-y-1 block relative shadow-lg hover:shadow-brand-gold/5"
    >
      {/* Image Cap */}
      <div className="h-48 w-full relative overflow-hidden">
        <Image 
          src={project.image || FALLBACK_IMAGE} 
          alt={project.name[locale]} 
          fill
          className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
        />
        <div className="absolute inset-0 bg-linear-to-t from-brand-gray/90 to-transparent"></div>
        
        {/* Heart Overlay */}
        <button 
          onClick={handleFavorite}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md border border-white/10 transition-all ${isFavorite ? 'bg-brand-gold text-black border-brand-gold' : 'bg-black/40 text-white hover:bg-black/60'}`}
        >
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <span className="text-[10px] font-bold text-black bg-brand-gold px-2 py-1 rounded uppercase tracking-widest">
            {project.category[locale]}
          </span>
        </div>
      </div>

      <div className="p-5 relative z-10">
        <h3 className="text-lg font-bold mb-2 text-white group-hover:text-brand-gold transition line-clamp-1">
          {project.name[locale]}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">
          {project.descriptionShort[locale]}
        </p>
        
        <div className="space-y-3 pt-4 border-t border-white/5">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">{locale === 'en' ? 'Capital' : 'رأس المال'}</span>
            <Money value={project.askingPrice} className="font-semibold text-gray-200 font-sans" />
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">{locale === 'en' ? 'Share' : 'الحصة'}</span>
            <span className="font-semibold text-brand-gold font-sans">{project.shareOffered}%</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

