export interface Article {
  id: string; // UUID from database
  title: string;
  slug: string;
  content: string;
  summary?: string;
  topic: string;
  topicName?: string;
  coverPhoto?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedDate?: string | null;
  views: number;
  published: boolean;
}

// CreateArticleInput: Pick user-provided fields, exclude auto-generated ones
export type CreateArticleInput = Pick<Article, 'title' | 'content' | 'topic' | 'tags'> & {
  slug?: string | undefined;
  summary?: string | undefined;
  coverPhoto?: string | undefined;
  publishedDate?: string | null | undefined;
  published?: boolean | undefined;
};

// UpdateArticleInput: Make all user-editable fields optional
export type UpdateArticleInput = Partial<Pick<Article, 'title' | 'slug' | 'content' | 'summary' | 'topic' | 'coverPhoto' | 'tags' | 'publishedDate' | 'published'>>;

// ArticleFilters: Common interface for filtering articles across frontend and backend
export interface ArticleFilters {
  search?: string;
  topic?: string;
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