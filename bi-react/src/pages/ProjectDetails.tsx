import React, { useState, useRef, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useStore } from "../hooks/useStore";
import { FALLBACK_IMAGE } from "../constants";
import {
  Lock,
  Unlock,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle,
  Store,
  Layers,
  Loader2,
} from "lucide-react";
import { Money } from "../components/Money";
import { useOpportunityDetail } from "../features/general/hooks/useOpportunities";
import {
  useBuySeat,
  useSubmitInterestRequest,
} from "../features/general/hooks/useActions";
import { useWhoWeAre } from "../features/general/hooks/useGeneralLookups";
import { PaymentModal } from "../components/PaymentModal";
import { toast } from "sonner";

export const ProjectDetails: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "ar" | "en";
  const { id } = useParams({ from: "/projects/$id" });
  const navigate = useNavigate();
  const { user } = useStore();

  const [showStageTooltip, setShowStageTooltip] = useState(false);
  const [tooltipPlacement, setTooltipPlacement] = useState<"top" | "bottom">(
    "top",
  );
  const stageCardRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useOpportunityDetail(id);
  const project = data?.data;

  const buySeat = useBuySeat();
  const submitInterest = useSubmitInterestRequest();
  const { data: whoWeAreData } = useWhoWeAre();
  const contactEmail = whoWeAreData?.data?.contact_email || "admin@bi.com";

  const [paymentSessionId, setPaymentSessionId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        stageCardRef.current &&
        !stageCardRef.current.contains(event.target as Node)
      ) {
        setShowStageTooltip(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 size={48} className="animate-spin text-brand-gold" />
      </div>
    );
  }

  if (!project) return <Navigate to="/projects" />;

  const unlocked = project.file_access.is_open || project.has_seat;

  const handlePurchase = () => {
    if (!user) {
      navigate({ to: "/login-type" });
      return;
    }
    buySeat.mutate(
      { id: project.id },
      {
        onSuccess: (response: any) => {
          // If response returns a session_id, open payment modal
          const sid = response?.data?.session_id || response?.session_id;
          if (sid) {
            setPaymentSessionId(sid);
          } else {
            toast.success(t("common.purchaseSuccess"));
            queryClient.invalidateQueries({
              queryKey: ["opportunity-detail", project.id],
            });
          }
        },
      },
    );
  };

  const toggleTooltip = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (showStageTooltip) {
      setShowStageTooltip(false);
      return;
    }

    if (stageCardRef.current) {
      const rect = stageCardRef.current.getBoundingClientRect();
      // If there is enough space above (e.g. > 180px), show top, otherwise bottom
      if (rect.top > 180) {
        setTooltipPlacement("top");
      } else {
        setTooltipPlacement("bottom");
      }
    }
    setShowStageTooltip(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header Card - Refactored for Stacking Context (Z-Index Fix) */}
      <div className="relative mb-8 z-20 group">
        {/* 1. Background Layer (Image + Gradient) - Handles clipping and borders */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 bg-brand-gray pointer-events-none">
          <div className="absolute inset-0">
            <img
              src={project.image}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = FALLBACK_IMAGE;
              }}
              alt={project.company_name}
              className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition duration-[2s]"
              dir="ltr"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-gray via-brand-gray/90 to-transparent"></div>
          </div>
        </div>

        {/* 2. Content Layer - No overflow hidden, allows tooltip to pop out */}
        <div className="relative p-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div>
              <span
                className={`bg-brand-gold text-black px-3 py-1 rounded text-xs font-bold uppercase tracking-widest ${lang === "ar" ? "inline-block mb-4" : ""}`}
              >
                {project.category.name}
              </span>
              <h1
                className={`text-3xl md:text-5xl font-bold mb-2 text-white shadow-black drop-shadow-lg ${lang === "ar" ? "leading-normal" : "mt-4"}`}
              >
                {project.company_name}
              </h1>
              <p className="text-gray-300 text-sm flex items-center gap-2 mt-2">
                <span className="opacity-60 font-sans">
                  ID: {project.opportunity_number}
                </span>
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              {/* Ad Status Badge */}
              <span
                className={`flex items-center gap-2 text-white text-sm font-bold uppercase tracking-wider bg-black/60 px-4 py-2 rounded border border-white/10`}
                title={project.status.label}
              >
                {project.status.label}
              </span>

              {/* Locked/Unlocked Badge */}
              <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                <span
                  className={`font-bold ${unlocked ? "text-green-400" : "text-gray-400"} flex items-center gap-2`}
                >
                  {unlocked ? <Unlock size={16} /> : <Lock size={16} />}
                  {unlocked ? t("common.unlocked") : t("common.locked")}
                </span>
              </div>
            </div>
          </div>

          {/* Group A: Public Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Card 1: Investment Amount */}
            <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:border-brand-gold/30 transition flex flex-col justify-center min-h-[100px] min-w-0">
              <div className="flex items-start gap-2 text-gray-400 mb-1.5 text-xs uppercase w-full">
                <DollarSign size={14} className="shrink-0 mt-0.5" />
                <span className="line-clamp-2 leading-tight">
                  {t("auth.requestedInvestment")}
                </span>
              </div>
              <Money
                value={project.investment_required}
                className="text-xs sm:text-sm md:text-lg font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis leading-tight font-sans"
              />
            </div>

            {/* Card 1.5: Company Type (NEW - Visualizing more public data) */}
            <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:border-brand-gold/30 transition flex flex-col justify-center min-h-[100px] min-w-0">
              <div className="flex items-start gap-2 text-gray-400 mb-1.5 text-xs uppercase w-full">
                <Store size={14} className="shrink-0 mt-0.5" />
                <span className="line-clamp-2 leading-tight">
                  {t("auth.companyTypeLabel")}
                </span>
              </div>
              <div className="text-xs sm:text-sm md:text-lg font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis leading-tight">
                {project.category.name}
              </div>
            </div>

            {/* Card 2: Age */}
            <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:border-brand-gold/30 transition flex flex-col justify-center min-h-[100px] min-w-0">
              <div className="flex items-start gap-2 text-gray-400 mb-1.5 text-xs uppercase w-full">
                <Calendar size={14} className="shrink-0 mt-0.5" />
                <span className="line-clamp-2 leading-tight">
                  {t("common.age")}
                </span>
              </div>
              <div className="text-xs sm:text-sm md:text-lg font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis leading-tight font-sans">
                {project.business_age_years} {t("common.age")}
              </div>
            </div>

            {/* Card 4: Clickable Company Stage Card */}
            <div
              ref={stageCardRef}
              onClick={toggleTooltip}
              className="relative cursor-pointer group/tooltip bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:border-brand-gold hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition flex flex-col justify-center min-h-[100px] min-w-0"
            >
              <div className="flex items-start gap-2 text-gray-400 mb-1.5 text-xs uppercase w-full">
                <Layers size={14} className="shrink-0 mt-0.5" />
                <span className="line-clamp-2 leading-tight">
                  {t("auth.companyStage")}
                </span>
              </div>
              <div className="text-xs sm:text-sm md:text-lg font-bold text-brand-gold whitespace-nowrap overflow-hidden text-ellipsis leading-tight">
                {project.business_stage}
              </div>

              {/* Tooltip Popup */}
              {showStageTooltip && project.business_stage && (
                <div
                  className={`absolute left-1/2 -translate-x-1/2 w-64 bg-brand-dark border border-brand-gold/30 p-4 rounded-xl shadow-2xl z-[9999] animate-fade-in cursor-default ${
                    tooltipPlacement === "top"
                      ? "bottom-[calc(100%+12px)]"
                      : "top-[calc(100%+12px)]"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-sm text-gray-200 leading-relaxed text-center">
                    <strong className="block text-brand-gold mb-2 border-b border-brand-gold/20 pb-2">
                      {project.business_stage}
                    </strong>
                  </div>
                  {/* Arrow */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent ${
                      tooltipPlacement === "top"
                        ? "top-full border-t-[8px] border-t-brand-dark"
                        : "bottom-full border-b-[8px] border-b-brand-dark"
                    }`}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Group A: Project Summary (Public) */}
          <div className="bg-brand-dark p-8 rounded-2xl border border-white/5">
            <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-4">
              {t("common.overview")}
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-400 text-sm font-bold uppercase mb-2">
                  {t("auth.investmentReason")}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {project.investment_reason || t("common.noDetails")}
                </p>
              </div>
            </div>
          </div>

          {/* Group B: Project File / Locked Details */}
          {unlocked ? (
            <div className="bg-green-900/10 border border-green-500/20 p-8 rounded-xl animate-fade-in">
              <h2 className="text-xl font-bold mb-4 border-b border-green-500/20 pb-4 text-green-400 flex items-center gap-2">
                <Unlock size={20} /> {t("common.projectFile")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-black/40 p-4 rounded-lg">
                  <span className="block text-gray-400 text-xs uppercase mb-1">
                    {t("auth.shareToSell")}
                  </span>
                  <span className="text-2xl font-bold text-brand-gold font-sans">
                    {project.sale_percentage ?? 0}%
                  </span>
                </div>
                <div className="bg-black/40 p-4 rounded-lg">
                  <span className="block text-gray-400 text-xs uppercase mb-1">
                    {t("common.financial")}
                  </span>
                  <span className="text-2xl font-bold text-white block mb-1">
                    {project.financial_status}
                  </span>
                </div>
              </div>

              <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2 uppercase text-sm">
                {t("auth.fullDetails")}
              </h3>
              <div
                className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: project.full_description || t("common.noDetails"),
                }}
              />

              <div className="mt-8 flex gap-4 border-t border-green-500/20 pt-6">
                <button
                  onClick={() => {
                    if (!user) {
                      navigate({ to: "/login-type" });
                      return;
                    }
                    submitInterest.mutate({ id: project.id });
                  }}
                  disabled={
                    submitInterest.isPending || submitInterest.isSuccess
                  }
                  className="flex-1 bg-brand-gold text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {submitInterest.isPending ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : submitInterest.isSuccess ? (
                    "Interest Submitted ✓"
                  ) : (
                    t("common.interested")
                  )}
                </button>
                <a
                  href={`mailto:${contactEmail}?subject=Interest in ${project.id}`}
                  className="flex-1 flex justify-center items-center bg-white/10 text-white font-bold py-3 rounded-lg hover:bg-white/20 transition text-center"
                >
                  {t("common.contactAdmin")}
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-brand-gray border border-dashed border-white/20 p-10 rounded-xl text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)] opacity-20 pointer-events-none"></div>
              <div className="relative z-10">
                <Lock className="w-12 h-12 text-brand-gold mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">
                  {t("common.lockedTitle")}
                </h3>
                <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                  {t("common.lockedDetails")}
                </p>
                <div className="flex justify-center gap-8 text-sm text-gray-500 mb-6 blur-sm select-none">
                  <span>{t("auth.shareToSell")}</span>
                  <span>{t("auth.fullDetails")}</span>
                  <span>{t("common.financial")}</span>
                </div>
                <button
                  onClick={handlePurchase}
                  className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition shadow-lg shadow-white/10"
                >
                  {t("common.buyFile")} (<Money value={project.seat_price} />)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-brand-dark p-6 rounded-xl border border-white/5">
            <h3 className="font-bold mb-4 text-gray-200">
              {t("common.highlights")}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <CheckCircle size={16} className="text-brand-gold" />
                <span>{t("common.verifiedOwnership")}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <CheckCircle size={16} className="text-brand-gold" />
                <span>{t("common.auditedFinancials")}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <CheckCircle size={16} className="text-brand-gold" />
                <span>{t("common.escrowAvailable")}</span>
              </li>
            </ul>
          </div>
          <div className="p-4 bg-brand-gold/10 border border-brand-gold/20 rounded-xl">
            <p className="text-xs text-brand-gold text-center">
              {t("common.commission")}
            </p>
          </div>
        </div>
      </div>

      {paymentSessionId && (
        <PaymentModal
          sessionId={paymentSessionId}
          onClose={() => setPaymentSessionId(null)}
          onSuccess={() => {
            setPaymentSessionId(null);
            toast.success(t("common.purchaseSuccess"));
            queryClient.invalidateQueries({
              queryKey: ["opportunity-detail", project.id],
            });
          }}
        />
      )}
    </div>
  );
};
