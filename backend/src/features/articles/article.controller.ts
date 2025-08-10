import { Request, Response, NextFunction } from 'express';
import { ArticleService } from './article.service';
import { 
  CreateArticleDto, 
  UpdateArticleDto, 
  ArticleQueryDto,
  ArticleResponseDto,
  ArticleListResponseDto,
  ErrorResponseDto
} from './dtos';

export class ArticleController {
  constructor(private readonly service: ArticleService) {}

  /**
   * GET /api/articles
   * Get all articles with optional filters
   */
  async getAllArticles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const queryDto = new ArticleQueryDto(req.query as { [key: string]: string | string[] | undefined });
      const errors = queryDto.validate();
      
      if (errors.length > 0) {
        res.status(400).json(new ErrorResponseDto('Validation error', { errors }));
        return;
      }

      const result = await this.service.getAllArticles({
        limit: queryDto.limit,
        offset: queryDto.offset,
        topic: queryDto.topic,
        search: queryDto.search,
        published: true
      });

      // Return array directly for backward compatibility
      res.json(new ArticleListResponseDto(result.articles));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/articles/popular
   * Get popular articles (highest views)
   */
  async getPopularArticles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 3, 10);
      const articles = await this.service.getPopularArticles(limit);
      res.json(new ArticleListResponseDto(articles));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/articles/recent
   * Get recent articles
   */
  async getRecentArticles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
      const articles = await this.service.getRecentArticles(limit);
      res.json(new ArticleListResponseDto(articles));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/articles/:slug
   * Get article by slug
   */
  async getArticleBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      if (!slug) {
        res.status(400).json(new ErrorResponseDto('Slug parameter is required'));
        return;
      }
      const trackView = req.query.trackView !== 'false'; // Default true
      
      const article = await this.service.getArticleBySlug(slug, trackView);
      
      if (!article) {
        res.status(404).json(new ErrorResponseDto('Article not found'));
        return;
      }

      res.json(new ArticleResponseDto(article));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/articles/id/:id
   * Get article by ID
   */
  async getArticleById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json(new ErrorResponseDto('ID parameter is required'));
        return;
      }
      
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        res.status(400).json(new ErrorResponseDto('Invalid article ID format'));
        return;
      }

      const article = await this.service.getArticleById(id);
      
      if (!article) {
        res.status(404).json(new ErrorResponseDto('Article not found'));
        return;
      }

      res.json(new ArticleResponseDto(article));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/articles
   * Create a new article
   */
  async createArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new CreateArticleDto(req.body);
      const errors = dto.validate();
      
      if (errors.length > 0) {
        res.status(400).json(new ErrorResponseDto('Validation error', { errors }));
        return;
      }

      const article = await this.service.createArticle(dto);
      res.status(201).json(new ArticleResponseDto(article));
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('already exists')) {
        res.status(409).json(new ErrorResponseDto('Conflict', { message: error.message }));
        return;
      }
      next(error);
    }
  }

  /**
   * PUT /api/articles/:id
   * Update an article
   */
  async updateArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json(new ErrorResponseDto('ID parameter is required'));
        return;
      }
      
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        res.status(400).json(new ErrorResponseDto('Invalid article ID format'));
        return;
      }

      const dto = new UpdateArticleDto(req.body);
      const errors = dto.validate();
      
      if (errors.length > 0) {
        res.status(400).json(new ErrorResponseDto('Validation error', { errors }));
        return;
      }

      const article = await this.service.updateArticle(id, dto);
      
      if (!article) {
        res.status(404).json(new ErrorResponseDto('Article not found'));
        return;
      }

      res.json(new ArticleResponseDto(article));
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('already exists')) {
        res.status(409).json(new ErrorResponseDto('Conflict', { message: error.message }));
        return;
      }
      next(error);
    }
  }

  /**
   * DELETE /api/articles/:id
   * Delete an article (soft delete)
   */
  async deleteArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json(new ErrorResponseDto('ID parameter is required'));
        return;
      }
      
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        res.status(400).json(new ErrorResponseDto('Invalid article ID format'));
        return;
      }

      const success = await this.service.deleteArticle(id);
      
      if (!success) {
        res.status(404).json(new ErrorResponseDto('Article not found'));
        return;
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}