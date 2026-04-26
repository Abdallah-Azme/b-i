import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { ChangePasswordPayload } from '../types';

/**
 * Changes the authenticated user's password.
 * PATCH /v1/auth/password
 * Body: { current_password, password, password_confirmation }
 *
 * On success the backend logs out all devices — the UI should clear
 * the auth token and redirect to login.
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      authService.changePassword(payload),
  });
};
