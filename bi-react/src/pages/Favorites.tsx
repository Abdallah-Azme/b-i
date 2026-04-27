
import React from 'react';
import { useStore } from '../hooks/useStore';
import { FALLBACK_IMAGE } from '../constants';
import { useTranslation } from 'react-i18next';
import { Navigate, Link } from '@tanstack/react-router';
import { ArrowRight, Lock, Unlock } from 'lucide-react';
import { Money } from '../components/Money';

export const Favorites: React.FC = () => {
  const { user, projects, lang, isProjectUnlocked } = useStore();
  const { t } = useTranslation();

  if (!user) return <Navigate to="/login" />;

  const favProjects = projects.filter(p => user.favorites.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('tabs.favorites')}</h1>
      
      {favProjects.length === 0 ? (
        <div className="text-center py-20 bg-brand-gray/30 rounded-xl border border-dashed border-white/10">
          <p className="text-gray-400 mb-4">{t('common.noFavorites')}</p>
          <Link to="/projects" className="text-brand-gold hover:underline">
            {t('common.browseProjects')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favProjects.map(project => {
            const unlocked = isProjectUnlocked(project.id);
            return (
              <Link to="/projects/$id" params={{ id: project.id }} key={project.id} className="group bg-brand-gray/30 border border-white/10 hover:border-brand-gold/50 rounded-xl overflow-hidden transition-all hover:-translate-y-1 block relative shadow-lg">
                <div className="h-48 w-full relative overflow-hidden">
                   <img 
                      src={project.image} 
                      onError={(e) => { const target = e.target as HTMLImageElement; target.onerror = null; target.src = FALLBACK_IMAGE; }}
                      alt={project.name[lang]} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                   />
                   <div className={`absolute top-2 ${lang === 'ar' ? 'left-2' : 'right-2'}`}>
                     <div className={`p-1 rounded-full ${unlocked ? 'bg-green-500' : 'bg-black/50'}`}>
                       {unlocked ? <Unlock size={14} className="text-white" /> : <Lock size={14} className="text-white" />}
                     </div>
                   </div>
                </div>
                <div className="p-4">
                   <h3 className="text-lg font-bold mb-2 text-white group-hover:text-brand-gold transition line-clamp-1">{project.name[lang]}</h3>
                   <div className="flex justify-between items-center text-sm text-gray-400">
                      <Money value={project.askingPrice} className="font-sans" />
                      <span className="text-brand-gold font-sans">{project.shareOffered}%</span>
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
