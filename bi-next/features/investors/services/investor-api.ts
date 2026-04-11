import { PublicInvestor } from '@/shared/types';
import { CATEGORIES } from '@/features/projects/services/project-api';

export const SAMPLE_INVESTORS: PublicInvestor[] = Array.from({ length: 15 }, (_, i) => {
  const types: Array<'company' | 'angel' | 'crowdfunding'> = ['company', 'angel', 'crowdfunding'];
  const experiences: Array<'beginner' | 'intermediate' | 'expert'> = ['beginner', 'intermediate', 'expert'];
  const cat = CATEGORIES[i % CATEGORIES.length];
  
  return {
    id: `INV-${8920 + i}`,
    investorType: types[i % 3],
    capital: (Math.floor(Math.random() * 90) + 10) * 10000,
    preferredField: cat.en,
    experience: experiences[i % 3],
    joinedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  };
});

export const investorService = {
  getAllInvestors: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 0));
    return SAMPLE_INVESTORS;
  }
};
