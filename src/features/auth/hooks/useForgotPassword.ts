import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import {
  ForgotPasswordRequestPayload,
  ForgotPasswordVerifyPayload,
  ForgotPasswordResetPayload,
} from '../types';
import { toast } from '@/lib/toast';

/**
 * Step 1 – Request a reset code sent to the user's email.
 * POST /v1/auth/password/forgot/request-code
 * Body: { email }
 */
export const useForgotPasswordRequestCode = () => {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (payload: ForgotPasswordRequestPayload) =>
      authService.forgotPasswordRequestCode(payload),
    onSuccess: () => {
      toast.success(t('auth.codeSent'), { id: 'forgot-password-request-success' });
    },
  });
};

/**
 * Step 2 – Verify the reset code.
 * POST /v1/auth/password/forgot/verify-code
 * Body: { email, otp }
 */
export const useForgotPasswordVerifyCode = () => {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (payload: ForgotPasswordVerifyPayload) =>
      authService.forgotPasswordVerifyCode(payload),
    onSuccess: () => {
      toast.success(t('auth.codeVerified'), { id: 'forgot-password-verify-success' });
    },
  });
};

/**
 * Step 3 – Set the new password.
 * POST /v1/auth/password/forgot/reset
 * Body: { email, password, password_confirmation }
 */
export const useForgotPasswordReset = () => {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (payload: ForgotPasswordResetPayload) =>
      authService.forgotPasswordReset(payload),
    onSuccess: () => {
      toast.success(t('auth.passwordResetSuccess'), { id: 'forgot-password-reset-success' });
    },
  });
};
