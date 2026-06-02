import { OpportunityDetail } from '@/features/general/types';
import { Pagination } from '@/features/general/types';

// \u2500\u2500\u2500 Create / Update Opportunity \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

export type OpportunityGoal = 'request_investment' | 'sell_business';

export interface CreateOpportunityPayload {
  goal: OpportunityGoal;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  owner_name: string;
  admin_company_name: string;
  license_number: string;
  company_name: string;
  category_id: number;
  business_age_years: number;
  investment_required: number;
  business_stage: string;
  sale_percentage?: number; // required when goal = request_investment
  legal_entity: string;
  financial_status: string;
  investment_reason: string;
  full_description: string;
  terms_accepted: boolean;
  image?: File;
  license_file: File;
  commercial_record_file: File;
  tax_certificate_file: File;
  financial_statements_file: File;
}

// Responses
export interface CompanyOpportunityResponse {
  key: string;
  msg: string;
  code: number;
  response_status: { error: boolean; validation_errors: any };
  data: OpportunityDetail;
}

export interface CompanyOpportunitiesListResponse {
  key: string;
  msg: string;
  code: number;
  response_status: { error: boolean; validation_errors: any };
  data: {
    opportunities: OpportunityDetail[];
    pagination: Pagination;
  };
}
