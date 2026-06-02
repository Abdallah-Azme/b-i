import { useQuery } from '@tanstack/react-query';
import { generalService } from '../services/generalService';

export const useWhoWeAre = () => {
  return useQuery({
    queryKey: ['who-we-are'],
    queryFn: () => generalService.getWhoWeAre(),
  });
};
