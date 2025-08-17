import { create } from 'zustand';

export interface AdminState {
  // App-level UI state
  error: string | null;
  success: string | null;
  showFilters: boolean;

  // Actions
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  toggleFilters: () => void;
  clearError: () => void;
  clearSuccess: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  // Initial state
  error: null,
  success: null,
  showFilters: false,

  // Actions
  setError: (error: string | null) => set({ error }),
  setSuccess: (success: string | null) => set({ success }),
  toggleFilters: () => set((state) => ({ showFilters: !state.showFilters })),
  clearError: () => set({ error: null }),
  clearSuccess: () => set({ success: null }),
}));