import { PublicInvestor } from '@/shared/types';
import { api } from '@/shared/services/api-client';

export const investorService = {
  getAllInvestors: async (filters: any = {}): Promise<PublicInvestor[]> => {
    const query: any = {
      page: 1,
      per_page: 50 // Temp pagination bypass
    };
    
    if (filters.filterType) query.investor_type = filters.filterType;
    if (filters.filterExp) query.investor_experience = filters.filterExp;
    if (filters.filterField) query.preferred_field = filters.filterField;
    if (filters.filterCapital) {
      if (filters.filterCapital === 'low') { query.max_capital = 99999; }
      else if (filters.filterCapital === 'mid') { query.min_capital = 100000; query.max_capital = 499999; }
      else if (filters.filterCapital === 'high') { query.min_capital = 500000; }
    }

    try {
      const response = await api.get('/v1/general/investors', { query });
      const investors = response?.data?.data || response?.data || response || [];
      
      // Normalize backend JSON map to frontend PublicInvestor format safely
      return investors.map((inv: any) => ({
        id: inv.id ? String(inv.id) : `INV-${Math.floor(Math.random()*1000)}`,
        investorType: inv.investor_type || 'angel',
        capital: inv.capital || inv.available_capital || 0,
        preferredField: inv.preferred_field || inv.category?.name || inv.category?.en || 'Tech',
        experience: inv.investor_experience || 'intermediate',
        joinedAt: inv.created_at || new Date().toISOString(),
      }));
    } catch (e) {
      console.error("Investors fetch array mapped:", e);
      return [];
    }
  }
};
