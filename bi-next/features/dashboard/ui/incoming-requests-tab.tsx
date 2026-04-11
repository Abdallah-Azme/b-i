'use client';

import React from 'react';
import { IncomingRequest } from '@/shared/types';

// Mock Data
const SAMPLE_INCOMING_REQUESTS: IncomingRequest[] = [
  { id: 'ir1', projectName: { ar: 'متجر الإلكترونيات', en: 'Electronics Store' }, investorName: 'Ahmed Abdullah', date: '2024-03-12', status: 'new' },
  { id: 'ir2', projectName: { ar: 'مطعم جديد', en: 'New Restaurant' }, investorName: 'Sarah Smith', date: '2024-03-10', status: 'replied' }
];

export const IncomingRequestsTab: React.FC<{ locale: string }> = ({ locale }) => {
  const isAr = locale === 'ar';
  
  const getWhatsAppLink = (req: IncomingRequest) => {
    const projectName = req.projectName[locale as keyof typeof req.projectName];
    const message = isAr 
      ? `السلام عليكم، أود الاستفسار عن الطلب المقدم على مشروع ${projectName} من ${req.investorName}.`
      : `Hello, I would like to inquire about the request submitted for the project ${projectName} from ${req.investorName}.`;
    return `https://wa.me/96560070353?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-4">
      {SAMPLE_INCOMING_REQUESTS.map(req => (
        <div key={req.id} className="bg-brand-gray/20 p-4 rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-white">{req.projectName[locale as keyof typeof req.projectName]}</h4>
            <p className="text-xs text-gray-400">{isAr ? 'المستثمر: ' : 'Investor: '}{req.investorName} • {req.date}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-[10px] font-bold ${req.status === 'new' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
              {req.status.toUpperCase()}
            </span>
            <a 
              href={getWhatsAppLink(req)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-brand-gold text-black px-3 py-1 rounded font-bold hover:bg-yellow-500 transition"
            >
              {isAr ? 'متابعة' : 'Follow Up'}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};
