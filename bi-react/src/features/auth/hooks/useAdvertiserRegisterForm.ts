import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { toast } from 'sonner';

export const useAdvertiserRegisterForm = () => {
  const { t } = useTranslation();
  const { mutate: register, isPending } = useMutation({
    mutationFn: (payload: any) => authService.registerAdvertiser(payload),
    onSuccess: (_data, variables) => {
      toast.success(t('auth.successAdvertiser'), { duration: 16000 });
      const email = variables instanceof FormData ? variables.get('email') as string : variables.email;
      const password = variables instanceof FormData ? variables.get('password') as string : variables.password;
      sessionStorage.setItem('verify_email', email);
      sessionStorage.setItem('verify_password', password);
      sessionStorage.setItem('verify_role', 'advertiser');
      window.location.href = '/verify-email';
    },
  });

  const advertiserSchema = z.object({
    first_name: z.string().min(2, t('errors.firstNameTooShort')),
    last_name: z.string().min(2, t('errors.lastNameTooShort')),
    email: z.string().email(t('errors.invalidEmail')),
    password: z.string().min(8, t('errors.passwordTooShort8')),
    password_confirmation: z.string(),
    country_code: z.string().default('965'),
    phone: z.string().superRefine((val, ctx) => {
      const digits = val.replace(/\D/g, '');
      if (digits.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('errors.invalidPhone'),
        });
      }
    }),
    company_name: z.string().min(2, t('errors.companyNameRequired')),
    license_number: z.string().min(1, t('errors.licenseNumberRequired')),
    company_license: z.any().refine(val => val instanceof File || (typeof FileList !== 'undefined' && val instanceof FileList && val.length > 0), t('errors.licenseFileRequired')),
    image: z.any().optional(),
    agreed_to_terms: z.boolean().refine(val => val === true, t('auth.termsError')),
  }).refine((data) => {
    const lengths: Record<string, number> = {
      '965': 8, '966': 8, '971': 8, '974': 8, '973': 8, '968': 8, '20': 8, '962': 8
    };
    const expected = lengths[data.country_code] || 8;
    return data.phone.length === expected;
  }, (data) => {
    const lengths: Record<string, number> = {
      '965': 8, '966': 8, '971': 8, '974': 8, '973': 8, '968': 8, '20': 8, '962': 8
    };
    const expected = lengths[data.country_code] || 8;
    return {
      message: t('errors.invalidPhoneLength', { length: expected }),
      path: ['phone']
    };
  }).refine((data) => data.password === data.password_confirmation, {
    message: t('auth.passwordsDoNotMatch'),
    path: ['password_confirmation']
  });

  type AdvertiserFormValues = z.infer<typeof advertiserSchema>;

  const form = useForm<AdvertiserFormValues>({
    resolver: zodResolver(advertiserSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirmation: '',
      country_code: '965',
      phone: '',
      company_name: '',
      license_number: '',
      company_license: undefined,
      image: undefined,
      agreed_to_terms: false,
    },
  });

  const onSubmit = (data: AdvertiserFormValues) => {
    const formData = new FormData();
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('country_code', data.country_code);
    formData.append('phone', data.phone);
    formData.append('company_name', data.company_name);
    formData.append('license_number', data.license_number);
    formData.append('agreed_to_terms', data.agreed_to_terms ? '1' : '0');
    
    // Handle files
    if (data.company_license instanceof FileList && data.company_license.length > 0) {
      formData.append('company_license', data.company_license[0]);
    } else if (data.company_license instanceof File) {
      formData.append('company_license', data.company_license);
    }
    
    if (data.image instanceof FileList && data.image.length > 0) {
      formData.append('image', data.image[0]);
    } else if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    register(formData as any); // authService accepts any and forwards to api.post
  };

  return {
    form,
    register: form.register,
    handleSubmit: form.handleSubmit(onSubmit),
    errors: form.formState.errors,
    isLoading: isPending,
  };
};
