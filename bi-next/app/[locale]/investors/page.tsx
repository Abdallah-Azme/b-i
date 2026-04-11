import React from 'react';
import { investorService } from '@/features/investors/services/investor-api';
import { InvestorListClient } from '@/features/investors/ui/investor-list-client';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export const metadata = {
  title: 'Investors Network | شبكة المستثمرين',
  description: 'Connect with verified angel investors and venture capital firms.',
};

export default async function InvestorsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['investors'],
    queryFn: () => investorService.getAllInvestors(),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pointer-events-auto">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <InvestorListClient />
      </HydrationBoundary>
    </div>
  );
}

