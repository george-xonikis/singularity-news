// Database schema types for Supabase
export interface Article {
  id: string;
  title: string;
  content: string;
  topic: string;
  cover_photo?: string;
  created_at: string;
  updated_at: string;
  views: number;
  published: boolean;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

// API request/response types
export interface CreateArticleRequest {
  title: string;
  content: string;
  topic: string;
  cover_photo?: string;
  tags?: string[];
  published?: boolean;
}

export interface UpdateArticleRequest {
  title?: string;
  content?: string;
  topic?: string;
  cover_photo?: string;
  published?: boolean;
}

export interface CreateTopicRequest {
  name: string;
  slug: string;
}

// API response wrappers
export interface ApiResponse<T> {
  data: T | null;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}