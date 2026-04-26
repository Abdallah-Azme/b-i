import { useQuery } from '@tanstack/react-query';
import { investorService } from '../services/investor.service';

export const useInvestorCurrentRequests = (params?: any, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['investor-current-requests', params],
    queryFn: () => investorService.getCurrentRequests(params),
    ...options,
  });
};

export const useInvestorSentInterests = (params?: any, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['investor-sent-interests', params],
    queryFn: () => investorService.getSentInterests(params),
    ...options,
  });
};

export const useInvestorPurchasedSeats = (params?: any, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['investor-purchased-seats', params],
    queryFn: () => investorService.getPurchasedSeats(params),
    ...options,
  });
};
