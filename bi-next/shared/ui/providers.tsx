'use client';

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { Toaster, toast } from 'sonner';


export default function Providers({children}: {children: ReactNode}) {
  const [queryClient] = useState(() => new QueryClient({
    queryCache: new QueryCache({
      onError: (error: any) => {
        const message = error?.data?.message || error?.data?.msg || error?.response?._data?.msg || error?.response?._data?.message || error?.message || 'An error occurred';
        toast.error(message);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error: any) => {
        const message = error?.data?.message || error?.data?.msg || error?.response?._data?.msg || error?.response?._data?.message || error?.message || 'An error occurred';
        toast.error(message);
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: false, // Don't randomly retry failing requests
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" richColors theme="dark" />
      {children}
    </QueryClientProvider>
  );
}
