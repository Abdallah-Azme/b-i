
export interface Feature {
  id: number;
  image: string;
  title: string;
  description: string;
}

export interface Section {
  id: number;
  name: string;
  opportunities_count: number;
}

export interface OpportunityStatistics {
  purchased_seats_count: number;
  interest_requests_count: number;
  views_count: number;
}

export interface FileAccess {
  key: string;
  label: string;
  is_open: boolean;
}

export interface Opportunity {
  id: number;
  opportunity_number: string;
  company_name: string;
  image: string;
  goal: {
    key: string;
    label: string;
  };
  status: {
    value: string;
    name: string;
    label: string;
  };
  category: {
    id: number;
    name: string;
  };
  investment_required: number;
  sale_percentage: number | null;
  seat_price: number;
  statistics: OpportunityStatistics;
  file_access: FileAccess;
  is_owner: boolean;
  has_seat: boolean | null;
  can_buy_seat: boolean | null;
  can_submit_interest: boolean | null;
  has_submitted_interest: boolean | null;
}

export interface HomePageData {
  website_name: string;
  project_brief: string;
  logo_url: string | null;
  website_header: {
    title: string;
    description: string;
  };
  features: Feature[];
  sections: Section[];
  latest_opportunities: Opportunity[];
}

export interface HomePageResponse {
  key: string;
  msg: string;
  code: number;
  response_status: {
    error: boolean;
    validation_errors: any[];
  };
  data: HomePageData;
}

export interface GeneralContentResponse {
  key: string;
  msg: string;
  code: number;
  response_status: {
    error: boolean;
    validation_errors: any[];
  };
  data: string;
}

export interface Investor {
  id: number;
  display_id: string;
  investor_type: {
    value: string;
    label: string;
  };
  available_capital: number;
  focus_sector: {
    id: number;
    name: string;
  };
  investment_experience: {
    value: string;
    label: string;
  };
  image: string;
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface InvestorsListData {
  investors: Investor[];
  pagination: Pagination;
}

export interface InvestorsListResponse {
  key: string;
  msg: string;
  code: number;
  response_status: {
    error: boolean;
    validation_errors: any[];
  };
  data: InvestorsListData;
}

export interface InvestorsQueryParams {
  investor_type?: string;
  min_capital?: number;
  max_capital?: number;
  investor_experience?: string;
  preferred_sector_id?: number;
  page?: number;
  per_page?: number;
}

export interface Sector {
  id: number;
  name: string;
}

export interface SectorsResponse {
  key: string;
  msg: string;
  code: number;
  response_status: {
    error: boolean;
    validation_errors: any[];
  };
  data: Sector[];
}


export interface LookupValue {
  value: string;
  label: string;
}

export interface LookupResponse {
  key: string;
  msg: string;
  code: number;
  response_status: {
    error: boolean;
    validation_errors: any[];
  };
  data: LookupValue[];
}

// ─── Categories ─────────────────────────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
  opportunities_count: number;
}

export interface CategoriesResponse {
  key: string;
  msg: string;
  code: number;
  response_status: { error: boolean; validation_errors: any[] };
  data: {
    categories: Category[];
    pagination: Pagination;
  };
}

// ─── Packages / Pricing ─────────────────────────────────────────────────────

export interface Package {
  id: number;
  name: string;
  description: string; // HTML string
  price_monthly: string;
  can_register: boolean;
  is_subscribed: boolean;
}

export interface PackagesResponse {
  key: string;
  msg: string;
  code: number;
  response_status: { error: boolean; validation_errors: any[] };
  data: {
    pageSettings: {
      title: string;
      description: string;
    };
    packages: Package[];
  };
}

// ─── Statistics ─────────────────────────────────────────────────────────────

export interface Statistics {
  advertisers_count: number;
  investors_count: number;
  projects_count: number;
  online_users_count: number;
  successful_deals_count: number;
  proposed_deals_count: number;
}

export interface StatisticsResponse {
  key: string;
  msg: string;
  code: number;
  response_status: { error: boolean; validation_errors: any[] };
  data: Statistics;
}

// ─── Opportunities (Public List) ─────────────────────────────────────────────

export interface OpportunitySummary {
  id: number;
  opportunity_number: string;
  company_name: string;
  image: string;
  goal: { key: string; label: string };
  status: { value: string; name: string; label: string };
  category: { id: number; name: string };
  investment_required: number;
  sale_percentage: number | null;
}

export interface OpportunitiesQueryParams {
  page?: number;
  per_page?: number;
  category_id?: number;
  goal?: 'request_investment' | 'sell_business';
}

export interface OpportunitiesListResponse {
  key: string;
  msg: string;
  code: number;
  response_status: { error: boolean; validation_errors: any[] };
  data: {
    opportunities: OpportunitySummary[];
    pagination: Pagination;
  };
}

// ─── Opportunity Detail ───────────────────────────────────────────────────────

export interface OpportunityDetail {
  id: number;
  opportunity_number: string;
  goal: string;
  status: { value: string; name: string; label: string };
  image: string;
  company_name: string;
  category: { id: number; name: string };
  business_age_years: number;
  investment_required: number;
  business_stage: string;
  sale_percentage: number | null;
  seat_price: number;
  completed_deals_commission: number;
  current_locale: string;
  file_access: { key: string; label: string; is_open: boolean };
  has_seat: boolean | null;
  can_buy_seat: boolean | null;
  can_submit_interest: boolean | null;
  has_submitted_interest: boolean | null;
  // company-specific fields (when owned)
  legal_entity?: string;
  financial_status?: string;
  investment_reason?: string;
  full_description?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
}

export interface OpportunityDetailResponse {
  key: string;
  msg: string;
  code: number;
  response_status: { error: boolean; validation_errors: any[] };
  data: OpportunityDetail;
}
