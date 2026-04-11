'use client';

import React, { useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Globe, User as UserIcon, LogOut } from 'lucide-react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { Logo } from './logo';
import { SAMPLE_PROJECTS } from '@/features/projects/services/project-api';
import { SAMPLE_INVESTORS } from '@/features/investors/services/investor-api';
import { useAuth } from '@/features/auth/hooks/use-auth';

export const TopNavbar: React.FC = () => {
  const locale = useLocale();
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const isActive = (path: string) => pathname === path ? "text-brand-gold font-bold" : "text-gray-300 hover:text-brand-gold transition-colors";

  const totalStats = useMemo(() => {
    // Exact totals from React logic (projects + investors + static stats)
    return SAMPLE_PROJECTS.length + SAMPLE_INVESTORS.length + 142 + 89 + 34;
  }, []);

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <nav className="fixed w-full z-40 bg-black/80 backdrop-blur-md border-b border-white/10 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/" className="relative inline-flex items-center justify-center overflow-visible rounded-full">
               <div className="absolute -inset-[13px] rounded-full blur-[11px] z-0 pointer-events-none bg-[radial-gradient(circle,rgba(212,175,55,0.35)_0%,rgba(212,175,55,0.15)_40%,rgba(212,175,55,0.00)_70%)]"></div>
               <Logo className="w-10 h-10 relative z-10" />
            </Link>
            <span className="text-lg font-bold tracking-wide hidden md:block uppercase">
               {locale === 'en' ? 'Business & Investments' : 'الأعمال والاستثمارات'}
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/statistics" 
              className="flex items-center gap-2 bg-emerald-600/10 border border-emerald-500/40 text-emerald-400 px-4 py-1.5 rounded-full hover:bg-emerald-600 hover:text-white transition group"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse group-hover:bg-white"></div>
              <span className="text-sm font-bold">{t('stats')}</span>
              <span className="bg-emerald-500 text-black text-[10px] font-bold px-1.5 rounded-full group-hover:bg-white group-hover:text-emerald-600 transition">
                {totalStats}
              </span>
            </Link>

            <button onClick={toggleLanguage} className="flex items-center gap-1 text-sm border border-white/20 px-3 py-1 rounded-full hover:bg-white/10 transition">
              <Globe size={14} />
              {locale === 'en' ? 'العربية' : 'English'}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="flex items-center gap-2 bg-brand-gray px-4 py-2 rounded-lg hover:bg-brand-gray/80 transition">
                  <UserIcon size={16} />
                  <span>{t('dashboard')}</span>
                </Link>
                <button onClick={logout} className="text-gray-400 hover:text-red-500 transition">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link href="/login-type" className="bg-brand-white text-black px-6 py-2 rounded-lg font-bold hover:bg-gray-200 transition">
                {t('login')}
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center gap-3">
            <Link 
              href="/statistics" 
              className="flex items-center gap-1.5 bg-emerald-600/10 border border-emerald-500/40 text-emerald-400 px-3 py-1 rounded-full"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold">{t('stats')}</span>
              <span className="bg-emerald-500 text-black text-[9px] font-bold px-1 rounded-full leading-tight">
                {totalStats}
              </span>
            </Link>
          </div>
        </div>

        {/* Second Row (Desktop only) */}
        <div className="hidden md:flex items-center justify-center h-12 border-t border-white/10 gap-8">
          <Link href="/" className={isActive('/')}>{t('home')}</Link>
          <Link href="/projects" className={isActive('/projects')}>{t('projects')}</Link>
          <Link href="/investors" className={isActive('/investors')}>{t('investors')}</Link>
          <Link href="/pricing" className={isActive('/pricing')}>{t('pricing')}</Link>
          <Link href="/about" className={isActive('/about')}>{t('about')}</Link>
        </div>
      </div>
    </nav>
  );
};
