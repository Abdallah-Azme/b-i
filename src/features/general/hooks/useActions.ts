import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generalService } from '../services/generalService';
import { invalidateNotificationsQueries } from '@/features/auth/hooks/useNotifications';
import { toast } from '@/lib/toast';
import { useTranslation } from 'react-i18next';

export const useBuySeat = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload?: any }) => generalService.buySeat(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['opportunity', id] });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast.success(t('common.purchaseSuccess'), { id: `buy-seat-success-${id}` });
    },
  });
};

export const useSubmitInterestRequest = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload?: any }) => generalService.submitInterestRequest(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['opportunity', id] });
      invalidateNotificationsQueries(queryClient);
      toast.success(t('common.interestSubmitted', { defaultValue: 'Interest submitted successfully' }), {
        id: `submit-interest-success-${id}`,
      });
    },
  });
};
