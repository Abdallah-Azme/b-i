import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "../context/Store";
import { useChangePassword } from "../features/auth/hooks/useChangePassword";
import { useDeleteAccount, useAuth } from "../features/auth/hooks/useAuth";
import {
  useNotificationSettings,
  useUpdateNotificationSettings,
} from "../features/auth/hooks/useNotificationSettings";
import { useLatestProfileUpdateRequest } from "../features/auth/hooks/useProfileUpdateRequest";
import { ChangeEmailModal } from "../features/auth/ui/ChangeEmailModal";
import { toast } from "sonner";
import {
  useCurrentRequests,
  useSentInterests,
  usePurchasedSeats,
} from "../features/company/hooks/useCompanyInteractions";
import {
  useInvestorCurrentRequests,
  useInvestorSentInterests,
  useInvestorPurchasedSeats,
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
    const message = isAr
      ? `السلام عليكم، أود الاستفسار عن الطلب المقدم على مشروع ${projectName} من شركة ${investorName}.`
      : `Hello, I would like to inquire about the request submitted for the project ${projectName} from the company ${investorName}.`;
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
            className="bg-brand-gray/20 p-4 rounded-xl border border-white/5 flex items-center justify-between"
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
  const interests = data?.data?.interests || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {interests.length === 0 ? (
        <div className="text-gray-400 text-center py-4 col-span-2">
          {t("common.noData")}
        </div>
      ) : (
        interests.map((int: any) => (
          <div
            key={int.id}
            className="bg-brand-gray/20 p-4 rounded-xl border border-white/5 flex gap-4"
          >
            <img
              src={int.opportunity?.image || "/placeholder.png"}
              alt=""
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="font-bold text-white">
                {int.opportunity?.company_name}
              </h4>
              <p className="text-xs text-gray-400">
                {new Date(int.created_at).toLocaleDateString()}
              </p>
              <span className="text-[10px] font-bold text-brand-gold">
                {int.status?.toUpperCase() || "SENT"}
              </span>
            </div>
          </div>
        ))
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
  const investorQuery = useInvestorPurchasedSeats(
    {},
    { enabled: !isAdvertiser },
  );

  const data = isAdvertiser ? companyQuery.data : investorQuery.data;
  const deals = data?.data?.seats || [];

  return (
    <div className="space-y-4">
      {deals.length === 0 ? (
        <div className="text-gray-400 text-center py-4">
          {t("common.noData")}
        </div>
      ) : (
        deals.map((deal: any) => (
          <div
            key={deal.id}
            className="bg-brand-gray/20 p-4 rounded-xl border border-white/5 flex items-center justify-between"
          >
            <div>
              <h4 className="font-bold text-white">
                {deal.opportunity?.company_name}
              </h4>
              <p className="text-xs text-gray-400">
                {t("dashboard.counterparty")}
                {deal.counterparty?.name || "N/A"}
              </p>
            </div>
            <div className="text-right">
              <span className="block text-[10px] font-bold text-white">
                {deal.status?.toUpperCase() || "ACTIVE"}
              </span>
              <span className="text-[10px] text-gray-500">
                {new Date(deal.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))
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
        <p className="text-gray-400">
          {t("dashboard.companyName")}
          <span className="text-white ml-2">
            {info.first_name} {info.last_name}
          </span>
        </p>
        <p className="text-gray-400">
          {t("dashboard.licenseNumber")}
          <span className="text-white ml-2">
            {info.license_number || "N/A"}
          </span>
        </p>
      </div>

      {pendingRequest && (
        <div className="mt-4 p-3 bg-brand-gold/10 border border-brand-gold/20 rounded-lg text-brand-gold text-sm font-medium">
          Update request under review
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <button
          onClick={onEditProfile}
          disabled={!!pendingRequest}
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

  // Notifications state
  const { data: notifData } = useNotificationSettings();
  const updateNotifSettings = useUpdateNotificationSettings();
  const settings = notifData?.data || {
    request_notifications: true,
    interest_notifications: true,
    system_notifications: true,
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error(t("common.errorDesc"));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    changePassword.mutate(
      {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
      },
    );
  };

  const handleToggleNotif = (field: string) => {
    updateNotifSettings.mutate({ [field]: !settings[field] });
  };

  return (
    <div className="space-y-8">
      {/* Security */}
      <section className="bg-brand-gray/20 p-6 rounded-xl border border-white/5">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Lock size={18} className="text-brand-gold" />{" "}
          {t("dashboard.security")}
        </h3>
        <div className="space-y-4">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder={t("dashboard.currentPassword")}
            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-brand-gold"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t("dashboard.newPassword")}
            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-brand-gold"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t("dashboard.confirmPassword")}
            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-brand-gold"
          />
          <button
            onClick={handleChangePassword}
            disabled={changePassword.isPending}
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
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-brand-gray p-6 rounded-xl border border-white/10 max-w-sm w-full text-center">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              {t("dashboard.areYouSure")}
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              {t("dashboard.deleteDesc")}
            </p>
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
          </div>
        </div>
      )}

      {showEmailChange && (
        <ChangeEmailModal onClose={() => setShowEmailChange(false)} />
      )}
    </div>
  );
};
