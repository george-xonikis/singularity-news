import { create } from 'zustand';
import { ArticleService } from '@/services/articleService';
import type { Article, ArticleFilters } from '@singularity-news/shared';
import { useAdminStore } from './adminStore';

export interface ArticleState {
  // Data
  articles: Article[];

  // Pagination metadata from API response
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };

  // Current filters (includes pagination, sorting, and filters)
  filters: ArticleFilters;

  // Actions
  setFilters: (filters: Partial<ArticleFilters>) => void;
  clearFilters: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSort: (field: string, order?: 'ASC' | 'DESC') => void;

  // Async Actions
  deleteArticle: (id: string) => Promise<void>;

  // Reset
  reset: () => void;
}

export const createInitialFilters = (): ArticleFilters => ({
  // Pagination
  limit: 20,
  offset: 0,

  // Sorting
  sortBy: 'created_at',
  sortOrder: 'DESC',

  // Filters
  search: '',
  topic: '',
  minViews: undefined,
  maxViews: undefined,
  startDate: '',
  endDate: '',
});

const createInitialState = () => ({
  articles: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasMore: false,
  },
  filters: createInitialFilters(),
});

export const useArticleStore = create<ArticleState>((set) => ({
  ...createInitialState(),

  setFilters: (newFilters: Partial<ArticleFilters>) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
        offset: 0 // Reset to first page when filters change
      }
    }));
  },

  clearFilters: () => {
    set(() => ({
      filters: createInitialFilters()
    }));
  },

  setSort: (field: string, order?: 'ASC' | 'DESC') => {
    set((state) => {
      const currentOrder = state.filters.sortOrder || 'DESC';
      const newSortOrder = order || (state.filters.sortBy === field && currentOrder === 'DESC' ? 'ASC' : 'DESC');
      return {
        filters: {
          ...state.filters,
          sortBy: field,
          sortOrder: newSortOrder,
          offset: 0 // Reset to first page when sorting changes
        }
      };
    });
  },

  setPage: (page: number) => {
    set((state) => ({
      filters: {
        ...state.filters,
        offset: (page - 1) * (state.filters.limit || 20)
      }
    }));
  },

  setPageSize: (pageSize: number) => {
    set((state) => ({
      filters: {
        ...state.filters,
        limit: pageSize,
        offset: 0 // Reset to first page when changing page size
      }
    }));
  },

  // Async Actions
  deleteArticle: async (id: string) => {
    const { setError } = useAdminStore.getState();

    try {
      await ArticleService.deleteArticle(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete article';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  },

  reset: () => set(createInitialState()),
}));