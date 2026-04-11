'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Briefcase, Users, Building, FileText, CheckCircle, Activity, Radio } from 'lucide-react';
import { SAMPLE_PROJECTS, EXTRA_STATS } from '@/features/projects/services/project-api';
import { SAMPLE_INVESTORS } from '@/features/investors/services/investor-api';

export const StatisticsClient: React.FC = () => {
  const t = useTranslations('stats');
  const [onlineUsers, setOnlineUsers] = useState(24);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => Math.max(15, Math.min(40, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
       label: t('projects'),
       value: SAMPLE_PROJECTS.length,
       icon: Briefcase,
       color: 'text-blue-400',
       bg: 'bg-blue-500/10',
       border: 'border-blue-500/20'
    },
    {
       label: t('investors'),
       value: SAMPLE_INVESTORS.length,
       icon: Users,
       color: 'text-brand-gold',
       bg: 'bg-brand-gold/10',
       border: 'border-brand-gold/20'
    },
    {
       label: t('owners'),
       value: EXTRA_STATS.companyOwners,
       icon: Building,
       color: 'text-purple-400',
       bg: 'bg-purple-500/10',
       border: 'border-purple-500/20'
    },
    {
       label: t('proposed'),
       value: EXTRA_STATS.proposedDeals,
       icon: FileText,
       color: 'text-orange-400',
       bg: 'bg-orange-500/10',
       border: 'border-orange-500/20'
    },
    {
       label: t('successful'),
       value: EXTRA_STATS.successfulDeals,
       icon: CheckCircle,
       color: 'text-green-400',
       bg: 'bg-green-500/10',
       border: 'border-green-500/20'
    },
    {
       label: t('onlineNow'),
       value: onlineUsers,
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
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{t('title')}</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {stats.map((stat, index) => (
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
         <p className="text-gray-500 uppercase tracking-widest text-xs mb-2">{t('totalActivity')}</p>
         <p className="text-6xl font-bold text-white tracking-tighter font-sans">{total}</p>
      </div>
    </div>
  );
};
