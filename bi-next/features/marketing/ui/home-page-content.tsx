'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { TrendingUp, Shield, Users, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/features/projects/services/project-api';
import { ProjectCard } from '@/features/projects/ui/project-card';
import { Language, Project } from '@/shared/types';
import { useLatestProjects, useProjects } from '@/features/projects/hooks/use-projects';

interface HomePageContentProps {
  latestProjects?: Project[];
}

export function HomePageContent({ latestProjects = [] }: HomePageContentProps) {
  const { data: projects = latestProjects } = useLatestProjects();
  const { data: allProjects = [] } = useProjects();
  const locale = useLocale() as Language;
  const tHero = useTranslations('hero');
  const tNav = useTranslations('nav');
  const tHome = useTranslations('home');

  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-brand-black">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-gray-800/30 via-black to-black"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight leading-tight bg-clip-text text-transparent bg-linear-to-r from-white via-gray-200 to-gray-500">
            {tHero('title')}
          </h1>
          <p className="text-lg md:text-2xl text-gray-400 mb-10 font-light">
            {tHero('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/projects" className="bg-brand-gold text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-500 transition shadow-lg shadow-brand-gold/20">
              {tHero('cta')}
            </Link>
            <Link href="/register-type" className="px-8 py-4 rounded-full font-bold text-lg border border-white/30 hover:bg-white/10 transition backdrop-blur-sm">
              {tNav('register')}
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Projects Section */}
      <section className="py-20 bg-brand-black border-b border-white/5" aria-label={tHome('latestOpportunities')}>
        <div className="max-w-7xl mx-auto px-4">
           <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-2 text-white">{tHome('latestOpportunities')}</h2>
                <p className="text-gray-400">{tHome('latestOpportunitiesDesc')}</p>
              </div>
              <Link href="/projects" className="hidden md:flex items-center gap-2 text-brand-gold hover:text-white transition font-bold" aria-label={tHome('viewAllProjects')}>
                 {tHome('viewAllProjects')}
                 <ArrowRight size={20} className={locale === 'ar' ? 'rotate-180' : ''} />
              </Link>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
           </div>

           <div className="mt-8 md:hidden flex justify-center">
              <Link href="/projects" className="flex items-center gap-2 text-brand-gold hover:text-white transition font-bold" aria-label={tHome('viewAllProjects')}>
                 {tHome('viewAllProjects')}
                 <ArrowRight size={20} className={locale === 'ar' ? 'rotate-180' : ''} />
              </Link>
           </div>
        </div>
      </section>

      {/* Stats / Trust Section */}
      <section className="bg-brand-dark py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <Shield className="w-12 h-12 text-brand-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{tHome('trustSection.identityTitle')}</h3>
            <p className="text-gray-400 text-sm">{tHome('trustSection.identityDesc')}</p>
          </div>
          <div className="p-6">
            <TrendingUp className="w-12 h-12 text-brand-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{tHome('trustSection.dealsTitle')}</h3>
            <p className="text-gray-400 text-sm">{tHome('trustSection.dealsDesc')}</p>
          </div>
          <div className="p-6">
            <Users className="w-12 h-12 text-brand-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{tHome('trustSection.connectionTitle')}</h3>
            <p className="text-gray-400 text-sm">{tHome('trustSection.connectionDesc')}</p>
          </div>
        </div>
      </section>

      {/* Categories Scroller */}
      <section className="py-20 max-w-7xl mx-auto px-4 w-full">
        <h2 className="text-3xl font-bold mb-10 text-center">{tHome('exploreSectors')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4" role="list">
          {CATEGORIES.slice(0, 10).map((cat, idx) => {
            const count = allProjects.filter(p => p.category.en === cat.en && (p.status === 'published' || p.status === 'approved')).length; 
            return (
              <Link role="listitem" href={`/projects?cat=${cat.en}`} key={idx} className="group relative overflow-hidden rounded-xl aspect-square bg-brand-gray border border-white/5 hover:border-brand-gold/50 transition flex items-center justify-center p-4 text-center">
                <div className="relative z-10 flex flex-col items-center">
                  <span className="font-semibold text-gray-300 group-hover:text-white transition">{cat[locale]}</span>
                  <span className="text-xs text-gray-500 mt-2 font-medium group-hover:text-brand-gold transition font-sans">({count})</span>
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
              </Link>
            );
          })}
        </div>
        <div className="text-center mt-12">
          <Link href="/categories" className="text-brand-gold hover:underline underline-offset-4">
            {tHome('viewAllCategories')}
          </Link>
        </div>
      </section>
    </main>
  );
};
