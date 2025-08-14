import { create } from 'zustand';
import type { Topic } from '@singularity-news/shared';

export interface TopicState {
  // Data
  topics: Topic[];
  refetchTrigger: number;

  // Synchronous Actions
  setTopics: (topics: Topic[]) => void;
  refetch: () => void;
  reset: () => void;
}

export const useTopicStore = create<TopicState>((set) => ({
  // Initial state
  topics: [],
  refetchTrigger: 0,

  // Synchronous Actions only
  setTopics: (topics) => set({ topics }),

  refetch: () => set((state) => ({ refetchTrigger: state.refetchTrigger + 1 })),

  reset: () => {
    set({ topics: [], refetchTrigger: 0 });
  },
}));