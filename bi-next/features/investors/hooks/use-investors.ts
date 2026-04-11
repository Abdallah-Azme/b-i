import { useQuery } from '@tanstack/react-query';
import { investorService } from '../services/investor-api';

export const useInvestors = () => {
  return useQuery({
    queryKey: ['investors'],
    queryFn: () => investorService.getAllInvestors(),
  });
};
