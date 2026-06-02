import { Toaster, toast as sonnerToast, useSonner } from 'sonner';
import type { ExternalToast, ToastClassnames, ToastT, ToastToDismiss, ToasterProps } from 'sonner';

export { Toaster, useSonner };
export type { ExternalToast, ToastClassnames, ToastT, ToastToDismiss, ToasterProps };

export const TOAST_MAX_DURATION_MS = 5_000;

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
