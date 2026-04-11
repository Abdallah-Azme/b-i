'use client';

import React from 'react';
import { SentInterest } from '@/shared/types';
import Image from 'next/image';
import { Star } from 'lucide-react';

const SAMPLE_SENT_INTERESTS: SentInterest[] = [
  { id: 'si1', projectName: { ar: 'مشروع عقاري', en: 'Real Estate Project' }, image: '', date: '2024-03-15', status: 'sent' }
];

export const SentInterestsTab: React.FC<{ locale: string }> = ({ locale }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {SAMPLE_SENT_INTERESTS.map(int => (
        <div key={int.id} className="bg-brand-gray/20 p-4 rounded-xl border border-white/5 flex gap-4">
          <div className="w-16 h-16 rounded-lg bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden relative">
             {int.image ? <Image src={int.image} alt="" fill className="object-cover" /> : <Star size={24} className="text-gray-600" />}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-white">{int.projectName[locale as keyof typeof int.projectName]}</h4>
            <p className="text-xs text-gray-400">{int.date}</p>
            <span className="text-[10px] font-bold text-brand-gold">{int.status.toUpperCase()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
