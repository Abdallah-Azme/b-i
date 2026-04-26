import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import {
  ForgotPasswordRequestPayload,
  ForgotPasswordVerifyPayload,
  ForgotPasswordResetPayload,
} from '../types';

/**
 * Step 1 – Request a reset code sent to the user's email.
 * POST /v1/auth/password/forgot/request-code
 * Body: { email }
 */
export const useForgotPasswordRequestCode = () =>
  useMutation({
    mutationFn: (payload: ForgotPasswordRequestPayload) =>
      authService.forgotPasswordRequestCode(payload),
  });

/**
 * Step 2 – Verify the reset code.
 * POST /v1/auth/password/forgot/verify-code
 * Body: { email, otp }
 */
export const useForgotPasswordVerifyCode = () =>
  useMutation({
    mutationFn: (payload: ForgotPasswordVerifyPayload) =>
      authService.forgotPasswordVerifyCode(payload),
  });

/**
 * Step 3 – Set the new password.
 * POST /v1/auth/password/forgot/reset
 * Body: { email, password, password_confirmation }
 */
export const useForgotPasswordReset = () =>
  useMutation({
    mutationFn: (payload: ForgotPasswordResetPayload) =>
      authService.forgotPasswordReset(payload),
  });
