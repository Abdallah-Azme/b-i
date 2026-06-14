import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { FetchError } from 'ofetch';
import { toast, toastIdForMessage } from '@/lib/toast';
import { ApiError, extractApiError, isAuthErrorStatus } from './fetcher';
import i18n from '../i18n';

const getAuthErrorStatus = (error: unknown): number | undefined => {
  if (error instanceof ApiError) {
    return error.serverData?.code;
  }

  if (error instanceof FetchError) {
    return (
      error.status ??
      (error as FetchError & { statusCode?: number }).statusCode ??
      error.response?.status
    );
  }

  return extractApiError(error)?.serverData?.code;
};

const shouldSkipErrorToast = (error: unknown) => isAuthErrorStatus(getAuthErrorStatus(error));

function formatValidationErrors(
  validationErrors: Record<string, string[]> | []
): string | null {
  // Backend sends [] when there are no field-level errors
  if (Array.isArray(validationErrors)) return null;

  const entries = Object.entries(validationErrors);
  if (entries.length === 0) return null;

  return entries
    .flatMap(([, messages]) => messages.map((msg) => `• ${msg}`))
    .join('\n');
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: unknown) => {
      if (shouldSkipErrorToast(error)) return;

      const apiError = extractApiError(error);
      const message =
        apiError?.serverData?.msg ||
        (error instanceof Error ? error.message : null) ||
        i18n.t('common.error');
      toast.error(message, { id: toastIdForMessage(message) });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: unknown) => {
      if (shouldSkipErrorToast(error)) return;

      const apiError = extractApiError(error);

      if (apiError) {
        const validationErrors =
          apiError.serverData?.response_status?.validation_errors;
        const description = validationErrors
          ? formatValidationErrors(validationErrors)
          : null;

        const title = description ? i18n.t('common.error') : (apiError.serverData.msg || i18n.t('common.error'));
        toast.error(title, {
          id: toastIdForMessage(description ? `${title}:${description}` : title, 'api-mutation-error'),
          ...(description ? { description } : {}),
        });
        return;
      }

      const message =
        error instanceof Error ? error.message : i18n.t('common.error');
      toast.error(message, { id: toastIdForMessage(message, 'api-mutation-error') });
    },
  }),
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});
