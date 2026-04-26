import { useQuery } from '@tanstack/react-query';
import { generalService } from '../services/generalService';

export const useTermsAndConditions = () => {
  return useQuery({
    queryKey: ['terms-and-conditions'],
    queryFn: () => generalService.getTermsAndConditions(),
  });
};
