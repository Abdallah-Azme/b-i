import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "@tanstack/react-router";
import * as z from "zod";
import { useStore } from "../hooks/useStore";
import { useChangePassword } from "../features/auth/hooks/useChangePassword";
import { useDeleteAccount, useAuth } from "../features/auth/hooks/useAuth";
import {
  useNotificationSettings,
  useUpdateNotificationSettings,
} from "../features/auth/hooks/useNotificationSettings";
import { useLatestProfileUpdateRequest } from "../features/auth/hooks/useProfileUpdateRequest";
import { ChangeEmailModal } from "../features/auth/ui/ChangeEmailModal";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { toast } from "@/lib/toast";
import {
  getPasswordTooShortMessage,
  getPasswordsDoNotMatchMessage,
  isValidPassword,
  passwordsMatch,
} from "@/lib/password-validation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  useCurrentRequests,
  useSentInterests,
  usePurchasedSeats,
} from "../features/company/hooks/useCompanyInteractions";
import {
  useInvestorCurrentRequests,
  useInvestorSentInterests,
} from "../features/investor/hooks/useInvestorInteractions";
import { Money } from "./Money";
import {
  Lock,
  LogOut,
  Trash2,
  Bell,
  ChevronRight,
  AlertCircle,
  Globe,
  Mail,
} from "lucide-react";

export const IncomingRequestsTab: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user: apiUser } = useAuth();
  const navigate = useNavigate();
  const storedRole = localStorage.getItem("auth_role");
  const role = (apiUser?.role as any)?.key ?? apiUser?.role ?? storedRole;
  const isAdvertiser = role === "advertiser";
  const lang = i18n.language as "en" | "ar";
  const isAr = lang === "ar";

  const companyQuery = useCurrentRequests({}, { enabled: isAdvertiser });
  const investorQuery = useInvestorCurrentRequests(
    {},
    { enabled: !isAdvertiser },
  );

  const data = isAdvertiser ? companyQuery.data : investorQuery.data;
  const requests = data?.data?.requests || [];

  const getWhatsAppLink = (req: any) => {
    const projectName = req.opportunity?.company_name || "Project";
    const investorName = req.investor?.name || "Investor";
    const message = t('dashboard.waMessage', { projectName, investorName });
    return `https://wa.me/96560070353?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-4">
      {requests.length === 0 ? (
        <div className="text-gray-400 text-center py-4">
          {t("common.noData")}
        </div>
      ) : (
        requests.map((req: any) => (
          <div
            key={req.id}
            onClick={() => navigate({ to: "/projects/$id", params: { id: String(req.opportunity?.id ?? req.opportunity_id ?? req.model_id ?? req.id) } })}
            className="cursor-pointer bg-brand-gray/20 p-4 rounded-xl border border-white/5 flex items-center justify-between hover:border-brand-gold/30 hover:bg-brand-gray/30 transition"
          >
            <div>
              <h4 className="font-bold text-white">
                {req.opportunity?.company_name}
              </h4>
              <p className="text-xs text-gray-400">
                {t("dashboard.investorLabel")}
                {req.investor?.name} •{" "}
                {new Date(req.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded text-[10px] font-bold ${req.status === "new" ? "bg-blue-500/20 text-blue-400" : "bg-gray-500/20 text-gray-400"}`}
              >
                {req.status.toUpperCase()}
              </span>
              <a
                href={getWhatsAppLink(req)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-brand-gold text-black px-3 py-1 rounded font-bold hover:bg-yellow-500 transition"
              >
                {t("dashboard.followUp")}
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export const SentInterestsTab: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user: apiUser } = useAuth();
  const storedRole = localStorage.getItem("auth_role");
  const role = (apiUser?.role as any)?.key ?? apiUser?.role ?? storedRole;
  const isAdvertiser = role === "advertiser";

  const companyQuery = useSentInterests({}, { enabled: isAdvertiser });
  const investorQuery = useInvestorSentInterests(
    {},
    { enabled: !isAdvertiser },
  );

  const data = isAdvertiser ? companyQuery.data : investorQuery.data;
  const interests = data?.data?.interests || data?.data?.opportunities || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {interests.length === 0 ? (
        <div className="text-gray-400 text-center py-4 col-span-2">
          {t("common.noData")}
        </div>
      ) : (
        interests.map((int: any) => {
          const opportunity = int.opportunity || int;
          const opportunityId = opportunity?.id ?? int.opportunity_id ?? int.model_id ?? int.id;
          return (
            <Link
              key={int.id}
              to="/projects/$id"
              params={{ id: String(opportunityId) }}
              className="bg-brand-gray/20 p-4 rounded-xl border border-white/5 flex gap-4 hover:border-brand-gold/30 hover:bg-brand-gray/30 transition"
            >
              <img
                src={opportunity?.image || "/placeholder.png"}
                alt=""
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-bold text-white">
                  {opportunity?.company_name}
                </h4>
                <p className="text-xs text-gray-400">
                  {int.created_at ? new Date(int.created_at).toLocaleDateString() : ""}
                </p>
                <span className="text-[10px] font-bold text-brand-gold">
                  {int.status?.label?.toUpperCase() || int.status?.toUpperCase() || "SENT"}
                </span>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
};

export const OngoingRequestsTab: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user: apiUser } = useAuth();
  const storedRole = localStorage.getItem("auth_role");
  const role = (apiUser?.role as any)?.key ?? apiUser?.role ?? storedRole;
  const isAdvertiser = role === "advertiser";

  const companyQuery = usePurchasedSeats({}, { enabled: isAdvertiser });
  const investorQuery = useInvestorCurrentRequests(
    {},
    { enabled: !isAdvertiser },
  );

  const data = isAdvertiser ? companyQuery.data : investorQuery.data;
  const deals = data?.data?.opportunities || data?.data?.seats || [];

  return (
    <div className="space-y-4">
      {deals.length === 0 ? (
        <div className="text-gray-400 text-center py-4">
          {t("common.noData")}
        </div>
      ) : (
        deals.map((deal: any) => {
          const opportunity = deal.opportunity || deal;
          const opportunityId = opportunity?.id ?? deal.opportunity_id ?? deal.model_id ?? deal.id;
          const statusLabel =
            opportunity?.status?.label ||
            opportunity?.status?.name ||
            opportunity?.status?.value ||
            deal.status?.label ||
            deal.status?.name ||
            deal.status?.value ||
            "ACTIVE";
          const goalLabel = opportunity?.goal?.label || deal.goal?.label || "";
          const categoryName = opportunity?.category?.name || deal.category?.name || "";
          const image = opportunity?.image || deal.image || "/placeholder.png";
          return (
            <Link
              key={deal.id}
              to="/projects/$id"
              params={{ id: String(opportunityId) }}
              className="bg-brand-gray/20 p-4 rounded-xl border border-white/5 flex gap-4 items-center hover:border-brand-gold/30 hover:bg-brand-gray/30 transition"
            >
              <img
                src={image}
                alt=""
                className="w-16 h-16 rounded-lg object-cover shrink-0 border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-bold text-white truncate">
                    {opportunity?.company_name || t("common.noDetails")}
                  </h4>
                  <span className="shrink-0 px-2 py-1 rounded text-[10px] font-bold bg-brand-gold/10 text-brand-gold border border-brand-gold/20">
                    {statusLabel}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {opportunity?.opportunity_number || deal.opportunity_number || ""}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
                  {categoryName && <span>{categoryName}</span>}
                  {goalLabel && <span>• {goalLabel}</span>}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-gray-400">
                  <div className="rounded-lg bg-black/20 px-2 py-2">
                    <span className="block text-gray-500">{t("dashboard.value")}</span>
                    <span className="block text-white font-bold">{opportunity?.investment_required ?? deal.investment_required ?? "N/A"}</span>
                  </div>
                  <div className="rounded-lg bg-black/20 px-2 py-2">
                    <span className="block text-gray-500">{t("dashboard.seats")}</span>
                    <span className="block text-white font-bold">{opportunity?.statistics?.purchased_seats_count ?? deal.statistics?.purchased_seats_count ?? 0}</span>
                  </div>
                  <div className="rounded-lg bg-black/20 px-2 py-2">
                    <span className="block text-gray-500">{t("dashboard.interests")}</span>
                    <span className="block text-white font-bold">{opportunity?.statistics?.interest_requests_count ?? deal.statistics?.interest_requests_count ?? 0}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
};

export const VerificationInfoTab: React.FC<{ onEditProfile?: () => void }> = ({
  onEditProfile,
}) => {
  const { t } = useTranslation();
  const { user: apiUser } = useAuth();
  const storedRole = localStorage.getItem("auth_role");
  const role = (apiUser?.role as any)?.key ?? apiUser?.role ?? storedRole;
  const info = apiUser || {
    first_name: "",
    last_name: "",
    license_number: "",
    verification_status: "review",
  };

  const { data: updateRequestData } = useLatestProfileUpdateRequest();
  const pendingRequest = updateRequestData?.data;
  const isPending = pendingRequest?.status?.key === "pending";

  return (
    <div className="bg-brand-gray/20 p-6 rounded-xl border border-white/5 space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-bold text-white">{t("dashboard.accountStatus")}</h4>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${info.verification_status === "review" ? "bg-orange-500/20 text-orange-400" : "bg-green-500/20 text-green-400"}`}
        >
          {info.verification_status?.toUpperCase() || "VERIFIED"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        {(info.first_name || info.last_name) && (
          <p className="text-gray-400">
            {t("dashboard.companyName")}
            <span className="text-white ms-2">
              {info.first_name} {info.last_name}
            </span>
          </p>
        )}
        {info.license_number && info.license_number !== "N/A" && (
          <p className="text-gray-400">
            {t("dashboard.licenseNumber")}
            <span className="text-white ml-2">
              {info.license_number}
            </span>
          </p>
        )}
      </div>

      {isPending && (
        <div className="mt-4 p-3 bg-brand-gold/10 border border-brand-gold/20 rounded-lg text-brand-gold text-sm font-medium">
          {t('dashboard.updateReview')}
        </div>
      )}

      {pendingRequest?.status?.key === "rejected" && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm font-medium">
          {t('dashboard.updateRejected', { defaultValue: 'Update request rejected' })}
          {pendingRequest.rejection_reason && `: ${pendingRequest.rejection_reason}`}
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <button
          onClick={onEditProfile}
          disabled={isPending}
          className="bg-brand-gray border border-white/10 text-white px-4 py-2 rounded-lg font-bold text-xs disabled:opacity-50"
        >
          {t("dashboard.updateData")}
        </button>
      </div>
    </div>
  );
};

export const SettingsTab: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { toggleLanguage } = useStore();
  const { logout: apiLogout } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEmailChange, setShowEmailChange] = useState(false);
  const deleteAccount = useDeleteAccount();

  // Password state
  const changePassword = useChangePassword();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  // Notifications state
  const { data: notifData } = useNotificationSettings();
  const updateNotifSettings = useUpdateNotificationSettings();
  const settings = notifData?.data || {
    request_notifications: true,
    interest_notifications: true,
    system_notifications: true,
  };

  const handleChangePassword = () => {
    const schema = z
      .object({
        currentPassword: z.string().trim().min(1, t("errors.currentPasswordRequired")),
        newPassword: z.string().trim().min(1, t("errors.newPasswordRequired")),
        confirmPassword: z.string().trim().min(1, t("errors.confirmPasswordRequired")),
      })
      .refine((data) => isValidPassword(data.newPassword), {
        message: getPasswordTooShortMessage(t),
        path: ["newPassword"],
      })
      .refine((data) => passwordsMatch(data.newPassword, data.confirmPassword), {
        message: getPasswordsDoNotMatchMessage(t),
        path: ["confirmPassword"],
      });

    const result = schema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      const nextErrors: typeof passwordErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof typeof nextErrors | undefined;
        if (key) nextErrors[key] = issue.message;
      });
      setPasswordErrors(nextErrors);
      return;
    }

    setPasswordErrors({});
    changePassword.mutate(
      {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      },
        {
          onSuccess: () => {
            toast.success(t("auth.passwordResetSuccess"), {
              id: "change-password-success",
            });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            window.setTimeout(() => {
              localStorage.removeItem("auth_token");
              localStorage.removeItem("auth_role");
              window.location.replace("/login?reason=password_changed");
            }, 900);
          },
        },
      );
  };

  const handleToggleNotif = (field: string) => {
    updateNotifSettings.mutate({ [field]: !settings[field] });
  };

  const isPasswordFormValid =
    currentPassword.trim().length > 0 &&
    newPassword.trim().length > 0 &&
    confirmPassword.trim().length > 0 &&
    isValidPassword(newPassword) &&
    passwordsMatch(newPassword, confirmPassword);

  return (
    <div className="space-y-8">
      {/* Security */}
      <section id="change-password" className="bg-brand-gray/20 p-6 rounded-xl border border-white/5 scroll-mt-24">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Lock size={18} className="text-brand-gold" />{" "}
          {t("dashboard.security")}
        </h3>
        <div className="space-y-4">
          <PasswordInput
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              setPasswordErrors((prev) => ({ ...prev, currentPassword: undefined }));
            }}
            placeholder={t("dashboard.currentPassword")}
            className="bg-black/30 border-white/10 p-3 text-sm"
          />
          {passwordErrors.currentPassword && (
            <p className="text-xs text-red-400 -mt-2">{passwordErrors.currentPassword}</p>
          )}
          <PasswordInput
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setPasswordErrors((prev) => ({ ...prev, newPassword: undefined }));
            }}
            placeholder={t("dashboard.newPassword")}
            className="bg-black/30 border-white/10 p-3 text-sm"
          />
          {passwordErrors.newPassword && (
            <p className="text-xs text-red-400 -mt-2">{passwordErrors.newPassword}</p>
          )}
          <PasswordInput
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setPasswordErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }}
            placeholder={t("dashboard.confirmPassword")}
            className="bg-black/30 border-white/10 p-3 text-sm"
          />
          {passwordErrors.confirmPassword && (
            <p className="text-xs text-red-400 -mt-2">{passwordErrors.confirmPassword}</p>
          )}
          <button
            onClick={handleChangePassword}
            disabled={changePassword.isPending || !isPasswordFormValid}
            className="bg-brand-gold text-black px-4 py-2 rounded-lg font-bold text-xs disabled:opacity-50"
          >
            {changePassword.isPending ? "..." : t("dashboard.changePassword")}
          </button>
        </div>
      </section>

      {/* Language Toggle Integration */}
      <section className="bg-brand-gray/20 p-6 rounded-xl border border-white/5">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Globe size={18} className="text-brand-gold" />{" "}
          {t("moreMenu.language")}
        </h3>
        <button
          onClick={toggleLanguage}
          className="w-full flex items-center justify-between p-3 bg-black/30 border border-white/10 rounded-lg text-white font-bold hover:bg-black/40 transition"
        >
          <span>{i18n.language === "en" ? "English" : "العربية"}</span>
          <ChevronRight
            size={18}
            className={i18n.language === "ar" ? "rotate-180" : ""}
          />
        </button>
      </section>

      {/* Notifications */}
      {/* <section className="bg-brand-gray/20 p-6 rounded-xl border border-white/5">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Bell size={18} className="text-brand-gold" /> {t('dashboard.notifications')}</h3>
        <div className="space-y-4">
          {[
            { label: t('dashboard.reqNotifications'), field: 'request_notifications', val: settings.request_notifications },
            { label: t('dashboard.intNotifications'), field: 'interest_notifications', val: settings.interest_notifications },
            { label: t('dashboard.sysNotifications'), field: 'system_notifications', val: settings.system_notifications }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm text-gray-300">{item.label}</span>
              <button onClick={() => handleToggleNotif(item.field)} className={`w-10 h-5 rounded-full relative transition-colors ${item.val ? 'bg-brand-gold' : 'bg-gray-600'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${item.val ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
          ))}
        </div>
      </section> */}

      {/* Account */}
      <section className="bg-brand-gray/20 p-6 rounded-xl border border-white/5">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <LogOut size={18} className="text-brand-gold" />{" "}
          {t("dashboard.account")}
        </h3>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setShowEmailChange(true)}
            className="flex items-center gap-2 text-brand-gold hover:text-yellow-400 text-sm font-bold w-fit"
          >
            <Mail size={16} /> {t("dashboard.changeEmail")}
          </button>
          <div className="flex gap-4 pt-4 border-t border-white/10 mt-2">
            <button
              onClick={() => apiLogout()}
              className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-bold"
            >
              <LogOut size={16} /> {t("nav.logout")}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 text-red-500 hover:text-red-400 text-sm font-bold"
            >
              <Trash2 size={16} /> {t("dashboard.deleteAccount")}
            </button>
          </div>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader>
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <DialogTitle className="text-xl font-bold text-white mb-2">
              {t("dashboard.areYouSure")}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-400 mb-6">
              {t("dashboard.deleteDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 bg-brand-gray border border-white/10 text-white py-2 rounded-lg font-bold"
            >
              {t("dashboard.cancel")}
            </button>
            <button
              onClick={() => deleteAccount.mutate()}
              disabled={deleteAccount.isPending}
              className="flex-1 flex justify-center items-center bg-red-600 text-white py-2 rounded-lg font-bold disabled:opacity-50"
            >
              {deleteAccount.isPending ? "..." : t("dashboard.deleteAccount")}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {showEmailChange && (
        <ChangeEmailModal onClose={() => setShowEmailChange(false)} />
      )}
    </div>
  );
};
