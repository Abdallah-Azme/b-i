import { useQuery } from '@tanstack/react-query';
import { generalService } from '../services/generalService';
import { OpportunitiesQueryParams } from '../types';

export const useOpportunities = (params?: OpportunitiesQueryParams) => {
  return useQuery({
    queryKey: ['opportunities', params],
    queryFn: () => generalService.getOpportunities(params),
    staleTime: 1000 * 60 * 2, // 2 min
  });
};

export const useOpportunityDetail = (id: number | string | undefined) => {
  return useQuery({
    queryKey: ['opportunity', id],
    queryFn: () => generalService.getOpportunityDetail(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 min
  });
};
