import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../context/Store';
import { useNavigate, Link } from '@tanstack/react-router';
import { Mail, Key, Lock, ArrowRight, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useForgotPasswordRequestCode, useForgotPasswordVerifyCode, useForgotPasswordReset } from '../features/auth/hooks/useForgotPassword';

export const ForgotPassword = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'ar' | 'en';
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const requestCode = useForgotPasswordRequestCode();
  const verifyCode = useForgotPasswordVerifyCode();
  const resetPassword = useForgotPasswordReset();

  const handleRequestCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    requestCode.mutate(
      { email },
      { onSuccess: () => setStep(2) }
    );
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    verifyCode.mutate(
      { email, otp: code },
      { onSuccess: () => setStep(3) }
    );
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password !== passwordConfirmation) return;
    resetPassword.mutate(
      { email, otp: code, password, password_confirmation: passwordConfirmation },
      { onSuccess: () => navigate({ to: '/login' }) }
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
              <ArrowLeft size={16} className={`mr-2 ${lang === 'ar' ? 'rotate-180' : ''}`} />
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
            {step === 1 && (
              <form onSubmit={handleRequestCode} className="space-y-6 animate-fade-in relative z-10">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300 ml-1">{t('auth.emailOrPhone')}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input 
                      type="text" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition"
                    />
                  </div>
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
              <form onSubmit={handleVerifyCode} className="space-y-6 animate-fade-in relative z-10">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300 ml-1">{t('auth.verificationCode')}</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input 
                      type="text" 
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition tracking-widest font-mono text-center"
                      maxLength={6}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={verifyCode.isPending}
                  className="w-full bg-brand-gold text-black font-bold py-3.5 rounded-xl hover:bg-yellow-500 transition shadow-lg shadow-brand-gold/20 disabled:opacity-50 flex justify-center items-center"
                >
                  {verifyCode.isPending ? <Loader2 className="animate-spin" /> : t('common.verify')}
                </button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-6 animate-fade-in relative z-10">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300 ml-1">{t('dashboard.newPassword')}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300 ml-1">{t('dashboard.confirmPassword')}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input 
                      type="password" 
                      required
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={resetPassword.isPending || password !== passwordConfirmation}
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
