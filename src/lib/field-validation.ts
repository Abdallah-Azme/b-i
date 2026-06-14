import * as z from 'zod';
import type { TFunction } from 'i18next';

export const emailSchema = (t: TFunction) =>
  z
    .string()
    .min(1, t('errors.emailRequired'))
    .email(t('errors.invalidEmail'));

export const verificationCodeSchema = (t: TFunction) =>
  z.string().min(1, t('errors.verificationCodeRequired'));
