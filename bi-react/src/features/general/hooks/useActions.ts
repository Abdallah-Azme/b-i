import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generalService } from '../services/generalService';

export const useBuySeat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload?: any }) => generalService.buySeat(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['opportunity', id] });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });
};

export const useSubmitInterestRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload?: any }) => generalService.submitInterestRequest(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['opportunity', id] });
    },
  });
};
