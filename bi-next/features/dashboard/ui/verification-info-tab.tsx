'use client';

import React from 'react';
import { VerificationInfo } from '@/shared/types';
import { Shield } from 'lucide-react';
import { Button } from '@/shared/ui/button';

const SAMPLE_VERIFICATION_INFO: VerificationInfo = {
  accountStatus: 'review',
  companyName: 'B&I Tech Solutions',
  licenseNumber: 'LIC-2024-00123',
  verificationStatus: 'review'
};

export const VerificationInfoTab: React.FC<{ locale: string }> = ({ locale }) => {
  const isAr = locale === 'ar';
  const info = SAMPLE_VERIFICATION_INFO;
  return (
    <div className="bg-brand-gray/20 p-6 rounded-xl border border-white/5 space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-bold text-white">{isAr ? 'حالة التحقق' : 'Account Status'}</h4>
        <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${info.verificationStatus === 'review' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
           <Shield size={12} />
           {info.verificationStatus.toUpperCase()}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2">
        <div>
           <p className="text-gray-400 mb-0.5">{isAr ? 'اسم الشركة' : 'Company Name'}</p>
           <p className="text-white font-medium">{info.companyName}</p>
        </div>
        <div>
           <p className="text-gray-400 mb-0.5">{isAr ? 'رقم الترخيص' : 'License Number'}</p>
           <p className="text-white font-medium">{info.licenseNumber}</p>
        </div>
      </div>
      <div className="flex gap-2 pt-4">
        <Button variant="outline" className="bg-brand-gray border-white/10 text-white font-bold h-10 hover:bg-white/10">{isAr ? 'تحديث البيانات' : 'Update Data'}</Button>
      </div>
    </div>
  );
};
