import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import {
  EmailChangeRequestCurrentPayload,
  EmailChangeVerifyCurrentPayload,
  EmailChangeRequestNewPayload,
  EmailChangeVerifyNewPayload,
} from '../types';
import { toast } from '@/lib/toast';
import { useTranslation } from 'react-i18next';

/**
 * Step 1 – Send OTP to current email (requires current_password).
 * POST /v1/auth/email-change/request-current
 */
export const useEmailChangeRequestCurrent = () =>
  (() => {
    const { t } = useTranslation();
    return useMutation({
      mutationFn: (payload: EmailChangeRequestCurrentPayload) =>
        authService.emailChangeRequestCurrent(payload),
      onSuccess: () => {
        toast.success(t('auth.codeSent'), { id: 'email-change-request-current-success' });
      },
    });
  })();

/**
 * Step 2 – Verify OTP received at current email.
 * POST /v1/auth/email-change/verify-current
 */
export const useEmailChangeVerifyCurrent = () =>
  (() => {
    const { t } = useTranslation();
    return useMutation({
      mutationFn: (payload: EmailChangeVerifyCurrentPayload) =>
        authService.emailChangeVerifyCurrent(payload),
      onSuccess: () => {
        toast.success(t('auth.codeVerified'), { id: 'email-change-verify-current-success' });
      },
    });
  })();

/**
 * Step 3 – Submit new email (sends OTP to new address).
 * POST /v1/auth/email-change/request-new
 */
export const useEmailChangeRequestNew = () =>
  (() => {
    const { t } = useTranslation();
    return useMutation({
      mutationFn: (payload: EmailChangeRequestNewPayload) =>
        authService.emailChangeRequestNew(payload),
      onSuccess: () => {
        toast.success(t('auth.codeSent'), { id: 'email-change-request-new-success' });
      },
    });
  })();

/**
 * Step 4 – Verify OTP received at new email → email changes, all devices logged out.
 * POST /v1/auth/email-change/verify-new
 */
export const useEmailChangeVerifyNew = () =>
  (() => {
    const { t } = useTranslation();
    return useMutation({
      mutationFn: (payload: EmailChangeVerifyNewPayload) =>
        authService.emailChangeVerifyNew(payload),
      onSuccess: () => {
        toast.success(t('auth.emailChangedSuccess'), { id: 'email-change-verify-new-success' });
      },
    });
  })();
