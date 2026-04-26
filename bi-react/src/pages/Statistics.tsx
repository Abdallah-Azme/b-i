import React from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase, Users, Building, FileText, CheckCircle, Activity, Radio } from 'lucide-react';
import { useStatistics } from '../features/general/hooks/useStatistics';

export const Statistics: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useStatistics();
  const s = data?.data;

  const stats = [
    {
       label: t('stats.projects'),
       value: s?.projects_count ?? 0,
       icon: Briefcase,
       color: 'text-blue-400',
       bg: 'bg-blue-500/10',
       border: 'border-blue-500/20'
    },
    {
       label: t('stats.investors'),
       value: s?.investors_count ?? 0,
       icon: Users,
       color: 'text-brand-gold',
       bg: 'bg-brand-gold/10',
       border: 'border-brand-gold/20'
    },
    {
       label: t('stats.owners'),
       value: s?.advertisers_count ?? 0,
       icon: Building,
       color: 'text-purple-400',
       bg: 'bg-purple-500/10',
       border: 'border-purple-500/20'
    },
    {
       label: t('stats.proposed'),
       value: s?.proposed_deals_count ?? 0,
       icon: FileText,
       color: 'text-orange-400',
       bg: 'bg-orange-500/10',
       border: 'border-orange-500/20'
    },
    {
       label: t('stats.successful'),
       value: s?.successful_deals_count ?? 0,
       icon: CheckCircle,
       color: 'text-green-400',
       bg: 'bg-green-500/10',
       border: 'border-green-500/20'
    },
    {
       label: t('stats.usersOnline'),
       value: s?.online_users_count ?? 0,
       icon: Radio,
       color: 'text-emerald-400',
       bg: 'bg-emerald-500/10',
       border: 'border-emerald-500/20'
    }
  ];

  const total = stats.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16 animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mb-6 relative">
          <Activity size={32} />
          <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{t('stats.title')}</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          {t('stats.subtitle')}
        </p>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {isLoading
           ? Array.from({ length: 6 }).map((_, i) => (
               <div key={i} className="p-8 rounded-2xl border border-white/10 bg-white/5 animate-pulse flex flex-col items-center gap-4">
                 <div className="w-16 h-16 rounded-full bg-white/10" />
                 <div className="h-4 w-24 rounded bg-white/10" />
                 <div className="h-12 w-16 rounded bg-white/10" />
               </div>
             ))
           : stats.map((stat, index) => (
               <div
                 key={index}
                 className={`p-8 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col items-center text-center group ${stat.bg} ${stat.border}`}
               >
                 <div className={`w-16 h-16 rounded-full ${stat.bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 border ${stat.border}`}>
                   <stat.icon size={32} className={stat.color} />
                 </div>
                 <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">{stat.label}</h3>
                 <p className={`text-5xl font-bold ${stat.color} drop-shadow-lg font-sans`}>{stat.value}</p>
               </div>
             ))}
       </div>
      
      <div className="mt-16 text-center bg-brand-gray/20 border border-white/5 p-8 rounded-2xl">
         <p className="text-gray-500 uppercase tracking-widest text-xs mb-2">{t('stats.totalActivity')}</p>
         <p className="text-6xl font-bold text-white tracking-tighter font-sans">{total}</p>
      </div>
    </div>
  );
};
