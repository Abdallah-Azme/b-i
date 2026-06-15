import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyService } from '../services/company.service';
import { invalidateNotificationsQueries } from '@/features/auth/hooks/useNotifications';
import { toast } from '@/lib/toast';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => companyService.sendInvestorInterestRequest(payload),
    onSuccess: () => {
      invalidateNotificationsQueries(queryClient);
      toast.success(t('investorsPage.interestSentSuccess'), {
        id: 'send-investor-interest-success',
      });
    },
  });
};
