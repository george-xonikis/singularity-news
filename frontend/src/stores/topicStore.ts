import { create } from 'zustand';
import { TopicService } from '@/services/topicService';
import type { Topic } from '@singularity-news/shared';
import { useAdminStore } from './adminStore';

export interface TopicState {
  // Data
  topics: Topic[];

  // Actions
  fetchTopics: () => Promise<void>;
  reset: () => void;
}

export const useTopicStore = create<TopicState>((set) => ({
  // Initial state
  topics: [],

  // Async Actions
  fetchTopics: async () => {
    const { setError } = useAdminStore.getState();

    try {
      const topics = await TopicService.getTopics();
      set({ topics });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch topics';
      setError(errorMessage);
      console.error('Failed to fetch topics:', error);
    }
  },

  reset: () => {
    set({ topics: [] });
  },
}));