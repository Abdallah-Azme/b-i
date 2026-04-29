import React from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "../hooks/useStore";
import { Link, Navigate } from "@tanstack/react-router";
import {
  Globe,
  FileText,
  Plus,
  CheckCircle,
  LayoutDashboard,
  Briefcase,
  Phone,
  Mail,
  User,
  Building2,
  FileBadge,
  Calendar,
  Layers,
  Activity,
  DollarSign,
  PieChart,
  FileEdit,
  Image as ImageIcon,
} from "lucide-react";
import {
  FINANCIAL_HEALTH_MAP,
  FINANCIAL_STATUS_ORDER,
  COMPANY_STAGES,
} from "../constants";
import { useCreateOpportunity } from "../features/company/hooks/useOpportunities";
import { useCategories } from "../features/general/hooks/useCategories";
import { FinancialStatus } from "../types";
import { useAuth } from "../features/auth/hooks/useAuth";
import { FileUpload } from "../components/ui/FileUpload";

export const AddListing: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { user: apiUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: categoriesData } = useCategories({ per_page: 100 });
  const categories = categoriesData?.data?.categories ?? [];

  const [step, setStep] = React.useState(1);
  const [purpose, setPurpose] = React.useState<
    "request_investment" | "sell_business" | null
  >(null);
  const [purposeError, setPurposeError] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const [formData, setFormData] = React.useState({
    fullName: "",
    phone: "",
    email: "",
    adminCompanyName: "",
    companyOwnerName: "",
    licenseNumber: "",
    companyName: "",
    sector: "", // category_id as string
    companyAge: "",
    legalEntity: "",
    companyStage: "seed",
    financialHealth: "Stable" as FinancialStatus,
    requestedInvestment: "",
    investmentReason: "",
    shareToSell: "",
    fullDetails: "",
  });

  const [files, setFiles] = React.useState<{ [key: string]: File | null }>({
    image: null,
    license_file: null,
    commercial_record_file: null,
    tax_certificate_file: null,
    financial_statements_file: null,
  });

  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [termsError, setTermsError] = React.useState(false);

  const createOpportunity = useCreateOpportunity();

  const fillDemoData = () => {
    setFormData({
      companyName: t("listing.placeholderCompany"),
      fullName: t("auth.firstName"),
      phone: "80808080",
      email: "test@demo.com",
      adminCompanyName: t("listing.placeholderElite"),
      companyOwnerName: t("auth.firstName"),
      licenseNumber: "LIC-123456",
      sector: categories[0]?.id.toString() || "1",
      companyAge: "3",
      legalEntity: t("listing.placeholderWLL"),
      companyStage: "seed",
      financialHealth: "Stable",
      requestedInvestment: "65000",
      investmentReason: t("listing.demoReason"),
      shareToSell: "20",
      fullDetails: t("listing.demoDetails"),
    });
  };

  React.useEffect(() => {
    if (step === 2) {
      fillDemoData();
    }
  }, [lang, step]);

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
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: fileList } = e.target;
    if (fileList && fileList[0]) {
      setFiles((prev) => ({ ...prev, [name]: fileList[0] }));
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const validateStep1 = () => {
    if (!purpose) {
      setPurposeError(true);
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};
    const requiredStr = t("auth.required");

    if (!formData.fullName.trim()) newErrors.fullName = requiredStr;
    if (!formData.phone.trim()) newErrors.phone = requiredStr;
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
    if (!formData.financialHealth.trim())
      newErrors.financialHealth = requiredStr;
    if (!formData.requestedInvestment.trim())
      newErrors.requestedInvestment = requiredStr;
    if (!formData.investmentReason.trim())
      newErrors.investmentReason = requiredStr;
    if (!formData.fullDetails.trim()) newErrors.fullDetails = requiredStr;

    if (purpose === "request_investment" && !formData.shareToSell.trim()) {
      newErrors.shareToSell = requiredStr;
    }

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
          contact_name: formData.fullName,
          contact_phone: formData.phone,
          contact_email: formData.email,
          owner_name: formData.companyOwnerName,
          admin_company_name: formData.adminCompanyName,
          license_number: formData.licenseNumber,
          company_name: formData.companyName,
          category_id: Number(formData.sector),
          business_age_years: Number(formData.companyAge),
          investment_required: parseFloat(formData.requestedInvestment),
          business_stage: formData.companyStage,
          sale_percentage:
            purpose === "sell_business"
              ? 100
              : parseFloat(formData.shareToSell),
          legal_entity: formData.legalEntity,
          financial_status: formData.financialHealth,
          investment_reason: formData.investmentReason,
          full_description: formData.fullDetails,
          terms_accepted: termsAccepted,
          image: files.image!,
          license_file: files.license_file!,
          commercial_record_file: files.commercial_record_file!,
          tax_certificate_file: files.tax_certificate_file!,
          financial_statements_file: files.financial_statements_file!,
        },
        {
          onSuccess: () => {
            setShowSuccess(true);
            setTimeout(() => {
              window.location.href = "/dashboard";
            }, 3000);
          },
        },
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t("listing.title")}</h1>
            <div className="flex items-center gap-4 text-sm">
              <div
                className={`flex items-center gap-2 ${step === 1 ? "text-brand-gold" : "text-gray-500"}`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center border ${step === 1 ? "border-brand-gold" : "border-gray-500"}`}
                >
                  1
                </span>
                {t("listing.step1")}
              </div>
              <div className="w-8 h-px bg-gray-800"></div>
              <div
                className={`flex items-center gap-2 ${step === 2 ? "text-brand-gold" : "text-gray-500"}`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center border ${step === 2 ? "border-brand-gold" : "border-gray-500"}`}
                >
                  2
                </span>
                {t("listing.step2")}
              </div>
            </div>
          </div>
          <Link
            to="/dashboard"
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition text-gray-400"
          >
            <LayoutDashboard size={24} />
          </Link>
        </div>

        {step === 1 ? (
          <div className="bg-brand-gray/20 border border-white/10 rounded-2xl p-8 backdrop-blur-sm animate-fade-in">
            <h2 className="text-xl font-bold mb-6">
              {t("listing.purposeTitle")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <button
                onClick={() => {
                  setPurpose("request_investment");
                  setPurposeError(false);
                }}
                className={`p-6 rounded-xl border text-start transition-all group ${purpose === "request_investment" ? "bg-brand-gold text-black border-brand-gold" : "bg-black/40 border-white/10 hover:border-brand-gold/50"}`}
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${purpose === "request_investment" ? "bg-black/20" : "bg-brand-gold/10 text-brand-gold group-hover:bg-brand-gold/20"}`}
                >
                  <Plus size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">
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
                className={`p-6 rounded-xl border text-start transition-all group ${purpose === "sell_business" ? "bg-brand-gold text-black border-brand-gold" : "bg-black/40 border-white/10 hover:border-brand-gold/50"}`}
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${purpose === "sell_business" ? "bg-black/20" : "bg-brand-gold/10 text-brand-gold group-hover:bg-brand-gold/20"}`}
                >
                  <Briefcase size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">{t("listing.sale")}</h3>
                <p
                  className={`text-sm ${purpose === "sell_business" ? "text-black/70" : "text-gray-400"}`}
                >
                  {t("listing.saleDesc")}
                </p>
              </button>
            </div>

            {purposeError && (
              <p className="text-red-500 text-center mb-6">
                {t("listing.selectGoalFirst")}
              </p>
            )}

            <button
              onClick={() => validateStep1() && setStep(2)}
              className="w-full bg-brand-gold text-black font-bold py-4 rounded-xl hover:bg-yellow-500 transition shadow-lg shadow-brand-gold/20"
            >
              {t("listing.next")}
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-brand-gray/20 border border-white/10 rounded-2xl p-8 backdrop-blur-sm animate-fade-in space-y-8"
          >
            <div className="space-y-6">
              {/* SECTION 1: Administration Information */}
              <div className="bg-black/20 border border-white/10 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-brand-gold/10 rounded-lg text-brand-gold">
                    <User size={20} />
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
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                      <User size={16} className="text-brand-gold" />
                      <label>
                        {t("auth.firstName")}{" "}
                        <span className="text-brand-gold">*</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full bg-[#121212] border ${errors.fullName ? "border-red-500" : "border-white/15"} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                      <Phone size={16} className="text-brand-gold" />
                      <label>
                        {t("auth.phone")}{" "}
                        <span className="text-brand-gold">*</span>
                      </label>
                    </div>
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
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                    <Mail size={16} className="text-brand-gold" />
                    <label>
                      {t("auth.email")}{" "}
                      <span className="text-brand-gold">*</span>
                    </label>
                  </div>
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
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                      <Building2 size={16} className="text-brand-gold" />
                      <label>
                        {t("auth.adminCompanyName")}{" "}
                        <span className="text-brand-gold">*</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      name="adminCompanyName"
                      value={formData.adminCompanyName}
                      onChange={handleChange}
                      className={`w-full bg-[#121212] border ${errors.adminCompanyName ? "border-red-500" : "border-white/15"} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                      <User size={16} className="text-brand-gold" />
                      <label>
                        {t("auth.companyOwnerName")}{" "}
                        <span className="text-brand-gold">*</span>
                      </label>
                    </div>
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
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                    <FileBadge size={16} className="text-brand-gold" />
                    <label>
                      {t("auth.licenseNumber")}{" "}
                      <span className="text-brand-gold">*</span>
                    </label>
                  </div>
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
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                      <Building2 size={16} className="text-brand-gold" />
                      <label>
                        {t("auth.companyName")}{" "}
                        <span className="text-brand-gold">*</span>
                      </label>
                    </div>
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
                      <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                        <Layers size={16} className="text-brand-gold" />
                        <label>
                          {t("auth.sector")} <span className="text-brand-gold">*</span>
                        </label>
                      </div>
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
                      <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                        <Calendar size={16} className="text-brand-gold" />
                        <label>
                          {t("auth.companyAge")}{" "}
                          <span className="text-brand-gold">*</span>
                        </label>
                      </div>
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
                      <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                        <Activity size={16} className="text-brand-gold" />
                        <label>
                          {t("auth.companyStage")}{" "}
                          <span className="text-brand-gold">*</span>
                        </label>
                      </div>
                      <select
                        name="companyStage"
                        value={formData.companyStage}
                        onChange={handleChange}
                        className={`w-full bg-[#121212] border ${errors.companyStage ? "border-red-500" : "border-white/15"} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
                      >
                        {COMPANY_STAGES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {t(s.labelKey)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                        <DollarSign size={16} className="text-brand-gold" />
                        <label>
                          {purpose === "sell_business"
                            ? t("auth.salePrice")
                            : t("auth.requestedInvestment")}{" "}
                          <span className="text-brand-gold">*</span>
                        </label>
                      </div>
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
                      <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                        <PieChart size={16} className="text-brand-gold" />
                        <label>
                          {t("auth.shareToSell")}{" "}
                          <span className="text-brand-gold">*</span>
                        </label>
                      </div>
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
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                      <Briefcase size={16} className="text-brand-gold" />
                      <label>
                        {t("auth.legalEntity")}{" "}
                        <span className="text-brand-gold">*</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      name="legalEntity"
                      value={formData.legalEntity}
                      onChange={handleChange}
                      className={`w-full bg-[#121212] border ${errors.legalEntity ? "border-red-500" : "border-white/15"} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                      <Activity size={16} className="text-brand-gold" />
                      <label>
                        {t("common.financial")}{" "}
                        <span className="text-brand-gold">*</span>
                      </label>
                    </div>
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
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                      <FileEdit size={16} className="text-brand-gold" />
                      <label>
                        {t("auth.investmentReason")}{" "}
                        <span className="text-brand-gold">*</span>
                      </label>
                    </div>
                    <textarea
                      name="investmentReason"
                      rows={3}
                      value={formData.investmentReason}
                      onChange={handleChange}
                      className={`w-full bg-[#121212] border ${errors.investmentReason ? "border-red-500" : "border-white/15"} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-300">
                      <FileText size={16} className="text-brand-gold" />
                      <label>
                        {t("auth.fullDetails")}{" "}
                        <span className="text-brand-gold">*</span>
                      </label>
                    </div>
                    <textarea
                      name="fullDetails"
                      rows={5}
                      value={formData.fullDetails}
                      onChange={handleChange}
                      className={`w-full bg-[#121212] border ${errors.fullDetails ? "border-red-500" : "border-white/15"} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
                    />
                  </div>

                  {/* File Uploads */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <FileUpload
                      label={t("auth.companyImage")}
                      value={files.image}
                      onChange={(file) => {
                        setFiles(prev => ({ ...prev, image: file }));
                        if (errors.image) setErrors(prev => { const e = {...prev}; delete e.image; return e; });
                      }}
                      error={errors.image}
                      accept="image/*"
                      icon={<ImageIcon size={16} className="text-brand-gold" />}
                    />
                    
                    <FileUpload
                      label={t("auth.companyLicense")}
                      value={files.license_file}
                      onChange={(file) => {
                        setFiles(prev => ({ ...prev, license_file: file }));
                        if (errors.license_file) setErrors(prev => { const e = {...prev}; delete e.license_file; return e; });
                      }}
                      error={errors.license_file}
                      accept=".pdf,.png,.jpg"
                      icon={<FileBadge size={16} className="text-brand-gold" />}
                    />

                    <FileUpload
                      label={t("auth.commercialRecord")}
                      value={files.commercial_record_file}
                      onChange={(file) => {
                        setFiles(prev => ({ ...prev, commercial_record_file: file }));
                        if (errors.commercial_record_file) setErrors(prev => { const e = {...prev}; delete e.commercial_record_file; return e; });
                      }}
                      error={errors.commercial_record_file}
                      accept=".pdf,.png,.jpg"
                      icon={<FileText size={16} className="text-brand-gold" />}
                    />

                    <FileUpload
                      label={t("auth.taxCertificate")}
                      value={files.tax_certificate_file}
                      onChange={(file) => {
                        setFiles(prev => ({ ...prev, tax_certificate_file: file }));
                        if (errors.tax_certificate_file) setErrors(prev => { const e = {...prev}; delete e.tax_certificate_file; return e; });
                      }}
                      error={errors.tax_certificate_file}
                      accept=".pdf,.png,.jpg"
                      icon={<FileText size={16} className="text-brand-gold" />}
                    />

                    <FileUpload
                      label={t("auth.financialStatements")}
                      value={files.financial_statements_file}
                      onChange={(file) => {
                        setFiles(prev => ({ ...prev, financial_statements_file: file }));
                        if (errors.financial_statements_file) setErrors(prev => { const e = {...prev}; delete e.financial_statements_file; return e; });
                      }}
                      error={errors.financial_statements_file}
                      accept=".pdf,.png,.jpg"
                      icon={<Activity size={16} className="text-brand-gold" />}
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
                  {t("auth.agreeToTermsListing")}{" "}
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
