import { useQuery } from '@tanstack/react-query';
import { generalService } from '../services/generalService';

export const usePrivacyPolicy = () => {
  return useQuery({
    queryKey: ['privacy-policy'],
    queryFn: () => generalService.getPrivacyPolicy(),
  });
};
