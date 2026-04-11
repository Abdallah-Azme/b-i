'use client';

import React, { useState, useMemo } from 'react';
import { Project, Language, ListingPurpose } from '@/shared/types';
import { useLocale, useTranslations } from 'next-intl';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { CATEGORIES } from '@/features/projects/services/project-api';
import { ProjectHorizontalCard } from './project-horizontal-card';
import { useProjects } from '../hooks/use-projects';

interface ProjectListClientProps {
  initialProjects?: Project[];
}

export const ProjectListClient: React.FC<ProjectListClientProps> = ({ initialProjects = [] }) => {
  const { data: projects = initialProjects } = useProjects();
  const locale = useLocale() as Language;
  const searchParams = useSearchParams();

  const tFilters = useTranslations('filters');
  const tNav = useTranslations('nav');

  // Initialize filter from URL if present
  const initialCat = searchParams.get('cat') || '';

  const [filterCat, setFilterCat] = useState<string>(initialCat);
  const [filterPurpose, setFilterPurpose] = useState<ListingPurpose | ''>('');
  const [sortOption, setSortOption] = useState<string>('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync URL with Category filter
  React.useEffect(() => {
    const url = new URL(window.location.href);
    if (filterCat) {
      url.searchParams.set('cat', filterCat);
    } else {
      url.searchParams.delete('cat');
    }
    window.history.replaceState({}, '', url);
  }, [filterCat]);

  const filteredProjects = useMemo(() => {
    let result = [...projects];
    
    if (filterCat) {
      result = result.filter(p => p.category.en === filterCat);
    }

    if (filterPurpose) {
       result = result.filter(p => p.listingPurpose === filterPurpose);
    }
    
    if (sortOption === 'price_asc') {
      result.sort((a, b) => a.askingPrice - b.askingPrice);
    } else if (sortOption === 'price_desc') {
      result.sort((a, b) => b.askingPrice - a.askingPrice);
    } else if (sortOption === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [projects, filterCat, filterPurpose, sortOption]);

  const resetFilters = () => {
    setFilterCat('');
    setFilterPurpose('');
    setSortOption('newest');
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setShowMobileFilters(!showMobileFilters)}
        className="md:hidden w-full bg-brand-gray border border-white/10 rounded-xl p-4 flex justify-between items-center mb-6 text-brand-gold font-bold hover:bg-brand-gray/80 transition"
      >
         <div className="flex items-center gap-2">
           <Filter size={20} />
           <span>{tFilters('title')}</span>
         </div>
         {showMobileFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {/* Sidebar Filters */}
      <aside className={`w-full md:w-1/4 space-y-8 ${showMobileFilters ? 'block' : 'hidden'} md:block`}>
        <div className="bg-brand-gray p-6 rounded-xl border border-white/5 sticky top-24">
          <div className="flex items-center justify-between mb-6 text-brand-gold">
            <div className="flex items-center gap-2">
              <Filter size={20} />
              <h3 className="font-bold text-lg">{tFilters('title')}</h3>
            </div>
            <button 
              onClick={() => setShowMobileFilters(false)}
              className="md:hidden text-gray-400 hover:text-white flex items-center gap-1 text-xs bg-white/5 px-2 py-1.5 rounded border border-white/10"
            >
              <span>{locale === 'ar' ? 'إغلاق' : 'Close'}</span>
              <X size={14} />
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">{tFilters('category')}</label>
              <select 
                className="w-full bg-black border border-white/20 rounded-lg p-2 text-sm focus:border-brand-gold outline-none"
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
              >
                <option value="">{locale === 'en' ? 'All Categories' : 'جميع الفئات'}</option>
                {CATEGORIES.map(c => <option key={c.en} value={c.en}>{c[locale]}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">{tFilters('listingType')}</label>
              <select 
                className="w-full bg-black border border-white/20 rounded-lg p-2 text-sm focus:border-brand-gold outline-none"
                value={filterPurpose}
                onChange={(e) => setFilterPurpose(e.target.value as ListingPurpose | '')}
              >
                <option value="">{tFilters('allTypes')}</option>
                <option value="sale">{tFilters('forSale')}</option>
                <option value="investment">{tFilters('forInvestment')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">{tFilters('sort')}</label>
              <select 
                className="w-full bg-black border border-white/20 rounded-lg p-2 text-sm focus:border-brand-gold outline-none"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="newest">{tFilters('newest')}</option>
                <option value="price_asc">{tFilters('priceLow')}</option>
                <option value="price_desc">{tFilters('priceHigh')}</option>
              </select>
            </div>
            
            <button 
              onClick={resetFilters}
              className="w-full text-sm text-gray-500 hover:text-white underline mt-4"
            >
              {tFilters('reset')}
            </button>
          </div>
        </div>
      </aside>

      {/* Project Grid */}
      <div className="w-full md:w-3/4">
         <div className="flex items-center justify-between mb-6">
           <h2 className="text-2xl font-bold">{tNav('projects')} <span className="text-gray-500 text-lg font-normal font-sans">({filteredProjects.length})</span></h2>
         </div>

         <div className="grid grid-cols-1 gap-6">
           {filteredProjects.map(project => (
             <ProjectHorizontalCard 
               key={project.id} 
               project={project} 
             />
           ))}
           {filteredProjects.length === 0 && (
             <div className="py-20 text-center bg-brand-gray/30 rounded-xl border border-dashed border-white/10">
               <p className="text-gray-400">{locale === 'en' ? 'No projects match your filters.' : 'لا توجد مشاريع تطابق مرشحاتك.'}</p>
               <button onClick={resetFilters} className="text-brand-gold hover:underline mt-2">{tFilters('reset')}</button>
             </div>
           )}
         </div>
      </div>
    </div>
  );
};
