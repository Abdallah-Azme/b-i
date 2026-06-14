import * as z from 'zod';
import type { TFunction } from 'i18next';

export const PASSWORD_MIN_LENGTH = 8;

export const passwordSchema = (t: TFunction) =>
  z
    .string()
    .min(1, t('errors.required'))
    .min(PASSWORD_MIN_LENGTH, t('errors.passwordTooShort8'));

export const passwordConfirmationSchema = () => z.string();

export const isValidPassword = (password: string) =>
  password.length >= PASSWORD_MIN_LENGTH;

export const passwordsMatch = (password: string, confirmation: string) =>
  password === confirmation;

export const getPasswordTooShortMessage = (t: TFunction) =>
  t('errors.passwordTooShort8');

export const getPasswordsDoNotMatchMessage = (t: TFunction) =>
  t('auth.passwordsDoNotMatch');

export const passwordMatchRefinement = <T extends { password: string; password_confirmation: string }>(
  t: TFunction,
) => ({
  check: (data: T) => data.password === data.password_confirmation,
  message: getPasswordsDoNotMatchMessage(t),
  path: ['password_confirmation'] as const,
});
