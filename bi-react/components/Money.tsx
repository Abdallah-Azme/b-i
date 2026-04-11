
import React from 'react';
import { useStore } from '../context/Store';

interface MoneyProps {
  value: number;
  className?: string;
}

export const Money: React.FC<MoneyProps> = ({ value, className = '' }) => {
  const { lang } = useStore();

  // 1. Always format digits using Western numbers
  const formattedValue = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  const currency = lang === 'ar' ? 'د.ك' : 'KWD';

  // 2. Render money with a wrapper that controls direction per language
  // Arabic (rtl): DOM is [Number] [Currency]. RTL layout puts Number on Right, Currency on Left. Visual: Currency Number.
  // English (ltr): DOM is [Number] [Currency]. LTR layout puts Number on Left, Currency on Right. Visual: Number Currency.
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
