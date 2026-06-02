import React from 'react';
import { useSearch } from '@tanstack/react-router';
import { InvestorRegisterForm } from '@/features/auth/ui/InvestorRegisterForm';
import { AdvertiserRegisterForm } from '@/features/auth/ui/AdvertiserRegisterForm';

export const Signup: React.FC = () => {
  const search = useSearch({ from: '/signup' });
  const roleParam = search.role;
  const role = (roleParam === 'company' || roleParam === 'advertiser') ? 'advertiser' : 'investor';

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      {role === 'advertiser' ? <AdvertiserRegisterForm /> : <InvestorRegisterForm />}
    </div>
  );
};
