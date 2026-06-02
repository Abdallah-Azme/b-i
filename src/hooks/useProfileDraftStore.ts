import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ProfileDraftState {
  draft: any | null;
  setDraft: (draft: any) => void;
  clearDraft: () => void;
}

export const useProfileDraftStore = create<ProfileDraftState>()(
  persist(
    (set) => ({
      draft: null,
      setDraft: (draft) => set({ draft }),
      clearDraft: () => set({ draft: null }),
    }),
    {
      name: 'profile-draft-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
