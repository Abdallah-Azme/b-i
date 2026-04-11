'use client';

import React from 'react';
import { Users, DollarSign, Briefcase, Award, CheckCircle } from 'lucide-react';
import { PublicInvestor, Language } from '@/shared/types';
import { Money } from '@/shared/ui/money';
import { CATEGORIES } from '@/features/projects/services/project-api';
import { useAuth } from '@/features/auth/hooks/use-auth';

interface InvestorCardProps {
  investor: PublicInvestor;
  locale: Language;
  userRole?: string;
  t: (key: string, values?: any) => string; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const InvestorCard: React.FC<InvestorCardProps> = ({ investor, locale, userRole, t }) => {
  const { toggleInterestInvestor, isInterestedInInvestor } = useAuth();
  const isInterested = isInterestedInInvestor(investor.id);

  return (
    <div className="bg-brand-gray/30 border border-white/5 hover:border-brand-gold/30 rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-gold/5 relative group overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-brand-gold/5 rounded-full blur-3xl -z-10 group-hover:bg-brand-gold/10 transition-colors"></div>

      <div className="flex justify-between items-start mb-8 gap-4">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold border border-brand-gold/20 shadow-inner">
               <Users size={28} />
            </div>
            <div>
               <h3 className="font-bold text-white text-xl font-sans tracking-tight">{investor.id}</h3>
               <span className="text-[10px] text-brand-gold uppercase tracking-widest font-black bg-brand-gold/10 px-2.5 py-1 rounded-md border border-brand-gold/20 block mt-1">
                 {investor.investorType.toUpperCase()}
               </span>
            </div>
         </div>

         {userRole === 'advertiser' && (
           <button 
             onClick={(e) => {
               e.preventDefault();
               toggleInterestInvestor(investor.id);
             }}
             disabled={isInterested}
             className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-colors shadow-xl uppercase tracking-widest flex items-center gap-2 ${
               isInterested 
               ? 'bg-gray-800 text-gray-400 cursor-not-allowed shadow-none' 
               : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-900/20'
             }`}
           >
             {isInterested && <CheckCircle size={14} />}
             {isInterested ? (locale === 'ar' ? 'مهتم' : 'Interested') : t('investorsPage.interested')}
           </button>
         )}
      </div>

      <div className="space-y-4">
         <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
            <div className="flex items-center gap-3 text-gray-400 text-sm font-bold uppercase tracking-wider">
               <DollarSign size={18} className="text-brand-gold" />
               <span>{t('auth.investorCapital')}</span>
            </div>
            <Money value={investor.capital} className="font-bold text-white font-sans text-xl" />
         </div>

         <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 text-gray-400 text-sm font-bold uppercase tracking-wider">
               <Briefcase size={18} className="text-brand-gold" />
               <span>{t('auth.investorSector')}</span>
            </div>
            <span className="font-bold text-white text-base">
              {CATEGORIES.find(c => c.en === investor.preferredField)?.[locale] || investor.preferredField}
            </span>
         </div>

         <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 text-gray-400 text-sm font-bold uppercase tracking-wider">
               <Award size={18} className="text-brand-gold" />
               <span>{t('auth.investorExperience')}</span>
            </div>
            <span className="font-bold text-white text-base uppercase">
              {t(`auth.exp${investor.experience.charAt(0).toUpperCase() + investor.experience.slice(1)}`)}
            </span>
         </div>
      </div>
    </div>
  );
};
