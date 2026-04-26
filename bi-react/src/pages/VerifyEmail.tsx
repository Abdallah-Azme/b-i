import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from '@tanstack/react-router';
import { Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/features/auth/services/auth.service';
import { toast } from 'sonner';
import type { UserRole } from '@/features/auth/types';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

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
  const [cooldown, setCooldown] = useState(0);
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
      setVerified(true);
      setTimeout(() => navigate({ to: '/dashboard' }), 2500);
    },
    onError: (err: any) => {
      const msg = err?.serverData?.msg ?? err?.message ?? t('common.error');
      toast.error(msg);
    },
  });

  const resendMutation = useMutation({
    mutationFn: () =>
      authService.resendCode({ email, password, role }),
    onSuccess: () => {
      toast.success(t('auth.codeSent'));
      setCooldown(RESEND_COOLDOWN);
    },
    onError: (err: any) => {
      const msg = err?.serverData?.msg ?? err?.message ?? t('common.error');
      toast.error(msg);
    },
  });

  // --- OTP input handlers ---
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const next = [...otp];
    pasted.split('').forEach((char, i) => { next[i] = char; });
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

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
    <div className="min-h-screen bg-brand-black flex flex-col md:flex-row">
      {/* Form Side */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 py-12">
        <div className="mx-auto w-full max-w-md animate-fade-in">
          {/* Back link */}
          <Link
            to="/login"
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={16} className={isRtl ? 'rotate-180' : ''} />
            {t('auth.backToLogin')}
          </Link>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-5 border border-brand-gold/30 relative">
              <ShieldCheck size={36} className="text-brand-gold" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-gold rounded-full border-2 border-black flex items-center justify-center">
                <Mail size={10} className="text-black" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{t('auth.verifyTitle')}</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('auth.verifyOtpDesc')}{' '}
              <span className="text-brand-gold font-semibold break-all">{email}</span>
            </p>
          </div>

          {/* Card */}
          <div className="bg-[#121212] p-8 rounded-2xl border border-white/10 shadow-xl shadow-brand-gold/5">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* OTP inputs */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-300 text-center">
                  {t('auth.enterOtp')}
                </label>
                <div
                  className="flex gap-3 justify-center"
                  onPaste={handlePaste}
                  dir="ltr"
                >
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      disabled={isLoading}
                      className={`
                        w-12 h-14 text-center text-xl font-bold rounded-xl
                        bg-black/60 border-2 outline-none transition-all
                        ${digit ? 'border-brand-gold text-white' : 'border-white/10 text-white'}
                        focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20
                        disabled:opacity-50
                      `}
                    />
                  ))}
                </div>
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
              <div key={key} className="flex items-center gap-3 text-left">
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

