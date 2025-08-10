import { create } from 'zustand';
import { ArticleAdminService, type ArticleFilters } from '@/services/articleAdminService';
import { TopicAdminService } from '@/services/topicAdminService';
import type { Article, Topic } from '@singularity-news/shared';

export interface AdminFilters {
  search: string;
  topic: string;
  minViews: string;
  maxViews: string;
  startDate: string;
  endDate: string;
}

export interface AdminState {
  // Data
  articles: Article[];
  topics: Topic[];
  
  // UI State
  loading: boolean;
  error: string | null;
  
  // Pagination
  currentPage: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  
  // Sorting
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  
  // Filters
  filters: AdminFilters;
  showFilters: boolean;
  
  // Actions
  setFilters: (filters: Partial<AdminFilters>) => void;
  clearFilters: () => void;
  setSort: (field: string) => void;
  setPage: (page: number) => void;
  toggleFilters: () => void;
  
  // Async Actions
  fetchArticles: () => Promise<void>;
  fetchTopics: () => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  
  // Reset
  reset: () => void;
}

const initialState = {
  articles: [],
  topics: [],
  loading: false,
  error: null,
  currentPage: 1,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasMore: false,
  },
  sortBy: 'created_at',
  sortOrder: 'desc' as const,
  filters: {
    search: '',
    topic: '',
    minViews: '',
    maxViews: '',
    startDate: '',
    endDate: '',
  },
  showFilters: false,
};

export const useAdminStore = create<AdminState>((set, get) => ({
  ...initialState,

  // Sync Actions
  setFilters: (newFilters: Partial<AdminFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1, // Reset to first page when filters change
    }));
    // Reactively trigger fetch when filters change
    get().fetchArticles();
  },

  clearFilters: () => {
    set(() => ({
      filters: initialState.filters,
      currentPage: 1,
    }));
    get().fetchArticles();
  },

  setSort: (field: string) => {
    set((state) => {
      const newSortOrder = state.sortBy === field && state.sortOrder === 'desc' ? 'asc' : 'desc';
      return {
        sortBy: field,
        sortOrder: newSortOrder,
      };
    });
    get().fetchArticles();
  },

  setPage: (page: number) => {
    set({ currentPage: page });
    get().fetchArticles();
  },

  toggleFilters: () => {
    set((state) => ({ showFilters: !state.showFilters }));
  },

  // Async Actions
  fetchArticles: async () => {
    const state = get();
    set({ loading: true, error: null });

    try {
      // Convert store filters to service filters format
      const serviceFilters: ArticleFilters = {};
      if (state.filters.search) serviceFilters.search = state.filters.search;
      if (state.filters.topic) serviceFilters.topic = state.filters.topic;
      if (state.filters.minViews) serviceFilters.minViews = parseInt(state.filters.minViews);
      if (state.filters.maxViews) serviceFilters.maxViews = parseInt(state.filters.maxViews);
      if (state.filters.startDate) serviceFilters.startDate = state.filters.startDate;
      if (state.filters.endDate) serviceFilters.endDate = state.filters.endDate;

      const result = await ArticleAdminService.getArticles({
        page: state.currentPage,
        limit: 20,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        filters: serviceFilters,
      });

      set({
        articles: result.data,
        pagination: result.pagination,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch articles',
      });
      console.error('Failed to fetch articles:', error);
    }
  },

  fetchTopics: async () => {
    try {
      const topics = await TopicAdminService.getTopics();
      set({ topics });
    } catch (error) {
      console.error('Failed to fetch topics:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to fetch topics' });
    }
  },

  deleteArticle: async (id: string) => {
    try {
      await ArticleAdminService.deleteArticle(id);
      // Reactively refresh articles after deletion
      await get().fetchArticles();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete article';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  reset: () => {
    set(initialState);
  },
}));