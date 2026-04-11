
import React, { useState, useMemo } from 'react';
import { useStore } from '../context/Store';
import { TRANSLATIONS, CATEGORIES, FALLBACK_IMAGE, AD_STATUS_CONFIG } from '../constants';
import { Filter, SlidersHorizontal, Lock, Unlock, ArrowRight, ChevronDown, ChevronUp, X, Info } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { ListingPurpose } from '../types';
import { Money } from '../components/Money';

export const Projects: React.FC = () => {
  const { lang, projects, isProjectUnlocked, isPubliclyVisible } = useStore();
  const t = TRANSLATIONS[lang];
  const [searchParams] = useSearchParams();

  // Initialize filter from URL if present
  const initialCat = searchParams.get('cat') || '';

  const [filterCat, setFilterCat] = useState<string>(initialCat);
  const [filterPurpose, setFilterPurpose] = useState<ListingPurpose | ''>('');
  const [sortOption, setSortOption] = useState<string>('newest');

  // Mobile Filter Visibility State
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Logic to filter and sort
  const filteredProjects = useMemo(() => {
    // Filter by public visibility first
    let result = projects.filter(p => isPubliclyVisible(p));
    
    if (filterCat) {
      // Filter based on the English category name which is the key/ID
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
  }, [projects, filterCat, filterPurpose, sortOption, isPubliclyVisible]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Mobile Filter Toggle Button */}
      <button
        onClick={() => setShowMobileFilters(!showMobileFilters)}
        className="md:hidden w-full bg-brand-gray border border-white/10 rounded-xl p-4 flex justify-between items-center mb-6 text-brand-gold font-bold hover:bg-brand-gray/80 transition shadow-lg shadow-black/20"
      >
         <div className="flex items-center gap-2">
           <Filter size={20} />
           <span>{t.filters.title}</span>
         </div>
         {showMobileFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className={`w-full md:w-1/4 space-y-8 ${showMobileFilters ? 'block' : 'hidden'} md:block transition-all duration-300`}>
          <div className="bg-brand-gray p-6 rounded-xl border border-white/5 sticky top-24">
            <div className="flex items-center justify-between mb-6 text-brand-gold">
              <div className="flex items-center gap-2">
                <Filter size={20} />
                <h3 className="font-bold text-lg">{t.filters.title}</h3>
              </div>
              {/* Close Button for Mobile */}
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="md:hidden text-gray-400 hover:text-white flex items-center gap-1 text-xs bg-white/5 px-2 py-1.5 rounded border border-white/10"
              >
                <span>{lang === 'en' ? 'Close' : 'إغلاق'}</span>
                <X size={14} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">{t.filters.category}</label>
                <select 
                  className="w-full bg-black border border-white/20 rounded-lg p-2 text-sm focus:border-brand-gold outline-none"
                  value={filterCat}
                  onChange={(e) => setFilterCat(e.target.value)}
                >
                  <option value="">{lang === 'en' ? 'All Categories' : 'جميع الفئات'}</option>
                  {CATEGORIES.map(c => <option key={c.en} value={c.en}>{c[lang]}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">{t.filters.listingType}</label>
                <select 
                  className="w-full bg-black border border-white/20 rounded-lg p-2 text-sm focus:border-brand-gold outline-none"
                  value={filterPurpose}
                  onChange={(e) => setFilterPurpose(e.target.value as ListingPurpose | '')}
                >
                  <option value="">{t.filters.allTypes}</option>
                  <option value="sale">{t.filters.forSale}</option>
                  <option value="investment">{t.filters.forInvestment}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">{t.filters.sort}</label>
                <select 
                  className="w-full bg-black border border-white/20 rounded-lg p-2 text-sm focus:border-brand-gold outline-none"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="newest">{t.filters.newest}</option>
                  <option value="price_asc">{t.filters.priceLow}</option>
                  <option value="price_desc">{t.filters.priceHigh}</option>
                </select>
              </div>
              
              <button 
                onClick={() => { setFilterCat(''); setFilterPurpose(''); setSortOption('newest'); }}
                className="w-full text-sm text-gray-500 hover:text-white underline mt-4"
              >
                {t.filters.reset}
              </button>
            </div>
          </div>
        </aside>

        {/* Project Grid */}
        <div className="w-full md:w-3/4">
           <div className="flex items-center justify-between mb-6">
             <h2 className="text-2xl font-bold">{t.nav.projects} <span className="text-gray-500 text-lg font-normal font-sans">({filteredProjects.length})</span></h2>
           </div>

           <div className="grid grid-cols-1 gap-6">
             {filteredProjects.map(project => {
               const unlocked = isProjectUnlocked(project.id);
               return (
                 <div key={project.id} className="bg-brand-gray/50 hover:bg-brand-gray border border-white/5 hover:border-brand-gold/30 rounded-xl overflow-hidden transition-all group relative">
                   <div className="flex flex-col md:flex-row">
                     {/* Thumbnail Image */}
                     <div className="w-full md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                       <img 
                          src={project.image} 
                          onError={(e) => { const target = e.target as HTMLImageElement; target.onerror = null; target.src = FALLBACK_IMAGE; }}
                          alt={project.name[lang]} 
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                       />
                       
                       {/* Mobile Badge Only */}
                       <div className={`absolute top-0 p-3 md:hidden ${lang === 'ar' ? 'left-0' : 'right-0'}`}>
                          {unlocked ? (
                             <span className="flex items-center gap-1 text-black text-[10px] font-bold uppercase tracking-wider bg-green-400 px-2 py-1 rounded">
                               <Unlock size={10} /> {t.common.unlocked}
                             </span>
                           ) : (
                             <span className="flex items-center gap-1 text-white text-[10px] font-bold uppercase tracking-wider bg-black/60 px-2 py-1 rounded backdrop-blur-md">
                               <Lock size={10} /> {t.common.locked}
                             </span>
                           )}
                       </div>
                     </div>

                     {/* Content */}
                     <div className="flex-1 p-6 flex flex-col justify-between">
                       <div className="relative">
                          {/* Desktop Status Badge Removed */}
                          <div className="flex items-center gap-2 mb-1">
                             <span className="text-brand-gold text-xs font-bold uppercase tracking-widest block">{project.category[lang]}</span>
                             <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                             <span className="text-gray-400 text-xs font-bold uppercase tracking-widest block">
                                {project.listingPurpose === 'sale' ? t.filters.forSale : t.filters.forInvestment}
                             </span>
                          </div>
                          
                          <h3 className="text-xl font-bold mb-2 group-hover:text-white text-gray-100">{project.name[lang]}</h3>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                            <span className="bg-black/20 px-3 py-1 rounded-full border border-white/5">{t.common.price}: <Money value={project.askingPrice} className="text-white font-sans" /></span>
                            <span className="bg-black/20 px-3 py-1 rounded-full border border-white/5">{t.common.share}: <span className="text-white font-sans">{project.shareOffered}%</span></span>
                          </div>
                          <p className="text-gray-400 text-sm max-w-xl line-clamp-2">{project.descriptionShort[lang]}</p>
                       </div>
                       
                       <div className="mt-4 flex justify-between items-center">
                          <span className="text-xs text-gray-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-gold"></span> {project.location[lang]}</span>
                          <Link 
                            to={`/projects/${project.id}`} 
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition text-sm ${unlocked ? 'bg-brand-white text-black hover:bg-gray-200' : 'bg-brand-gold text-black hover:bg-yellow-500'}`}
                          >
                            {lang === 'en' ? 'View Details' : 'عرض التفاصيل'}
                            <ArrowRight size={16} className={lang === 'ar' ? 'rotate-180' : ''} />
                          </Link>
                       </div>
                     </div>
                   </div>
                 </div>
               );
             })}
           </div>
        </div>
      </div>
    </div>
  );
};
