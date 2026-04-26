import { useQuery } from '@tanstack/react-query';
import { generalService } from '../services/generalService';
import { InvestorsQueryParams } from '../types';

export const useInvestors = (params?: InvestorsQueryParams) => {
  return useQuery({
    queryKey: ['investors', params],
    queryFn: () => generalService.getInvestors(params),
  });
};
