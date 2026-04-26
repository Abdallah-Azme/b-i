import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLoginForm } from '../hooks/useLoginForm';
import { Link } from '@tanstack/react-router';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const { form, handleSubmit, isLoading, watch, setValue } = useLoginForm();
  const currentRole = watch('role');

  return (
    <div className="w-full max-w-md mx-auto p-8 glass-card animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gold-gradient text-transparent bg-clip-text">{t('auth.welcomeBack')}</h1>
        <p className="text-gray-400 mt-2">{t('auth.loginSubtitle')}</p>
      </div>

      <div className="flex gap-4 mb-8 p-1 bg-white/5 rounded-lg">
        <button
          type="button"
          onClick={() => setValue('role', 'investor')}
          className={`flex-1 py-2 rounded-md font-bold transition-all ${
            currentRole === 'investor' ? 'bg-gold-gradient text-black' : 'text-gray-400 hover:text-white'
          }`}
        >
          {t('auth.investor')}
        </button>
        <button
          type="button"
          onClick={() => setValue('role', 'advertiser')}
          className={`flex-1 py-2 rounded-md font-bold transition-all ${
            currentRole === 'advertiser' ? 'bg-gold-gradient text-black' : 'text-gray-400 hover:text-white'
          }`}
        >
          {t('auth.advertiser')}
        </button>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="normal-case">{t('auth.email')}</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="normal-case">{t('auth.password')}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
                <div className="flex justify-end mt-2">
                  <Link to="/forgot-password" className="text-xs text-brand-gold hover:underline">
                    {t('auth.forgotPassword')}
                  </Link>
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? t('auth.signingIn') : t('auth.signIn')}
          </Button>
        </form>
      </Form>

      <div className="mt-8 text-center text-sm text-gray-500">
        {t('auth.noAccount')}{' '}
        <a href="/register-type" className="text-brand-gold hover:underline">
          {t('auth.createAccount')}
        </a>
      </div>
    </div>
  );
};
