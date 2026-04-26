import { api } from '@/lib/fetcher';
import {
  HomePageResponse,
  GeneralContentResponse,
  InvestorsListResponse,
  InvestorsQueryParams,
  SectorsResponse,
  LookupResponse,
  CategoriesResponse,
  PackagesResponse,
  StatisticsResponse,
  OpportunitiesListResponse,
  OpportunitiesQueryParams,
  OpportunityDetailResponse,
} from '../types';

export const generalService = {
  // ─── Home ────────────────────────────────────────────────────────────────
  getHomePage: async () =>
    api.get<HomePageResponse>('/v1/general/home-page'),

  // ─── Static content ──────────────────────────────────────────────────────
  getTermsAndConditions: async () =>
    api.get<GeneralContentResponse>('/v1/general/terms-and-conditions'),

  getPrivacyPolicy: async () =>
    api.get<GeneralContentResponse>('/v1/general/privacy-policy'),

  getWhoWeAre: async () =>
    api.get<GeneralContentResponse>('/v1/general/who-we-are'),

  // ─── Categories ──────────────────────────────────────────────────────────
  getCategories: async (params?: { page?: number; per_page?: number }) =>
    api.get<CategoriesResponse>('/v1/general/categories', { query: params }),

  // ─── Investors ───────────────────────────────────────────────────────────
  getInvestors: async (params?: InvestorsQueryParams) =>
    api.get<InvestorsListResponse>('/v1/general/investors', { query: params }),

  // ─── Lookup tables ───────────────────────────────────────────────────────
  getInvestorTypes: async () =>
    api.get<LookupResponse>('/v1/general/investor-types'),

  getInvestorExperiences: async () =>
    api.get<LookupResponse>('/v1/general/investor-experience'),

  getPreferredSectors: async () =>
    api.get<SectorsResponse>('/v1/general/preferred-sectors'),

  // ─── Packages / Pricing ──────────────────────────────────────────────────
  getPackages: async () =>
    api.get<PackagesResponse>('/v1/general/packages'),

  // ─── Opportunities (public) ──────────────────────────────────────────────
  getOpportunities: async (params?: OpportunitiesQueryParams) =>
    api.get<OpportunitiesListResponse>('/v1/general/opportunities', { query: params }),

  getOpportunityDetail: async (id: number | string) =>
    api.get<OpportunityDetailResponse>(`/v1/general/opportunities/${id}`),

  // ─── Statistics ──────────────────────────────────────────────────────────
  getStatistics: async () =>
    api.get<StatisticsResponse>('/v1/general/statistics'),

  changeLang: async (lang: 'ar' | 'en', device_token?: string) =>
    api.get<{ key: string; data: { lang: string } }>('/v1/general/change-lang', {
      query: { lang, device_token: device_token ?? '' },
    }),

  // ─── Actions ─────────────────────────────────────────────────────────────
  buySeat: async (opportunity_id: string | number, payload?: any) =>
    api.post(`/v1/opportunities/${opportunity_id}/seats`, payload),

  submitInterestRequest: async (opportunity_id: string | number, payload?: any) =>
    api.post(`/v1/opportunities/${opportunity_id}/interest-requests`, payload),
};
