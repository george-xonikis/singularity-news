import { create } from 'zustand';

export interface AdminState {
  // App-level UI state
  loading: boolean;
  error: string | null;
  showFilters: boolean;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleFilters: () => void;
  clearError: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  // Initial state
  loading: false,
  error: null,
  showFilters: false,

  // Actions
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  toggleFilters: () => set((state) => ({ showFilters: !state.showFilters })),
  clearError: () => set({ error: null }),
}));