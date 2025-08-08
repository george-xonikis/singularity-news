import { create } from 'zustand';
import { dataLayer, Topic } from '@/api/dataLayer';

interface TopicState {
  topics: Topic[];
  currentTopic: string | null;
  loading: boolean;
  error: string | null;
  fetchTopics: () => Promise<void>;
  setCurrentTopic: (topic: string | null) => void;
  clearError: () => void;
}

export const useTopicStore = create<TopicState>(set => ({
  topics: [],
  currentTopic: null,
  loading: false,
  error: null,

  fetchTopics: async () => {
    set({ loading: true, error: null });
    try {
      const topics = await dataLayer.getTopics();
      set({ topics, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch topics',
        loading: false,
      });
    }
  },

  setCurrentTopic: (topic: string | null) => set({ currentTopic: topic }),

  clearError: () => set({ error: null }),
}));
