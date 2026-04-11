import { NotificationListClient } from '@/features/notifications/ui/notification-list-client';

export const metadata = {
  title: 'Notifications | الإشعارات',
  description: 'Stay updated with your project interests and account activity.',
};

export default function NotificationsPage() {
  return (
    <div className="min-h-screen">
      <NotificationListClient />
    </div>
  );
}
