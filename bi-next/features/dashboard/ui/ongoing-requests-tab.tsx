'use client';

import React from 'react';
import { OngoingRequest } from '@/shared/types';

const SAMPLE_ONGOING_REQUESTS: OngoingRequest[] = [
  { id: 'or1', projectName: { ar: 'شركة تقنية', en: 'Tech Startup' }, counterparty: 'Jassim Al-Salem', status: 'negotiation', lastUpdate: '2024-03-14' }
];

export const OngoingRequestsTab: React.FC<{ locale: string }> = ({ locale }) => {
  const isAr = locale === 'ar';
  return (
    <div className="space-y-4">
      {SAMPLE_ONGOING_REQUESTS.map(deal => (
        <div key={deal.id} className="bg-brand-gray/20 p-4 rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-white">{deal.projectName[locale as keyof typeof deal.projectName]}</h4>
            <p className="text-xs text-gray-400">{isAr ? 'الطرف الآخر: ' : 'Counterparty: '}{deal.counterparty}</p>
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-bold text-white">{deal.status.toUpperCase()}</span>
            <span className="text-[10px] text-gray-500">{deal.lastUpdate}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
