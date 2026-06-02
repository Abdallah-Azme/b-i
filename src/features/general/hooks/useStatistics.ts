import { useQuery } from '@tanstack/react-query';
import { generalService } from '../services/generalService';

export const useStatistics = () => {
  return useQuery({
    queryKey: ['statistics'],
    queryFn: () => generalService.getStatistics(),
    staleTime: 1000 * 60 * 5, // 5 min
  });
};
