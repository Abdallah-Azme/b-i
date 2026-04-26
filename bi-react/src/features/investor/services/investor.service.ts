import { api } from '@/lib/fetcher';

export const investorService = {
  getCurrentRequests: (params?: any) =>
    api.get('/v1/investor/opportunities/current-requests', { query: params }),

  getSentInterests: (params?: any) =>
    api.get('/v1/investor/opportunities/sent-interests', { query: params }),

  getPurchasedSeats: (params?: any) =>
    api.get('/v1/investor/opportunities/purchased-seats', { query: params }),
};
