import { Topic } from './topic';

export interface Article {
  id: string; // UUID from database
  title: string;
  slug: string;
  content: string;
  summary?: string;
  author?: string;
  topics: Topic[];
  coverPhoto?: string;
  coverPhotoCaption?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedDate?: string | null;
  views: number;
  published: boolean;
}

// Input types for forms - these use topic IDs (UUIDs) instead of full Topic objects
export interface CreateArticleInput {
  title: string;
  content: string;
  topics: string[]; // Topic IDs
  tags: string[];
  slug?: string;
  summary?: string;
  author?: string;
  coverPhoto?: string;
  coverPhotoCaption?: string;
  published?: boolean;
  publishedDate?: string;
}

export interface UpdateArticleInput {
  title?: string;
  slug?: string;
  content?: string;
  summary?: string;
  author?: string;
  topics?: string[]; // Topic IDs
  coverPhoto?: string;
  coverPhotoCaption?: string;
  tags?: string[];
  published?: boolean;
  publishedDate?: string;
}

// ArticleFilters: Common interface for filtering articles across frontend and backend
export interface ArticleFilters {
  search?: string;
  topics?: string[];
  published?: boolean;
  minViews?: number;
  maxViews?: number;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}