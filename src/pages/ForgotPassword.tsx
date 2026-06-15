import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { Mail, Key, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { useForgotPasswordRequestCode, useForgotPasswordVerifyCode, useForgotPasswordReset } from '../features/auth/hooks/useForgotPassword';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { OtpInput } from '@/components/ui/OtpInput';
import {
  getPasswordTooShortMessage,
  getPasswordsDoNotMatchMessage,
  isValidPassword,
  passwordsMatch,
} from '@/lib/password-validation';
import { cn } from '@/lib/utils';
import { toast } from '@/lib/toast';

export const ForgotPassword = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'ar' | 'en';
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const requestCode = useForgotPasswordRequestCode();
  const verifyCode = useForgotPasswordVerifyCode();
  const resetPassword = useForgotPasswordReset();

  useEffect(() => {
    if (step === 2) {
      setResendCountdown(60);
      countdownRef.current = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [step]);

  const handleResendCode = () => {
    if (!email || resendCountdown > 0) return;
    requestCode.mutate({ email }, {
      onSuccess: () => {
        toast.success(t('auth.codeSent'), { id: 'forgot-password-code-sent' });
        setResendCountdown(60);
        countdownRef.current = setInterval(() => {
          setResendCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownRef.current!);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    });
  };

  const handleRequestCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setEmailError(t('errors.emailRequired'));
      return;
    }
    setEmailError('');
    requestCode.mutate(
      { email },
      { onSuccess: () => setStep(2) }
    );
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setCodeError(t('errors.verificationCodeRequired'));
      return;
    }
    setCodeError('');
    verifyCode.mutate(
      { email, otp: code },
      {
        onSuccess: () => {
          toast.success(t('auth.codeVerified'), { id: 'forgot-password-code-verified' });
          setStep(3);
        },
      }
    );
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!password) {
      setPasswordError(t('errors.passwordRequired'));
      hasError = true;
    } else if (!isValidPassword(password)) {
      setPasswordError(getPasswordTooShortMessage(t));
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (!passwordConfirmation) {
      setConfirmPasswordError(t('errors.confirmPasswordRequired'));
      hasError = true;
    } else if (!passwordsMatch(password, passwordConfirmation)) {
      setConfirmPasswordError(getPasswordsDoNotMatchMessage(t));
      hasError = true;
    } else {
      setConfirmPasswordError('');
    }

    if (hasError) return;

    resetPassword.mutate(
      { email, otp: code, password, password_confirmation: passwordConfirmation },
      {
        onSuccess: () => {
          toast.success(t('auth.passwordResetSuccess'), { id: 'forgot-password-reset-success' });
          navigate({ to: '/login' });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-brand-black flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md animate-fade-in">
          
          {step > 1 && (
            <button 
              onClick={() => setStep((s) => (s - 1) as any)}
              className="mb-8 flex items-center text-sm font-bold text-gray-400 hover:text-white transition"
            >
              <ArrowLeft size={16} className={`me-2 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              {t('common.back')}
            </button>
          )}

          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">{t('auth.forgotPassword')}</h2>
            <p className="text-gray-400 text-sm">
              {step === 1 && t('auth.forgotPasswordDesc')}
              {step === 2 && t('auth.enterCodeDesc')}
              {step === 3 && t('auth.newPasswordDesc')}
            </p>
          </div>

          <div className="bg-[#121212] p-8 rounded-2xl border border-white/10 shadow-xl shadow-brand-gold/5 relative overflow-hidden">
            <div className="mb-6 flex justify-start">
              <button
                type="button"
                onClick={() => navigate({ to: '/login' })}
                className="inline-flex items-center gap-2 text-sm font-bold text-brand-gold hover:text-yellow-400 transition"
              >
                <ArrowLeft size={16} className={lang === 'ar' ? 'rotate-180' : ''} />
                {lang === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to login'}
              </button>
            </div>

            {step === 1 && (
              <form onSubmit={handleRequestCode} noValidate className="space-y-6 animate-fade-in relative z-10">
                <div className="space-y-2">
                  <label className={cn("text-sm font-bold ms-1", emailError ? "text-red-500" : "text-gray-300")}>
                    {t('auth.emailOrPhone')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input 
                      type="text"
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError('');
                      }}
                      className={cn(
                        "w-full bg-black/50 border rounded-xl py-3 ps-12 pe-4 text-white focus:ring-2 focus:ring-brand-gold/20 outline-none transition",
                        emailError ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-brand-gold"
                      )}
                    />
                  </div>
                  {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                </div>

                <button 
                  type="submit" 
                  disabled={requestCode.isPending}
                  className="w-full bg-brand-gold text-black font-bold py-3.5 rounded-xl hover:bg-yellow-500 transition shadow-lg shadow-brand-gold/20 disabled:opacity-50 flex justify-center items-center"
                >
                  {requestCode.isPending ? <Loader2 className="animate-spin" /> : t('common.continue')}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyCode} noValidate className="space-y-6 animate-fade-in relative z-10">
                <div className="space-y-2">
                  <label className={cn("text-sm font-bold ms-1", codeError ? "text-red-500" : "text-gray-300")}>
                    {t('auth.verificationCode')}
                  </label>
                  <OtpInput
                    value={code}
                    onChange={(value) => {
                      setCode(value.slice(0, 6));
                      if (codeError) setCodeError('');
                    }}
                    hasError={!!codeError}
                  />
                  {codeError && <p className="text-sm text-red-500">{codeError}</p>}
                </div>

                <button 
                  type="submit" 
                  disabled={verifyCode.isPending}
                  className="w-full bg-brand-gold text-black font-bold py-3.5 rounded-xl hover:bg-yellow-500 transition shadow-lg shadow-brand-gold/20 disabled:opacity-50 flex justify-center items-center"
                >
                  {verifyCode.isPending ? <Loader2 className="animate-spin" /> : t('common.verify')}
                </button>

                <div className="text-center pt-2">
                  <span className="text-gray-500 text-sm">{t('auth.didntReceive')} </span>
                  {resendCountdown > 0 ? (
                    <span className="text-sm text-gray-400 font-medium">
                      {t('auth.resendIn', { seconds: resendCountdown })}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={requestCode.isPending}
                      className="text-sm font-bold text-brand-gold hover:text-yellow-400 transition disabled:opacity-50"
                    >
                      {requestCode.isPending ? <Loader2 className="animate-spin inline" size={14} /> : t('auth.resendCode')}
                    </button>
                  )}
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword} noValidate className="space-y-6 animate-fade-in relative z-10">
                <div className="space-y-2">
                  <label className={cn("text-sm font-bold ms-1", passwordError ? "text-red-500" : "text-gray-300")}>
                    {t('dashboard.newPassword')}
                  </label>
                  <PasswordInput 
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    leftIcon={<Lock size={20} />}
                    className={cn("rounded-xl py-3", passwordError && "border-red-500 focus:border-red-500")}
                  />
                  {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                </div>
                <div className="space-y-2">
                  <label className={cn("text-sm font-bold ms-1", confirmPasswordError ? "text-red-500" : "text-gray-300")}>
                    {t('dashboard.confirmPassword')}
                  </label>
                  <PasswordInput 
                    value={passwordConfirmation}
                    onChange={(e) => {
                      setPasswordConfirmation(e.target.value);
                      if (confirmPasswordError) setConfirmPasswordError('');
                    }}
                    leftIcon={<Lock size={20} />}
                    className={cn("rounded-xl py-3", confirmPasswordError && "border-red-500 focus:border-red-500")}
                  />
                  {confirmPasswordError && <p className="text-sm text-red-500">{confirmPasswordError}</p>}
                </div>

                <button 
                  type="submit" 
                  disabled={resetPassword.isPending}
                  className="w-full bg-brand-gold text-black font-bold py-3.5 rounded-xl hover:bg-yellow-500 transition shadow-lg shadow-brand-gold/20 disabled:opacity-50 flex justify-center items-center"
                >
                  {resetPassword.isPending ? <Loader2 className="animate-spin" /> : t('auth.saveChanges')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <div className="hidden md:block relative w-0 flex-1">
        <img className="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop" alt="" />
        <div className="absolute inset-0 bg-brand-black/80 backdrop-blur-sm"></div>
      </div>
    </div>
  );
};
