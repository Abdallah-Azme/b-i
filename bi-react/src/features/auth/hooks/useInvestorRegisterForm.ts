import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { toast } from 'sonner'; // only used for onSuccess

export const useInvestorRegisterForm = () => {
  const { t } = useTranslation();
  const { mutate: register, isPending } = useMutation({
    mutationFn: (payload: any) => authService.registerInvestor(payload),
    onSuccess: (_data, variables) => {
      toast.success(t('auth.successInvestor'));
      sessionStorage.setItem('verify_email', variables.email);
      sessionStorage.setItem('verify_password', variables.password);
      sessionStorage.setItem('verify_role', 'investor');
      window.location.href = '/verify-email';
    },
  });

  const investorSchema = z.object({
    first_name: z.string().min(2, t('errors.firstNameTooShort')),
    last_name: z.string().min(2, t('errors.lastNameTooShort')),
    email: z.string().email(t('errors.invalidEmail')),
    country_code: z.string().default('965'),
    phone: z.string().superRefine((val, ctx) => {
      const parent = (ctx as any).parent || (ctx as any)._input; // Accessing sibling field
      // Since superRefine doesn't easily provide siblings, we'll validate it in the object level if needed
      // but for now we'll do a general check and a more specific one in the component
      const digits = val.replace(/\D/g, '');
      if (digits.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('errors.invalidPhone'),
        });
      }
    }),
    investor_type: z.enum(['angel', 'company', 'crowdfunding']),
    capital: z.coerce.number().min(1000, t('errors.minCapital')).max(1000000000, t('errors.maxAmount', { defaultValue: 'Amount is too large' })),
    available_capital: z.coerce.number().min(1000, t('errors.minCapital')).max(1000000000, t('errors.maxAmount', { defaultValue: 'Amount is too large' })),
    preferred_sector_id: z.coerce.number(),
    category_id: z.coerce.number(),
    experience_level: z.coerce.number().min(0).max(100),
    previous_investments_count: z.coerce.number().min(0).max(10000),
    investor_experience: z.enum(['beginner', 'intermediate', 'expert']),
    agreed_to_terms: z.boolean().refine(val => val === true, t('auth.termsError')),
    password: z.string().min(8, t('errors.passwordTooShort8')),
    password_confirmation: z.string(),
  }).refine((data) => {
    // Dynamic validation based on country
    const lengths: Record<string, number> = {
      '965': 8, '966': 9, '971': 9, '974': 8, '973': 8, '968': 8, '20': 10, '962': 9
    };
    const expected = lengths[data.country_code] || 8;
    return data.phone.length === expected;
  }, {
    message: t('errors.invalidPhone'),
    path: ['phone']
  }).refine((data) => data.password === data.password_confirmation, {
    message: t('auth.passwordsDoNotMatch'),
    path: ['password_confirmation']
  });

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
