import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { ChangePasswordPayload } from '../types';
import { toast } from '@/lib/toast';
import { useTranslation } from 'react-i18next';

/**
 * Changes the authenticated user's password.
 * PATCH /v1/auth/password
 * Body: { current_password, password, password_confirmation }
 *
 * On success the backend logs out all devices — the UI should clear
 * the auth token and redirect to login.
 */
export const useChangePassword = () => {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      authService.changePassword(payload),
    onSuccess: () => {
      toast.success(t('auth.passwordResetSuccess'), {
        id: 'change-password-success',
      });
    },
  });
};
