import { create } from 'zustand';
import { Topic } from '@singularity-news/shared';

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/topics`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const topics = await response.json();
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
