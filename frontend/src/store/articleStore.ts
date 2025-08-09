import { create } from 'zustand';
import { Article } from '@singularity-news/shared';

interface ArticleState {
  articles: Article[];
  currentArticle: Article | null;
  loading: boolean;
  error: string | null;
  fetchArticles: () => Promise<void>;
  fetchArticleById: (id: string) => Promise<void>;
  fetchArticlesByTopic: (topic: string) => Promise<void>;
  searchArticles: (query: string) => Promise<void>;
  clearError: () => void;
  setCurrentArticle: (article: Article | null) => void;
}

export const useArticleStore = create<ArticleState>(set => ({
  articles: [],
  currentArticle: null,
  loading: false,
  error: null,

  fetchArticles: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/articles`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const articles = await response.json();
      set({ articles, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch articles',
        loading: false,
      });
    }
  },

  fetchArticleById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/articles/${id}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const article = await response.json();
      set({ currentArticle: article, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch article',
        loading: false,
      });
    }
  },

  fetchArticlesByTopic: async (topic: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/articles?topic=${encodeURIComponent(topic)}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const articles = await response.json();
      set({ articles, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch articles by topic',
        loading: false,
      });
    }
  },

  searchArticles: async (query: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/articles?search=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const articles = await response.json();
      set({ articles, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to search articles',
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),

  setCurrentArticle: (article: Article | null) => set({ currentArticle: article }),
}));
