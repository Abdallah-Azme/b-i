import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLogin } from './useAuth';
import { UserRole } from '../types';

export const useLoginForm = (defaultRole: UserRole = 'investor') => {
  const { t } = useTranslation();
  const { mutate: login, isPending } = useLogin();

  const loginSchema = z.object({
    email: z.string().email(t('errors.invalidEmail')),
    password: z.string().min(6, t('errors.passwordTooShort')),
    role: z.enum(['investor', 'advertiser'] as const),
  });

  type LoginFormValues = z.infer<typeof loginSchema>;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: defaultRole,
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login({
      ...data,
      device_type: 'web',
    });
  };

  return {
    form,
    register: form.register,
    handleSubmit: form.handleSubmit(onSubmit),
    errors: form.formState.errors,
    isLoading: isPending,
    setValue: form.setValue,
    watch: form.watch,
  };
};
