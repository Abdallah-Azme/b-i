'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Logo } from './logo';

export const Footer: React.FC = () => {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');


  return (
    <footer className="bg-brand-dark border-t border-white/10 mt-auto hidden md:block">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative inline-flex items-center justify-center overflow-visible rounded-full">
                  <div className="absolute -inset-[13px] rounded-full blur-[11px] z-0 pointer-events-none bg-[radial-gradient(circle,rgba(212,175,55,0.35)_0%,rgba(212,175,55,0.15)_40%,rgba(212,175,55,0.00)_70%)]"></div>
                  <Logo className="w-8 h-8 relative z-10" />
              </div>
              <span className="text-lg font-bold relative z-10 text-white">
                {t('title')}
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              {t('desc')}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-brand-gold tracking-wider uppercase mb-4">{t('platform')}</h3>
            <ul className="space-y-3">
              <li><Link href="/projects" className="text-gray-400 hover:text-white text-sm transition-colors">{tNav('projects')}</Link></li>
              <li><Link href="/investors" className="text-gray-400 hover:text-white text-sm transition-colors">{tNav('investors')}</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-white text-sm transition-colors">{tNav('pricing')}</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">{tNav('about')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-brand-gold tracking-wider uppercase mb-4">{t('legal')}</h3>
            <ul className="space-y-3">
              <li><Link href="/terms-of-use" className="text-gray-400 hover:text-white text-sm transition-colors">{t('terms')}</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">{t('privacy')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 flex flex-col items-center gap-3">
          <p className="text-gray-500 text-xs">&copy; 2024 Business & Investments. {t('rights')}</p>
          <a 
            href="https://raiyansoft.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-600 hover:text-brand-gold text-[10px] tracking-widest uppercase transition-colors duration-300"
          >
            Powered by RaiyanSoft
          </a>
        </div>
      </div>
    </footer>
  );
};
