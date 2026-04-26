import { api } from '@/lib/fetcher';
import {
  LoginPayload,
  VerifyPayload,
  ResendCodePayload,
  AuthResponse,
  ProfileResponse,
  NotificationSettingsResponse,
  UpdateNotificationSettingsPayload,
  ChangePasswordPayload,
  ForgotPasswordRequestPayload,
  ForgotPasswordVerifyPayload,
  ForgotPasswordResetPayload,
  EmailChangeRequestCurrentPayload,
  EmailChangeVerifyCurrentPayload,
  EmailChangeRequestNewPayload,
  EmailChangeVerifyNewPayload,
  ApiSimpleResponse,
  NotificationsListResponse,
  UnreadCountResponse,
} from '../types';

export const authService = {
  // ─── Auth core ────────────────────────────────────────────────────────────
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>('/v1/auth/login', payload),

  registerInvestor: (payload: any) =>
    api.post<AuthResponse>('/v1/auth/register/investor', payload),

  registerAdvertiser: (payload: any) =>
    api.post<AuthResponse>('/v1/auth/register/advertiser', payload),

  verifyCode: (payload: VerifyPayload) =>
    api.post<AuthResponse>('/v1/auth/verify-code', payload),

  resendCode: (payload: ResendCodePayload) =>
    api.post<ApiSimpleResponse>('/v1/auth/resend-code', payload),

  logout: (device_token?: string) =>
    api.post('/v1/auth/logout', { device_token }),

  // ─── Profile ─────────────────────────────────────────────────────────────
  getProfile: () =>
    api.get<ProfileResponse>('/v1/auth/profile'),

  updateProfile: (payload: any) =>
    api.patch<ProfileResponse>('/v1/auth/profile', payload),

  // ─── Notification settings ─────────────────────────────────────────────────
  getNotificationSettings: () =>
    api.get<NotificationSettingsResponse>('/v1/auth/notification-settings'),

  updateNotificationSettings: (payload: UpdateNotificationSettingsPayload) =>
    api.patch<NotificationSettingsResponse>('/v1/auth/notification-settings', payload),

  // ─── Change password ─────────────────────────────────────────────────────
  changePassword: (payload: ChangePasswordPayload) =>
    api.patch<ApiSimpleResponse>('/v1/auth/password', payload),

  // ─── Forgot password (3-step) ───────────────────────────────────────────────
  forgotPasswordRequestCode: (payload: ForgotPasswordRequestPayload) =>
    api.post<ApiSimpleResponse>('/v1/auth/password/forgot/request-code', payload),

  forgotPasswordVerifyCode: (payload: ForgotPasswordVerifyPayload) =>
    api.post<ApiSimpleResponse>('/v1/auth/password/forgot/verify-code', payload),

  forgotPasswordReset: (payload: ForgotPasswordResetPayload) =>
    api.post<ApiSimpleResponse>('/v1/auth/password/forgot/reset', payload),

  // ─── Change email (4-step) ─────────────────────────────────────────────────
  emailChangeRequestCurrent: (payload: EmailChangeRequestCurrentPayload) =>
    api.post<ApiSimpleResponse>('/v1/auth/email-change/request-current', payload),

  emailChangeVerifyCurrent: (payload: EmailChangeVerifyCurrentPayload) =>
    api.post<ApiSimpleResponse>('/v1/auth/email-change/verify-current', payload),

  emailChangeRequestNew: (payload: EmailChangeRequestNewPayload) =>
    api.post<ApiSimpleResponse>('/v1/auth/email-change/request-new', payload),

  emailChangeVerifyNew: (payload: EmailChangeVerifyNewPayload) =>
    api.post<ApiSimpleResponse>('/v1/auth/email-change/verify-new', payload),

  // ─── Profile Update Requests ───────────────────────────────────────────────
  getLatestProfileUpdateRequest: () =>
    api.get('/v1/auth/profile-update-requests/latest'),

  // ─── Account Deletion ──────────────────────────────────────────────────────
  deleteAccount: (payload?: any) =>
    api.post('/v1/auth/account-deletion-requests', payload),

  // ─── Notifications ─────────────────────────────────────────────────────────
  getNotifications: (params?: { page?: number; per_page?: number }) =>
    api.get<NotificationsListResponse>('/v1/auth/notifications', { query: params }),

  getUnreadNotificationsCount: () =>
    api.get<UnreadCountResponse>('/v1/auth/notifications/unread-count'),

  markAllNotificationsRead: () =>
    api.patch<ApiSimpleResponse>('/v1/auth/notifications/read-all'),

  deleteAllNotifications: () =>
    api.delete<ApiSimpleResponse>('/v1/auth/notifications/delete-all'),

  deleteNotification: (id: string | number) =>
    api.delete<ApiSimpleResponse>(`/v1/auth/notifications/${id}`),
};
