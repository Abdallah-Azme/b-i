import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'sonner';
import { extractApiError } from './fetcher';

/**
 * Flatten { field: ["msg1", "msg2"], ... } into a single string with
 * one bullet per message, e.g.:
 *   • phone: The phone format is invalid.
 *   • email: The email has already been taken.
 *
 * Returns null when validation_errors is an empty array or has no entries.
 */
function formatValidationErrors(
  validationErrors: Record<string, string[]> | []
): string | null {
  // Backend sends [] when there are no field-level errors
  if (Array.isArray(validationErrors)) return null;

  const entries = Object.entries(validationErrors);
  if (entries.length === 0) return null;

  return entries
    .flatMap(([field, messages]) =>
      messages.map((msg) => `• ${field}: ${msg}`)
    )
    .join('\n');
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: unknown) => {
      const apiError = extractApiError(error);
      const message =
        apiError?.serverData?.msg ||
        (error instanceof Error ? error.message : null) ||
        'Something went wrong';
      toast.error(message);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: unknown) => {
      const apiError = extractApiError(error);

      if (apiError) {
        const validationErrors =
          apiError.serverData?.response_status?.validation_errors;
        const description = validationErrors
          ? formatValidationErrors(validationErrors)
          : null;

        toast.error(apiError.serverData.msg || 'Action failed', {
          // Only attach description when there are actual field errors
          ...(description ? { description, duration: 8000 } : {}),
        });
        return;
      }

      // Fallback for non-API errors
      const message =
        error instanceof Error ? error.message : 'Action failed';
      toast.error(message);
    },
  }),
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});
