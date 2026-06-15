import type { ApiNotification } from '../types';

export type NotificationRoute =
  | { to: string; search?: Record<string, string> }
  | null;

const toSearchRecord = (search: string) => {
  const params = new URLSearchParams(search);
  const record: Record<string, string> = {};
  params.forEach((value, key) => {
    record[key] = value;
  });
  return Object.keys(record).length > 0 ? record : undefined;
};

const normalizeRelativeRoute = (value: string): NotificationRoute => {
  if (!value) return null;

  const isValidRoute = (path: string) => {
    if (!path) return false;
    if (path === '/projects' || path === '/advertiser/edit-listing') return false;
    if (/^\/projects\/\d+\/?$/.test(path)) return true;
    if (/^\/advertiser\/edit-listing\/\d+\/?$/.test(path)) return true;
    if (path === '/dashboard' || path === '/notifications') return true;
    return path.startsWith('/'); // keep other explicit internal routes
  };

  const fromPath = (path: string, search = ''): NotificationRoute => {
    if (!isValidRoute(path)) return null;
    return { to: path, search: toSearchRecord(search) };
  };

  if (value.startsWith('/')) {
    const [pathWithMaybeHash, searchWithMaybeHash] = value.split('?');
    const [search = ''] = (searchWithMaybeHash || '').split('#');
    return fromPath(pathWithMaybeHash, search ? `?${search}` : '');
  }

  try {
    const url = new URL(value);
    return fromPath(url.pathname, url.search);
  } catch {
    return null;
  }
};

export const resolveNotificationRoute = (notification: ApiNotification): NotificationRoute => {
  const nonNavigableTypes = new Set([
    'change_opportunity_status',
    'purchase_opportunity_booklet',
    'create_interest_request_for_opportunity_owner',
  ]);

  if (nonNavigableTypes.has(notification.notification_type)) {
    return null;
  }

  const directUrl = normalizeRelativeRoute(notification.target_url ?? '');
  if (directUrl) return directUrl;

  const payload = notification.payload ?? {};
  const payloadUrl =
    normalizeRelativeRoute(payload.target_url ?? '') ??
    normalizeRelativeRoute(payload.url ?? '') ??
    normalizeRelativeRoute(payload.route ?? '');

  if (payloadUrl) return payloadUrl;

  const modelId =
    payload.model_id ?? payload.project_id ?? payload.opportunity_id ?? notification.model_id;
  const type = `${notification.notification_type ?? ''}`.toLowerCase();

  switch (notification.notification_type) {
    case 'publish_opportunity':
      return modelId ? { to: `/projects/${modelId}` } : null;
    case 'approve_profile_update_request':
    case 'reject_profile_update_request':
      return { to: '/dashboard', search: { tab: 'verification' } };
    case 'change_password':
      return { to: '/dashboard', search: { tab: 'settings', section: 'password' } };
    default:
      break;
  }

  switch (notification.model_type) {
    case 'ProfileUpdateRequest':
      return { to: '/dashboard', search: { tab: 'verification' } };
    default:
      break;
  }

  if (
    /profile.*update|update.*profile|account.*update|approve.*profile|verification/i.test(
      type,
    )
  ) {
    return { to: '/dashboard', search: { tab: 'verification' } };
  }

  switch (notification.notification_category) {
    case 'profile_update':
    case 'profile':
    case 'account':
    case 'verification':
      return { to: '/dashboard', search: { tab: 'verification' } };
    default:
      return null;
  }
};
