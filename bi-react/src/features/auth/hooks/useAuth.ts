import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { LoginPayload } from '../types';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const useLogin = () => {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (response) => {
      if (response.data?.token) {
        localStorage.setItem('auth_token', response.data.token);
        // role is { key: "investor"|"advertiser", label: "..." }
        const roleKey = (response.data.role as any)?.key ?? response.data.role;
        if (roleKey) localStorage.setItem('auth_role', roleKey);
        toast.success(t('auth.loginSuccess'));
        window.location.href = '/dashboard';
      }
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
      toast.success(t('auth.profileUpdateSuccess'));
    },
  });
};

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: (payload?: any) => authService.deleteAccount(payload),
    onSuccess: () => {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
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
