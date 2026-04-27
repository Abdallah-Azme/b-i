
import React from 'react';
import { useStore } from '../hooks/useStore';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { PrivacyPolicyContent } from '../features/general/ui/PrivacyPolicyContent';

export const PrivacyPolicy: React.FC = () => {
  const { lang } = useStore();
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8 flex items-center gap-2">
        <Link to="/" className="text-gray-400 hover:text-white transition">
           {lang === 'ar' ? <ArrowRight /> : <ArrowLeft />}
        </Link>
        <span className="text-gray-500">/</span>
        <span className="text-brand-gold">{t('auth.privacyPolicy')}</span>
      </div>

      <PrivacyPolicyContent />
    </div>
  );
};
