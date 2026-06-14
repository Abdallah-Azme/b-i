import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { passwordSchema, passwordConfirmationSchema, passwordMatchRefinement } from '@/lib/password-validation';
import { emailSchema } from '@/lib/field-validation';

export const useInvestorRegisterForm = () => {
  const { t, i18n } = useTranslation();
  const { mutate: register, isPending } = useMutation({
    mutationFn: (payload: any) => authService.registerInvestor(payload),
    onSuccess: (_data, variables) => {
      sessionStorage.setItem('verify_email', variables.email);
      sessionStorage.setItem('verify_password', variables.password);
      sessionStorage.setItem('verify_role', 'investor');
      sessionStorage.setItem('registration_success_toast', t('auth.successInvestor'));
      sessionStorage.setItem('verify_resend_cooldown_until', String(Date.now() + 60_000));
      window.location.href = '/verify-email';
    },
  });

  const phoneLengths: Record<string, number> = {
    '965': 8, '966': 8, '971': 8, '974': 8, '973': 8, '968': 8, '20': 8, '962': 8,
  };

  const investorSchema = useMemo(() => {
    const passwordMatch = passwordMatchRefinement(t);

    return z.object({
    first_name: z.string().min(2, t('errors.firstNameTooShort')),
    last_name: z.string().min(2, t('errors.lastNameTooShort')),
    email: emailSchema(t),
    country_code: z.string().default('965'),
    phone: z.string().min(1, t('errors.phoneRequired')),
    investor_type: z.enum(['angel', 'company', 'crowdfunding']),
    capital: z.coerce.number().min(1000, t('errors.minCapital')).max(1000000000, t('errors.maxAmount', { defaultValue: 'Amount is too large' })),
    available_capital: z.coerce.number().min(1000, t('errors.minCapital')).max(1000000000, t('errors.maxAmount', { defaultValue: 'Amount is too large' })),
    preferred_sector_id: z.coerce.number(),
    category_id: z.coerce.number(),
    experience_level: z.coerce.number().min(0).max(100),
    previous_investments_count: z.coerce.number().min(0).max(10000),
    investor_experience: z.enum(['beginner', 'intermediate', 'expert']),
    agreed_to_terms: z.boolean().refine(val => val === true, t('auth.termsError')),
    password: passwordSchema(t),
    password_confirmation: passwordConfirmationSchema(),
  }).refine((data) => {
    const expected = phoneLengths[data.country_code] || 8;
    return data.phone.length === expected;
  }, (data) => {
    const expected = phoneLengths[data.country_code] || 8;
    return {
      message: t('errors.invalidPhoneLength', { length: expected }),
      path: ['phone'],
    };
  }).refine(passwordMatch.check, {
    message: passwordMatch.message,
    path: ['password_confirmation'],
  }).refine((data) => data.available_capital <= data.capital, {
    message: t('errors.availableCapitalExceedsTotal'),
    path: ['available_capital'],
  });
  }, [t, i18n.language]);

  type InvestorFormValues = z.infer<typeof investorSchema>;

  const form = useForm<InvestorFormValues>({
    resolver: zodResolver(investorSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      country_code: '965',
      phone: '',
      investor_type: 'angel',
      capital: 0,
      available_capital: 0,
      preferred_sector_id: 1,
      category_id: 1,
      experience_level: 0,
      previous_investments_count: 0,
      investor_experience: 'beginner',
      agreed_to_terms: false,
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = (data: InvestorFormValues) => {
    register({
      ...data,
      agreed_to_terms: data.agreed_to_terms ? 1 : 0,
    });
  };

  return {
    form,
    register: form.register,
    handleSubmit: form.handleSubmit(onSubmit),
    errors: form.formState.errors,
    isLoading: isPending,
    setValue: form.setValue,
  };
};
