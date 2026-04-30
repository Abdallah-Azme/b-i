
import React, { useMemo } from 'react';
import { useStore } from '../hooks/useStore';
import { useTranslation } from 'react-i18next';
import { useStatistics } from '../features/general/hooks/useStatistics';
import { Logo } from './Logo';
import { Globe, User as UserIcon, LogOut, Home, Briefcase, Users, Bell, Heart, MoreHorizontal } from 'lucide-react';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { NotificationDropdown } from '@/features/auth/ui/NotificationDropdown';
import { useUnreadNotificationsCount } from '@/features/auth/hooks/useNotifications';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang, toggleLanguage } = useStore();
  const { t } = useTranslation();
  const { isAuthenticated, logout: apiLogout } = useAuth();
  
  const { data: unreadCountData } = useUnreadNotificationsCount();
  const unreadCount = unreadCountData?.data?.unread_notifications_count ?? 0;
  const navigate = useNavigate();

  const location = useLocation();

  // Redirect authenticated users away from auth pages
  const authOnlyRoutes = ['/login', '/login-type', '/signup', '/register-type', '/verify-email', '/forgot-password'];
  const isOnAuthRoute = authOnlyRoutes.some(r => location.pathname.startsWith(r));
  React.useEffect(() => {
    if (isAuthenticated && isOnAuthRoute) {
      navigate({ to: '/dashboard' });
    }
  }, [isAuthenticated, isOnAuthRoute]);

  // Logout: clear token + legacy store state
  const handleLogout = () => {
    apiLogout();
  };

  const isActive = (path: string) => location.pathname === path ? "text-brand-gold font-bold" : "text-gray-300 hover:text-brand-gold transition-colors";
  
  const { data: statsData } = useStatistics();
  const s = statsData?.data;

  // Calculate Total Stats for Badge
  const totalStats = useMemo(() => {
    if (!s) return 0;
    return (s.projects_count || 0) + 
           (s.investors_count || 0) + 
           (s.advertisers_count || 0) + 
           (s.proposed_deals_count || 0) + 
           (s.successful_deals_count || 0) + 
           (s.online_users_count || 0);
  }, [s]);

  // Mobile Tab Bar Item Component
  const TabItem = ({ to, icon: Icon, label, badge }: { to: any, icon: any, label: string, badge?: number }) => {
    let active = false;
    
    if (to === '/') {
      active = location.pathname === '/';
    } else if (to === '/dashboard') {
      // Active for dashboard, advertiser sub-routes, AND auth/login routes
      // This ensures the tab stays active if the user is redirected to login or navigating auth flow
      const authRoutes = ['/login', '/signup', '/register-type', '/login-type', '/verify-email'];
      active = location.pathname.startsWith('/dashboard') || 
               location.pathname.startsWith('/advertiser') ||
               authRoutes.some(route => location.pathname.startsWith(route));
    } else {
      // For other tabs like /projects, /investors, /more - check if path starts with the base route
      active = location.pathname.startsWith(to);
    }

    const colorClass = active ? "text-brand-gold" : "text-gray-500";
    
    return (
      <Link 
        to={to} 
        className="flex-1 h-full flex items-center justify-center relative"
        aria-label={badge && badge > 0 ? `${label}, ${badge} ${lang === 'ar' ? 'غير مقروءة' : 'unread'}` : label}
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

  if (!t) return null; // Should not happen with fallback

  return (
    <div className="min-h-screen bg-brand-black flex flex-col text-white">
      {/* Top Navbar (Desktop + Mobile) */}
      <nav className="fixed w-full z-40 bg-black/80 backdrop-blur-md border-b border-white/10 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row */}
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {/* Desktop: logo navigates to home */}
              <Link to="/" className="relative hidden md:inline-flex items-center justify-center overflow-visible rounded-full">
                 {/* Logo Glow Effect - Reduced Intensity (50%) */}
                 <div className="absolute -inset-[13px] rounded-full blur-[11px] z-0 pointer-events-none bg-[radial-gradient(circle,rgba(212,175,55,0.35)_0%,rgba(212,175,55,0.15)_40%,rgba(212,175,55,0.00)_70%)]"></div>
                 <Logo className="w-10 h-10 relative z-10" />
              </Link>
              {/* Mobile: logo is non-clickable */}
              <div className="relative inline-flex md:hidden items-center justify-center overflow-visible rounded-full">
                 <div className="absolute -inset-[13px] rounded-full blur-[11px] z-0 pointer-events-none bg-[radial-gradient(circle,rgba(212,175,55,0.35)_0%,rgba(212,175,55,0.15)_40%,rgba(212,175,55,0.00)_70%)]"></div>
                 <Logo className="w-10 h-10 relative z-10" />
              </div>
              <span className="text-lg font-bold tracking-wide hidden md:block uppercase">
                 {lang === 'en' ? 'Business & Investments' : 'الأعمال والاستثمارات'}
              </span>
            </div>
            
            {/* Top Row Desktop Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {/* Stats Button */}
              <Link 
                to="/stats" 
                className="flex items-center gap-2 bg-gold-gradient text-black px-4 py-1.5 rounded-full hover:scale-105 transition-all duration-300 group shadow-lg shadow-brand-gold-glow"
              >
                <div className="w-2 h-2 rounded-full bg-black animate-pulse"></div>
                <span className="text-sm font-bold">{t('nav.stats')}</span>
                <span className="bg-black/20 text-black text-[10px] font-bold px-1.5 rounded-full">
                  {totalStats}
                </span>
              </Link>

              <button onClick={toggleLanguage} className="flex items-center gap-1 text-sm border border-white/20 px-3 py-1 rounded-full hover:bg-white/10 transition">
                <Globe size={14} />
                {lang === 'en' ? 'العربية' : 'English'}
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <NotificationDropdown />
                  <Link to="/dashboard" className="flex items-center gap-2 bg-brand-gray px-4 py-2 rounded-lg hover:bg-brand-gray/80 transition">
                    <UserIcon size={16} />
                    <span>{t('nav.dashboard')}</span>
                  </Link>
                  <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link to="/login-type" className="bg-brand-white text-black px-6 py-2 rounded-lg font-bold hover:bg-gray-200 transition">
                  {t('nav.login')}
                </Link>
              )}
            </div>

            {/* Mobile Top Header Elements */}
            <div className="md:hidden flex items-center gap-3">
              {/* Mobile Stats Button (Compact) */}
              <Link 
                to="/stats" 
                className="flex items-center gap-1.5 bg-emerald-600/10 border border-emerald-500/40 text-emerald-400 px-3 py-1 rounded-full"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-bold">{t('nav.stats')}</span>
                <span className="bg-emerald-500 text-black text-[9px] font-bold px-1 rounded-full leading-tight">
                  {totalStats}
                </span>
              </Link>
              {/* Removed redundant NotificationDropdown from mobile header as it exists in bottom tab bar */}
            </div>
          </div>

          {/* Second Row (Desktop only) */}
          <div className="hidden md:flex items-center justify-center h-12 border-t border-white/10 gap-8">
            <Link to="/" className={isActive('/')}>{t('nav.home')}</Link>
            <Link to="/projects" className={isActive('/projects')}>{t('nav.projects')}</Link>
            <Link to="/favorites" className={isActive('/favorites')}>{t('tabs.favorites')}</Link>
            <Link to="/investors" className={isActive('/investors')}>{t('nav.investors')}</Link>
            {/* <Link to="/pricing" className={isActive('/pricing')}>{t('nav.pricing')}</Link> */}
            <Link to="/about" className={isActive('/about')}>{t('nav.about')}</Link>
          </div>
        </div>
      </nav>

      {/* Main Content - Added padding bottom for mobile tab bar */}
      <main className="flex-grow pt-24 pb-24 md:pb-0 animate-fade-in">
        {children}
      </main>

      {/* Footer (Desktop Only mostly, or visible at bottom of scroll on mobile) */}
      <footer className="bg-brand-dark border-t border-white/10 mt-auto hidden md:block">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative inline-flex items-center justify-center overflow-visible rounded-full">
                    {/* Footer Logo Glow - Reduced Intensity (50%) */}
                    <div className="absolute -inset-[13px] rounded-full blur-[11px] z-0 pointer-events-none bg-[radial-gradient(circle,rgba(212,175,55,0.35)_0%,rgba(212,175,55,0.15)_40%,rgba(212,175,55,0.00)_70%)]"></div>
                    <Logo className="w-8 h-8 relative z-10" />
                </div>
                <span className="text-lg font-bold relative z-10">
                  {t('nav.appName')}
                </span>
              </div>
              <p className="text-gray-400 text-sm max-w-md">
                {t('nav.footerDesc')}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-brand-gold tracking-wider uppercase mb-4">{t('nav.platform')}</h3>
              <ul className="space-y-3">
                <li><Link to="/projects" className="text-gray-400 hover:text-white text-sm">{t('nav.projects')}</Link></li>
                <li><Link to="/investors" className="text-gray-400 hover:text-white text-sm">{t('nav.investors')}</Link></li>
                {/* <li><Link to="/pricing" className="text-gray-400 hover:text-white text-sm">{t('nav.pricing')}</Link></li> */}
                <li><Link to="/about" className="text-gray-400 hover:text-white text-sm">{t('nav.about')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-brand-gold tracking-wider uppercase mb-4">{t('nav.legal')}</h3>
              <ul className="space-y-3">
                <li><Link to="/terms-of-use" className="text-gray-400 hover:text-white text-sm">{t('nav.termsOfUse')}</Link></li>
                <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white text-sm">{t('nav.privacyPolicy')}</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-8 flex flex-col items-center gap-3">
            <p className="text-gray-500 text-xs">&copy; 2024 {t('nav.appName')}. {t('common.allRightsReserved')}</p>
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

      {/* Mobile Bottom Tab Bar */}
      <div className="sticky bottom-0 left-0 right-0 h-20 bg-black/95 backdrop-blur-xl border-t border-white/10 z-50 md:hidden pb-safe flex justify-between items-center px-2 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
         <TabItem to="/" icon={Home} label={t('tabs.home')} />
         <TabItem to="/projects" icon={Briefcase} label={t('tabs.projects')} />
         <TabItem to="/notifications" icon={Bell} label={t('tabs.notifications')} badge={unreadCount} />
         <TabItem to="/dashboard" icon={UserIcon} label={t('tabs.dashboard')} />
         <TabItem to="/more" icon={MoreHorizontal} label={t('tabs.more')} />
      </div>
    </div>
  );
};
