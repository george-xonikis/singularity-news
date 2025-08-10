import type { Article } from '@singularity-news/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

export interface ArticleFilters {
  topic?: string;
  search?: string;
  published?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  minViews?: number;
  maxViews?: number;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedArticlesResponse {
  data: Article[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export class ArticleService {
  private static handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  };

  /**
   * Fetch articles with filtering, sorting, and pagination
   */
  static async getArticles(params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    filters?: ArticleFilters;
  }): Promise<PaginatedArticlesResponse> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'created_at',
      sortOrder = 'desc',
      filters = {}
    } = params;

    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder: sortOrder.toUpperCase(),
    });

    // Add filters to search params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/admin/articles?${searchParams}`);
    const data = await this.handleResponse<{
      data: Article[];
      pagination: PaginatedArticlesResponse['pagination'];
    }>(response);

    return {
      data: data.data,
      pagination: data.pagination
    };
  }

  /**
   * Delete an article
   */
  static async deleteArticle(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/articles/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete article');
    }
  }

  /**
   * Get single article by ID
   */
  static async getArticle(id: string): Promise<Article> {
    const response = await fetch(`${API_BASE_URL}/admin/articles/${id}`);
    return this.handleResponse<Article>(response);
  }

  /**
   * Create new article
   */
  static async createArticle(articleData: Partial<Article>): Promise<Article> {
    const response = await fetch(`${API_BASE_URL}/admin/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    const data = await this.handleResponse<{ success: boolean; data: Article }>(response);
    return data.data;
  }

  /**
   * Update existing article
   */
  static async updateArticle(id: string, articleData: Partial<Article>): Promise<Article> {
    const response = await fetch(`${API_BASE_URL}/admin/articles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    const data = await this.handleResponse<{ success: boolean; data: Article }>(response);
    return data.data;
  }
}