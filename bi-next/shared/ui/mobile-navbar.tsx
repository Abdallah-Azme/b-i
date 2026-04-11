'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Home, Briefcase, Users, Bell, User as UserIcon, type LucideIcon } from 'lucide-react';
import { Link, usePathname } from '@/i18n/routing';
import { useNotifications } from '@/features/notifications/hooks/use-notifications';

const TabItem = ({ href, icon: Icon, label, badge, pathname, locale }: { 
  href: string, 
  icon: LucideIcon, 
  label: string, 
  badge?: number,
  pathname: string,
  locale: string
}) => {
  let active = false;
  
  if (href === '/') {
    active = pathname === '/';
  } else if (href === '/dashboard') {
    const dashboardRoutes = ['/dashboard', '/login', '/signup', '/register-type', '/login-type', '/verify-email', '/advertiser', '/more'];
    active = dashboardRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));
  } else {
    active = pathname.startsWith(href);
  }

  const colorClass = active ? "text-brand-gold" : "text-gray-500";
  
  return (
    <Link 
      href={href} 
      className="flex-1 h-full flex items-center justify-center relative"
      aria-label={badge && badge > 0 ? `${label}, ${badge} ${locale === 'ar' ? 'غير مقروءة' : 'unread'}` : label}
    >
      <div className={`flex flex-col items-center justify-center w-full h-full gap-1 ${colorClass}`}>
        <div className="relative">
          <Icon size={24} strokeWidth={active ? 2.5 : 2} />
          {badge !== undefined && badge > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] text-white font-bold border border-black shadow-sm">
               {badge > 99 ? '99+' : badge}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium">{label}</span>
      </div>
    </Link>
  );
};

export const MobileNavbar: React.FC = () => {
  const locale = useLocale();
  const t = useTranslations('tabs');
  const pathname = usePathname();
  
  const { unreadCount } = useNotifications();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/95 backdrop-blur-xl border-t border-white/10 z-50 md:hidden pb-safe flex justify-between items-center px-2 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
       <TabItem href="/" icon={Home} label={t('home')} pathname={pathname} locale={locale} />
       <TabItem href="/projects" icon={Briefcase} label={t('projects')} pathname={pathname} locale={locale} />
       <TabItem href="/investors" icon={Users} label={t('investors')} pathname={pathname} locale={locale} />
       <TabItem href="/notifications" icon={Bell} label={t('notifications')} badge={unreadCount} pathname={pathname} locale={locale} />
       <TabItem href="/dashboard" icon={UserIcon} label={t('dashboard')} pathname={pathname} locale={locale} />
    </div>
  );
};
