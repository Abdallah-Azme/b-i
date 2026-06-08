import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { User as UserIcon, Bell, Heart, Globe2, Info, Mail, FileText, Shield, Lock, LogOut } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { useWhoWeAre } from '../features/general/hooks/useGeneralLookups';
import { useAuth } from '../features/auth/hooks/useAuth';

type MoreMenuListProps = {
  onItemClick?: () => void;
};

export const MoreMenuList: React.FC<MoreMenuListProps> = ({ onItemClick }) => {
  const { t } = useTranslation();
  const { toggleLanguage } = useStore();
  const { isAuthenticated, user: apiUser, logout: apiLogout } = useAuth();
  const { data: whoWeAreData } = useWhoWeAre();
  const contactEmail = whoWeAreData?.data?.contact_email || 'support@bi.com';
  const displayName = apiUser?.name ?? apiUser?.display_name ?? '';
  const displayEmail = apiUser?.email ?? '';

  const close = () => onItemClick?.();

  return (
    <div className="space-y-2">
      {isAuthenticated && (
        <div className="mb-6 flex items-center gap-4 rounded-xl border border-white/5 bg-brand-gray/50 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/20 text-brand-gold">
            <UserIcon size={24} />
          </div>
          <div>
            <h3 className="font-bold">{displayName}</h3>
            <p className="text-xs text-gray-400">{displayEmail}</p>
          </div>
        </div>
      )}

      <Link to="/notifications" onClick={close} className="flex w-full items-center gap-4 rounded-xl bg-brand-gray/20 p-4 transition hover:bg-brand-gray/40">
        <Bell className="text-brand-gold" size={20} />
        <span className="font-medium">{t('moreMenu.notifications')}</span>
      </Link>

      <Link to="/favorites" onClick={close} className="flex w-full items-center gap-4 rounded-xl bg-brand-gray/20 p-4 transition hover:bg-brand-gray/40">
        <Heart className="text-brand-gold" size={20} />
        <span className="font-medium">{t('moreMenu.favorites')}</span>
      </Link>

      <button
        type="button"
        onClick={() => {
          toggleLanguage();
          close();
        }}
        className="flex w-full items-center gap-4 rounded-xl bg-brand-gray/20 p-4 transition hover:bg-brand-gray/40"
      >
        <Globe2 className="text-brand-gold" size={20} />
        <div className="flex flex-1 items-center justify-between text-start">
          <span className="font-medium">{t('moreMenu.language')}</span>
          <span className="rounded bg-black/50 px-2 py-1 text-xs text-gray-400">{t('common.currentLanguage')}</span>
        </div>
      </button>

      <div className="my-4 h-px bg-white/10" />

      <Link to="/about" onClick={close} className="flex w-full items-center gap-4 rounded-xl p-4 transition hover:bg-brand-gray/20">
        <Info className="text-gray-400" size={20} />
        <span>{t('moreMenu.about')}</span>
      </Link>
      <a href={`mailto:${contactEmail}`} onClick={close} className="flex w-full items-center gap-4 rounded-xl p-4 transition hover:bg-brand-gray/20">
        <Mail className="text-gray-400" size={20} />
        <span>{t('moreMenu.contact')}</span>
      </a>
      <Link to="/terms-of-use" onClick={close} className="flex w-full items-center gap-4 rounded-xl p-4 transition hover:bg-brand-gray/20">
        <FileText className="text-gray-400" size={20} />
        <span>{t('moreMenu.terms')}</span>
      </Link>
      <Link to="/privacy-policy" onClick={close} className="flex w-full items-center gap-4 rounded-xl p-4 transition hover:bg-brand-gray/20">
        <Shield className="text-gray-400" size={20} />
        <span>{t('moreMenu.privacy')}</span>
      </Link>

      {isAuthenticated && (
        <>
          <div className="my-4 h-px bg-white/10" />
          <Link
            to="/dashboard"
            search={{ tab: 'settings', section: 'password' }}
            onClick={close}
            className="flex w-full items-center gap-4 rounded-xl p-4 transition hover:bg-brand-gray/20"
          >
            <Lock className="text-gray-400" size={20} />
            <span>{t('moreMenu.password')}</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              apiLogout();
              close();
            }}
            className="mt-2 flex w-full items-center gap-4 rounded-xl p-4 text-red-400 transition hover:bg-red-500/10"
          >
            <LogOut size={20} />
            <span>{t('moreMenu.logout')}</span>
          </button>
        </>
      )}
    </div>
  );
};
