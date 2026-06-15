import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from '@tanstack/react-router';
import { Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/features/auth/services/auth.service';
import { TOAST_MAX_DURATION_MS, toast, showToastOnce } from '@/lib/toast';
import type { UserRole } from '@/features/auth/types';
import { OtpInput } from '@/components/ui/OtpInput';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds
const RESEND_COOLDOWN_UNTIL_KEY = 'verify_resend_cooldown_until';

const getRemainingCooldown = () => {
  const cooldownUntil = sessionStorage.getItem(RESEND_COOLDOWN_UNTIL_KEY);
  if (!cooldownUntil) return 0;
  return Math.max(0, Math.ceil((Number(cooldownUntil) - Date.now()) / 1000));
};

const startResendCooldown = () => {
  const until = Date.now() + RESEND_COOLDOWN * 1000;
  sessionStorage.setItem(RESEND_COOLDOWN_UNTIL_KEY, String(until));
  return RESEND_COOLDOWN;
};

export const VerifyEmail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const isRtl = lang === 'ar';

  // Read context from sessionStorage (populated by registration hooks)
  const email = sessionStorage.getItem('verify_email') ?? '';
  const password = sessionStorage.getItem('verify_password') ?? '';
  const role = (sessionStorage.getItem('verify_role') ?? 'advertiser') as UserRole;

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [cooldown, setCooldown] = useState(getRemainingCooldown);
  const [verified, setVerified] = useState(false);
  useEffect(() => {
    const registrationToast = sessionStorage.getItem('registration_success_toast');
    if (!registrationToast) return;

    showToastOnce('registration-success-toast', () => {
      toast.success(registrationToast, {
        id: 'registration-success-toast',
        duration: TOAST_MAX_DURATION_MS,
      });
    }, { sessionKey: 'registration_success_toast_shown' });

    sessionStorage.removeItem('registration_success_toast');
  }, []);

  useEffect(() => {
    const cooldownUntil = sessionStorage.getItem(RESEND_COOLDOWN_UNTIL_KEY);
    if (cooldownUntil) {
      setCooldown(getRemainingCooldown());
      return;
    }

    if (email && password) {
      setCooldown(startResendCooldown());
    }
  }, [email, password]);

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  // --- Mutations ---
  const verifyMutation = useMutation({
    mutationFn: () =>
      authService.verifyCode({
        email,
        otp: otp.join(''),
        password,
        device_type: 'web',
      }),
    onSuccess: (data) => {
      // Persist auth token — response shape: data.data.token, data.data.role.key
      if (data?.data?.token) {
        localStorage.setItem('auth_token', data.data.token);
        // role comes as { key: "investor", label: "..." }
        const roleKey = (data.data.role as any)?.key ?? role;
        localStorage.setItem('auth_role', roleKey);
      }
      sessionStorage.removeItem('verify_email');
      sessionStorage.removeItem('verify_password');
      sessionStorage.removeItem('verify_role');
      sessionStorage.removeItem(RESEND_COOLDOWN_UNTIL_KEY);
      setVerified(true);
      setTimeout(() => navigate({ to: '/dashboard' }), 2500);
    },
    onError: () => { },
  });

  const resendMutation = useMutation({
    mutationFn: () =>
      authService.resendCode({ email, password, role }),
    onSuccess: () => {
      toast.success(t('auth.codeSent'), { id: 'verify-code-sent' });
      setCooldown(startResendCooldown());
    },
    onError: () => { },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join('').length < OTP_LENGTH) {
      toast.error(t('auth.otpIncomplete'));
      return;
    }
    verifyMutation.mutate();
  };

  const isLoading = verifyMutation.isPending;

  // --- Verified success screen ---
  if (verified) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
            <CheckCircle size={48} className="text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">{t('auth.verifiedTitle')}</h1>
          <p className="text-gray-400">{t('auth.verifiedDesc')}</p>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // --- Missing context guard ---
  if (!email || !password) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 bg-brand-gray rounded-full flex items-center justify-center mx-auto">
            <Mail size={36} className="text-brand-gold" />
          </div>
          <h1 className="text-2xl font-bold text-white">{t('auth.verifyTitle')}</h1>
          <p className="text-gray-400">{t('auth.verifySessionExpired')}</p>
          <Link to="/login" className="inline-flex items-center gap-2 text-brand-gold hover:text-white font-bold transition">
            {isRtl ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
            {t('auth.backToLogin')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-10rem)] bg-brand-black flex flex-col md:min-h-screen md:flex-row">
      {/* Form Side */}
      <div className="flex-1 flex flex-col justify-start px-4 pt-2 pb-4 sm:px-6 md:justify-center md:py-4 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md animate-fade-in">
          {/* Back link */}
          <Link
            to="/login"
            className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition md:mb-8"
          >
            <ArrowLeft size={16} className={isRtl ? 'rotate-180' : ''} />
            {t('auth.backToLogin')}
          </Link>

          {/* Header */}
          <div className="text-center mb-5 md:mb-10">
            <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-brand-gold/30 relative md:w-20 md:h-20 md:mb-5">
              <ShieldCheck className="h-8 w-8 text-brand-gold md:h-9 md:w-9" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-gold rounded-full border-2 border-black flex items-center justify-center">
                <Mail size={10} className="text-black" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 md:mb-4 md:text-3xl">{t('auth.verifyTitle')}</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('auth.verifyOtpDesc')}{' '}
              <span className="text-brand-gold font-semibold break-all">{email}</span>
            </p>
          </div>

          {/* Card */}
          <div className="bg-[#121212] p-5 rounded-2xl border border-white/10 shadow-xl shadow-brand-gold/5 md:p-8">
            <form onSubmit={handleSubmit} noValidate className="space-y-6 md:space-y-8">
              {/* OTP inputs */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-300 text-center">
                  {t('auth.enterOtp')}
                </label>
                <OtpInput
                  value={otp.join('')}
                  onChange={(value) => setOtp(value.split('').concat(Array(OTP_LENGTH).fill('')).slice(0, OTP_LENGTH))}
                  disabled={isLoading}
                />
              </div>


              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || otp.join('').length < OTP_LENGTH}
                className="w-full bg-gold-gradient text-black font-bold py-3.5 rounded-xl hover-scale glow-on-hover transition-all disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isLoading
                  ? <><Loader2 size={18} className="animate-spin" /> {t('auth.verifying')}</>
                  : t('auth.verifyAccount')}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-xs text-gray-500">{t('auth.didntReceive')}</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              {/* Resend */}
              <button
                type="button"
                disabled={cooldown > 0 || resendMutation.isPending}
                onClick={() => resendMutation.mutate()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-sm font-semibold transition-all hover:border-brand-gold/50 hover:text-brand-gold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {resendMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <RefreshCw size={16} />
                )}
                {cooldown > 0
                  ? t('auth.resendIn', { seconds: cooldown })
                  : t('auth.resendCode')}
              </button>
            </form>
          </div>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs text-gray-500">
            {t('auth.verifySpam')}
          </p>
        </div>
      </div>

      {/* Visual Side */}
      <div className="hidden md:flex relative w-0 flex-1 items-center justify-center bg-[#0a0a0a] border-l border-white/5">
        <div className="text-center p-12 space-y-6 max-w-sm">
          <div className="w-28 h-28 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto border border-brand-gold/20">
            <ShieldCheck size={52} className="text-brand-gold" />
          </div>
          <h2 className="text-2xl font-bold text-white">{t('auth.secureVerification')}</h2>
          <p className="text-gray-500 text-sm leading-relaxed">{t('auth.secureVerificationDesc')}</p>
          <div className="flex flex-col gap-3 pt-4">
            {['auth.securePoint1', 'auth.securePoint2', 'auth.securePoint3'].map((key) => (
              <div key={key} className="flex items-center gap-3 text-start">
                <div className="w-2 h-2 rounded-full bg-brand-gold flex-shrink-0" />
                <span className="text-gray-400 text-sm">{t(key)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
