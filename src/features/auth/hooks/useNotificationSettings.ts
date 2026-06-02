import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { UpdateNotificationSettingsPayload } from '../types';

/**
 * Fetches notification preference settings for the authenticated user.
 * GET /v1/auth/notification-settings
 */
export const useNotificationSettings = () => {
  return useQuery({
    queryKey: ['notification-settings'],
    queryFn: () => authService.getNotificationSettings(),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Updates notification preferences.
 * PATCH /v1/auth/notification-settings
 * Body: { orders?: boolean, interest?: boolean, system?: boolean }
 */
export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateNotificationSettingsPayload) =>
      authService.updateNotificationSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
    },
  });
};
