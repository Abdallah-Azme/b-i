import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { LoginPayload } from '../types';
import { toast, clearShownToasts } from '@/lib/toast';
import { useTranslation } from 'react-i18next';
import { extractApiError } from '@/lib/fetcher';

export const useLogin = () => {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (response) => {
      if (response.data?.token) {
        Object.keys(sessionStorage)
          .filter((key) => key.startsWith('login_reason_toast_'))
          .forEach((key) => sessionStorage.removeItem(key));
        sessionStorage.removeItem('bi-auth-redirect-reason');
        clearShownToasts();
        localStorage.setItem('auth_token', response.data.token);
        // role is { key: "investor"|"advertiser", label: "..." }
        const roleKey = (response.data.role as any)?.key ?? response.data.role;
        if (roleKey) localStorage.setItem('auth_role', roleKey);
        toast.success(t('auth.loginSuccess'), { id: 'login-success' });
        window.location.href = '/dashboard';
      }
    },
    onError: (error, variables) => {
      const apiError = extractApiError(error);
      const msg = (apiError?.serverData?.msg || '').toLowerCase();

      const isNotActivated =
        msg.includes('not activated') ||
        msg.includes('inactive') ||
        msg.includes('deactivated') ||
        msg.includes('not active') ||
        msg.includes('غير مفعل') ||
        msg.includes('غير مفعّل') ||
        msg.includes('غير نشط') ||
        msg.includes('مفعل') && msg.includes('كود') ||
        msg.includes('activation code') ||
        msg.includes('verification code') ||
        msg.includes('code has been sent') ||
        msg.includes('sent a code');

      if (!isNotActivated) return;

      sessionStorage.setItem('verify_email', variables.email);
      sessionStorage.setItem('verify_password', variables.password);
      sessionStorage.setItem('verify_role', variables.role);
      sessionStorage.setItem(
        'registration_success_toast',
        t('auth.accountNotActivatedToast', {
          defaultValue: 'Your account is not activated yet. We sent you a verification code.',
        }),
      );
      sessionStorage.setItem('verify_resend_cooldown_until', String(Date.now() + 60_000));

      toast.success(
        t('auth.accountNotActivatedToast', {
          defaultValue: 'Your account is not activated yet. We sent you a verification code.',
        }),
        { id: 'login-account-not-activated' },
      );

      window.location.href = '/verify-email';
    },
  });
};

export const useUpdateProfile = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FormData) => authService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['profile-update-request-latest'] });
      toast.success(
        t('auth.profileUpdateRequestSubmitted', {
          defaultValue: 'Your update request has been sent to the admin for review',
        }),
        { id: 'profile-update-request-submitted' },
      );
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload?: any) => authService.deleteAccount(payload),
    onSuccess: () => {
      queryClient.cancelQueries();
      queryClient.clear();
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_role');
      window.location.replace('/login?reason=account_deleted');
    },
  });
};

export const useAuth = () => {
  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authService.getProfile(),
    enabled: !!localStorage.getItem('auth_token'),
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_role');
      window.location.href = '/login';
    },
    onError: () => {
      // Even on API error, clear local state
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_role');
      window.location.href = '/login';
    },
  });

  return {
    user: profile?.data,
    isLoading,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    isAuthenticated: !!localStorage.getItem('auth_token'),
    refreshProfile: refetch,
  };
};
