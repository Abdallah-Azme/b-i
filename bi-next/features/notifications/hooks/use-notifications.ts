'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { NotificationItem } from '@/shared/types';

interface NotificationsState {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  fetchNotifications: () => Promise<void>;
}

// Mocks removed since we fetch natively via API.

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      
      fetchNotifications: async () => {
        try {
          const { api } = await import('@/shared/services/api-client');
          const response = await api.get('/v1/notifications');
          const notifications = response?.data || [];
          set({ 
            notifications,
            unreadCount: notifications.filter((notif: any) => !notif.isRead).length
          });
        } catch (e) {
          console.warn('Failed to fetch notifications');
        }
      },
      
      addNotification: (n) => {
        const newNotification: NotificationItem = {
          ...n,
          id: Math.random().toString(36).substring(7),
          createdAt: new Date().toISOString(),
          isRead: false
        };
        const notifications = [newNotification, ...get().notifications];
        set({ 
          notifications,
          unreadCount: notifications.filter(notif => !notif.isRead).length
        });
      },
      
      markAsRead: async (id) => {
        const notifications = get().notifications.map(n => 
          n.id === id ? { ...n, isRead: true } : n
        );
        set({ 
          notifications,
          unreadCount: notifications.filter(notif => !notif.isRead).length
        });
        
        try {
           const { api } = await import('@/shared/services/api-client');
           await api.post(`/v1/notifications/${id}/read`);
        } catch (e) { /* ignore */ }
      },
      
      markAllAsRead: () => {
        const notifications = get().notifications.map(n => ({ ...n, isRead: true }));
        set({ notifications, unreadCount: 0 });
      },
      
      removeNotification: (id) => {
        const notifications = get().notifications.filter(n => n.id !== id);
        set({ 
          notifications,
          unreadCount: notifications.filter(notif => !notif.isRead).length
        });
      },
      
      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      }
    }),
    {
      name: 'bi-notifications-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useNotifications = () => {
  const store = useNotificationsStore();
  return {
    notifications: store.notifications,
    unreadCount: store.unreadCount,
    markAsRead: store.markAsRead,
    markAllAsRead: store.markAllAsRead,
    removeNotification: store.removeNotification,
    clearAll: store.clearAll,
    fetchNotifications: store.fetchNotifications
  };
};
