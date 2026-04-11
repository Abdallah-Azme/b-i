'use client';

import React, { useState } from 'react';
import { useProjects } from '@/features/projects/hooks/use-projects';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname, Link } from '@/i18n/routing';
import Image from 'next/image';
import { 
  Settings, Megaphone, FileText, CheckCircle, DollarSign, 
  TrendingUp, Wallet, PlusCircle, 
  Edit3, Menu,
  LogIn, Globe2, Info, Mail, Shield, ChevronRight, ChevronLeft,
  Star, Briefcase, Bell, Lock,
  type LucideIcon
} from 'lucide-react';
import { Project } from '@/shared/types';
import { EditProfileModal } from './edit-profile-modal';
import { IncomingRequestsTab } from './incoming-requests-tab';
import { SentInterestsTab } from './sent-interests-tab';
import { OngoingRequestsTab } from './ongoing-requests-tab';
import { VerificationInfoTab } from './verification-info-tab';
import { NotificationsTab } from './notifications-tab';
import { DashboardProjectCard } from './dashboard-project-card';
import { EmptyState } from './empty-state';
import { useNotifications } from '@/features/notifications/hooks/use-notifications';

const formatCompact = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1
  }).format(num);
};

interface DashboardClientProps {
  initialProjects?: Project[];
}

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

export const DashboardClient: React.FC<DashboardClientProps> = ({ initialProjects = [] }) => {
  const { data: allProjects = initialProjects } = useProjects();
  const { user, logout, isLoading, updateUser } = useAuth();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('dashboard');
  const tTabs = useTranslations('tabs');
  const tMenu = useTranslations('moreMenu');
  const isAr = locale === 'ar';
  
  const { unreadCount } = useNotifications();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  const myAds = React.useMemo(() => 
    allProjects.filter((p: Project) => user && p.ownerId === user.id),
    [allProjects, user]
  );

  const myBooklets = React.useMemo(() => 
    allProjects.filter((p: Project) => user && user.unlockedProjects?.includes(p.id)),
    [allProjects, user]
  );
  
  const stats = React.useMemo(() => {
    if (!user) return [];
    const totalValue = myAds.reduce((acc: number, p: Project) => acc + p.askingPrice, 0);
    return user.role === 'advertiser' 
      ? [
          { icon: Megaphone, value: myAds.length, label: t('myAds'), type: 'number' },
          { icon: CheckCircle, value: 12, label: t('successDeals'), type: 'number' },
          { icon: DollarSign, value: totalValue, label: t('portfolioValue'), type: 'compact' }
        ]
      : [
          { icon: FileText, value: myBooklets.length, label: t('booklets'), type: 'number' },
          { icon: TrendingUp, value: 5, label: t('investments'), type: 'number' },
          { icon: Wallet, value: user.investorCapital || 500000, label: t('capital'), type: 'compact' }
        ];
  }, [user, myAds, myBooklets, t]);

  const tabs = React.useMemo<Tab[]>(() => {
    if (!user) return [];
    return user.role === 'advertiser' 
      ? [
          { id: 'ads', label: t('myAds'), icon: Megaphone },
          { id: 'booklets', label: t('booklets'), icon: FileText },
          { id: 'incoming', label: t('incomingRequests'), icon: Mail },
          { id: 'verification', label: isAr ? 'معلومات التحقق' : 'Verification Info', icon: Shield },
          { id: 'settings', label: t('settings'), icon: Settings },
        ]
      : [
          { id: 'booklets', label: t('purchasedBooklets'), icon: FileText },
          { id: 'interests', label: t('sentInterests'), icon: Star },
          { id: 'requests', label: t('investments'), icon: Briefcase },
          { id: 'notifications', label: tTabs('notifications'), icon: Bell, badge: unreadCount },
          { id: 'settings', label: t('settings'), icon: Settings },
        ];
  }, [user, t, tTabs, unreadCount, isAr]);

  const [activeTab, setActiveTab] = useState<string | null>(null);
  
  const displayTab = React.useMemo(() => {
     if (tabs.length === 0) return null;
     if (activeTab && tabs.find(t => t.id === activeTab)) return activeTab;
     return tabs[0].id;
  }, [tabs, activeTab]);

  if (!user && !isLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 min-h-[75vh] animate-fade-in flex flex-col">
         <h1 className="text-3xl font-bold mb-8 text-white">{tTabs('dashboard')}</h1>
         
         <div className="space-y-3">
            <button 
              onClick={() => router.push('/login-type')} 
              className="w-full flex items-center gap-4 p-4 bg-brand-gold text-black rounded-xl hover:bg-yellow-500 transition shadow-lg shadow-brand-gold/10 group mb-6"
            >
               <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center">
                  <LogIn size={20} className="text-black" />
               </div>
               <div className="flex-1 text-left rtl:text-right">
                  <h3 className="font-bold text-lg">{isAr ? 'تسجيل الدخول' : 'Log in'}</h3>
                  <p className="text-xs opacity-75 font-medium">
                    {t('loginDesc')}
                  </p>
               </div>
               {isAr ? <ChevronLeft size={20} className="opacity-50" /> : <ChevronRight size={20} className="opacity-50" />}
            </button>
            
            <div className="h-px bg-white/10 my-4"></div>

            <button onClick={toggleLanguage} className="w-full flex items-center gap-4 p-4 bg-brand-gray/20 border border-white/5 rounded-xl hover:bg-brand-gray/40 transition group">
              <Globe2 className="text-brand-gold" size={20} />
              <div className="flex-1 text-left rtl:text-right flex justify-between items-center">
                 <span className="font-medium text-gray-200">{tMenu('language')}</span>
                 <span className="text-xs text-gray-400 bg-black/50 px-2 py-1 rounded">{locale === 'en' ? 'English' : 'العربية'}</span>
              </div>
            </button>

            <Link href="/about" className="w-full flex items-center gap-4 p-4 bg-brand-gray/20 border border-white/5 rounded-xl hover:bg-brand-gray/40 transition">
              <Info className="text-gray-400" size={20} />
              <span className="font-medium text-gray-200">{tMenu('about')}</span>
            </Link>

            <a href="mailto:support@bi.com" className="w-full flex items-center gap-4 p-4 bg-brand-gray/20 border border-white/5 rounded-xl hover:bg-brand-gray/40 transition">
              <Mail className="text-gray-400" size={20} />
              <span className="font-medium text-gray-200">{tMenu('contact')}</span>
            </a>

            <Link href="/terms-of-use" className="w-full flex items-center gap-4 p-4 bg-brand-gray/20 border border-white/5 rounded-xl hover:bg-brand-gray/40 transition">
              <FileText className="text-gray-400" size={20} />
              <span className="font-medium text-gray-200">{tMenu('terms')}</span>
            </Link>

            <Link href="/privacy-policy" className="w-full flex items-center gap-4 p-4 bg-brand-gray/20 border border-white/5 rounded-xl hover:bg-brand-gray/40 transition">
              <Shield className="text-gray-400" size={20} />
              <span className="font-medium text-gray-200">{tMenu('privacy')}</span>
            </Link>
         </div>

         <div className="p-8 text-center mt-auto">
            <p className="text-xs text-gray-600">App Version 1.0.3</p>
         </div>
      </div>
    );
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white font-bold animate-pulse">{t('loading')}</div>
    );
  }
      
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 min-h-screen relative">
      
      <Link 
        href="/more" 
        className="md:hidden absolute top-6 right-4 text-gray-300 hover:text-brand-gold transition-colors z-10 p-2"
        aria-label={isAr ? "فتح القائمة" : "Open menu"}
      >
        <Menu size={28} strokeWidth={2} />
      </Link>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 mb-10">
        <div className="relative group shrink-0">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-brand-gold p-1 bg-black">
            <div className="w-full h-full rounded-full overflow-hidden bg-brand-gray relative flex items-center justify-center">
                {user.role === 'advertiser' && user.companyLicenseUrl ? (
                  <Image 
                    src={user.companyLicenseUrl} 
                    alt="Profile" 
                    fill
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span className="text-3xl font-bold text-gray-500">{user.name.charAt(0)}</span>
                )}
            </div>
          </div>
        </div>

        <div className="flex-1 text-center md:text-start w-full">
           <div className="flex flex-col md:flex-row items-center md:items-baseline gap-2 md:gap-4 mb-3 justify-center md:justify-start">
              <h1 className="text-2xl md:text-3xl font-bold text-white font-alexandria">{user.name}</h1>
              <div className="flex items-center gap-2">
                 <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] text-gray-300 font-mono tracking-wider">
                   {user.id}
                 </span>
                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${user.role === 'advertiser' ? 'bg-brand-gold/20 text-brand-gold border-brand-gold/20' : 'bg-blue-500/20 text-blue-400 border-blue-500/20'}`}>
                    {user.role === 'advertiser' ? t('owner') : t('investor')}
                 </span>
              </div>
           </div>

           <div className="flex items-center justify-center md:justify-start gap-3 w-full">
             {user.role === 'advertiser' && (
               <Link href="/advertiser/new-listing" className="flex-1 md:flex-none bg-brand-gold text-black px-6 py-2.5 rounded-lg font-bold hover:bg-yellow-500 transition text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-gold/10">
                 <PlusCircle size={18} />
                 {t('publishAd')}
               </Link>
             )}
             <button 
               onClick={() => setIsEditModalOpen(true)}
               className="flex-1 md:flex-none bg-brand-gray border border-white/10 hover:border-white/30 text-white px-6 py-2.5 rounded-lg font-bold transition text-sm flex items-center justify-center gap-2"
             >
               <Edit3 size={18} />
               {t('editProfile')}
             </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-8 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center">
            <div 
               className="w-full aspect-square md:aspect-auto md:h-32 bg-brand-gray/30 border border-white/5 rounded-2xl flex flex-col items-center justify-center group hover:bg-brand-gray/50 hover:border-brand-gold/30 transition relative cursor-default" 
            >
               <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-gray-500 group-hover:text-brand-gold transition mb-2" strokeWidth={1.5} />
               <span className="text-xl md:text-3xl font-bold text-white tracking-tight font-sans">
                  {stat.type === 'compact' ? formatCompact(stat.value) : stat.value}
               </span>
            </div>
            <span className="text-[10px] md:text-xs text-gray-500 font-medium mt-2 uppercase tracking-wide text-center">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="border-b border-white/10 mb-8 overflow-x-auto">
         <div className="flex justify-start md:justify-center gap-2 md:gap-8 min-w-max">
            {tabs.map(tab => (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`group flex items-center gap-2 py-4 border-b-2 transition-all relative ${displayTab === tab.id ? 'border-brand-gold text-brand-gold' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
               >
                 <tab.icon size={16} />
                 <span className="text-xs font-bold uppercase tracking-widest">{tab.label}</span>
                 {'badge' in tab && tab.badge !== undefined && tab.badge > 0 && (
                   <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] text-white font-bold border border-black">
                      {tab.badge}
                   </span>
                 )}
               </button>
            ))}
         </div>
      </div>

      <div className="animate-fade-in min-h-[300px]">
         {displayTab === 'ads' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {myAds.length > 0 ? myAds.map((p: Project) => (
                 <DashboardProjectCard key={p.id} project={p} locale={locale} type="ad" />
               )) : (
                 <EmptyState 
                   icon={Megaphone} 
                   title={t('noAds')}
                   desc={t('startNow')}
                   action={
                     <Link href="/advertiser/new-listing" className="text-brand-gold hover:underline mt-2 inline-block text-sm font-bold">
                       {t('publishAd')}
                     </Link>
                   }
                 />
               )}
            </div>
         )}

         {displayTab === 'booklets' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {myBooklets.length > 0 ? myBooklets.map((p: Project) => (
                 <DashboardProjectCard key={p.id} project={p} locale={locale} type="booklet" />
               )) : (
                 <EmptyState 
                   icon={FileText} 
                   title={t('noBooklets')}
                   desc={t('browseProjects')}
                   action={
                     <Link href="/projects" className="text-brand-gold hover:underline mt-2 inline-block text-sm font-bold">
                       {tTabs('projects')}
                     </Link>
                   }
                 />
               )}
            </div>
         )}

         {displayTab === 'incoming' && <IncomingRequestsTab locale={locale} />}
         {displayTab === 'verification' && <VerificationInfoTab locale={locale} />}
         {displayTab === 'interests' && <SentInterestsTab locale={locale} />}
         {displayTab === 'requests' && <OngoingRequestsTab locale={locale} />}
         {displayTab === 'notifications' && <NotificationsTab locale={locale} />}

         {displayTab === 'settings' && (
           <div className="bg-brand-gray/10 p-4 md:p-8 rounded-2xl border border-white/5 max-w-2xl">
              <div className="space-y-4">
                 <button onClick={toggleLanguage} className="w-full flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 transition hover:bg-black/60">
                    <div className="flex items-center gap-3">
                       <Globe2 className="text-brand-gold" size={20} />
                       <span className="font-medium text-sm text-gray-200">{tMenu('language')}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 bg-black/50 px-2 py-1 rounded">{locale === 'en' ? 'English' : 'العربية'}</span>
                 </button>

                 <button className="w-full flex items-center gap-3 p-4 bg-black/40 rounded-xl border border-white/5 transition hover:bg-white/5">
                    <Lock className="text-gray-400" size={20} />
                    <span className="font-medium text-sm text-gray-200">{locale === 'en' ? 'Change Password' : 'تغيير كلمة المرور'}</span>
                 </button>

                 <button 
                  onClick={() => { logout(); router.push('/'); }}
                  className="w-full flex items-center gap-3 p-4 bg-black/40 rounded-xl border border-white/5 transition hover:bg-red-500/10 text-red-500"
                >
                   <LogIn size={20} />
                   <span className="font-bold text-sm tracking-wide">{t('logout')}</span>
                 </button>
              </div>
           </div>
         )}
      </div>

      <EditProfileModal 
        user={user} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onSave={(data) => {
          updateUser(data);
        }}
      />
    </div>
  );
};
