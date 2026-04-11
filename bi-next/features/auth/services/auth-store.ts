import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, UserRole, Project } from '@/shared/types';
import { SAMPLE_PROJECTS } from '@/features/projects/services/project-api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  interestedInvestors: string[];
  login: (role: UserRole, email?: string) => void;
  logout: () => void;
  unlockProject: (projectId: string) => void;
  toggleFavorite: (projectId: string) => void;
  updateUser: (userData: Partial<User>) => void;
  addProject: (projectData: Partial<Project>) => void;
  requestInterest: (projectId: string) => void;
  toggleInterestInvestor: (investorId: string) => void;
  isInterestedInInvestor: (investorId: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true, // This will be set to false after hydration
      interestedInvestors: [],
      
      login: (role: UserRole, email: string = 'user@bi-platform.com') => {
        // Migration/Normalization: Handle demo user matching
        const userId = (role === 'advertiser' && email.includes('advertiser')) 
            ? 'USR-DEMO-OWNER' 
            : `USR-${Math.floor(Math.random() * 10000)}`;

        const licenseUrl = role === 'advertiser' 
          ? 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80' 
          : undefined;

        const mockUser: User = {
          id: userId,
          email: email,
          name: role === 'investor' ? 'Verified Investor' : 'Business Owner',
          role,
          subscriptionPlan: role === 'investor' ? 'premium' : undefined,
          favorites: [],
          unlockedProjects: (role === 'advertiser' && email.includes('advertiser')) ? ['PROJ-1000', 'PROJ-1001'] : [],
          companyLicenseUrl: licenseUrl
        };
        set({ user: mockUser });
      },
      
      logout: () => {
        set({ user: null });
      },
      
      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, ...userData } });
      },
      
      unlockProject: (projectId: string) => {
        const { user } = get();
        if (!user) return;
        
        const unlockedProjects = [...(user.unlockedProjects || [])];
        if (!unlockedProjects.includes(projectId)) {
          unlockedProjects.push(projectId);
        }
        
        set({ user: { ...user, unlockedProjects } });
        
        // Match React alert behavior
        const isAr = typeof window !== 'undefined' && window.location.pathname.startsWith('/ar');
        alert(isAr ? 'تم الدفع بنجاح. تم فتح الملف.' : 'Payment Successful. File Unlocked.');
      },
      
      toggleFavorite: (projectId: string) => {
        const { user } = get();
        if (!user) {
          const isAr = typeof window !== 'undefined' && window.location.pathname.startsWith('/ar');
          alert(isAr ? 'يرجى تسجيل الدخول لحفظ المفضلة.' : 'Please login to save favorites.');
          return;
        }
        
        const favorites = user.favorites.includes(projectId)
          ? user.favorites.filter(id => id !== projectId)
          : [...user.favorites, projectId];
        
        set({ user: { ...user, favorites } });
      },

      addProject: (projectData: Partial<Project>) => {
        const { user } = get();
        if (!user) return;
        
        const newProject: Project = {
           id: `PROJ-${Math.floor(Math.random() * 100000)}`,
           ownerId: user.id,
           name: projectData.name || { ar: 'مشروع جديد', en: 'New Project' },
           category: projectData.category || { ar: 'غير محدد', en: 'Uncategorized' },
           image: projectData.image || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
           capital: projectData.capital || 0,
           age: projectData.age || { ar: '0 سنوات', en: '0 Years' },
           shareOffered: projectData.shareOffered || 0,
           askingPrice: projectData.askingPrice || 0,
           location: projectData.location || { ar: 'الكويت', en: 'Kuwait' },
           descriptionShort: projectData.descriptionShort || { ar: '', en: '' },
           descriptionFull: projectData.descriptionFull || { ar: '', en: '' },
           financialHealth: projectData.financialHealth || 'Stable',
           status: 'pending',
           createdAt: new Date().toISOString(),
           listingPurpose: projectData.listingPurpose || 'investment',
           companyStage: projectData.companyStage || { ar: 'تأسيسی', en: 'Seed' },
           viewsCount: 0,
           ...projectData
        } as Project;

        // Mutate the mock data list to simulate backend save
        SAMPLE_PROJECTS.unshift(newProject);
      },

      requestInterest: (_projectId: string) => {
        const isAr = typeof window !== 'undefined' && window.location.pathname.startsWith('/ar');
        alert(isAr ? 'تم تسجيل اهتمامك. سيتصل بك المسؤول قريباً.' : 'Interest registered. Admin will contact you shortly.');
      },

      toggleInterestInvestor: (investorId: string) => {
        const { user, interestedInvestors } = get();
        const isAr = typeof window !== 'undefined' && window.location.pathname.startsWith('/ar');

        if (!user || user.role !== 'advertiser') {
          alert(isAr ? 'فقط أصحاب الأعمال يمكنهم إبداء الاهتمام.' : 'Only business owners can express interest.');
          return;
        }
        
        if (interestedInvestors.includes(investorId)) return;
        
        set({ interestedInvestors: [...interestedInvestors, investorId] });
        alert(isAr ? 'تم إرسال الاهتمام للإدارة.' : 'Interest sent to admin.');
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
