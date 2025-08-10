import { Request, Response, NextFunction } from 'express';
import { ArticleService } from './article.service';
import { CreateArticleDto, UpdateArticleDto } from './dtos';

export class AdminArticleController {
  constructor(private readonly service: ArticleService) {}

  /**
   * GET /api/admin/articles
   * Get all articles with admin-specific filtering (including unpublished)
   */
  async getAllArticles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const offset = (page - 1) * limit;
      
      const topic = req.query.topic as string;
      const published = req.query.published as string;
      const sortBy = req.query.sortBy as string || 'created_at';
      const sortOrder: 'ASC' | 'DESC' = (req.query.sortOrder as string)?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      const search = req.query.search as string;
      const minViews = req.query.minViews ? parseInt(req.query.minViews as string) : undefined;
      const maxViews = req.query.maxViews ? parseInt(req.query.maxViews as string) : undefined;
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;

      // Build filters for ArticleService
      const filters: any = {
        limit,
        offset
      };

      if (topic) filters.topic = topic;
      if (published !== undefined && published !== '') filters.published = published === 'true';
      if (search) filters.search = search;
      if (sortBy) filters.sortBy = sortBy;
      if (sortOrder) filters.sortOrder = sortOrder;
      if (minViews !== undefined) filters.minViews = minViews;
      if (maxViews !== undefined) filters.maxViews = maxViews;
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;

      const result = await this.service.getAllArticles(filters);

      res.json({
        data: result.articles,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
          hasMore: offset + limit < result.total
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/articles/:id
   * Get single article by ID (including unpublished)
   */
  async getArticleById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'ID parameter is required' });
        return;
      }

      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        res.status(400).json({ error: 'Invalid article ID format' });
        return;
      }
      
      const article = await this.service.getArticleById(id);
      
      if (!article) {
        res.status(404).json({ error: 'Article not found' });
        return;
      }

      res.json(article);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/articles
   * Create new article
   */
  async createArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = new CreateArticleDto(req.body);
      const validationErrors = dto.validate();
      
      if (validationErrors.length > 0) {
        res.status(400).json({
          error: 'Validation failed',
          messages: validationErrors
        });
        return;
      }

      const article = await this.service.createArticle(dto);
      res.status(201).json({ success: true, data: article });
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        res.status(409).json({
          error: 'Conflict',
          message: error.message
        });
        return;
      }
      next(error);
    }
  }

  /**
   * PUT /api/admin/articles/:id
   * Update article
   */
  async updateArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'ID parameter is required' });
        return;
      }

      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        res.status(400).json({ error: 'Invalid article ID format' });
        return;
      }

      const dto = new UpdateArticleDto(req.body);
      const validationErrors = dto.validate();
      
      if (validationErrors.length > 0) {
        res.status(400).json({
          error: 'Validation failed',
          messages: validationErrors
        });
        return;
      }

      const article = await this.service.updateArticle(id, dto);
      
      if (!article) {
        res.status(404).json({ error: 'Article not found' });
        return;
      }

      res.json({ success: true, data: article });
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        res.status(409).json({
          error: 'Conflict',
          message: error.message
        });
        return;
      }
      next(error);
    }
  }

  /**
   * DELETE /api/admin/articles/:id
   * Hard delete article (admin only)
   */
  async deleteArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'ID parameter is required' });
        return;
      }

      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        res.status(400).json({ error: 'Invalid article ID format' });
        return;
      }

      const success = await this.service.hardDeleteArticle(id);
      
      if (!success) {
        res.status(404).json({ error: 'Article not found' });
        return;
      }

      res.json({ message: 'Article deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}