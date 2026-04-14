'use client';

import React, { useState, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Filter, Users, ChevronDown, ChevronUp, X } from 'lucide-react';
import { PublicInvestor, Language } from '@/shared/types';
import { CATEGORIES } from '@/features/projects/services/project-api';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { EmptyState } from '@/shared/ui/empty-state';
import { InvestorCard } from './investor-card';
import { useInvestors } from '../hooks/use-investors';

interface InvestorListClientProps {
  initialInvestors?: PublicInvestor[];
}

export const InvestorListClient: React.FC<InvestorListClientProps> = ({ initialInvestors = [] }) => {
  const locale = useLocale() as Language;

  const { user } = useAuth();
  const t = useTranslations();

  const [filterType, setFilterType] = useState<string>('');
  const [filterExp, setFilterExp] = useState<string>('');
  const [filterField, setFilterField] = useState<string>('');
  const [filterCapital, setFilterCapital] = useState<string>('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filters = useMemo(() => ({
    filterType,
    filterExp,
    filterField,
    filterCapital
  }), [filterType, filterExp, filterField, filterCapital]);

  const { data: investors = initialInvestors, isLoading } = useInvestors(filters);
  const filteredInvestors = investors;

  const resetFilters = () => {
    setFilterType('');
    setFilterExp('');
    setFilterField('');
    setFilterCapital('');
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 animate-fade-in">
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setShowMobileFilters(!showMobileFilters)}
        className="md:hidden w-full bg-brand-gray border border-white/10 rounded-2xl p-5 flex justify-between items-center mb-6 text-brand-gold font-bold hover:bg-brand-gray/80 transition shadow-lg"
      >
         <div className="flex items-center gap-2">
           <Filter size={20} />
           <span>{t('investorsPage.filterTitle')}</span>
         </div>
         {showMobileFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {/* Sidebar Filters */}
      <aside className={`w-full md:w-1/4 space-y-8 ${showMobileFilters ? 'block' : 'hidden'} md:block`}>
        <div className="bg-brand-gray p-6 rounded-2xl border border-white/5 sticky top-24 shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between mb-8 text-brand-gold">
            <div className="flex items-center gap-2">
              <Filter size={22} className="stroke-[2.5px]" />
              <h3 className="font-bold text-xl">{t('investorsPage.filterTitle')}</h3>
            </div>
            <button 
              onClick={() => setShowMobileFilters(false)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-3 text-gray-400 uppercase tracking-widest">{t('investorsPage.filterType')}</label>
              <select 
                className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-brand-gold outline-none transition-colors"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">{t('investorsPage.allTypes')}</option>
                <option value="company">{t('listing.companyType')}</option>
                <option value="angel">{t('listing.angelType')}</option>
                <option value="crowdfunding">{t('listing.crowdType')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-3 text-gray-400 uppercase tracking-widest">{t('investorsPage.filterCapital')}</label>
              <select 
                className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-brand-gold outline-none"
                value={filterCapital}
                onChange={(e) => setFilterCapital(e.target.value)}
              >
                <option value="">{t('investorsPage.anyAmount')}</option>
                <option value="low">{t('investorsPage.under100k')}</option>
                <option value="mid">{t('investorsPage.between100k500k')}</option>
                <option value="high">{t('investorsPage.over500k')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-3 text-gray-400 uppercase tracking-widest">{t('investorsPage.filterExp')}</label>
              <select 
                className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-brand-gold outline-none"
                value={filterExp}
                onChange={(e) => setFilterExp(e.target.value)}
              >
                <option value="">{t('investorsPage.allExp')}</option>
                <option value="beginner">{t('auth.expBeginner')}</option>
                <option value="intermediate">{t('auth.expIntermediate')}</option>
                <option value="expert">{t('auth.expExpert')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-3 text-gray-400 uppercase tracking-widest">{t('investorsPage.filterField')}</label>
              <select 
                className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-brand-gold outline-none"
                value={filterField}
                onChange={(e) => setFilterField(e.target.value)}
              >
                <option value="">{t('investorsPage.allFields')}</option>
                {CATEGORIES.map(c => <option key={c.en} value={c.en}>{c[locale]}</option>)}
              </select>
            </div>
            
            <button 
              onClick={resetFilters}
              className="w-full text-xs font-bold text-gray-500 hover:text-white underline mt-6 uppercase tracking-widest"
            >
              {t('investorsPage.reset')}
            </button>
          </div>
        </div>
      </aside>

      {/* Results Grid */}
      <div className="w-full md:w-3/4">
         <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-white tracking-tight">
             <Users className="text-brand-gold w-8 h-8" />
             {t('investorsPage.title')} <span className="text-gray-600 text-lg md:text-xl font-normal font-sans">({filteredInvestors.length})</span>
           </h2>
         </div>

         {isLoading ? (
           <div className="flex justify-center items-center py-20">
             <span className="w-10 h-10 border-4 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin"></span>
           </div>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
             {filteredInvestors.map((investor: any) => (
               <InvestorCard 
                 key={investor.id} 
                 investor={investor} 
                 locale={locale} 
                 userRole={user?.role} 
                 t={t} 
               />
             ))}
           </div>
         )}

         {filteredInvestors.length === 0 && (
           <EmptyState 
             icon={Users} 
             title={t('investorsPage.noInvestors')} 
             desc={t('investorsPage.changeFilters')} 
             action={<button onClick={resetFilters} className="text-brand-gold font-black hover:underline uppercase tracking-widest text-xs">{t('investorsPage.reset')}</button>}
           />
         )}
      </div>
    </div>
  );
};
