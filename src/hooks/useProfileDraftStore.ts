import { create } from 'zustand';

try {
  localStorage.removeItem('profile-draft-storage');
} catch {
  // Ignore storage access issues in private mode / restricted contexts.
}

interface ProfileDraftState {
  draft: any | null;
  setDraft: (draft: any) => void;
  clearDraft: () => void;
}

export const useProfileDraftStore = create<ProfileDraftState>()(
  (set) => ({
    draft: null,
    setDraft: (draft) => set({ draft }),
    clearDraft: () => set({ draft: null }),
  })
);
