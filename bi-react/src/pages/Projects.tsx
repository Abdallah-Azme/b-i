import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "../hooks/useStore";
import { FALLBACK_IMAGE } from "../constants";
import {
  Filter,
  Lock,
  Unlock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  X,
  Loader2,
} from "lucide-react";
import { Link, useSearch } from "@tanstack/react-router";
import { Money } from "../components/Money";
import { useOpportunities } from "../features/general/hooks/useOpportunities";
import { useCategories } from "../features/general/hooks/useCategories";

export const Projects: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "ar" | "en";

  // Note: the new API returns has_seat boolean, but we can fall back to the store if needed.
  // For now, let's use the local store function for backward compatibility until fully removed.
  const { isProjectUnlocked } = useStore();
  const search = useSearch({ from: "/projects/" });

  // Initialize filter from URL if present
  const initialCat = search.cat ? Number(search.cat) : undefined;

  const [filterCat, setFilterCat] = useState<number | undefined>(initialCat);
  const [filterPurpose, setFilterPurpose] = useState<
    "request_investment" | "sell_business" | undefined
  >(undefined);

  // Mobile Filter Visibility State
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // API hooks
  const { data: categoriesData } = useCategories({ per_page: 100 });
  const categories = categoriesData?.data?.categories ?? [];

  const { data: opportunitiesData, isLoading } = useOpportunities({
    ...(filterCat !== undefined && { category_id: filterCat }),
    ...(filterPurpose ? { goal: filterPurpose } : {}),
    page: 1,
    per_page: 50, // Get a chunk of them for now
  });

  const opportunities = opportunitiesData?.data?.opportunities ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Mobile Filter Toggle Button */}
      <button
        onClick={() => setShowMobileFilters(!showMobileFilters)}
        className="md:hidden w-full glass-card p-4 flex justify-between items-center mb-6 text-brand-gold font-bold hover-scale transition shadow-lg shadow-black/20"
      >
        <div className="flex items-center gap-2">
          <Filter size={20} />
          <span>{t("filters.title")}</span>
        </div>
        {showMobileFilters ? (
          <ChevronUp size={20} />
        ) : (
          <ChevronDown size={20} />
        )}
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`w-full md:w-1/4 space-y-8 ${showMobileFilters ? "block" : "hidden"} md:block transition-all duration-300`}
        >
          <div className="glass-card p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6 text-brand-gold">
              <div className="flex items-center gap-2">
                <Filter size={20} />
                <h3 className="font-bold text-lg">{t("filters.title")}</h3>
              </div>
              {/* Close Button for Mobile */}
              <button
                onClick={() => setShowMobileFilters(false)}
                className="md:hidden text-gray-400 hover:text-white flex items-center gap-1 text-xs bg-white/5 px-2 py-1.5 rounded border border-white/10"
              >
                <span>{t("filters.close")}</span>
                <X size={14} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">
                  {t("filters.category")}
                </label>
                <select
                  className="w-full bg-black border border-white/20 rounded-lg p-2 text-sm focus:border-brand-gold outline-none"
                  value={filterCat || ""}
                  onChange={(e) =>
                    setFilterCat(
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                >
                  <option value="">{t("filters.allCategories")}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">
                  {t("filters.listingType")}
                </label>
                <select
                  className="w-full bg-black border border-white/20 rounded-lg p-2 text-sm focus:border-brand-gold outline-none"
                  value={filterPurpose || ""}
                  onChange={(e) =>
                    setFilterPurpose(
                      (e.target.value || undefined) as
                        | "request_investment"
                        | "sell_business"
                        | undefined,
                    )
                  }
                >
                  <option value="">{t("filters.allTypes")}</option>
                  <option value="sell_business">{t("filters.forSale")}</option>
                  <option value="request_investment">
                    {t("filters.forInvestment")}
                  </option>
                </select>
              </div>

              <button
                onClick={() => {
                  setFilterCat(undefined);
                  setFilterPurpose(undefined);
                }}
                className="w-full text-sm text-gray-500 hover:text-white underline mt-4"
              >
                {t("filters.reset")}
              </button>
            </div>
          </div>
        </aside>

        {/* Project Grid */}
        <div className="w-full md:w-3/4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {t("nav.projects")}{" "}
              {opportunitiesData && (
                <span className="text-gray-500 text-lg font-normal font-sans">
                  ({opportunitiesData.data.pagination.total})
                </span>
              )}
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 size={48} className="animate-spin text-brand-gold" />
            </div>
          ) : opportunities.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p>No opportunities found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {opportunities.map((project) => {
                const unlocked = isProjectUnlocked(String(project.id)); // Using local state for now until fully supported
                return (
                  <div
                    key={project.id}
                    className="glass-card hover:border-brand-gold/50 rounded-xl overflow-hidden transition-all hover-scale group relative"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Thumbnail Image */}
                      <div className="w-full md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                        <img
                          src={project.image || FALLBACK_IMAGE}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = FALLBACK_IMAGE;
                          }}
                          alt={project.company_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />

                        {/* Mobile Badge Only */}
                        <div
                          className={`absolute top-0 p-3 md:hidden ${lang === "ar" ? "left-0" : "right-0"}`}
                        >
                          {unlocked ? (
                            <span className="flex items-center gap-1 text-black text-[10px] font-bold uppercase tracking-wider bg-green-400 px-2 py-1 rounded">
                              <Unlock size={10} /> {t("common.unlocked")}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-white text-[10px] font-bold uppercase tracking-wider bg-black/60 px-2 py-1 rounded backdrop-blur-md">
                              <Lock size={10} /> {t("common.locked")}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div className="relative">
                          {/* Desktop Status Badge Removed */}
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-brand-gold text-xs font-bold uppercase tracking-widest block">
                              {project.category.name}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest block">
                              {project.goal.label}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold mb-2 group-hover:text-white text-gray-100">
                            {project.company_name}
                          </h3>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                            <span className="bg-black/20 px-3 py-1 rounded-full border border-white/5">
                              {t("common.price")}:{" "}
                              <Money
                                value={project.investment_required}
                                className="text-white font-sans"
                              />
                            </span>
                            {project.sale_percentage && (
                              <span className="bg-black/20 px-3 py-1 rounded-full border border-white/5">
                                {t("common.share")}:{" "}
                                <span className="text-white font-sans">
                                  {project.sale_percentage}%
                                </span>
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end items-center">
                          <Link
                            to="/projects/$id"
                            params={{ id: String(project.id) }}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all duration-300 hover-scale text-sm ${unlocked ? "bg-brand-white text-black hover:bg-gray-200" : "bg-gold-gradient text-black hover:shadow-lg hover:shadow-brand-gold-glow"}`}
                          >
                            {t("filters.viewDetails")}
                            <ArrowRight
                              size={16}
                              className={lang === "ar" ? "rotate-180" : ""}
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
