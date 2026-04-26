import { useQuery } from '@tanstack/react-query';
import { generalService } from '../services/generalService';

export const useHomePage = () => {
  return useQuery({
    queryKey: ['home-page'],
    queryFn: () => generalService.getHomePage(),
  });
};
