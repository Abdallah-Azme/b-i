import { Toaster, toast as sonnerToast, useSonner } from 'sonner';
import type { ExternalToast, ToastClassnames, ToastT, ToastToDismiss, ToasterProps } from 'sonner';

export { Toaster, useSonner };
export type { ExternalToast, ToastClassnames, ToastT, ToastToDismiss, ToasterProps };

export const TOAST_MAX_DURATION_MS = 5_000;

const shownToastIds = new Set<string>();

/** Show a toast at most once per page load (and optionally per sessionStorage key). */
export function showToastOnce(
  id: string,
  show: () => void,
  options?: { sessionKey?: string },
) {
  if (shownToastIds.has(id)) return;
  if (options?.sessionKey && sessionStorage.getItem(options.sessionKey)) return;

  shownToastIds.add(id);
  if (options?.sessionKey) {
    sessionStorage.setItem(options.sessionKey, '1');
  }

  show();
}

export function clearShownToasts(ids?: string[]) {
  if (!ids) {
    shownToastIds.clear();
    return;
  }
  ids.forEach((id) => shownToastIds.delete(id));
}

export function toastIdForMessage(message: string, prefix = 'api-error') {
  return `${prefix}-${message}`;
}

type ToastOptionsWithDuration = {
  duration?: number;
};

const withMaxDuration = <T extends ToastOptionsWithDuration | undefined>(options: T) => {
  const duration = options?.duration;
  const cappedDuration =
    typeof duration === 'number' && Number.isFinite(duration)
      ? Math.min(duration, TOAST_MAX_DURATION_MS)
      : TOAST_MAX_DURATION_MS;

  return {
    ...(options ?? {}),
    duration: cappedDuration,
  };
};

const withCappedToastOptions = <T extends (...args: any[]) => any>(method: T): T =>
  ((...args: Parameters<T>) => {
    if (args.length > 1) {
      args[1] = withMaxDuration(args[1] as ToastOptionsWithDuration) as Parameters<T>[1];
    } else {
      args.push(withMaxDuration(undefined) as Parameters<T>[1]);
    }

    return method(...args);
  }) as T;

export const toast = new Proxy(withCappedToastOptions(sonnerToast), {
  get(_target, property) {
    const value = sonnerToast[property as keyof typeof sonnerToast];

    if (typeof value !== 'function') return value;

    if (property === 'dismiss' || property === 'getHistory' || property === 'getToasts') {
      return value;
    }

    return withCappedToastOptions(value as (...args: any[]) => any);
  },
}) as typeof sonnerToast;
