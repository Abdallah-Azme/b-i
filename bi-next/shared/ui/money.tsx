'use client';

import React from 'react';
import { useLocale } from 'next-intl';

interface MoneyProps {
  value: number;
  className?: string;
  currency?: string;
}

export const Money: React.FC<MoneyProps> = ({ 
  value, 
  className = "", 
  currency = "KWD" 
}) => {
  const locale = useLocale();
  
  // Custom Arabic currency label if needed
  const displayCurrency = locale === 'ar' ? 'د.ك' : currency;

  return (
    <span className={`money inline-block whitespace-nowrap font-sans font-semibold ${className}`} style={{ unicodeBidi: 'isolate' }}>
      {locale === 'ar' ? (
        <bdi>
          <span className="ml-1">{value.toLocaleString('en-US')}</span>
          <span>{displayCurrency}</span>
        </bdi>
      ) : (
        <bdi>
          <span className="mr-1">{displayCurrency}</span>
          <span>{value.toLocaleString('en-US')}</span>
        </bdi>
      )}
    </span>
  );
};
