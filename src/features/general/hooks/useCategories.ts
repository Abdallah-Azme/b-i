import { useQuery } from '@tanstack/react-query';
import { generalService } from '../services/generalService';

export const useCategories = (params?: { page?: number; per_page?: number }) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => generalService.getCategories(params),
    staleTime: 1000 * 60 * 10, // 10 min – categories rarely change
  });
};
