export type UserRole = 'investor' | 'advertiser';

// ─── Login ───────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
  role: UserRole;
  device_token?: string;
  device_type?: 'web' | 'android' | 'ios';
}

// ─── Register ────────────────────────────────────────────────────────────

export interface RegisterInvestorPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  investor_type: 'angel' | 'company' | 'crowdfunding';
  available_capital: number;
  investment_experience: 'beginner' | 'intermediate' | 'expert';
  preferred_sector_id?: number;
  terms_accepted: boolean;
  device_token?: string;
  device_type?: 'web' | 'android' | 'ios';
}

export interface RegisterAdvertiserPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  company_name: string;
  category_id: number;
  terms_accepted: boolean;
  device_token?: string;
  device_type?: 'web' | 'android' | 'ios';
}

export type RegisterPayload = RegisterInvestorPayload | RegisterAdvertiserPayload;

// ─── Verify ────────────────────────────────────────────────────────────────

export interface VerifyPayload {
  email: string;
  otp: string;
  password: string;
  device_token?: string;
  device_type?: 'web' | 'android' | 'ios';
}

export interface ResendCodePayload {
  email: string;
  role: UserRole;
  password: string;
}

// ─── Responses ────────────────────────────────────────────────────────────

export interface AuthResponse {
  key: string;
  msg: string;
  code: number;
  data: {
    token: string;
    role: UserRole;
    user: any;
  } | null;
}

export interface ProfileResponse {
  key: string;
  msg: string;
  code: number;
  data: any;
}

export type ApiSimpleResponse = {
  key: string;
  msg: string;
  code: number;
  response_status: { error: boolean; validation_errors: any };
  data: null;
};

// ─── Notification Settings ─────────────────────────────────────────────────

export interface NotificationSetting {
  value: string;
  name: string;
  label: string;
  enabled: boolean;
}

export interface NotificationSettingsResponse {
  key: string;
  msg: string;
  code: number;
  response_status: { error: boolean; validation_errors: any[] };
  data: { settings: NotificationSetting[] };
}

export interface UpdateNotificationSettingsPayload {
  orders?: boolean;
  interest?: boolean;
  system?: boolean;
}

// ─── Change Password ───────────────────────────────────────────────────────

export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

// ─── Forgot Password ────────────────────────────────────────────────────────

export interface ForgotPasswordRequestPayload {
  email: string;
}

export interface ForgotPasswordVerifyPayload {
  email: string;
  otp: string;
}

export interface ForgotPasswordResetPayload {
  email: string;
  otp: string;
  password: string;
  password_confirmation: string;
}

// ─── Email Change ───────────────────────────────────────────────────────────

export interface EmailChangeRequestCurrentPayload {
  current_password: string;
}

export interface EmailChangeVerifyCurrentPayload {
  otp: string;
}

export interface EmailChangeRequestNewPayload {
  email: string;
}

export interface EmailChangeVerifyNewPayload {
  email: string;
  code: string;
}

// ─── Notifications ─────────────────────────────────────────────────────────
export interface ApiNotification {
  id: string;
  title: string;
  body: string;
  seen: boolean;
  read_at: string | null;
  notification_category: string;
  notification_type: string;
  model_type: string;
  model_id: number;
  payload: any;
  created_at: string;
  target_url: string | null;
}

export interface NotificationsListResponse {
  key: string;
  msg: string;
  code: number;
  response_status: { error: boolean; validation_errors: any };
  data: {
    notifications: ApiNotification[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
}

export interface UnreadCountResponse {
  key: string;
  msg: string;
  code: number;
  response_status: { error: boolean; validation_errors: any };
  data: {
    unread_notifications_count: number;
  };
}
