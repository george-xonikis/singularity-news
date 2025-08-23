import { create } from 'zustand';
import type { Article, ArticleFilters } from '@singularity-news/shared';

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

  // Refetch trigger - increment to trigger a refetch with current filters
  refetchTrigger: number;

  // State Management Actions (synchronous only)
  updateArticle: (id: string, updatedArticle: Article) => void;

  // Filter Actions
  setFilters: (filters: Partial<ArticleFilters>) => void;
  clearFilters: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSort: (field: string, order?: 'ASC' | 'DESC') => void;

  // Refetch Action
  refetch: () => void;

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
  topics: undefined,
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
  refetchTrigger: 0,
});

export const useArticleStore = create<ArticleState>((set) => ({
  ...createInitialState(),

  updateArticle: (id: string, updatedArticle: Article) => {
    set((state) => ({
      articles: state.articles.map(article =>
        article.id === id ? updatedArticle : article
      )
    }));
  },

  // Filter Actions
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

  // Refetch Action - increments trigger to force observable to emit
  refetch: () => {
    set((state) => ({
      refetchTrigger: state.refetchTrigger + 1
    }));
  },

  reset: () => set(createInitialState()),
}));