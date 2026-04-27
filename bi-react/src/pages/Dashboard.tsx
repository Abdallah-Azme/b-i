import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "../context/Store";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Settings,
  Megaphone,
  FileText,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Wallet,
  PlusCircle,
  Edit3,
  MapPin,
  Menu,
  LogIn,
  Globe2,
  Info,
  Mail,
  Shield,
  ChevronRight,
  ChevronLeft,
  Eye,
  Star,
  Unlock,
  Trash2,
  Pencil,
} from "lucide-react";
import { FALLBACK_IMAGE, AD_STATUS_CONFIG } from "../constants";
import { Money } from "../components/Money";
import { EditProfileModal } from "../components/EditProfileModal";
import {
  IncomingRequestsTab,
  SentInterestsTab,
  OngoingRequestsTab,
  VerificationInfoTab,
  SettingsTab,
} from "../components/DashboardTabs";
import { Project, AdStatus } from "../types";
import {
  useMyOpportunities,
  useDeleteOpportunity,
} from "../features/company/hooks/useOpportunities";
import { useWhoWeAre } from "../features/general/hooks/useGeneralLookups";
import {
  useCurrentRequests,
  usePurchasedSeats,
} from "../features/company/hooks/useCompanyInteractions";
import { useInvestorPurchasedSeats } from "../features/investor/hooks/useInvestorInteractions";
import { OpportunitySummary } from "../features/general/types";
import { Briefcase } from "lucide-react";
import { useAuth } from "../features/auth/hooks/useAuth";

// Helper for compact stats (K/M)
const formatCompact = (num: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(num);
};

// Deterministic demo stats based on project
const getDemoStats = (project: any) => {
  const seed = parseInt(project.id.replace(/\D/g, "") || "123");
  const isHighValue = project.askingPrice > 500000;

  const views = isHighValue ? 300 + (seed % 2000) : 2000 + (seed % 13000);

  const purchases = isHighValue ? 20 + (seed % 100) : 5 + (seed % 30);

  const interest = isHighValue ? 50 + (seed % 250) : 10 + (seed % 100);

  return { views, purchases, interest };
};

const ProjectCard: React.FC<{ project: any; type: "ad" | "booklet" }> = ({
  project,
  type,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "ar";
  const isAr = lang === "ar";
  const deleteOpportunity = useDeleteOpportunity();

  // Using opportunity_number if available, fallback to legacy ID
  const displayId = project.opportunity_number || project.id;
  const isLegacy = !project.opportunity_number; // Indicates if it's mock data

  const stats = getDemoStats(project);

  // Handling new schema (project.status.value) vs legacy string
  const rawStatus = project.status?.value || project.status;
  const status = rawStatus as AdStatus;

  const categoryName = project.category?.name || project.category?.[lang] || "";
  const projectName = project.company_name || project.name?.[lang] || "";
  const locationName = project.location?.[lang] || "Riyadh"; // Add missing field in new schema gracefully
  const price = project.investment_required ?? project.askingPrice ?? 0;

  return (
    <div className="relative group block bg-brand-gray/20 rounded-xl overflow-hidden border border-white/5 hover:border-brand-gold/30 transition-all hover:scale-[1.02] shadow-md">
      <Link
        to="/projects/$id"
        params={{ id: project.id.toString() }}
        className="block"
      >
        <div className="aspect-[4/3] bg-gray-800 relative overflow-hidden">
          <img
            src={project.image || FALLBACK_IMAGE}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = FALLBACK_IMAGE;
            }}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80 group-hover:opacity-100"
          />
          {type === "ad" && AD_STATUS_CONFIG[status] ? (
            <div
              className={`absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold text-white flex items-center gap-1 ${AD_STATUS_CONFIG[status].color}`}
            >
              {project.status?.label || t(AD_STATUS_CONFIG[status].labelKey)}
            </div>
          ) : (
            <div className="absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold bg-black/60 backdrop-blur text-white flex items-center gap-1">
              <Unlock size={10} className="text-brand-gold" />{" "}
              {t("dashboard.unlocked")}
            </div>
          )}

          {/* Stats Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/85 to-transparent flex items-center justify-end gap-4 text-white backdrop-blur-[2px] transition-opacity duration-300">
            <div className="flex items-center gap-4 text-xs font-bold">
              <div
                className="flex items-center gap-1.5"
                title={isAr ? "عدد المهتمين" : "Interest"}
              >
                <span>{formatCompact(stats.interest)}</span>{" "}
                <Star size={14} className="text-white/80" />
              </div>
              <div
                className="flex items-center gap-1.5"
                title={isAr ? "عدد شراء الكراسة" : "Booklet Purchases"}
              >
                <span>{formatCompact(stats.purchases)}</span>{" "}
                <FileText size={14} className="text-white/80" />
              </div>
              <div
                className="flex items-center gap-1.5"
                title={isAr ? "عدد المشاهدات" : "Views"}
              >
                <span>{formatCompact(stats.views)}</span>{" "}
                <Eye size={14} className="text-white/80" />
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-brand-gold uppercase tracking-wider font-bold">
              {categoryName}
            </span>
          </div>
          <h3 className="font-bold text-white mb-3 line-clamp-1 group-hover:text-brand-gold transition text-sm md:text-base">
            {projectName}
          </h3>

          <div className="flex justify-between items-center pt-3 border-t border-white/5">
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <MapPin size={12} />
              <span>{locationName}</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-gray-500 uppercase">
                {t("dashboard.value")}
              </span>
              <Money value={price} className="font-bold text-white text-sm" />
            </div>
          </div>
        </div>
      </Link>

      {type === "ad" && (
        <div className="absolute top-2 left-2 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            to="/advertiser/edit-listing/$id"
            params={{ id: project.id.toString() }}
            className="w-8 h-8 rounded-full bg-brand-gold text-black flex items-center justify-center shadow-lg hover:scale-110 transition"
            onClick={(e) => e.stopPropagation()}
            title={t("dashboard.edit")}
          >
            <Pencil size={14} />
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (
                window.confirm(t("common.deleteConfirm") || "Are you sure?")
              ) {
                deleteOpportunity.mutate(project.id);
              }
            }}
            disabled={deleteOpportunity.isPending}
            className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition disabled:opacity-50"
            title={t("common.delete")}
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

const EmptyState: React.FC<{
  icon: any;
  title: string;
  desc: string;
  action: React.ReactNode;
}> = ({ icon: Icon, title, desc, action }) => (
  <div className="col-span-full py-20 text-center bg-brand-gray/10 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gray/30 mb-4 text-gray-500">
      <Icon size={28} />
    </div>
    <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
    <p className="text-sm text-gray-500 max-w-xs">{desc}</p>
    {action}
  </div>
);

export const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "ar";
  const { toggleLanguage, updateUser } = useStore();
  const { isAuthenticated, user: apiUser, logout } = useAuth();
  const navigate = useNavigate();
  const isAr = lang === "ar";
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [adsPage, setAdsPage] = useState(1);

  // Build a unified user object: prefer API data, fall back to localStorage role
  const storedRole = localStorage.getItem("auth_role") as
    | "investor"
    | "advertiser"
    | null;
  const user = apiUser
    ? {
        ...apiUser,
        role:
          (apiUser.role as any)?.key ??
          apiUser.role ??
          storedRole ??
          "investor",
        id: apiUser.user_name ?? apiUser.id,
        name: apiUser.name ?? apiUser.display_name ?? "",
        displayName: apiUser.display_name ?? apiUser.name ?? "",
        available_capital: parseFloat(apiUser.available_capital) || 0,
        favorites: [] as string[],
        unlockedProjects: [] as string[],
        companyLicenseUrl: undefined as string | undefined,
      }
    : isAuthenticated
      ? {
          id: "loading",
          name: "",
          displayName: "",
          email: "",
          role: storedRole ?? "investor",
          favorites: [] as string[],
          unlockedProjects: [] as string[],
          available_capital: 0,
          companyLicenseUrl: undefined as string | undefined,
        }
      : null;

  const { data: whoWeAreData } = useWhoWeAre();
  const contactEmail = whoWeAreData?.data?.contact_email || "support@bi.com";

  // ------------------------------------------------------------------
  // 1. Unauthenticated State (Logged Out View)
  // ------------------------------------------------------------------
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 min-h-[75vh] animate-fade-in flex flex-col">
        <h1 className="text-3xl font-bold mb-8 text-white">
          {t("tabs.dashboard")}
        </h1>

        <div className="space-y-3">
          {/* Primary Login Action */}
          <button
            onClick={() => navigate({ to: "/login-type" })}
            className="w-full flex items-center gap-4 p-4 bg-brand-gold text-black rounded-xl hover:bg-yellow-500 transition shadow-lg shadow-brand-gold/10 group mb-6"
          >
            <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center">
              <LogIn size={20} className="text-black" />
            </div>
            <div className="flex-1 text-left rtl:text-right">
              <h3 className="font-bold text-lg">{t("dashboard.login")}</h3>
              <p className="text-xs opacity-75 font-medium">
                {t("dashboard.loginDesc")}
              </p>
            </div>
            {isAr ? (
              <ChevronLeft size={20} className="opacity-50" />
            ) : (
              <ChevronRight size={20} className="opacity-50" />
            )}
          </button>

          <div className="h-px bg-white/10 my-4"></div>

          {/* Language */}
          <button
            onClick={toggleLanguage}
            className="w-full flex items-center gap-4 p-4 bg-brand-gray/20 border border-white/5 rounded-xl hover:bg-brand-gray/40 transition group"
          >
            <Globe2 className="text-brand-gold" size={20} />
            <div className="flex-1 text-left rtl:text-right flex justify-between items-center">
              <span className="font-medium text-gray-200">
                {t("moreMenu.language")}
              </span>
              <span className="text-xs text-gray-400 bg-black/50 px-2 py-1 rounded">
                {t("common.currentLanguage")}
              </span>
            </div>
          </button>

          {/* About */}
          <Link
            to="/about"
            className="w-full flex items-center gap-4 p-4 bg-brand-gray/20 border border-white/5 rounded-xl hover:bg-brand-gray/40 transition"
          >
            <Info className="text-gray-400" size={20} />
            <span className="font-medium text-gray-200">
              {t("moreMenu.about")}
            </span>
          </Link>

          {/* Contact */}
          <a
            href={`mailto:${contactEmail}`}
            className="w-full flex items-center gap-4 p-4 bg-brand-gray/20 border border-white/5 rounded-xl hover:bg-brand-gray/40 transition"
          >
            <Mail className="text-gray-400" size={20} />
            <span className="font-medium text-gray-200">
              {t("moreMenu.contact")}
            </span>
          </a>

          {/* Terms */}
          <Link
            to="/terms-of-use"
            className="w-full flex items-center gap-4 p-4 bg-brand-gray/20 border border-white/5 rounded-xl hover:bg-brand-gray/40 transition"
          >
            <FileText className="text-gray-400" size={20} />
            <span className="font-medium text-gray-200">
              {t("moreMenu.terms")}
            </span>
          </Link>

          {/* Privacy */}
          <Link
            to="/privacy-policy"
            className="w-full flex items-center gap-4 p-4 bg-brand-gray/20 border border-white/5 rounded-xl hover:bg-brand-gray/40 transition"
          >
            <Shield className="text-gray-400" size={20} />
            <span className="font-medium text-gray-200">
              {t("moreMenu.privacy")}
            </span>
          </Link>
        </div>

        <div className="p-8 text-center mt-auto">
          <p className="text-xs text-gray-600">App Version 1.0.3</p>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // 2. Authenticated State (Logged In View)
  // ------------------------------------------------------------------

  // Fetch real API data if advertiser
  const { data: myOpsData, isLoading: opsLoading } = useMyOpportunities(
    { per_page: 50, page: adsPage },
    { enabled: user.role === "advertiser" },
  );
  const myAds = myOpsData?.data?.opportunities ?? [];
  const { data: companySeatsData } = usePurchasedSeats(
    {},
    { enabled: user.role === "advertiser" },
  );
  const { data: investorSeatsData } = useInvestorPurchasedSeats(
    {},
    { enabled: user.role !== "advertiser" },
  );

  const myBooklets = investorSeatsData?.data?.seats ?? [];
  const successfulDeals = companySeatsData?.data?.seats?.length || 0;
  const totalValue = myAds.reduce(
    (acc: number, curr: any) => acc + (curr.investment_required || 0),
    0,
  );

  const successfulInvestments = myBooklets.length;
  const capital = user.available_capital || 0;

  // Define Stats based on Role
  const stats =
    user.role === "advertiser"
      ? [
          {
            icon: Megaphone,
            value: myAds.length,
            label: t("dashboard.myAds"),
            type: "number",
          },
          {
            icon: CheckCircle,
            value: successfulDeals,
            label: t("dashboard.successfulDeals"),
            type: "number",
          },
          {
            icon: DollarSign,
            value: totalValue,
            label: t("dashboard.portfolioValue"),
            type: "compact",
          },
        ]
      : [
          {
            icon: FileText,
            value: myBooklets.length,
            label: t("dashboard.booklets"),
            type: "number",
          },
          {
            icon: TrendingUp,
            value: successfulInvestments,
            label: t("dashboard.successfulInvestments"),
            type: "number",
          },
          {
            icon: Wallet,
            value: capital,
            label: t("dashboard.capital"),
            type: "compact",
          },
        ];

  // Tabs Definition
  const tabs =
    user.role === "advertiser"
      ? [
          { id: "ads", label: t("dashboard.myAds"), icon: Megaphone },
          {
            id: "booklets",
            label: t("dashboard.purchasedBooklets"),
            icon: FileText,
          },
          {
            id: "incoming",
            label: t("dashboard.incomingRequests"),
            icon: Mail,
          },
          {
            id: "verification",
            label: t("dashboard.verificationInfo"),
            icon: Shield,
          },
          { id: "settings", label: t("dashboard.settings"), icon: Settings },
        ]
      : [
          {
            id: "booklets",
            label: t("dashboard.purchasedBooklets"),
            icon: FileText,
          },
          { id: "interests", label: t("dashboard.sentInterests"), icon: Star },
          {
            id: "requests",
            label: t("dashboard.ongoingRequests"),
            icon: Briefcase,
          },
          // { id: 'notifications', label: t('dashboard.notifications'), icon: Menu },
          { id: "settings", label: t("dashboard.settings"), icon: Settings },
        ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  React.useEffect(() => {
    if (!tabs.find((t) => t.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [user.role, tabs]);

  const displayName = user.name || user.displayName || "";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 min-h-screen relative">
      {/* Mobile Menu Icon */}
      <Link
        to="/more"
        className="md:hidden absolute top-6 right-4 text-gray-300 hover:text-brand-gold transition-colors z-10 p-2"
        aria-label={t("common.openMenu")}
      >
        <Menu size={28} strokeWidth={2} />
      </Link>

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 mb-10">
        {/* Avatar */}
        <div className="relative group shrink-0">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-brand-gold p-1 bg-black">
            <div className="w-full h-full rounded-full overflow-hidden bg-brand-gray relative">
              {user.role === "advertiser" && user.companyLicenseUrl ? (
                <img
                  src={user.companyLicenseUrl}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = FALLBACK_IMAGE;
                  }}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-gray to-black text-gray-500">
                  <span className="text-3xl font-bold">
                    {displayName.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info & Actions */}
        <div className="flex-1 text-center md:text-start w-full">
          <div className="flex flex-col md:flex-row items-center md:items-baseline gap-2 md:gap-4 mb-3 justify-center md:justify-start">
            <h1 className="text-2xl md:text-3xl font-bold text-white font-alexandria">
              {displayName}
            </h1>
            <div className="flex items-center gap-2">
              <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] text-gray-300 font-mono tracking-wider">
                {user.id}
              </span>
              {user.role === "advertiser" && (
                <span className="bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-brand-gold/20">
                  {t("dashboard.businessOwner")}
                </span>
              )}
              {user.role === "investor" && (
                <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-blue-500/20">
                  {t("dashboard.investor")}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center md:justify-start gap-3 w-full">
            {user.role === "advertiser" && (
              <Link
                to="/advertiser/new-listing"
                className="flex-1 md:flex-none bg-brand-gold text-black px-6 py-2.5 rounded-lg font-bold hover:bg-yellow-500 transition text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-gold/10"
              >
                <PlusCircle size={18} />
                {t("dashboard.publishAd")}
              </Link>
            )}
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="flex-1 md:flex-none bg-brand-gray border border-white/10 hover:border-white/30 text-white px-6 py-2.5 rounded-lg font-bold transition text-sm flex items-center justify-center gap-2"
            >
              <Edit3 size={18} />
              {t("dashboard.editProfile")}
            </button>
          </div>
        </div>
      </div>

      {isEditProfileOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditProfileOpen(false)}
          onSave={(data: any) => {
            updateUser(data);
            setIsEditProfileOpen(false);
          }}
        />
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 md:gap-8 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-full aspect-square md:aspect-auto md:h-32 bg-brand-gray/30 border border-white/5 rounded-2xl flex flex-col items-center justify-center group hover:bg-brand-gray/50 hover:border-brand-gold/30 transition relative cursor-default">
              <stat.icon
                className="w-6 h-6 md:w-8 md:h-8 text-gray-500 group-hover:text-brand-gold transition mb-2"
                strokeWidth={1.5}
              />
              {stat.type === "compact" ? (
                <span
                  className="text-xl md:text-3xl font-bold text-white tracking-tight font-sans"
                  dir="ltr"
                >
                  {formatCompact(stat.value)}
                </span>
              ) : stat.type === "money" ? (
                <Money
                  value={stat.value}
                  className="text-xl md:text-3xl font-bold text-white tracking-tight font-sans"
                />
              ) : (
                <span className="text-xl md:text-3xl font-bold text-white tracking-tight font-sans">
                  {stat.value}
                </span>
              )}
            </div>
            <span className="text-[10px] md:text-xs text-gray-500 font-medium mt-2 uppercase tracking-wide text-center">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-white/10 mb-8 overflow-x-auto">
        <div className="flex justify-start md:justify-center gap-2 md:gap-8 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group flex items-center gap-2 py-4 border-b-2 transition-all ${activeTab === tab.id ? "border-brand-gold text-brand-gold" : "border-transparent text-gray-500 hover:text-gray-300"}`}
            >
              <tab.icon size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="animate-fade-in min-h-[300px]">
        {activeTab === "ads" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myAds.length > 0 ? (
                myAds.map((p: any) => (
                  <ProjectCard key={p.id} project={p} type="ad" />
                ))
              ) : (
                <EmptyState
                  icon={Megaphone}
                  title={t("dashboard.noAds")}
                  desc={t("dashboard.noAdsDesc")}
                  action={
                    <Link
                      to="/advertiser/new-listing"
                      className="text-brand-gold hover:underline mt-2 inline-block text-sm font-bold"
                    >
                      {t("dashboard.publishNewAd")}
                    </Link>
                  }
                />
              )}
            </div>

            {/* Pagination for Ads */}
            {myOpsData?.data?.pagination &&
              myOpsData.data.pagination.last_page > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12 mb-8">
                  <button
                    disabled={adsPage === 1}
                    onClick={() => {
                      setAdsPage((p) => p - 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-2 rounded-lg bg-brand-gray border border-white/10 text-white disabled:opacity-30 transition hover:bg-brand-gray/80"
                  >
                    {isAr ? (
                      <ChevronRight size={20} />
                    ) : (
                      <ChevronLeft size={20} />
                    )}
                  </button>
                  <span className="text-sm font-bold text-white min-w-[60px] text-center">
                    {adsPage} / {myOpsData.data.pagination.last_page}
                  </span>
                  <button
                    disabled={adsPage === myOpsData.data.pagination.last_page}
                    onClick={() => {
                      setAdsPage((p) => p + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-2 rounded-lg bg-brand-gray border border-white/10 text-white disabled:opacity-30 transition hover:bg-brand-gray/80"
                  >
                    {isAr ? (
                      <ChevronLeft size={20} />
                    ) : (
                      <ChevronRight size={20} />
                    )}
                  </button>
                </div>
              )}
          </>
        )}

        {activeTab === "booklets" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myBooklets.length > 0 ? (
              myBooklets.map((seat: any) => (
                <ProjectCard
                  key={seat.id}
                  project={seat.opportunity}
                  type="booklet"
                />
              ))
            ) : (
              <EmptyState
                icon={FileText}
                title={t("dashboard.noBooklets")}
                desc={t("dashboard.noBookletsDesc")}
                action={
                  <Link
                    to="/projects"
                    className="text-brand-gold hover:underline mt-2 inline-block text-sm font-bold"
                  >
                    {t("dashboard.browseProjects")}
                  </Link>
                }
              />
            )}
          </div>
        )}

        {activeTab === "incoming" && <IncomingRequestsTab />}
        {activeTab === "interests" && <SentInterestsTab />}
        {activeTab === "requests" && <OngoingRequestsTab />}
        {activeTab === "verification" && (
          <VerificationInfoTab
            onEditProfile={() => setIsEditProfileOpen(true)}
          />
        )}
        {activeTab === "settings" && <SettingsTab />}

        {/* Placeholder for other tabs */}
        {![
          "ads",
          "booklets",
          "incoming",
          "interests",
          "requests",
          "verification",
          "settings",
        ].includes(activeTab) && (
          <div className="text-center py-20 text-gray-500">
            <Info size={48} className="mx-auto mb-4 opacity-50" />
            <p>{t("dashboard.underDevelopment")}</p>
          </div>
        )}
      </div>
    </div>
  );
};
