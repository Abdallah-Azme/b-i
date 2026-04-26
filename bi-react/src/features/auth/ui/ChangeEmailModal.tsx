import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../../context/Store';
import { X, Mail, Key, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { 
  useEmailChangeRequestCurrent, 
  useEmailChangeVerifyCurrent, 
  useEmailChangeRequestNew, 
  useEmailChangeVerifyNew 
} from '../hooks/useEmailChange';

export const ChangeEmailModal = ({ onClose }: { onClose: () => void }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'ar' | 'en';
  const { logout } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [currentPassword, setCurrentPassword] = useState('');
  const [currentOtp, setCurrentOtp] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newOtp, setNewOtp] = useState('');

  const requestCurrent = useEmailChangeRequestCurrent();
  const verifyCurrent = useEmailChangeVerifyCurrent();
  const requestNew = useEmailChangeRequestNew();
  const verifyNew = useEmailChangeVerifyNew();

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) return;
    requestCurrent.mutate({ current_password: currentPassword }, {
      onSuccess: () => setStep(2)
    });
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOtp) return;
    verifyCurrent.mutate({ otp: currentOtp }, {
      onSuccess: () => setStep(3)
    });
  };

  const handleStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    requestNew.mutate({ email: newEmail }, {
      onSuccess: () => setStep(4)
    });
  };

  const handleStep4 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOtp) return;
    verifyNew.mutate({ email: newEmail, code: newOtp }, {
      onSuccess: () => {
        onClose();
        logout(); // Session revoked server side
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-brand-gray border border-white/10 rounded-2xl w-full max-w-md p-6 animate-fade-in relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={20} />
        </button>

        {step > 1 && (
          <button 
            onClick={() => setStep((s) => (s - 1) as any)}
            className="mb-6 flex items-center text-sm font-bold text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={16} className={`mr-2 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            {t('common.back')}
          </button>
        )}

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">{t('dashboard.changeEmail')}</h2>
          <p className="text-gray-400 text-sm">
            {step === 1 && "Enter your password to verify your identity"}
            {step === 2 && "Enter the OTP sent to your current email"}
            {step === 3 && "Enter your new email address"}
            {step === 4 && "Enter the OTP sent to your new email"}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="password" 
                required
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder={t('dashboard.currentPassword')}
                className="w-full bg-[#121212] border border-white/15 rounded-xl py-3 pl-12 pr-4 text-white focus:border-brand-gold outline-none"
              />
            </div>
            <button type="submit" disabled={requestCurrent.isPending} className="w-full bg-brand-gold text-black font-bold py-3 rounded-xl hover:bg-yellow-500 transition disabled:opacity-50 flex justify-center">
              {requestCurrent.isPending ? <Loader2 className="animate-spin" size={20} /> : t('common.continue')}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleStep2} className="space-y-4">
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="text" 
                required
                value={currentOtp}
                onChange={e => setCurrentOtp(e.target.value)}
                placeholder={t('auth.verificationCode')}
                className="w-full bg-[#121212] border border-white/15 rounded-xl py-3 pl-12 pr-4 text-white focus:border-brand-gold outline-none tracking-widest text-center"
                maxLength={6}
              />
            </div>
            <button type="submit" disabled={verifyCurrent.isPending} className="w-full bg-brand-gold text-black font-bold py-3 rounded-xl hover:bg-yellow-500 transition disabled:opacity-50 flex justify-center">
              {verifyCurrent.isPending ? <Loader2 className="animate-spin" size={20} /> : t('common.verify')}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleStep3} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="email" 
                required
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                placeholder="New Email Address"
                className="w-full bg-[#121212] border border-white/15 rounded-xl py-3 pl-12 pr-4 text-white focus:border-brand-gold outline-none"
              />
            </div>
            <button type="submit" disabled={requestNew.isPending} className="w-full bg-brand-gold text-black font-bold py-3 rounded-xl hover:bg-yellow-500 transition disabled:opacity-50 flex justify-center">
              {requestNew.isPending ? <Loader2 className="animate-spin" size={20} /> : t('common.continue')}
            </button>
          </form>
        )}

        {step === 4 && (
          <form onSubmit={handleStep4} className="space-y-4">
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="text" 
                required
                value={newOtp}
                onChange={e => setNewOtp(e.target.value)}
                placeholder={t('auth.verificationCode')}
                className="w-full bg-[#121212] border border-white/15 rounded-xl py-3 pl-12 pr-4 text-white focus:border-brand-gold outline-none tracking-widest text-center"
                maxLength={6}
              />
            </div>
            <button type="submit" disabled={verifyNew.isPending} className="w-full bg-brand-gold text-black font-bold py-3 rounded-xl hover:bg-yellow-500 transition disabled:opacity-50 flex justify-center">
              {verifyNew.isPending ? <Loader2 className="animate-spin" size={20} /> : t('common.verify')}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
