import { Article } from '@singularity-news/shared';

/**
 * Response DTO for single article
 * Maintains backward compatibility with existing API
 */
export class ArticleResponseDto {
  success: boolean;
  data: Article;

  constructor(article: Article) {
    this.success = true;
    this.data = article;
  }
}

/**
 * Response DTO for article list
 * Maintains backward compatibility - returns array directly
 */
export class ArticleListResponseDto {
  constructor(public articles: Article[]) {}

  // For backward compatibility, return the array directly
  toJSON() {
    return this.articles;
  }
}

/**
 * Paginated response with metadata
 * For future API versions
 */
export class PaginatedArticleResponseDto {
  success: boolean;
  data: Article[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  constructor(articles: Article[], total: number, page: number, limit: number) {
    this.success = true;
    this.data = articles;
    this.meta = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
}

/**
 * Error response DTO
 */
export class ErrorResponseDto {
  success: boolean;
  error: string;
  message?: string;
  errors?: string[];

  constructor(error: string, details?: { message?: string; errors?: string[] }) {
    this.success = false;
    this.error = error;
    if (details?.message) this.message = details.message;
    if (details?.errors) this.errors = details.errors;
  }
}