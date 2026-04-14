import { ofetch } from 'ofetch';
import { useAuthStore } from '@/features/auth/services/auth-store';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const fetchClient = ofetch.create({
  baseURL: baseUrl,
  headers: {
    'Accept': 'application/json',
  },
  onRequest({ options }) {
    // Inject token dynamically on every request
    const token = useAuthStore.getState().token;
    if (token) {
      options.headers = new Headers(options.headers);
      options.headers.set('Authorization', `Bearer ${token}`);
    }

    // Inject active language for backend translation streams
    if (typeof window !== 'undefined') {
      const activeLocale = document.documentElement.lang || 'en';
      options.headers = new Headers(options.headers || {});
      options.headers.set('Accept-Language', activeLocale);
    }
  },
  onResponseError({ response, error }) {
    // Handle unauthorized globally
    if (response?.status === 401) {
      useAuthStore.getState().logout();
    }
  }
});

/**
 * Global API wrapper exposing standardized get/post/put/delete methods
 */
export const api = {
  get: <T = any>(url: string, options?: any) => 
    fetchClient<T>(url, { method: 'GET', ...options }),
    
  post: <T = any>(url: string, body?: any, options?: any) => 
    fetchClient<T>(url, { method: 'POST', body, ...options }),
    
  put: <T = any>(url: string, body?: any, options?: any) => 
    fetchClient<T>(url, { method: 'PUT', body, ...options }),
    
  patch: <T = any>(url: string, body?: any, options?: any) => 
    fetchClient<T>(url, { method: 'PATCH', body, ...options }),
    
  delete: <T = any>(url: string, options?: any) => 
    fetchClient<T>(url, { method: 'DELETE', ...options }),
};
