import type { ApiNotification } from '../types';

const normalizeRelativePath = (value: string) => {
  if (!value) return null;

  if (value.startsWith('/')) return value;

  try {
    const url = new URL(value);
    return `${url.pathname}${url.search}${url.hash}` || null;
  } catch {
    return null;
  }
};

export type NotificationRoute =
  | { to: string; search?: Record<string, string> }
  | null;

export const resolveNotificationRoute = (notification: ApiNotification): NotificationRoute => {
  const directUrl = normalizeRelativePath(notification.target_url ?? '');
  if (directUrl) return { to: directUrl };

  const payload = notification.payload ?? {};
  const payloadUrl =
    normalizeRelativePath(payload.target_url ?? '') ??
    normalizeRelativePath(payload.url ?? '') ??
    normalizeRelativePath(payload.route ?? '');

  if (payloadUrl) return { to: payloadUrl };

  const modelId =
    payload.model_id ?? payload.project_id ?? payload.opportunity_id ?? notification.model_id;

  switch (notification.model_type) {
    case 'opportunity':
    case 'project':
      return modelId ? { to: `/projects/${modelId}` } : null;
    case 'advertiser':
      return modelId ? { to: `/advertiser/edit-listing/${modelId}` } : null;
    case 'ProfileUpdateRequest':
      return { to: '/dashboard', search: { tab: 'verification' } };
    default:
      break;
  }

  switch (notification.notification_type) {
    case 'publish_opportunity':
      return modelId ? { to: `/projects/${modelId}` } : null;
    case 'approve_profile_update_request':
      return { to: '/dashboard', search: { tab: 'verification' } };
    case 'change_password':
      return { to: '/dashboard', search: { tab: 'settings', section: 'password' } };
    default:
      break;
  }

  switch (notification.notification_category) {
    case 'deal':
    case 'project':
      return modelId ? { to: `/projects/${modelId}` } : null;
    default:
      return null;
  }
};
