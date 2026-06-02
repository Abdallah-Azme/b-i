import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Link } from '@tanstack/react-router';
import { ArrowRight, Lock, Unlock, HeartOff, Loader2 } from 'lucide-react';
import { Money } from '../components/Money';
import { useFavoritesStore } from '@/hooks/useFavoritesStore';
import { useOpportunities } from '@/features/general/hooks/useOpportunities';
import { useStore } from '../hooks/useStore';
import { FALLBACK_IMAGE } from '../constants';
import { FavoriteButton } from '@/components/FavoriteButton';

export const Favorites: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "ar" | "en";
  const { favorites } = useFavoritesStore();
  const { isProjectUnlocked } = useStore();

  const { data, isLoading } = useOpportunities({
    per_page: 100, // Assuming a reasonable limit for now
  });

  const opportunities = data?.data?.opportunities ?? [];
  const favOpportunities = opportunities.filter(op => favorites.map(f => String(f)).includes(String(op.id)));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 size={48} className="animate-spin text-brand-gold" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-[70vh]">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 text-white tracking-tight">
            {t("favorites.title")}
          </h1>
          <p className="text-gray-400">
            {t("favorites.savedCount", { count: favOpportunities.length })}
          </p>
        </div>
        <Link 
          to="/projects" 
          className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl border border-white/10 transition flex items-center gap-2 text-sm font-bold"
        >
          {t("common.browseProjects")}
          <ArrowRight size={16} className={lang === 'ar' ? 'rotate-180' : ''} />
        </Link>
      </div>
      
      {favOpportunities.length === 0 ? (
        <div className="text-center py-32 bg-brand-dark/50 rounded-[40px] border-2 border-dashed border-white/5">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <HeartOff size={40} className="text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">{t("favorites.noFavoritesTitle")}</h2>
          <p className="text-gray-400 mb-10 max-w-sm mx-auto">
            {t("favorites.noFavoritesDesc")}
          </p>
          <Link to="/projects" className="bg-gold-gradient text-black px-10 py-4 rounded-full font-black hover-scale shadow-xl shadow-brand-gold/20">
            {t("favorites.startExploring")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favOpportunities.map(project => {
            const unlocked = isProjectUnlocked(String(project.id));
            return (
              <Link 
                to="/projects/$id" 
                params={{ id: String(project.id) }} 
                key={project.id} 
                className="group glass-card border-white/10 hover:border-brand-gold/50 rounded-2xl overflow-hidden transition-all duration-500 hover-scale block relative shadow-2xl"
              >
                 {/* Thumbnail Image */}
                 <div className="h-56 w-full relative overflow-hidden">
                   <img 
                      src={project.image || FALLBACK_IMAGE} 
                      onError={(e) => { const target = e.target as HTMLImageElement; target.onerror = null; target.src = FALLBACK_IMAGE; }}
                      alt={project.company_name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-60"></div>
                   
                   <div className={`absolute top-4 ${lang === 'ar' ? 'left-4' : 'right-4'}`}>
                      <div className={`p-1.5 rounded-full backdrop-blur-md border border-white/10 ${unlocked ? 'bg-green-500/80' : 'bg-black/50'}`}>
                        {unlocked ? <Unlock size={14} className="text-white" /> : <Lock size={14} className="text-white" />}
                      </div>
                   </div>

                   <div className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'}`}>
                      <FavoriteButton projectId={project.id} />
                   </div>
                 </div>

                 <div className="p-6 relative z-10">
                    <span className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block">
                       {project.category.name}
                    </span>
                    <h3 className="text-xl font-bold mb-6 text-white group-hover:text-brand-gold transition line-clamp-1">
                      {project.company_name}
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                       <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{t('common.capital')}</span>
                          <Money value={project.investment_required} className="text-base font-black text-white font-sans" />
                       </div>
                       <div className="flex flex-col gap-1 items-end">
                          <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{t('common.share')}</span>
                          <span className="text-base font-black text-brand-gold font-sans">
                            {project.sale_percentage ?? 0}%
                          </span>
                       </div>
                    </div>
                 </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
