import { useQuery, useMutation } from '@tanstack/react-query';
import { companyService } from '../services/company.service';

export const usePurchasedSeats = (params?: any, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['company-purchased-seats', params],
    queryFn: () => companyService.getPurchasedSeats(params),
    ...options,
  });
};

export const useSentInterests = (params?: any, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['company-sent-interests', params],
    queryFn: () => companyService.getSentInterests(params),
    ...options,
  });
};

export const useCurrentRequests = (params?: any, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['company-current-requests', params],
    queryFn: () => companyService.getCurrentRequests(params),
    ...options,
  });
};

export const useSendInvestorInterestRequest = () => {
  return useMutation({
    mutationFn: (payload: any) => companyService.sendInvestorInterestRequest(payload),
  });
};
