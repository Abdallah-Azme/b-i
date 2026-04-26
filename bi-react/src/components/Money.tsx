import React from 'react';
import { useTranslation } from 'react-i18next';

interface MoneyProps {
  value: number;
  className?: string;
}

export const Money: React.FC<MoneyProps> = ({ value, className = '' }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  // 1. Always format digits using Western numbers
  const formattedValue = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  const currency = t('common.currency');

  return (
    <span
      className={`money ${className}`}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <bdi dir="ltr">{formattedValue}</bdi>
      <span className="currency">&nbsp;{currency}</span>
    </span>
  );
};
