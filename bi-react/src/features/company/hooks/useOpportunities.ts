import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyService } from '../services/company.service';
import { CreateOpportunityPayload } from '../types';

const MY_OPPORTUNITIES_KEY = 'my-opportunities';

/**
 * Fetch the authenticated advertiser's own opportunity listings.
 * GET /v1/company/opportunities
 */
export const useMyOpportunities = (params?: { page?: number; per_page?: number }, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: [MY_OPPORTUNITIES_KEY, params],
    queryFn: () => companyService.getMyOpportunities(params),
    staleTime: 1000 * 60 * 2,
    ...options,
  });

/**
 * Fetch a single company opportunity (owner view — includes contact fields).
 * GET /v1/company/opportunities/:id
 */
export const useMyOpportunityDetail = (id: number | string | undefined) =>
  useQuery({
    queryKey: ['my-opportunity', id],
    queryFn: () => companyService.getOpportunityDetail(id!),
    enabled: !!id,
  });

/**
 * Create a new opportunity.
 * POST /v1/company/opportunities
 */
export const useCreateOpportunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOpportunityPayload) =>
      companyService.createOpportunity(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MY_OPPORTUNITIES_KEY] });
    },
  });
};

/**
 * Update an existing opportunity.
 * PATCH /v1/company/opportunities/:id
 */
export const useUpdateOpportunity = (id: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<CreateOpportunityPayload>) =>
      companyService.updateOpportunity(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MY_OPPORTUNITIES_KEY] });
      queryClient.invalidateQueries({ queryKey: ['my-opportunity', id] });
    },
  });
};

/**
 * Delete an opportunity.
 * DELETE /v1/company/opportunities/:id
 */
export const useDeleteOpportunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => companyService.deleteOpportunity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MY_OPPORTUNITIES_KEY] });
    },
  });
};
