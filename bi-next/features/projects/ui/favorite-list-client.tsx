'use client';

import React from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Project, Language } from '@/shared/types';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { Money } from '@/shared/ui/money';
import { Link, useRouter } from '@/i18n/routing';
import { Lock, Unlock } from 'lucide-react';

import { useProjects } from '../hooks/use-projects';

interface FavoriteListClientProps {
  initialProjects?: Project[];
}

export const FavoriteListClient: React.FC<FavoriteListClientProps> = ({ initialProjects = [] }) => {
  const { data: projects = initialProjects } = useProjects();
  const { user, isLoading: isAuthLoading } = useAuth();

  const locale = useLocale() as Language;
  const t = useTranslations('tabs');
  const isAr = locale === 'ar';
  const FALLBACK_IMAGE = "https://b3businessbrokers.com/wp-content/uploads/2024/05/AdobeStock_157565392-min.jpeg";

  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace('/login-type');
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  const favProjects = projects.filter((p: Project) => user.favorites.includes(p.id));


  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-white">{t('favorites')}</h1>
      
      {favProjects.length === 0 ? (
        <div className="text-center py-20 bg-brand-gray/30 rounded-xl border border-dashed border-white/10">
          <p className="text-gray-400 mb-4">{isAr ? 'لا توجد مفضلة بعد.' : 'No favorites yet.'}</p>
          <Link href="/projects" className="text-brand-gold hover:underline">
            {isAr ? 'تصفح المشاريع' : 'Browse Projects'}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favProjects.map((project: Project) => {
            const unlocked = user.unlockedProjects?.includes(project.id);
            return (
              <Link href={`/projects/${project.id}`} key={project.id} className="group bg-brand-gray/30 border border-white/10 hover:border-brand-gold/50 rounded-xl overflow-hidden transition-all hover:-translate-y-1 block relative shadow-lg">
                <div className="h-48 w-full relative overflow-hidden">
                   <Image 
                      src={project.image || FALLBACK_IMAGE} 
                      alt={project.name[locale]} 
                      fill
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                   />
                   <div className={`absolute top-2 ${locale === 'ar' ? 'left-2' : 'right-2'}`}>
                     <div className={`p-1 rounded-full ${unlocked ? 'bg-green-500' : 'bg-black/50'}`}>
                       {unlocked ? <Unlock size={14} className="text-white" /> : <Lock size={14} className="text-white" />}
                     </div>
                   </div>
                </div>
                <div className="p-4">
                   <h3 className="text-lg font-bold mb-2 text-white group-hover:text-brand-gold transition line-clamp-1">{project.name[locale]}</h3>
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
