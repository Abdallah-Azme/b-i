import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../hooks/useStore";
import { Mail, Key, Lock, Loader2 } from "lucide-react";
import {
  useEmailChangeRequestCurrent,
  useEmailChangeVerifyCurrent,
  useEmailChangeRequestNew,
  useEmailChangeVerifyNew,
} from "../hooks/useEmailChange";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { OtpInput } from "@/components/ui/OtpInput";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

export const ChangeEmailModal = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const { logout } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [currentPassword, setCurrentPassword] = useState("");
  const [currentOtp, setCurrentOtp] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newOtp, setNewOtp] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [currentOtpError, setCurrentOtpError] = useState("");
  const [newEmailError, setNewEmailError] = useState("");
  const [newOtpError, setNewOtpError] = useState("");

  const requestCurrent = useEmailChangeRequestCurrent();
  const verifyCurrent = useEmailChangeVerifyCurrent();
  const requestNew = useEmailChangeRequestNew();
  const verifyNew = useEmailChangeVerifyNew();

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordError(t("errors.passwordRequired"));
      return;
    }
    setPasswordError("");
    requestCurrent.mutate(
      { current_password: currentPassword },
      {
        onSuccess: () => setStep(2),
      },
    );
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOtp.trim()) {
      setCurrentOtpError(t("errors.verificationCodeRequired"));
      return;
    }
    setCurrentOtpError("");
    verifyCurrent.mutate(
      { otp: currentOtp },
      {
        onSuccess: () => setStep(3),
      },
    );
  };

  const handleStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) {
      setNewEmailError(t("errors.emailRequired"));
      return;
    }
    if (!isValidEmail(newEmail.trim())) {
      setNewEmailError(t("errors.invalidEmail"));
      return;
    }
    setNewEmailError("");
    requestNew.mutate(
      { email: newEmail },
      {
        onSuccess: () => setStep(4),
      },
    );
  };

  const handleStep4 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOtp.trim()) {
      setNewOtpError(t("errors.verificationCodeRequired"));
      return;
    }
    setNewOtpError("");
    verifyNew.mutate(
      { email: newEmail, otp: newOtp },
      {
        onSuccess: () => {
          toast.success(t("auth.emailChangedSuccess", {
            defaultValue: "Email changed successfully",
          }), {
            id: "email-change-success",
          });
          onClose();
          window.setTimeout(() => {
            logout();
            window.location.replace("/login?reason=email_changed");
          }, 900);
        },
      },
    );
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-white mb-2">
            {t("dashboard.changeEmail")}
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-sm">
            {step === 1 && t("dashboard.changeEmailStep1")}
            {step === 2 && t("dashboard.changeEmailStep2")}
            {step === 3 && t("dashboard.changeEmailStep3")}
            {step === 4 && t("dashboard.changeEmailStep4")}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {step === 1 && (
            <form onSubmit={handleStep1} noValidate className="space-y-4">
              <div className="space-y-2">
                <PasswordInput
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  placeholder={t("dashboard.currentPassword")}
                  leftIcon={<Lock size={20} />}
                  className={cn(
                    "bg-[#121212] border-white/15 rounded-xl py-3",
                    passwordError && "border-red-500 focus:border-red-500",
                  )}
                />
                {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
              </div>
              <button
                type="submit"
                disabled={requestCurrent.isPending}
                className="w-full bg-brand-gold text-black font-bold py-3 rounded-xl hover:bg-yellow-500 transition disabled:opacity-50 flex justify-center"
              >
                {requestCurrent.isPending ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  t("common.continue")
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleStep2} noValidate className="space-y-4">
              <div className="space-y-2">
                <OtpInput
                  value={currentOtp}
                  onChange={(value) => {
                    setCurrentOtp(value.slice(0, 6));
                    if (currentOtpError) setCurrentOtpError("");
                  }}
                  hasError={!!currentOtpError}
                />
                {currentOtpError && <p className="text-sm text-red-500">{currentOtpError}</p>}
              </div>
              <button
                type="submit"
                disabled={verifyCurrent.isPending}
                className="w-full bg-brand-gold text-black font-bold py-3 rounded-xl hover:bg-yellow-500 transition disabled:opacity-50 flex justify-center"
              >
                {verifyCurrent.isPending ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  t("common.verify")
                )}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleStep3} noValidate className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    size={20}
                  />
                  <input
                    type="text"
                    inputMode="email"
                    autoComplete="email"
                    value={newEmail}
                    onChange={(e) => {
                      setNewEmail(e.target.value);
                      if (newEmailError) setNewEmailError("");
                    }}
                    placeholder={t("dashboard.newEmailPlaceholder")}
                    className={cn(
                      "w-full bg-[#121212] border rounded-xl py-3 ps-12 pe-4 text-white focus:border-brand-gold outline-none",
                      newEmailError ? "border-red-500" : "border-white/15",
                    )}
                  />
                </div>
                {newEmailError && <p className="text-sm text-red-500">{newEmailError}</p>}
              </div>
              <button
                type="submit"
                disabled={requestNew.isPending}
                className="w-full bg-brand-gold text-black font-bold py-3 rounded-xl hover:bg-yellow-500 transition disabled:opacity-50 flex justify-center"
              >
                {requestNew.isPending ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  t("common.continue")
                )}
              </button>
            </form>
          )}

          {step === 4 && (
            <form onSubmit={handleStep4} noValidate className="space-y-4">
              <div className="space-y-2">
                <OtpInput
                  value={newOtp}
                  onChange={(value) => {
                    setNewOtp(value.slice(0, 6));
                    if (newOtpError) setNewOtpError("");
                  }}
                  hasError={!!newOtpError}
                />
                {newOtpError && <p className="text-sm text-red-500">{newOtpError}</p>}
              </div>
              <button
                type="submit"
                disabled={verifyNew.isPending}
                className="w-full bg-brand-gold text-black font-bold py-3 rounded-xl hover:bg-yellow-500 transition disabled:opacity-50 flex justify-center"
              >
                {verifyNew.isPending ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  t("common.verify")
                )}
              </button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
