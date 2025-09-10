import { Article, ArticleFilters } from '@singularity-news/shared';
import { ArticleRepository } from './article.repository';
import { CreateArticleDto, UpdateArticleDto } from './dtos';
import { generateSlug } from '../../shared/utils/slug.utils';
import { TopicRepository } from '../topics/topic.repository';

export class ArticleService {
  private topicRepository: TopicRepository;
  
  constructor(private readonly repository: ArticleRepository) {
    this.topicRepository = new TopicRepository();
  }

  /**
   * Get all articles with filters
   */
  async getAllArticles(filters: ArticleFilters & { topicSlug?: string }): Promise<{
    articles: Article[];
    total: number;
    page: number;
    limit: number;
  }> {
    // Convert topic slug to topic ID if provided
    if (filters.topicSlug) {
      const topic = await this.topicRepository.findBySlug(filters.topicSlug.toLowerCase());
      if (topic) {
        filters.topics = [topic.id];
      } else {
        // If topic not found, return empty results
        return {
          articles: [],
          total: 0,
          page: 1,
          limit: filters.limit || 50,
        };
      }
      delete filters.topicSlug;
    }

    const [articles, total] = await Promise.all([
      this.repository.findAll(filters),
      this.repository.count(filters)
    ]);

    return {
      articles,
      total,
      page: Math.floor((filters.offset || 0) / (filters.limit || 50)) + 1,
      limit: filters.limit || 50,
    };
  }

  /**
   * Get article by ID
   */
  async getArticleById(id: string): Promise<Article | null> {
    return this.repository.findById(id);
  }

  /**
   * Get article by slug and track view
   */
  async getArticleBySlug(slug: string, trackView = true): Promise<Article | null> {
    return this.repository.findBySlug(slug, trackView);
  }

  /**
   * Get popular articles for sidebar
   */
  async getPopularArticles(limit = 3): Promise<Article[]> {
    return this.repository.findPopular(limit);
  }

  /**
   * Get recent articles
   */
  async getRecentArticles(limit = 10): Promise<Article[]> {
    return this.repository.findRecent(limit);
  }

  /**
   * Create a new article
   */
  async createArticle(dto: CreateArticleDto): Promise<Article> {
    const data = dto.validatedData;
    
    // Generate slug if not provided
    const slug = data.slug || generateSlug(data.title);

    // Check if slug already exists
    const existing = await this.repository.findBySlug(slug, false);
    if (existing) {
      throw new Error(`Article with slug "${slug}" already exists`);
    }

    return this.repository.create({
      title: data.title,
      slug,
      content: data.content,
      summary: data.summary || null,
      author: data.author || null,
      topics: data.topics,
      cover_photo: data.coverPhoto || null,
      cover_photo_caption: data.coverPhotoCaption || null,
      tags: data.tags || [],
      published: data.published ?? true,
      published_date: data.publishedDate ? new Date(data.publishedDate).toISOString() : new Date().toISOString()
    });
  }

  /**
   * Update an article
   */
  async updateArticle(id: string, dto: UpdateArticleDto): Promise<Article | null> {
    const data = dto.validatedData;
    
    // Check if article exists
    const existing = await this.repository.findById(id);
    if (!existing) {
      return null;
    }

    // If updating slug, check for conflicts
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await this.repository.findBySlug(data.slug, false);
      if (slugExists) {
        throw new Error(`Article with slug "${data.slug}" already exists`);
      }
    }

    const updates: Partial<{
      title: string;
      slug: string;
      content: string;
      summary: string | null;
      author: string | null;
      topics: string[];
      cover_photo: string | null;
      cover_photo_caption: string | null;
      tags: string[];
      published: boolean;
      published_date: string | null;
    }> = {};
    if (data.title !== undefined) updates.title = data.title;
    if (data.slug !== undefined) updates.slug = data.slug;
    if (data.content !== undefined) updates.content = data.content;
    if (data.summary !== undefined) updates.summary = data.summary;
    if (data.author !== undefined) updates.author = data.author;
    if (data.topics !== undefined) updates.topics = data.topics;
    if (data.coverPhoto !== undefined) updates.cover_photo = data.coverPhoto;
    if (data.coverPhotoCaption !== undefined) updates.cover_photo_caption = data.coverPhotoCaption;
    if (data.tags !== undefined) updates.tags = data.tags;
    if (data.published !== undefined) updates.published = data.published;
    if (data.publishedDate !== undefined) {
      updates.published_date = data.publishedDate ? new Date(data.publishedDate).toISOString() : null;
    }

    return this.repository.update(id, updates);
  }

  /**
   * Delete an article (soft delete)
   */
  async deleteArticle(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  /**
   * Hard delete an article from database
   */
  async hardDeleteArticle(id: string): Promise<boolean> {
    return this.repository.hardDelete(id);
  }

  /**
   * Search articles by keyword
   */
  async searchArticles(query: string, limit = 50, offset = 0): Promise<Article[]> {
    return this.repository.findAll({
      search: query,
      published: true,
      limit,
      offset
    });
  }

  /**
   * Get articles by topics
   */
  async getArticlesByTopics(topics: string[], limit = 50, offset = 0): Promise<Article[]> {
    return this.repository.findAll({
      topics,
      published: true,
      limit,
      offset
    });
  }
}