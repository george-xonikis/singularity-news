import type { Article, ArticleFilters } from '@singularity-news/shared';
import { API_CONFIG } from '@/config/env';

const API_BASE_URL = API_CONFIG.NEXT_URL;

export interface PaginatedArticlesResponse {
  data: Article[];
  // TODO rename "pagination" to "meta"
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
  static async getArticles(filters: ArticleFilters): Promise<PaginatedArticlesResponse> {
    const {
      limit = 20,
      offset = 0,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      ...otherFilters
    } = filters;

    // Convert offset back to page for the API
    const page = Math.floor(offset / limit) + 1;

    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder: sortOrder.toUpperCase(),
    });

    // Add filters to search params
    Object.entries(otherFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/admin/articles?${searchParams}`);
    const { data, pagination } = await this.handleResponse<{
      data: Article[];
      pagination: PaginatedArticlesResponse['pagination'];
    }>(response);

    return {
      data,
      pagination
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

    const { data } = await this.handleResponse<{ success: boolean; data: Article }>(response);
    return data;
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

    const { data } = await this.handleResponse<{ success: boolean; data: Article }>(response);
    return data;
  }
}