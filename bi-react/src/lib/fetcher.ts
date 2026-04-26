import { ofetch, FetchError } from 'ofetch';

const BASE_URL = 'https://portal.businessandinvestments.net/api'; // Production Base URL

/**
 * Typed shape of every error response from the backend.
 * Example:
 * { key: "fail", msg: "The given data was invalid.", code: 422,
 *   response_status: { error: true, validation_errors: { phone: ["..."] } } }
 */
export interface ApiErrorData {
  key?: string;
  msg?: string;
  code?: number;
  data?: unknown;
  response_status?: {
    error?: boolean;
    /** Empty array [] when no errors; field-keyed object when there are errors. */
    validation_errors?: Record<string, string[]> | [];
  };
}

/** Custom error class that carries the full server response. */
export class ApiError extends Error {
  serverData: ApiErrorData;
  constructor(serverData: ApiErrorData) {
    super(serverData.msg || 'Request failed');
    this.serverData = serverData;
    this.name = 'ApiError';
  }
}

export const apiFetcher = ofetch.create({
  baseURL: BASE_URL,
  async onRequest({ options }) {
    const token = localStorage.getItem('auth_token');
    // i18next may store 'en-US' or 'ar-SA' — normalize to bare code ('en' / 'ar')
    const rawLang = localStorage.getItem('i18nextLng') || 'en';
    const lang = rawLang.split('-')[0].toLowerCase();

    options.headers = new Headers(options.headers);
    options.headers.set('Accept', 'application/json');
    // Match Postman's  Accept-Language: {{lang}}  header globally
    options.headers.set('Accept-Language', lang);

    if (token) {
      options.headers.set('Authorization', `Bearer ${token}`);
    }
  },
  async onResponseError({ response }) {
    if (response.status === 401) {
      // Handle logout/redirect
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }

    // ofetch parses the response body BEFORE calling error hooks and stores
    // the result on response._data. Calling response.json() again would fail
    // because the stream is already consumed.
    const body: ApiErrorData = (response as any)._data ?? {};
    throw new ApiError(body);
  },
});

/** Unwrap an ApiError from whatever ofetch throws (it may wrap ours). */
export function extractApiError(error: unknown): ApiError | null {
  if (error instanceof ApiError) return error;
  // ofetch may wrap our ApiError as FetchError.cause (v1) or FetchError.data (some builds)
  if (error instanceof FetchError) {
    if (error.cause instanceof ApiError) return error.cause;
    if (error.data instanceof ApiError) return error.data;
    // ofetch also exposes the parsed body directly on FetchError.data as a plain object
    if (error.data && typeof error.data === 'object' && 'msg' in error.data) {
      return new ApiError(error.data as ApiErrorData);
    }
  }
  return null;
}

export const api = {
  get: <T>(url: string, opts?: any) => apiFetcher<T>(url, { method: 'GET', ...opts }),
  post: <T>(url: string, body?: any, opts?: any) => apiFetcher<T>(url, { method: 'POST', body, ...opts }),
  put: <T>(url: string, body?: any, opts?: any) => apiFetcher<T>(url, { method: 'PUT', body, ...opts }),
  patch: <T>(url: string, body?: any, opts?: any) => apiFetcher<T>(url, { method: 'PATCH', body, ...opts }),
  delete: <T>(url: string, opts?: any) => apiFetcher<T>(url, { method: 'DELETE', ...opts }),
};
