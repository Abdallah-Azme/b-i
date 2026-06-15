import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { toast, showToastOnce } from '@/lib/toast';
import i18n from '@/i18n';

const isAuthed = () => !!localStorage.getItem('auth_token');
const AUTH_LOGIN_AT_KEY = 'auth_login_at';
export const NOTIFICATIONS_REFETCH_INTERVAL = 20_000;
export const NOTIFICATIONS_PAGE_REFETCH_INTERVAL = 5_000;

export const invalidateNotificationsQueries = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: ['notifications'] });

const notificationQueryDefaults = {
  staleTime: 0,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
} as const;

export const useNotificationsLiveSync = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    invalidateNotificationsQueries(queryClient);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        invalidateNotificationsQueries(queryClient);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [queryClient]);
};

const FORCE_LOGOUT_TOAST_KEYS = {
  banned: 'force_logout_toast_banned',
  deleted: 'force_logout_toast_deleted',
} as const;

const FORCE_LOGOUT_HANDLED_IDS_KEY = 'force_logout_handled_notification_ids';

const getHandledForceLogoutNotificationIds = () => {
  try {
    const raw = localStorage.getItem(FORCE_LOGOUT_HANDLED_IDS_KEY);
    if (!raw) return new Set<string>();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set<string>();
    return new Set(parsed.filter((value): value is string => typeof value === 'string'));
  } catch {
    return new Set<string>();
  }
};

const markForceLogoutNotificationHandled = (notificationId: string) => {
  const handledIds = getHandledForceLogoutNotificationIds();
  handledIds.add(notificationId);

  const cappedIds = Array.from(handledIds).slice(-50);
  localStorage.setItem(FORCE_LOGOUT_HANDLED_IDS_KEY, JSON.stringify(cappedIds));
};

const getCurrentLoginAt = () => {
  const storedLoginAt = Number(localStorage.getItem(AUTH_LOGIN_AT_KEY));
  if (Number.isFinite(storedLoginAt) && storedLoginAt > 0) return storedLoginAt;

  const loginAt = Date.now();
  localStorage.setItem(AUTH_LOGIN_AT_KEY, String(loginAt));
  return loginAt;
};

const isNotificationFromCurrentSession = (createdAt?: string | null) => {
  if (!createdAt) return false;

  const createdAtMs = Date.parse(createdAt);
  if (!Number.isFinite(createdAtMs)) return false;

  return createdAtMs >= getCurrentLoginAt() - 5_000;
};

const clearAuthAndRedirect = (reason: 'banned' | 'deleted') => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_role');
  localStorage.removeItem(AUTH_LOGIN_AT_KEY);
  sessionStorage.setItem('bi-auth-redirect-reason', reason);
  window.location.replace(`/login?reason=${reason}`);
};

export const useAccountAccessNotificationWatcher = () => {
  const { data: notificationsData } = useNotifications({
    per_page: 20,
    refetchInterval: NOTIFICATIONS_REFETCH_INTERVAL,
  });

  useEffect(() => {
    const notifications = notificationsData?.data?.notifications ?? [];
    const latestBlockingNotification = notifications.find((notification) => {
      const type = (notification.notification_type || '').toLowerCase();
      return (
        notification.payload?.force_logout === true ||
        type === 'user_blocked' ||
        type === 'admin_blocked' ||
        type === 'delete_account'
      );
    });

    if (!latestBlockingNotification) return;
    if (!isNotificationFromCurrentSession(latestBlockingNotification.created_at)) return;

    const handledIds = getHandledForceLogoutNotificationIds();
    if (handledIds.has(latestBlockingNotification.id)) return;

    const type = (latestBlockingNotification.notification_type || '').toLowerCase();
    const isDeleted = type === 'delete_account';
    const reason = isDeleted ? 'deleted' : 'banned';
    const toastKey = `${FORCE_LOGOUT_TOAST_KEYS[reason]}-${latestBlockingNotification.id}`;
    const toastId = `force-logout-${reason}-${latestBlockingNotification.id}`;

    showToastOnce(
      toastId,
      () => {
        toast.error(
          isDeleted ? i18n.t('auth.deletedError') : i18n.t('auth.bannedError'),
          { id: toastId },
        );
      },
      { sessionKey: toastKey },
    );

    markForceLogoutNotificationHandled(latestBlockingNotification.id);
    clearAuthAndRedirect(reason);
  }, [notificationsData]);
};

export const useNotifications = (params?: { page?: number; per_page?: number; refetchInterval?: number | false }) => {
  const { refetchInterval, ...queryParams } = params ?? {};
  return useQuery({
    queryKey: ['notifications', queryParams],
    queryFn: () => authService.getNotifications(queryParams),
    enabled: isAuthed(),
    ...notificationQueryDefaults,
    refetchOnMount: 'always',
    refetchInterval: isAuthed() ? (refetchInterval ?? NOTIFICATIONS_REFETCH_INTERVAL) : false,
    refetchIntervalInBackground: true,
  });
};

export const useUnreadNotificationsCount = (options?: { refetchInterval?: number | false }) => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => authService.getUnreadNotificationsCount(),
    enabled: isAuthed(),
    ...notificationQueryDefaults,
    refetchOnMount: 'always',
    refetchInterval: isAuthed() ? (options?.refetchInterval ?? NOTIFICATIONS_REFETCH_INTERVAL) : false,
    refetchIntervalInBackground: true,
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success(i18n.t('notifications.markAllReadSuccess', { defaultValue: 'All notifications marked as read' }), {
        id: 'notifications-mark-all-read-success',
      });
    },
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => authService.readNotification(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      
      const previousNotifications = queryClient.getQueryData(['notifications']);
      
      queryClient.setQueriesData({ queryKey: ['notifications'] }, (old: any) => {
        if (!old || !old.data || !old.data.notifications) return old;
        return {
          ...old,
          data: {
            ...old.data,
            notifications: old.data.notifications.map((n: any) =>
              n.id === id ? { ...n, seen: true } : n
            ),
          },
        };
      });
      
      queryClient.setQueryData(['notifications', 'unread-count'], (old: any) => {
         if (!old || !old.data) return old;
         return {
            ...old,
            data: {
               ...old.data,
               unread_notifications_count: Math.max(0, old.data.unread_notifications_count - 1)
            }
         }
      });

      return { previousNotifications };
    },
    onError: (err, variables, context) => {
      queryClient.setQueriesData(
        { queryKey: ['notifications'] },
        context?.previousNotifications
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.deleteAllNotifications(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success(i18n.t('notifications.deleteSuccess', { defaultValue: 'Notifications deleted successfully' }), {
        id: 'notifications-delete-all-success',
      });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => authService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success(i18n.t('notifications.deleteSuccess', { defaultValue: 'Notification deleted successfully' }), {
        id: 'notification-delete-success',
      });
    },
  });
};
