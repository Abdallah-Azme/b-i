
import React, { useState, useMemo } from 'react';
import { useStore } from '../context/Store';
import { TRANSLATIONS, CATEGORIES, SAMPLE_INVESTORS } from '../constants';
import { Filter, Users, DollarSign, Briefcase, Award, ChevronDown, ChevronUp, X, CheckCircle } from 'lucide-react';
import { PublicInvestor } from '../types';
import { Money } from '../components/Money';

export const Investors: React.FC = () => {
  const { lang, user, toggleInterestInvestor, isInterestedInInvestor } = useStore();
  const t = TRANSLATIONS[lang];
  const p = t.investorsPage;
  const isAr = lang === 'ar';

  // Filter States
  const [filterType, setFilterType] = useState<string>('');
  const [filterExp, setFilterExp] = useState<string>('');
  const [filterField, setFilterField] = useState<string>('');
  const [filterCapital, setFilterCapital] = useState<string>('');
  
  // Mobile Filter Visibility State
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filtering Logic
  const filteredInvestors = useMemo(() => {
    let result = [...SAMPLE_INVESTORS];

    if (filterType) {
      result = result.filter(i => i.investorType === filterType);
    }
    if (filterExp) {
      result = result.filter(i => i.experience === filterExp);
    }
    if (filterField) {
      result = result.filter(i => i.preferredField === filterField);
    }
    if (filterCapital) {
      // Basic Range Filtering Demo
      if (filterCapital === 'low') result = result.filter(i => i.capital < 100000);
      else if (filterCapital === 'mid') result = result.filter(i => i.capital >= 100000 && i.capital < 500000);
      else if (filterCapital === 'high') result = result.filter(i => i.capital >= 500000);
    }

    return result;
  }, [filterType, filterExp, filterField, filterCapital]);

  // Helper for translated values
  const getTypeLabel = (type: string) => {
     if (type === 'angel') return t.listing.angelType;
     if (type === 'company') return t.listing.companyType;
     if (type === 'crowdfunding') return t.listing.crowdType;
     return type;
  };

  const getExpLabel = (exp: string) => {
     if (exp === 'beginner') return t.auth.expBeginner;
     if (exp === 'intermediate') return t.auth.expIntermediate;
     if (exp === 'expert') return t.auth.expExpert;
     return exp;
  };

  const getFieldLabel = (fieldEn: string) => {
     const cat = CATEGORIES.find(c => c.en === fieldEn);
     return cat ? cat[lang] : fieldEn;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">{p.title}</h1>
        <p className="text-gray-400">{p.subtitle}</p>
      </div>

      {/* Mobile Filter Toggle Button */}
      <button
        onClick={() => setShowMobileFilters(!showMobileFilters)}
        className="md:hidden w-full bg-brand-gray border border-white/10 rounded-xl p-4 flex justify-between items-center mb-6 text-brand-gold font-bold hover:bg-brand-gray/80 transition shadow-lg shadow-black/20"
      >
         <div className="flex items-center gap-2">
           <Filter size={20} />
           <span>{p.filterTitle}</span>
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
                <h3 className="font-bold text-lg">{p.filterTitle}</h3>
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
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">{p.filterType}</label>
                <select 
                  className="w-full bg-black border border-white/20 rounded-lg p-2 text-sm focus:border-brand-gold outline-none"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">{p.allTypes}</option>
                  <option value="company">{t.listing.companyType}</option>
                  <option value="angel">{t.listing.angelType}</option>
                  <option value="crowdfunding">{t.listing.crowdType}</option>
                </select>
              </div>

              {/* Capital Filter */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">{p.filterCapital}</label>
                <select 
                  className="w-full bg-black border border-white/20 rounded-lg p-2 text-sm focus:border-brand-gold outline-none"
                  value={filterCapital}
                  onChange={(e) => setFilterCapital(e.target.value)}
                >
                  <option value="">{lang === 'en' ? 'Any Amount' : 'أي مبلغ'}</option>
                  <option value="low">{lang === 'en' ? 'Under 100K' : 'أقل من ١٠٠ ألف'}</option>
                  <option value="mid">{lang === 'en' ? '100K - 500K' : '١٠٠ ألف - ٥٠٠ ألف'}</option>
                  <option value="high">{lang === 'en' ? '500K+' : '٥٠٠ ألف +'}</option>
                </select>
              </div>

              {/* Experience Filter */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">{p.filterExp}</label>
                <select 
                  className="w-full bg-black border border-white/20 rounded-lg p-2 text-sm focus:border-brand-gold outline-none"
                  value={filterExp}
                  onChange={(e) => setFilterExp(e.target.value)}
                >
                  <option value="">{p.allExp}</option>
                  <option value="beginner">{t.auth.expBeginner}</option>
                  <option value="intermediate">{t.auth.expIntermediate}</option>
                  <option value="expert">{t.auth.expExpert}</option>
                </select>
              </div>

              {/* Field Filter */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">{p.filterField}</label>
                <select 
                  className="w-full bg-black border border-white/20 rounded-lg p-2 text-sm focus:border-brand-gold outline-none"
                  value={filterField}
                  onChange={(e) => setFilterField(e.target.value)}
                >
                  <option value="">{p.allFields}</option>
                  {CATEGORIES.map(c => <option key={c.en} value={c.en}>{c[lang]}</option>)}
                </select>
              </div>
              
              <button 
                onClick={() => { setFilterType(''); setFilterExp(''); setFilterField(''); setFilterCapital(''); }}
                className="w-full text-sm text-gray-500 hover:text-white underline mt-4"
              >
                {p.reset}
              </button>
            </div>
          </div>
        </aside>

        {/* Results Grid */}
        <div className="w-full md:w-3/4">
           <div className="flex items-center justify-between mb-6">
             <h2 className="text-2xl font-bold flex items-center gap-3">
               <Users className="text-brand-gold" />
               {p.title} <span className="text-gray-500 text-lg font-normal font-sans">({filteredInvestors.length})</span>
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
                          <h3 className="font-bold text-white text-lg font-sans">{investor.id}</h3>
                          <span className="text-xs text-brand-gold uppercase tracking-wider font-bold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20">
                            {getTypeLabel(investor.investorType)}
                          </span>
                       </div>
                    </div>

                    {/* Interested Action */}
                    {user && user.role === 'advertiser' && (
                      <button
                        onClick={() => toggleInterestInvestor(investor.id)}
                        disabled={isInterestedInInvestor(investor.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
                          isInterestedInInvestor(investor.id)
                            ? 'bg-emerald-900/50 text-emerald-400 cursor-default border border-emerald-900'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {isInterestedInInvestor(investor.id) ? (
                          <>
                            <CheckCircle size={14} />
                            {isAr ? 'تم الاهتمام' : 'Interest Sent'}
                          </>
                        ) : (
                          isAr ? 'مهتم' : 'Interested'
                        )}
                      </button>
                    )}
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                       <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <DollarSign size={16} className="text-brand-gold" />
                          <span>{t.auth.investorCapital}</span>
                       </div>
                       <Money value={investor.capital} className="font-bold text-white font-sans" />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                       <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Briefcase size={16} className="text-brand-gold" />
                          <span>{t.auth.investorSector}</span>
                       </div>
                       <span className="font-bold text-white">{getFieldLabel(investor.preferredField)}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                       <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Award size={16} className="text-brand-gold" />
                          <span>{t.auth.investorExperience}</span>
                       </div>
                       <span className="font-bold text-white">{getExpLabel(investor.experience)}</span>
                    </div>
                 </div>

               </div>
             ))}
           </div>

           {filteredInvestors.length === 0 && (
             <div className="text-center py-20 bg-brand-gray/20 rounded-xl border border-dashed border-white/10">
               <Users className="mx-auto text-gray-600 mb-4" size={48} />
               <p className="text-gray-400 text-lg">{lang === 'en' ? 'No investors found matching your filters.' : 'لا يوجد مستثمرين يطابقون اختيارك.'}</p>
               <button 
                  onClick={() => { setFilterType(''); setFilterExp(''); setFilterField(''); setFilterCapital(''); }}
                  className="mt-4 text-brand-gold hover:underline"
               >
                 {p.reset}
               </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
