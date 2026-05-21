import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';

const isAuthed = () => !!localStorage.getItem('auth_token');

export const useNotifications = (params?: { page?: number; per_page?: number }) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => authService.getNotifications(params),
    enabled: isAuthed(),
  });
};

export const useUnreadNotificationsCount = () => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => authService.getUnreadNotificationsCount(),
    refetchInterval: isAuthed() ? 30000 : false,
    enabled: isAuthed(),
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => authService.markNotificationRead(id),
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
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => authService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
