import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import i18n from '@/i18n';
import { toast } from '@/lib/toast';

interface InvestorFavoritesState {
  favorites: (number | string)[];
  toggleFavorite: (investorId: number | string) => void;
  isFavorite: (investorId: number | string) => boolean;
}

export const useInvestorFavoritesStore = create<InvestorFavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (investorId) => {
        const idStr = String(investorId);
        const favorites = get().favorites.map((favorite) => String(favorite));
        const isActive = favorites.includes(idStr);

        if (isActive) {
          return;
        }

        set({ favorites: [...favorites, idStr] });
        toast.success(i18n.t('favorites.investorAddedToast'), {
          id: `investor-favorite-added-${idStr}`,
        });
      },
      isFavorite: (investorId) =>
        get().favorites.map((favorite) => String(favorite)).includes(String(investorId)),
    }),
    {
      name: 'bi-investor-favorites-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
