import { Link, Navigate, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  FileText,
  Globe,
  Lock,
  Store,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FINANCIAL_HEALTH_MAP, FINANCIAL_STATUS_ORDER } from "../constants";
import { useStore } from "../context/Store";
import { useCreateOpportunity } from "../features/company/hooks/useOpportunities";
import { useCategories } from "../features/general/hooks/useCategories";
import { FinancialStatus } from "../types";
import { useAuth } from "../features/auth/hooks/useAuth";

export const AddListing: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "ar" | "en";
  const { user: apiUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: categoriesData } = useCategories({ per_page: 100 });
  const categories = categoriesData?.data?.categories ?? [];
  const createOpportunity = useCreateOpportunity();

  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState<
    "request_investment" | "sell_business" | undefined
  >(undefined);
  const [purposeError, setPurposeError] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [formData, setFormData] = useState({
    companyName: "",
    fullName: "",
    phone: "",
    email: "",
    adminCompanyName: "",
    companyOwnerName: "",
    licenseNumber: "",
    sector: "", // category_id as string
    companyAge: "",
    legalEntity: "",
    companyType: "",
    companyStage: "seed",
    financialHealth: "Stable" as FinancialStatus,
    requestedInvestment: "",
    investmentReason: "",
    shareToSell: "",
    fullDetails: "",
  });

  const [files, setFiles] = useState<{
    image?: File;
    license_file?: File;
    commercial_record_file?: File;
    tax_certificate_file?: File;
    financial_statements_file?: File;
  }>({});

  const fillDemoData = () => {
    setFormData({
      companyName: t("listing.placeholderCompany"),
      fullName: t("auth.firstName"),
      phone: "80808080",
      email: "test@demo.com",
      adminCompanyName: t("listing.placeholderElite"),
      companyOwnerName: t("auth.firstName"),
      licenseNumber: "LIC-123456",
      sector: "Restaurants",
      companyAge: "3",
      legalEntity: t("listing.placeholderWLL"),
      companyType: t("listing.placeholderActive"),
      companyStage: "seed",
      financialHealth: "Stable",
      requestedInvestment: "65000",
      investmentReason: t("listing.demoReason"),
      shareToSell: "20",
      fullDetails: t("listing.demoDetails"),
    });
    // For demo purposes, we do not auto-fill files as browser security prevents it.
  };

  React.useEffect(() => {
    fillDemoData();
  }, [lang]);

  if (authLoading) return <div className="p-12 text-center text-white">Loading...</div>;

  const storedRole = localStorage.getItem("auth_role");
  const userRole = (apiUser?.role as any)?.key ?? apiUser?.role ?? storedRole;

  if (!isAuthenticated || userRole !== "advertiser") {
    return <Navigate to="/dashboard" />;
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    const requiredStr = t("auth.required");
    if (!formData.fullName.trim()) newErrors.fullName = requiredStr;
    if (!formData.phone.trim()) {
      newErrors.phone = requiredStr;
    } else {
      const digits = formData.phone.replace(/\D/g, "");
      if (digits.length < 8 || digits.length > 16) {
        newErrors.phone = t("errors.invalidPhone") || "Invalid phone length";
      }
    }
    if (!formData.email.trim()) newErrors.email = requiredStr;
    if (!formData.adminCompanyName.trim())
      newErrors.adminCompanyName = requiredStr;
    if (!formData.companyOwnerName.trim())
      newErrors.companyOwnerName = requiredStr;
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = requiredStr;
    if (!formData.companyName.trim()) newErrors.companyName = requiredStr;
    if (!formData.sector.trim()) newErrors.sector = requiredStr;
    if (!formData.companyAge.trim()) newErrors.companyAge = requiredStr;
    if (!formData.legalEntity.trim()) newErrors.legalEntity = requiredStr;
    if (!formData.companyType.trim()) newErrors.companyType = requiredStr;
    if (!formData.financialHealth.trim())
      newErrors.financialHealth = requiredStr;
    if (!formData.requestedInvestment.trim())
      newErrors.requestedInvestment = requiredStr;
    if (purpose === "request_investment" && !formData.shareToSell.trim()) {
      newErrors.shareToSell = requiredStr;
    }
    if (!formData.fullDetails.trim()) newErrors.fullDetails = requiredStr;
    if (!formData.investmentReason.trim())
      newErrors.investmentReason = requiredStr;

    // File validation
    if (!files.image) newErrors.image = requiredStr;
    if (!files.license_file) newErrors.license_file = requiredStr;
    if (!files.commercial_record_file)
      newErrors.commercial_record_file = requiredStr;
    if (!files.tax_certificate_file)
      newErrors.tax_certificate_file = requiredStr;
    if (!files.financial_statements_file)
      newErrors.financial_statements_file = requiredStr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setTermsError(true);
      return;
    }
    if (validateStep2()) {
      createOpportunity.mutate(
        {
          goal: purpose!,
          category_id: Number(formData.sector),
          company_name: formData.companyName,
          business_age_years: Number(formData.companyAge),
          legal_entity: formData.legalEntity,
          investment_required: parseFloat(formData.requestedInvestment),
          sale_percentage:
            purpose === "sell_business"
              ? 100
              : parseFloat(formData.shareToSell),
          business_stage: formData.companyStage,
          financial_status: formData.financialHealth,
          investment_reason: formData.investmentReason,
          full_description: formData.fullDetails,
          contact_name: formData.fullName,
          contact_phone: formData.phone,
          contact_email: formData.email,
          owner_name: formData.companyOwnerName,
          admin_company_name: formData.adminCompanyName,
          license_number: formData.licenseNumber,
          image: files.image!,
          license_file: files.license_file!,
          commercial_record_file: files.commercial_record_file!,
          tax_certificate_file: files.tax_certificate_file!,
          financial_statements_file: files.financial_statements_file!,
          terms_accepted: termsAccepted,
        },
        {
          onSuccess: () => {
            setShowSuccess(true);
            setTimeout(() => {
              setShowSuccess(false);
              navigate({ to: "/dashboard" });
            }, 2000);
          },
          onError: (err) => {
            console.error("Failed to create opportunity", err);
            // Handle error visually if needed
          },
        },
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">{t("listing.title")}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className={step === 1 ? "text-brand-gold font-bold" : ""}>
            1. {t("listing.step1")}
          </span>
          <span>&rarr;</span>
          <span className={step === 2 ? "text-brand-gold font-bold" : ""}>
            2. {t("listing.step2")}
          </span>
        </div>
      </div>

      <div className="bg-brand-gray/20 border border-white/10 rounded-2xl p-8 backdrop-blur-sm animate-fade-in">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-center mb-6">
              {t("listing.purposeTitle")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setPurpose("request_investment");
                  setPurposeError(false);
                }}
                className={`p-6 rounded-xl border text-left transition-all group ${purpose === "request_investment" ? "bg-brand-gold text-black border-brand-gold" : "bg-black/40 border-white/10 hover:border-brand-gold/50"}`}
              >
                <TrendingUp
                  size={32}
                  className={`mb-4 ${purpose === "request_investment" ? "text-black" : "text-brand-gold"}`}
                />
                <h3 className="font-bold text-lg mb-1">
                  {t("listing.investment")}
                </h3>
                <p
                  className={`text-sm ${purpose === "request_investment" ? "text-black/70" : "text-gray-400"}`}
                >
                  {t("listing.investmentDesc")}
                </p>
              </button>
              <button
                onClick={() => {
                  setPurpose("sell_business");
                  setPurposeError(false);
                }}
                className={`p-6 rounded-xl border text-left transition-all group ${purpose === "sell_business" ? "bg-brand-gold text-black border-brand-gold" : "bg-black/40 border-white/10 hover:border-brand-gold/50"}`}
              >
                <Store
                  size={32}
                  className={`mb-4 ${purpose === "sell_business" ? "text-black" : "text-brand-gold"}`}
                />
                <h3 className="font-bold text-lg mb-1">{t("listing.sale")}</h3>
                <p
                  className={`text-sm ${purpose === "sell_business" ? "text-black/70" : "text-gray-400"}`}
                >
                  {t("listing.saleDesc")}
                </p>
              </button>
            </div>
            {purposeError && (
              <p className="text-red-500 text-center font-medium animate-fade-in">
                {t("listing.selectGoalFirst")}
              </p>
            )}
            <div className="flex justify-end pt-6">
              <button
                onClick={() => {
                  if (!purpose) {
                    setPurposeError(true);
                  } else {
                    setPurposeError(false);
                    setStep(2);
                  }
                }}
                className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition flex items-center gap-2"
              >
                {t("listing.next")}{" "}
                {lang === "ar" ? (
                  <ArrowLeft size={18} />
                ) : (
                  <ArrowRight size={18} />
                )}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={fillDemoData}
                className="text-xs bg-brand-gold/10 text-brand-gold px-3 py-1.5 rounded-md hover:bg-brand-gold/20 transition"
              >
                {t("auth.fillDemo")}
              </button>
            </div>

            {/* SECTION 1: Admin Only */}
            <div className="bg-black/20 border border-red-500/20 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                  <Lock size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {t("listing.adminOnlyInfo")}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {t("listing.adminOnlyInfoDesc")}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    {t("auth.firstName")}{" "}
                    <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full bg-[#121212] border ${errors.fullName ? "border-red-500" : "border-white/15"} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    {t("auth.phone")} <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full bg-[#121212] border ${errors.phone ? "border-red-500" : "border-white/15"} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  {t("auth.email")} <span className="text-brand-gold">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-[#121212] border ${errors.email ? "border-red-500" : "border-white/15"} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    {t("auth.adminCompanyName")}{" "}
                    <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    name="adminCompanyName"
                    value={formData.adminCompanyName}
                    onChange={handleChange}
                    className={`w-full bg-[#121212] border ${errors.adminCompanyName ? "border-red-500" : "border-white/15"} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    {t("auth.companyOwnerName")}{" "}
                    <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyOwnerName"
                    value={formData.companyOwnerName}
                    onChange={handleChange}
                    className={`w-full bg-[#121212] border ${errors.companyOwnerName ? "border-red-500" : "border-white/15"} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  {t("auth.licenseNumber")}{" "}
                  <span className="text-brand-gold">*</span>
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className={`w-full bg-[#121212] border ${errors.licenseNumber ? "border-red-500" : "border-white/15"} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
                />
              </div>
            </div>

            {/* SECTION 2: Public Information */}
            <div className="bg-black/20 border border-brand-gold/20 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-brand-gold/10 rounded-lg text-brand-gold">
                  <Globe size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {t("listing.publicInfo")}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {t("listing.publicInfoDesc")}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    {t("auth.companyName")}{" "}
                    <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`w-full bg-[#121212] border ${errors.companyName ? "border-red-500" : "border-white/15"} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      {t("auth.sector")}{" "}
                      <span className="text-brand-gold">*</span>
                    </label>
                    <select
                      name="sector"
                      value={formData.sector}
                      onChange={handleChange}
                      className={`w-full bg-[#121212] border ${errors.sector ? "border-red-500" : "border-white/15"} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
                    >
                      <option value="">{t("listing.selectSector")}</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      {t("auth.companyAge")}{" "}
                      <span className="text-brand-gold">*</span>
                    </label>
                    <input
                      type="number"
                      name="companyAge"
                      value={formData.companyAge}
                      onChange={handleChange}
                      className={`w-full bg-[#121212] border ${errors.companyAge ? "border-red-500" : "border-white/15"} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      {t("auth.companyType")}{" "}
                      <span className="text-brand-gold">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyType"
                      value={formData.companyType}
                      onChange={handleChange}
                      className={`w-full bg-[#121212] border ${errors.companyType ? "border-red-500" : "border-white/15"} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      {purpose === "sell_business"
                        ? t("auth.salePrice")
                        : t("auth.requestedInvestment")}{" "}
                      <span className="text-brand-gold">*</span>
                    </label>
                    <input
                      type="number"
                      name="requestedInvestment"
                      value={formData.requestedInvestment}
                      onChange={handleChange}
                      className={`w-full bg-[#121212] border ${errors.requestedInvestment ? "border-red-500" : "border-white/15"} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
                    />
                  </div>
                </div>
                {purpose === "request_investment" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      {t("auth.shareToSell")}{" "}
                      <span className="text-brand-gold">*</span>
                    </label>
                    <input
                      type="number"
                      name="shareToSell"
                      max="100"
                      value={formData.shareToSell}
                      onChange={handleChange}
                      className={`w-full bg-[#121212] border ${errors.shareToSell ? "border-red-500" : "border-white/15"} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 3: Premium / Booklet Info */}
            <div className="bg-black/20 border border-blue-500/20 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {t("listing.bookletInfo")}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {t("listing.bookletInfoDesc")}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    {t("auth.legalEntity")}{" "}
                    <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    name="legalEntity"
                    value={formData.legalEntity}
                    onChange={handleChange}
                    className={`w-full bg-[#121212] border ${errors.legalEntity ? "border-red-500" : "border-white/15"} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    {t("common.financial")}{" "}
                    <span className="text-brand-gold">*</span>
                  </label>
                  <select
                    name="financialHealth"
                    value={formData.financialHealth}
                    onChange={handleChange}
                    className={`w-full bg-[#121212] border ${errors.financialHealth ? "border-red-500" : "border-white/15"} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
                  >
                    {FINANCIAL_STATUS_ORDER.map((status) => (
                      <option key={status} value={status}>
                        {t(FINANCIAL_HEALTH_MAP[status].labelKey)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    {t("auth.investmentReason")}{" "}
                    <span className="text-brand-gold">*</span>
                  </label>
                  <textarea
                    name="investmentReason"
                    rows={3}
                    value={formData.investmentReason}
                    onChange={handleChange}
                    className={`w-full bg-[#121212] border ${errors.investmentReason ? "border-red-500" : "border-white/15"} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    {t("auth.fullDetails")}{" "}
                    <span className="text-brand-gold">*</span>
                  </label>
                  <textarea
                    name="fullDetails"
                    rows={5}
                    value={formData.fullDetails}
                    onChange={handleChange}
                    className={`w-full bg-[#121212] border ${errors.fullDetails ? "border-red-500" : "border-white/15"} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
                  />
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Project Image <span className="text-brand-gold">*</span>
                    </label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleFileChange}
                      className={`w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-gold file:text-black hover:file:bg-brand-gold/90 border ${errors.image ? "border-red-500" : "border-transparent"}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      License File <span className="text-brand-gold">*</span>
                    </label>
                    <input
                      type="file"
                      name="license_file"
                      accept=".pdf,.png,.jpg"
                      onChange={handleFileChange}
                      className={`w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-gold file:text-black hover:file:bg-brand-gold/90 border ${errors.license_file ? "border-red-500" : "border-transparent"}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Commercial Record{" "}
                      <span className="text-brand-gold">*</span>
                    </label>
                    <input
                      type="file"
                      name="commercial_record_file"
                      accept=".pdf,.png,.jpg"
                      onChange={handleFileChange}
                      className={`w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-gold file:text-black hover:file:bg-brand-gold/90 border ${errors.commercial_record_file ? "border-red-500" : "border-transparent"}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Tax Certificate <span className="text-brand-gold">*</span>
                    </label>
                    <input
                      type="file"
                      name="tax_certificate_file"
                      accept=".pdf,.png,.jpg"
                      onChange={handleFileChange}
                      className={`w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-gold file:text-black hover:file:bg-brand-gold/90 border ${errors.tax_certificate_file ? "border-red-500" : "border-transparent"}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Financial Statements{" "}
                      <span className="text-brand-gold">*</span>
                    </label>
                    <input
                      type="file"
                      name="financial_statements_file"
                      accept=".pdf,.png,.jpg"
                      onChange={handleFileChange}
                      className={`w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-gold file:text-black hover:file:bg-brand-gold/90 border ${errors.financial_statements_file ? "border-red-500" : "border-transparent"}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    setTermsError(false);
                  }}
                  className="accent-brand-gold"
                />
                <span className="text-sm text-gray-300">
                  {t("auth.agreeToTerms")}{" "}
                  <Link
                    to="/terms-of-use"
                    target="_blank"
                    className="text-brand-gold underline"
                  >
                    {t("auth.termsAndConditions")}
                  </Link>
                </span>
              </label>
              {termsError && (
                <p className="text-red-500 text-sm">
                  {t("auth.termsErrorListing")}
                </p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-white/10 text-white font-bold py-4 rounded-xl hover:bg-white/20 transition"
              >
                {t("listing.back")}
              </button>
              <button
                type="submit"
                disabled={createOpportunity.isPending}
                className="flex-[2] bg-brand-gold text-black font-bold text-lg py-4 rounded-xl hover:bg-yellow-500 transition shadow-lg shadow-brand-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createOpportunity.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                    {t("listing.processing")}
                  </span>
                ) : (
                  t("listing.submit")
                )}
              </button>
            </div>
          </form>
        )}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-[#121212] border border-brand-gold/20 p-8 rounded-2xl max-w-md text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white">
                {t("listing.submitted")}
              </h2>
              <p className="text-gray-300">{t("listing.success")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
