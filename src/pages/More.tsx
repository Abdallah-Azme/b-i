import React from 'react';
import { useTranslation } from 'react-i18next';
import { MoreMenuList } from '../components/MoreMenuList';

export const More: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-md mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-8 text-white">{t('tabs.more')}</h1>

        <MoreMenuList />
        
        <div className="p-4 border-t border-white/10 text-center mt-6">
            <p className="text-xs text-gray-500">{t('common.appVersion', { version: '1.0.3' })}</p>
        </div>
    </div>
  );
};
