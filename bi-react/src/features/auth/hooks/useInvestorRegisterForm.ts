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
    phone: z.string().refine(val => {
      const digits = val.replace(/\D/g, '');
      return digits.length >= 8 && digits.length <= 16;
    }, t('errors.invalidPhone')),
    investor_type: z.enum(['angel', 'company', 'crowdfunding']),
    capital: z.coerce.number().min(1000, t('errors.minCapital')),
    available_capital: z.coerce.number().min(1000, t('errors.minCapital')),
    preferred_sector_id: z.coerce.number(),
    category_id: z.coerce.number(),
    experience_level: z.coerce.number().min(0).max(100),
    previous_investments_count: z.coerce.number().min(0),
    investor_experience: z.enum(['beginner', 'intermediate', 'expert']),
    agreed_to_terms: z.boolean().refine(val => val === true, t('auth.termsError')),
    password: z.string().min(8, t('errors.passwordTooShort8')),
  });

  type InvestorFormValues = z.infer<typeof investorSchema>;

  const form = useForm<InvestorFormValues>({
    resolver: zodResolver(investorSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
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
