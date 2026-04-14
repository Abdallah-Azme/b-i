import { useQuery } from '@tanstack/react-query';
import { investorService } from '../services/investor-api';

export const useInvestors = (filters: any = {}) => {
  return useQuery({
    queryKey: ['investors', filters],
    queryFn: () => investorService.getAllInvestors(filters),
  });
};
