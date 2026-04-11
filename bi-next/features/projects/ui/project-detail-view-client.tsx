'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Language } from '@/shared/types';
import { useLocale, useTranslations } from 'next-intl';
import { Lock, Unlock, MapPin, DollarSign, Calendar, CheckCircle, Building, Layers } from 'lucide-react';
import { Money } from '@/shared/ui/money';
import { FINANCIAL_HEALTH_MAP, AD_STATUS_CONFIG, COMPANY_STAGES } from '@/features/projects/services/project-api';
import Image from 'next/image';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/features/auth/hooks/use-auth';

import { useProject } from '../hooks/use-projects';

interface ProjectDetailViewClientProps {
  id: string;
}

export const ProjectDetailViewClient: React.FC<ProjectDetailViewClientProps> = ({ id }) => {
  const { data: project, isLoading } = useProject(id);
  const locale = useLocale() as Language;

  const tCommon = useTranslations('common');
  const tAuth = useTranslations('auth');
  const router = useRouter();
  const { user, unlockProject, requestInterest } = useAuth();
  
  const [showStageTooltip, setShowStageTooltip] = useState(false);
  const [tooltipPlacement, setTooltipPlacement] = useState<'top' | 'bottom'>('top');
  const stageCardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (stageCardRef.current && !stageCardRef.current.contains(event.target as Node)) {
        setShowStageTooltip(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading || !project) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  const unlocked = user?.unlockedProjects?.includes(project.id) || false;

  
  const FALLBACK_IMAGE = "https://b3businessbrokers.com/wp-content/uploads/2024/05/AdobeStock_157565392-min.jpeg";

  // Get localized financial health
  const healthKey = project.financialHealth;
  const healthInfo = FINANCIAL_HEALTH_MAP[healthKey];
  const localizedHealth = healthInfo ? healthInfo[locale] : healthKey;

  // Get Stage Info for Tooltip
  const stageInfo = COMPANY_STAGES.find(s => s.label.en === project.companyStage?.en);

  const handlePurchase = () => {
    if (!user) {
      router.push('/login-type');
      return;
    }
    unlockProject(project.id);
  };


  const toggleTooltip = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (showStageTooltip) {
      setShowStageTooltip(false);
      return;
    }

    if (stageCardRef.current) {
      const rect = stageCardRef.current.getBoundingClientRect();
      if (rect.top > 180) {
        setTooltipPlacement('top');
      } else {
        setTooltipPlacement('bottom');
      }
    }
    setShowStageTooltip(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header Card */}
      <div className="relative mb-8 z-20 group">
        
        {/* Background Layer */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 bg-brand-gray pointer-events-none">
          <div className="absolute inset-0">
            <Image 
              src={project.image || FALLBACK_IMAGE} 
              alt={project.name[locale]} 
              fill
              className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition duration-[2s]" 
            />
            <div className="absolute inset-0 bg-linear-to-r from-brand-gray via-brand-gray/90 to-transparent"></div>
          </div>
        </div>
        
        {/* Content Layer */}
        <div className="relative p-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div>
              <span className={`bg-brand-gold text-black px-3 py-1 rounded text-xs font-bold uppercase tracking-widest ${locale === 'ar' ? 'inline-block mb-4' : ''}`}>
                {project.category[locale]}
              </span>
              <h1 className={`text-3xl md:text-5xl font-bold mb-2 text-white shadow-black drop-shadow-lg ${locale === 'ar' ? 'leading-normal' : 'mt-4'}`}>
                {project.name[locale]}
              </h1>
              <p className="text-gray-300 text-sm flex items-center gap-2 mt-2">
                 <span className="opacity-60 font-sans">ID: {project.id}</span>
                 <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                 <span className="flex items-center gap-1 text-brand-gold"><MapPin size={12}/> {project.location[locale]}</span>
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
               {/* Ad Status Badge */}
               <span className={`flex items-center gap-2 text-white text-sm font-bold uppercase tracking-wider ${AD_STATUS_CONFIG[project.status].color} px-4 py-2 rounded border border-white/10`} title={AD_STATUS_CONFIG[project.status].desc[locale]}>
                 {AD_STATUS_CONFIG[project.status][locale]}
               </span>
               
               {/* Locked/Unlocked Badge */}
               <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                  <span className={`font-bold ${unlocked ? 'text-green-400' : 'text-gray-400'} flex items-center gap-2`}>
                     {unlocked ? <Unlock size={16} /> : <Lock size={16} />}
                     {unlocked ? tCommon('unlocked') : tCommon('locked')}
                  </span>
               </div>
            </div>
          </div>

          {/* Public Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:border-brand-gold/30 transition flex flex-col justify-center min-h-[100px] min-w-0">
              <div className="flex items-start gap-2 text-gray-400 mb-1.5 text-xs uppercase w-full">
                <DollarSign size={14} className="shrink-0 mt-0.5"/> 
                <span className="line-clamp-2 leading-tight">{tAuth('requestedInvestment')}</span>
              </div>
              <Money value={project.askingPrice} className="text-xs sm:text-sm md:text-lg font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis leading-tight font-sans" />
            </div>

            <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:border-brand-gold/30 transition flex flex-col justify-center min-h-[100px] min-w-0">
              <div className="flex items-start gap-2 text-gray-400 mb-1.5 text-xs uppercase w-full">
                <Calendar size={14} className="shrink-0 mt-0.5"/> 
                <span className="line-clamp-2 leading-tight">{tCommon('age')}</span>
              </div>
              <div className="text-xs sm:text-sm md:text-lg font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis leading-tight font-sans">
                {project.age[locale]}
              </div>
            </div>

            <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:border-brand-gold/30 transition flex flex-col justify-center min-h-[100px] min-w-0">
              <div className="flex items-start gap-2 text-gray-400 mb-1.5 text-xs uppercase w-full">
                <Building size={14} className="shrink-0 mt-0.5"/> 
                <span className="line-clamp-2 leading-tight">{tAuth('legalEntity')}</span>
              </div>
              <div className="text-xs sm:text-sm md:text-lg font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis leading-tight">
                {project.legalEntity ? project.legalEntity[locale] : 'LLC'}
              </div>
            </div>
            
            <div 
              ref={stageCardRef}
              onClick={toggleTooltip}
              className="relative cursor-pointer group/tooltip bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:border-brand-gold hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition flex flex-col justify-center min-h-[100px] min-w-0"
            >
               <div className="flex items-start gap-2 text-gray-400 mb-1.5 text-xs uppercase w-full">
                 <Layers size={14} className="shrink-0 mt-0.5"/> 
                 <span className="line-clamp-2 leading-tight">{tAuth('companyStage')}</span>
               </div>
               <div className="text-xs sm:text-sm md:text-lg font-bold text-brand-gold whitespace-nowrap overflow-hidden text-ellipsis leading-tight">
                 {project.companyStage ? project.companyStage[locale] : ''}
               </div>
               
               {showStageTooltip && stageInfo && (
                 <div 
                    className={`absolute left-1/2 -translate-x-1/2 w-64 bg-brand-dark border border-brand-gold/30 p-4 rounded-xl shadow-2xl z-9999 animate-fade-in cursor-default ${
                        tooltipPlacement === 'top' 
                            ? 'bottom-[calc(100%+12px)]' 
                            : 'top-[calc(100%+12px)]'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                 >
                    <div className="text-sm text-gray-200 leading-relaxed text-center">
                       <strong className="block text-brand-gold mb-2 border-b border-brand-gold/20 pb-2">{stageInfo.label[locale]}</strong>
                       {stageInfo.desc ? stageInfo.desc[locale] : ''}
                    </div>
                    <div className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent ${
                        tooltipPlacement === 'top'
                            ? 'top-full border-t-8 border-t-brand-dark'
                            : 'bottom-full border-b-8 border-b-brand-dark'
                    }`}></div>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-brand-dark p-8 rounded-2xl border border-white/5">
            <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-4">{locale === 'en' ? 'Project Overview (Summary)' : 'الملف المختصر (نظرة عامة)'}</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-400 text-sm font-bold uppercase mb-2">{tAuth('investmentReason')}</h3>
                <p className="text-gray-300 leading-relaxed">
                  {project.investmentReason ? project.investmentReason[locale] : project.descriptionShort[locale]}
                </p>
              </div>
              <div>
                 <h3 className="text-gray-400 text-sm font-bold uppercase mb-2">{locale === 'en' ? 'Activity Description' : 'وصف النشاط'}</h3>
                 <p className="text-gray-300 leading-relaxed">
                   {project.descriptionShort[locale]}
                 </p>
              </div>
            </div>
          </div>
            
          {unlocked ? (
            <div className="bg-emerald-900/10 border border-green-500/20 p-8 rounded-xl animate-fade-in">
              <h2 className="text-xl font-bold mb-4 border-b border-green-500/20 pb-4 text-green-400 flex items-center gap-2">
                <Unlock size={20} /> {locale === 'en' ? 'Project File (Full Details)' : 'كراسة المشروع (التفاصيل الكاملة)'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div className="bg-black/40 p-4 rounded-lg">
                    <span className="block text-gray-400 text-xs uppercase mb-1">{tAuth('shareToSell')}</span>
                    <span className="text-2xl font-bold text-brand-gold font-sans">{project.shareOffered}%</span>
                 </div>
                 <div className="bg-black/40 p-4 rounded-lg">
                    <span className="block text-gray-400 text-xs uppercase mb-1">{tCommon('financial')}</span>
                    <span className="text-2xl font-bold text-white block mb-1">{localizedHealth}</span>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        {healthInfo ? healthInfo.desc[locale] : ''}
                    </p>
                 </div>
              </div>

              <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2 uppercase text-sm">
                 {tAuth('fullDetails')}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {project.descriptionFull[locale]}
              </p>
              
              <div className="mt-8 flex gap-4 border-t border-green-500/20 pt-6">
                <button onClick={() => requestInterest(project.id)} className="flex-1 bg-brand-gold text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition">
                  {tCommon('interested')}
                </button>
                <a href={`mailto:admin@bi.com?subject=Interest in ${project.id}`} className="flex-1 bg-white/10 text-white font-bold py-3 rounded-lg hover:bg-white/20 transition text-center">
                  {locale === 'en' ? 'Contact Admin' : 'تواصل مع الإدارة'}
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-brand-gray border border-dashed border-white/20 p-10 rounded-xl text-center relative overflow-hidden">
               <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)] opacity-20 pointer-events-none"></div>
               <div className="relative z-10">
                <Lock className="w-12 h-12 text-brand-gold mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{locale === 'en' ? 'Full Details & Equity Info Locked' : 'التفاصيل الكاملة وحصة الأسهم مقفلة'}</h3>
                <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                  {tCommon('lockedDetails')}
                </p>
                <div className="flex justify-center gap-8 text-sm text-gray-500 mb-6 blur-sm select-none">
                   <span>{tAuth('shareToSell')}</span>
                   <span>{tAuth('fullDetails')}</span>
                   <span>Financials</span>
                </div>
                <button onClick={handlePurchase} className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition shadow-lg shadow-white/10">
                  {tCommon('buyFile')} (<Money value={10} />)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-brand-dark p-6 rounded-xl border border-white/5">
             <h3 className="font-bold mb-4 text-gray-200">{locale === 'en' ? 'Investment Highlights' : 'أبرز نقاط الاستثمار'}</h3>
             <ul className="space-y-3">
               <li className="flex items-center gap-3 text-sm text-gray-400">
                 <CheckCircle size={16} className="text-brand-gold" />
                 <span>{locale === 'en' ? 'Verified Ownership' : 'ملكية موثقة'}</span>
               </li>
               <li className="flex items-center gap-3 text-sm text-gray-400">
                 <CheckCircle size={16} className="text-brand-gold" />
                 <span>{locale === 'en' ? 'Audited Financials' : 'بيانات مالية مدققة'}</span>
               </li>
               <li className="flex items-center gap-3 text-sm text-gray-400">
                 <CheckCircle size={16} className="text-brand-gold" />
                 <span>{locale === 'en' ? 'Admin Escrow Available' : 'خدمة الضمان الإداري متاحة'}</span>
               </li>
             </ul>
          </div>
          <div className="p-4 bg-brand-gold/10 border border-brand-gold/20 rounded-xl">
             <p className="text-xs text-brand-gold text-center">
               {tCommon('commission')}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
