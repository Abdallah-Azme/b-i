import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/auth.service';

export const useLatestProfileUpdateRequest = () => {
  return useQuery({
    queryKey: ['profile-update-request-latest'],
    queryFn: () => authService.getLatestProfileUpdateRequest(),
    enabled: !!localStorage.getItem('auth_token'),
  });
};
