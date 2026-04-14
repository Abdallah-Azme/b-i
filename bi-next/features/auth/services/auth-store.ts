import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, UserRole, Project } from '@/shared/types';
import { SAMPLE_PROJECTS } from '@/features/projects/services/project-api';
import { api } from '@/shared/services/api-client';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  interestedInvestors: string[];
  login: (payload: { role: UserRole; email: string; phone?: string; password?: string }) => Promise<void>;
  logout: () => void;
  unlockProject: (projectId: string) => Promise<void>;
  toggleFavorite: (projectId: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  requestInterest: (projectId: string) => Promise<void>;
  toggleInterestInvestor: (investorId: string) => Promise<void>;
  isInterestedInInvestor: (investorId: string) => boolean;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true, // This will be set to false after hydration
      interestedInvestors: [],
      
      login: async (payload) => {
        const { role, email, phone, password } = payload;
        
        const formData = new FormData();
        formData.append('email', email);
        if (password) formData.append('password', password);
        else if (phone) formData.append('password', phone); 
        formData.append('role', role);
        formData.append('device_token', 'web-token');
        formData.append('device_type', 'web');

        // ofetch automatically throws errors for non-2xx responses
        const data = await api.post('/v1/auth/login', formData);

        if (data.key === 'success' || data.data?.token) {
           const token = data.data?.token || 'mock_token';
           const userId = `USR-${Math.floor(Math.random() * 10000)}`;

           const mockUser: User = {
             id: data.data?.user?.id || userId,
             email: data.data?.user?.email || email,
             name: data.data?.user?.first_name ? `${data.data.user.first_name} ${data.data.user.last_name}` : (role === 'investor' ? 'Verified Investor' : 'Business Owner'),
             role,
             subscriptionPlan: role === 'investor' ? 'premium' : undefined,
             favorites: [],
             unlockedProjects: [],
             companyLicenseUrl: undefined
           };
           
           set({ user: mockUser, token });
        } else {
           throw new Error(data.msg || 'Login failed');
        }
      },
      
      logout: () => {
        set({ user: null, token: null });
      },
      
      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, ...userData } });
      },
      
      refreshProfile: async () => {
        try {
           const response = await api.get('/v1/auth/me');
           if (response?.data?.user) {
              const u = response.data.user;
              set({ user: { 
                 id: u.id, 
                 email: u.email, 
                 name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'User',
                 role: u.role || 'investor',
                 subscriptionPlan: u.subscription_plan,
                 favorites: Array.isArray(u.favorites) ? u.favorites : [],
                 unlockedProjects: Array.isArray(u.unlocked_projects) ? u.unlocked_projects : [],
              } });
           }
        } catch (e) {
           console.warn('Failed to refresh profile');
        }
      },

      unlockProject: async (projectId: string) => {
        const { user } = get();
        if (!user) return;
        
        try {
          await api.post(`/v1/company/opportunities/${projectId}/buy`);
          const unlockedProjects = [...(user.unlockedProjects || []), projectId];
          set({ user: { ...user, unlockedProjects } });
          const isAr = typeof window !== 'undefined' && window.location.pathname.startsWith('/ar');
          alert(isAr ? 'تم الدفع بنجاح. تم فتح الملف.' : 'Payment Successful. File Unlocked.');
        } catch (e: any) {
           alert(e.message || 'Failed to unlock');
        }
      },
      
      toggleFavorite: async (projectId: string) => {
        const { user } = get();
        if (!user) return;
        
        try {
          // Optimistic UI update
          const favorites = user.favorites.includes(projectId)
            ? user.favorites.filter(id => id !== projectId)
            : [...user.favorites, projectId];
          set({ user: { ...user, favorites } });
          
          await api.post(`/v1/company/opportunities/${projectId}/favorite`);
        } catch (e: any) {
          // Revert on failure
          get().refreshProfile();
        }
      },

      requestInterest: async (projectId: string) => {
        try {
          await api.post(`/v1/company/opportunities/${projectId}/interest`);
          const isAr = typeof window !== 'undefined' && window.location.pathname.startsWith('/ar');
          alert(isAr ? 'تم تسجيل اهتمامك. سيتصل بك المسؤول قريباً.' : 'Interest registered. Admin will contact you shortly.');
        } catch (e: any) {
          alert('Error registering interest');
        }
      },

      toggleInterestInvestor: async (investorId: string) => {
        const { user, interestedInvestors } = get();
        const isAr = typeof window !== 'undefined' && window.location.pathname.startsWith('/ar');

        if (!user || user.role !== 'advertiser') {
          alert(isAr ? 'فقط أصحاب الأعمال يمكنهم إبداء الاهتمام.' : 'Only business owners can express interest.');
          return;
        }
        
        if (interestedInvestors.includes(investorId)) return;
        
        try {
           await api.post(`/v1/general/investors/${investorId}/interest`);
           set({ interestedInvestors: [...interestedInvestors, investorId] });
           alert(isAr ? 'تم إرسال الاهتمام للإدارة.' : 'Interest sent to admin.');
        } catch (e) {
           alert('Error sending interest');
        }
      },

      isInterestedInInvestor: (investorId: string) => {
        return get().interestedInvestors.includes(investorId);
      }
    }),
    {
      name: 'bi-auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (state) => {
        return () => {
          if (state) {
            state.isLoading = false;
          }
        };
      },
    }
  )
);
