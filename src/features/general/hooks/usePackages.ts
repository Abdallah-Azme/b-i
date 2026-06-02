import { useQuery } from '@tanstack/react-query';
import { generalService } from '../services/generalService';

export const usePackages = () => {
  return useQuery({
    queryKey: ['packages'],
    queryFn: () => generalService.getPackages(),
    staleTime: 1000 * 60 * 15, // 15 min – pricing rarely changes mid-session
  });
};
