import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import {
  EmailChangeRequestCurrentPayload,
  EmailChangeVerifyCurrentPayload,
  EmailChangeRequestNewPayload,
  EmailChangeVerifyNewPayload,
} from '../types';

/**
 * Step 1 – Send OTP to current email (requires current_password).
 * POST /v1/auth/email-change/request-current
 */
export const useEmailChangeRequestCurrent = () =>
  useMutation({
    mutationFn: (payload: EmailChangeRequestCurrentPayload) =>
      authService.emailChangeRequestCurrent(payload),
  });

/**
 * Step 2 – Verify OTP received at current email.
 * POST /v1/auth/email-change/verify-current
 */
export const useEmailChangeVerifyCurrent = () =>
  useMutation({
    mutationFn: (payload: EmailChangeVerifyCurrentPayload) =>
      authService.emailChangeVerifyCurrent(payload),
  });

/**
 * Step 3 – Submit new email (sends OTP to new address).
 * POST /v1/auth/email-change/request-new
 */
export const useEmailChangeRequestNew = () =>
  useMutation({
    mutationFn: (payload: EmailChangeRequestNewPayload) =>
      authService.emailChangeRequestNew(payload),
  });

/**
 * Step 4 – Verify OTP received at new email → email changes, all devices logged out.
 * POST /v1/auth/email-change/verify-new
 */
export const useEmailChangeVerifyNew = () =>
  useMutation({
    mutationFn: (payload: EmailChangeVerifyNewPayload) =>
      authService.emailChangeVerifyNew(payload),
  });
