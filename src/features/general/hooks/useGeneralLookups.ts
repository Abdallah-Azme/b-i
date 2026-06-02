import { useQuery } from '@tanstack/react-query';
import { generalService } from '../services/generalService';

export const useInvestorTypes = () => {
  return useQuery({
    queryKey: ['investor-types'],
    queryFn: () => generalService.getInvestorTypes(),
  });
};

export const useInvestorExperiences = () => {
  return useQuery({
    queryKey: ['investor-experience'],
    queryFn: () => generalService.getInvestorExperiences(),
  });
};

export const usePreferredSectors = () => {
  return useQuery({
    queryKey: ['preferred-sectors'],
    queryFn: () => generalService.getPreferredSectors(),
  });
};

export const useWhoWeAre = () => {
  return useQuery({
    queryKey: ['who-we-are'],
    queryFn: () => generalService.getWhoWeAre(),
  });
};
