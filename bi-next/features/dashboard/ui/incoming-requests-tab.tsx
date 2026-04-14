'use client';

import React from 'react';
import { IncomingRequest } from '@/shared/types';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/services/api-client';

export const IncomingRequestsTab: React.FC<{ locale: string }> = ({ locale }) => {
  const isAr = locale === 'ar';
  
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['incomingRequests'],
    queryFn: async () => {
       const res = await api.get('/v1/company/opportunities/requests');
       return (res?.data || []) as IncomingRequest[];
    }
  });
  
  const getWhatsAppLink = (req: IncomingRequest) => {
    const projectName = req.projectName[locale as keyof typeof req.projectName];
    const message = isAr 
      ? `السلام عليكم، أود الاستفسار عن الطلب المقدم على مشروع ${projectName} من ${req.investorName}.`
      : `Hello, I would like to inquire about the request submitted for the project ${projectName} from ${req.investorName}.`;
    return `https://wa.me/96560070353?text=${encodeURIComponent(message)}`;
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading requests...</div>;
  }

  if (!requests.length) {
    return <div className="p-8 text-center text-gray-500 border border-white/5 rounded-xl bg-brand-gray/20">No incoming requests yet.</div>;
  }

  return (
    <div className="space-y-4">
      {requests.map(req => (
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
