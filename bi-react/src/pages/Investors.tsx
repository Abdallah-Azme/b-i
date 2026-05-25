import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../hooks/useStore';
import { Filter, Users, DollarSign, Briefcase, Award, ChevronDown, ChevronUp, X, CheckCircle, Loader2 } from 'lucide-react';
import { Money } from '../components/Money';
import { useInvestors } from '../features/general/hooks/useInvestors';
import { useInvestorTypes, useInvestorExperiences, usePreferredSectors } from '../features/general/hooks/useGeneralLookups';
import { InvestorsQueryParams } from '../features/general/types';
import { useSendInvestorInterestRequest } from '../features/company/hooks/useCompanyInteractions';
import { toast } from 'sonner';

export const Investors: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'ar' | 'en';
  const { user, toggleInterestInvestor, isInterestedInInvestor } = useStore();
  const sendInterest = useSendInvestorInterestRequest();
  const [selectedInvestorId, setSelectedInvestorId] = useState<number | null>(null);

  // Filter States
  const [filterType, setFilterType] = useState<string>('');
  const [filterExp, setFilterExp] = useState<string>('');
  const [filterField, setFilterField] = useState<string>('');
  const [filterCapital, setFilterCapital] = useState<string>('');

  // Mobile Filter Visibility State
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  // Pagination State
  const [page, setPage] = useState(1);
  const perPage = 10;

  // External Reference Data
  const { data: typesResponse } = useInvestorTypes();
  const { data: expsResponse } = useInvestorExperiences();
  const { data: sectorsResponse } = usePreferredSectors();

  // Prepare Query Params
  const queryParams = useMemo((): InvestorsQueryParams => {
    const params: InvestorsQueryParams = {
      page,
      per_page: perPage,
    };

    if (filterType) params.investor_type = filterType;
    if (filterExp) params.investor_experience = filterExp;
    if (filterField) params.preferred_sector_id = Number(filterField);
    
    if (filterCapital === 'low') {
      params.min_capital = 0;
      params.max_capital = 100000;
    }
    else if (filterCapital === 'mid') {
      params.min_capital = 100000;
      params.max_capital = 500000;
    }
    else if (filterCapital === 'high') {
      params.min_capital = 500000;
    }
    else if (filterCapital && !isNaN(Number(filterCapital))) {
      params.min_capital = Number(filterCapital);
    }

    return params;
  }, [filterType, filterExp, filterField, filterCapital, page]);

  // Fetch Data
  const { data: response, isLoading, isError, refetch, isFetching } = useInvestors(queryParams);

  const investors = response?.data?.investors || [];
  const pagination = response?.data?.pagination;

  // All filtering is now server-side for consistency with pagination
  const filteredInvestors = investors;

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filterType, filterExp, filterField, filterCapital]);


  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">{t('investorsPage.title')}</h1>
        <p className="text-gray-400">{t('investorsPage.subtitle')}</p>
      </div>

      {/* Mobile Filter Toggle Button */}
      <button
        onClick={() => setShowMobileFilters(!showMobileFilters)}
        className="md:hidden w-full bg-brand-gray border border-white/10 rounded-xl p-4 flex justify-between items-center mb-6 text-brand-gold font-bold hover:bg-brand-gray/80 transition shadow-lg shadow-black/20"
      >
         <div className="flex items-center gap-2">
            <Filter size={20} />
            <span>{t('investorsPage.filterTitle')}</span>
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
                <h3 className="font-bold text-lg">{t('investorsPage.filterTitle')}</h3>
              </div>
              {/* Close Button for Mobile */}
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="md:hidden text-gray-400 hover:text-white flex items-center gap-1 text-xs bg-white/5 px-2 py-1.5 rounded border border-white/10"
              >
                <span>{t('filters.close')}</span>
                <X size={14} />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">{t('investorsPage.filterType')}</label>
                <select 
                  className="w-full bg-black border border-white/20 rounded-lg p-2 text-sm focus:border-brand-gold outline-none"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">{t('investorsPage.allTypes')}</option>
                  {typesResponse?.data.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Capital Filter */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">{t('investorsPage.filterCapital')}</label>
                <select 
                  className="w-full bg-black border border-white/20 rounded-lg p-2 text-sm focus:border-brand-gold outline-none"
                  value={filterCapital}
                  onChange={(e) => setFilterCapital(e.target.value)}
                >
                  <option value="">{t('investorsPage.anyAmount')}</option>
                  <option value="low">{t('investorsPage.under100k')}</option>
                  <option value="mid">{t('investorsPage.midRange')}</option>
                  <option value="high">{t('investorsPage.highRange')}</option>
                </select>
              </div>

              {/* Experience Filter */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">{t('investorsPage.filterExp')}</label>
                <select 
                  className="w-full bg-black border border-white/20 rounded-lg p-2 text-sm focus:border-brand-gold outline-none"
                  value={filterExp}
                  onChange={(e) => setFilterExp(e.target.value)}
                >
                  <option value="">{t('investorsPage.allExp')}</option>
                  {expsResponse?.data.map(exp => (
                    <option key={exp.value} value={exp.value}>{exp.label}</option>
                  ))}
                </select>
              </div>

              {/* Field Filter */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">{t('investorsPage.filterField')}</label>
                <select 
                  className="w-full bg-black border border-white/20 rounded-lg p-2 text-sm focus:border-brand-gold outline-none"
                  value={filterField}
                  onChange={(e) => setFilterField(e.target.value)}
                >
                  <option value="">{t('investorsPage.allFields')}</option>
                  {sectorsResponse?.data.map(sector => (
                    <option key={sector.id} value={sector.id}>{sector.name}</option>
                  ))}
                </select>
              </div>
              
              <button 
                onClick={() => { setFilterType(''); setFilterExp(''); setFilterField(''); setFilterCapital(''); }}
                className="w-full text-sm text-gray-500 hover:text-white underline mt-4"
              >
                {t('investorsPage.reset')}
              </button>
            </div>
          </div>
        </aside>

        {/* Results Grid */}
        <div className="w-full md:w-3/4">
           <div className="flex items-center justify-between mb-6">
             <h2 className="text-2xl font-bold flex items-center gap-3">
               <Users className="text-brand-gold" />
               {t('investorsPage.title')} <span className="text-gray-500 text-lg font-normal font-sans">({pagination?.total || 0})</span>
               {isFetching && !isLoading && <Loader2 size={18} className="animate-spin text-brand-gold/50" />}
             </h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {filteredInvestors.map(investor => (
               <div key={investor.id} className="bg-brand-gray/30 border border-white/5 hover:border-brand-gold/50 rounded-xl p-6 transition-all hover:-translate-y-1 relative group overflow-hidden">
                 
                 {/* Decorative BG Gradient */}
                 <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl -z-10 group-hover:bg-brand-gold/10 transition"></div>

                 <div className="flex justify-between items-start mb-6 gap-4">
                    <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold border border-brand-gold/20">
                          <Users size={24} />
                       </div>
                       <div>
                          <h3 className="font-bold text-white text-lg font-sans">{investor.display_id}</h3>
                          <span className="text-xs text-brand-gold uppercase tracking-wider font-bold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20">
                            {investor.investor_type.label}
                          </span>
                       </div>
                    </div>

                    {/* Interested Action */}
                    {user && user.role === 'advertiser' && (
                      <button
                        onClick={() => setSelectedInvestorId(investor.id)}
                        disabled={isInterestedInInvestor(investor.id.toString())}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
                          isInterestedInInvestor(investor.id.toString())
                            ? 'bg-emerald-900/50 text-emerald-400 cursor-default border border-emerald-900'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {isInterestedInInvestor(investor.id.toString()) ? (
                          <>
                            <CheckCircle size={14} />
                            {t('investorsPage.interestSent')}
                          </>
                        ) : (
                          t('investorsPage.interested')
                        )}
                      </button>
                    )}
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                       <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <DollarSign size={16} className="text-brand-gold" />
                          <span>{t('auth.investorCapital')}</span>
                       </div>
                       <Money value={investor.available_capital} className="font-bold text-white font-sans" />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                       <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Briefcase size={16} className="text-brand-gold" />
                          <span>{t('auth.investorSector')}</span>
                       </div>
                       <span className="font-bold text-white">{investor.focus_sector.name}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                       <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Award size={16} className="text-brand-gold" />
                          <span>{t('auth.investorExperience')}</span>
                       </div>
                       <span className="font-bold text-white">{investor.investment_experience.label}</span>
                    </div>
                 </div>

               </div>
             ))}
           </div>

            {filteredInvestors.length === 0 && !isLoading && (
             <div className="text-center py-20 bg-brand-gray/20 rounded-xl border border-dashed border-white/10">
               <Users className="mx-auto text-gray-600 mb-4" size={48} />
               <p className="text-gray-400 text-lg">{t('investorsPage.noInvestors')}</p>
               <button 
                  onClick={() => { setFilterType(''); setFilterExp(''); setFilterField(''); setFilterCapital(''); }}
                  className="mt-4 text-brand-gold hover:underline"
               >
                 {t('investorsPage.reset')}
               </button>
             </div>
           )}

           {isLoading && (
             <div className="flex flex-col items-center justify-center py-20">
               <Loader2 className="w-12 h-12 text-brand-gold animate-spin mb-4" />
               <p className="text-gray-400">{t('investorsPage.loadingInvestors')}</p>
             </div>
           )}

           {isError && (
             <div className="text-center py-20 bg-red-900/10 rounded-xl border border-dashed border-red-900/20">
               <p className="text-red-400 mb-4">{t('investorsPage.errorInvestors')}</p>
               <button 
                  onClick={() => refetch()}
                  className="px-6 py-2 bg-brand-gold text-black font-bold rounded-lg hover:bg-brand-gold/80 transition"
               >
                 {t('common.retry')}
               </button>
             </div>
           )}

           {/* Pagination */}
           {pagination && pagination.last_page > 1 && (
             <div className="flex justify-center items-center gap-4 mt-12">
               <button
                 disabled={page === 1}
                 onClick={() => setPage(p => Math.max(1, p - 1))}
                 className="px-4 py-2 bg-brand-gray border border-white/10 rounded-lg text-white disabled:opacity-50 hover:bg-brand-gray/80 transition"
               >
                 {t('investorsPage.previous')}
               </button>
               <span className="text-gray-400">
                 {t('investorsPage.pageOf', { current: page, total: pagination.last_page })}
               </span>
               <button
                 disabled={page === pagination.last_page}
                 onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
                 className="px-4 py-2 bg-brand-gray border border-white/10 rounded-lg text-white disabled:opacity-50 hover:bg-brand-gray/80 transition"
               >
                 {t('investorsPage.next')}
               </button>
             </div>
           )}
        </div>
      </div>

      {selectedInvestorId && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-brand-gray p-6 rounded-xl border border-white/10 max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-white mb-2">{t('investorsPage.sendInterestTitle')}</h3>
            <p className="text-sm text-gray-400 mb-6">{t('investorsPage.sendInterestConfirm')}</p>
            <div className="flex gap-4">
              <button onClick={() => setSelectedInvestorId(null)} className="flex-1 bg-brand-gray border border-white/10 text-white py-2 rounded-lg font-bold">{t('dashboard.cancel')}</button>
              <button 
                onClick={() => {
                  sendInterest.mutate({ investor_id: selectedInvestorId }, {
                    onSuccess: () => {
                      toast.success(t('investorsPage.interestSentSuccess'));
                      toggleInterestInvestor(selectedInvestorId.toString());
                      setSelectedInvestorId(null);
                    },
                  });
                }} 
                disabled={sendInterest.isPending} 
                className="flex-1 flex justify-center items-center bg-brand-gold text-black py-2 rounded-lg font-bold disabled:opacity-50"
              >
                {sendInterest.isPending ? <Loader2 className="animate-spin" size={20} /> : t('investorsPage.send')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
