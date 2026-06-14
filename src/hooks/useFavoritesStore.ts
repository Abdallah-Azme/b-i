import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import i18n from '@/i18n';
import { toast } from '@/lib/toast';

interface FavoritesState {
  favorites: (number | string)[]; // Array of project IDs
  toggleFavorite: (projectId: number | string) => void;
  isFavorite: (projectId: number | string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (projectId) => {
        const idStr = String(projectId);
        const { favorites } = get();
        const normalizedFavorites = favorites.map(f => String(f));
        const index = normalizedFavorites.indexOf(idStr);
        if (index === -1) {
          set({ favorites: [...favorites, idStr] });
          toast.success(i18n.t('favorites.addedToast'), {
            id: `favorite-added-${idStr}`,
          });
        } else {
          set({ favorites: normalizedFavorites.filter((id) => id !== idStr) });
          toast.success(i18n.t('favorites.removedToast'), {
            id: `favorite-removed-${idStr}`,
          });
        }
      },
      isFavorite: (projectId) => {
        const idStr = String(projectId);
        return get().favorites.map(f => String(f)).includes(idStr);
      },
    }),
    {
      name: 'bi-favorites-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage),
    }
  )
);
