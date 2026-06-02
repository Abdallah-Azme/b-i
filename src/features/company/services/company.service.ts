import { api } from '@/lib/fetcher';
import {
  CreateOpportunityPayload,
  CompanyOpportunityResponse,
  CompanyOpportunitiesListResponse,
} from '../types';

/**
 * Converts a CreateOpportunityPayload to FormData.
 * The API expects multipart/form-data when an image is included.
 */
function toFormData(payload: CreateOpportunityPayload): FormData {
  const fd = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (value instanceof File) {
      fd.append(key, value);
    } else {
      fd.append(key, String(value));
    }
  });
  return fd;
}

export const companyService = {
  // ─── Opportunities CRUD ──────────────────────────────────────────────────

  /** POST /v1/company/opportunities — Create a new opportunity (advertiser only) */
  createOpportunity: (payload: CreateOpportunityPayload) =>
    api.post<CompanyOpportunityResponse>(
      '/v1/company/opportunities',
      toFormData(payload),
    ),

  /** GET /v1/company/opportunities — List the authenticated company's opportunities */
  getMyOpportunities: (params?: { page?: number; per_page?: number }) =>
    api.get<CompanyOpportunitiesListResponse>('/v1/company/opportunities', {
      query: params,
    }),

  /** GET /v1/company/opportunities/:id — Single opportunity detail (owner view) */
  getOpportunityDetail: (id: number | string) =>
    api.get<CompanyOpportunityResponse>(`/v1/company/opportunities/${id}`),

  /** PATCH /v1/company/opportunities/:id — Update an existing opportunity */
  updateOpportunity: (id: number | string, payload: Partial<CreateOpportunityPayload>) =>
    api.patch<CompanyOpportunityResponse>(
      `/v1/company/opportunities/${id}`,
      toFormData(payload as CreateOpportunityPayload),
    ),

  /** DELETE /v1/company/opportunities/:id — Remove an opportunity */
  deleteOpportunity: (id: number | string) =>
    api.delete(`/v1/company/opportunities/${id}`),

  // ─── Opportunity Interactions ──────────────────────────────────────────────
  getPurchasedSeats: (params?: any) =>
    api.get('/v1/company/opportunities/purchased-seats', { query: params }),

  getSentInterests: (params?: any) =>
    api.get('/v1/company/opportunities/sent-interests', { query: params }),

  getCurrentRequests: (params?: any) =>
    api.get('/v1/company/opportunities/current-requests', { query: params }),

  sendInvestorInterestRequest: (payload: any) =>
    api.post('/v1/company/investor-interest-requests', payload),
};
