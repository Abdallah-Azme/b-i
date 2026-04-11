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
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    type: 'interest',
    title: { ar: 'اهتمام جديد', en: 'New Interest' },
    message: { ar: 'قام مستثمر بتسجيل اهتمام بمشروعك PROJ-1002', en: 'An investor registered interest in PROJ-1002' },
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    isRead: false,
    link: '/projects/PROJ-1002'
  },
  {
    id: 'n-2',
    type: 'deal',
    title: { ar: 'تحديث الصفقة', en: 'Deal Update' },
    message: { ar: 'تم قبول العرض المبدئي لصفقة المطعم', en: 'Initial offer accepted for the Restaurant deal' },
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    isRead: false,
    link: '/dashboard'
  },
  {
    id: 'n-3',
    type: 'system',
    title: { ar: 'توثيق الحساب', en: 'Account Verification' },
    message: { ar: 'تم توثيق حسابك بنجاح. يمكنك الآن الوصول لكل الميزات.', en: 'Your account is successfully verified. You have full access.' },
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    isRead: true
  },
  {
    id: 'n-4',
    type: 'project',
    title: { ar: 'مشروع جديد', en: 'New Project' },
    message: { ar: 'تمت إضافة مشروع جديد في قطاع التكنولوجيا', en: 'A new project was added in the Technology sector' },
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    isRead: false,
    link: '/projects'
  },
  {
    id: 'n-5',
    type: 'deal',
    title: { ar: 'شراء كراسة', en: 'Booklet Purchased' },
    message: { ar: 'قام مستثمر بشراء كراسة المشروع PROJ-1044', en: 'An investor purchased the booklet for PROJ-1044' },
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    isRead: true
  },
  {
    id: 'n-6',
    type: 'system',
    title: { ar: 'تنبيه أمان', en: 'Security Alert' },
    message: { ar: 'تم تسجيل دخول جديد من جهاز غير معروف', en: 'New login detected from an unknown device' },
    createdAt: new Date(Date.now() - 36 * 3600000).toISOString(),
    isRead: true
  },
  {
    id: 'n-7',
    type: 'interest',
    title: { ar: 'رسالة من الإدارة', en: 'Admin Message' },
    message: { ar: 'يرجى تحديث بيانات الملف الشخصي لاستكمال الإجراءات', en: 'Please update your profile to complete procedures' },
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    isRead: false,
    link: '/dashboard'
  },
  {
    id: 'n-8',
    type: 'project',
    title: { ar: 'فرصة مميزة', en: 'Featured Opportunity' },
    message: { ar: 'فرصة استثمارية ذهبية في قطاع العقارات متاحة الآن', en: 'Golden investment opportunity in Real Estate is now live' },
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    isRead: true,
    link: '/projects'
  },
  {
    id: 'n-9',
    type: 'deal',
    title: { ar: 'اكتمال صفقة', en: 'Deal Completed' },
    message: { ar: 'مبروك! تم إغلاق جولة الاستثمار لمشروع القهوة', en: 'Congrats! Investment round closed for the Coffee project' },
    createdAt: new Date(Date.now() - 96 * 3600000).toISOString(),
    isRead: true
  },
  {
    id: 'n-10',
    type: 'system',
    title: { ar: 'تحديث النظام', en: 'System Update' },
    message: { ar: 'تم تحديث سياسة الخصوصية الخاصة بالمنصة', en: 'Platform Privacy Policy has been updated' },
    createdAt: new Date(Date.now() - 120 * 3600000).toISOString(),
    isRead: true,
    link: '/privacy-policy'
  },
  {
    id: 'n-11',
    type: 'interest',
    title: { ar: 'تذكير', en: 'Reminder' },
    message: { ar: 'لديك طلبات صداقة معلقة من مستثمرين آخرين', en: 'You have pending connection requests from investors' },
    createdAt: new Date(Date.now() - 144 * 3600000).toISOString(),
    isRead: true
  },
  {
    id: 'n-12',
    type: 'project',
    title: { ar: 'مشروع مماثل', en: 'Similar Project' },
    message: { ar: 'مشروع مشابه لاهتماماتك تم نشره للتو', en: 'A project matching your interests was just published' },
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    isRead: false,
    link: '/projects'
  }
];

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: MOCK_NOTIFICATIONS,
      unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.isRead).length,
      
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
      
      markAsRead: (id) => {
        const notifications = get().notifications.map(n => 
          n.id === id ? { ...n, isRead: true } : n
        );
        set({ 
          notifications,
          unreadCount: notifications.filter(notif => !notif.isRead).length
        });
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
  };
};
