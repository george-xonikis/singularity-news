import { create } from 'zustand';

export interface AdminState {
  // App-level UI state
  error: string | null;
  showFilters: boolean;

  // Actions
  setError: (error: string | null) => void;
  toggleFilters: () => void;
  clearError: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  // Initial state
  error: null,
  showFilters: false,

  // Actions
  setError: (error: string | null) => set({ error }),
  toggleFilters: () => set((state) => ({ showFilters: !state.showFilters })),
  clearError: () => set({ error: null }),
}));