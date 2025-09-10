import { query } from '../../shared/database/connection';
import { Article, ArticleFilters } from '@singularity-news/shared';
import { DatabaseArticle, transformArticleFromDb } from './article.mapper';
import { TopicRepository } from '../topics/topic.repository';

export class ArticleRepository {
  private topicRepository: TopicRepository;

  constructor() {
    this.topicRepository = new TopicRepository();
  }
  /**
   * Get all articles with optional filters
   * Optimized query that sorts by views for popularity
   */
  async findAll(filters: ArticleFilters = {}): Promise<Article[]> {
    const {
      topics,
      search,
      published,
      limit = 50,
      offset = 0,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      minViews,
      maxViews,
      startDate,
      endDate
    } = filters;

    let sql = 'SELECT * FROM articles WHERE 1=1';
    const params: (string | string[] | number | boolean)[] = [];
    let paramCount = 0;

    if (published !== undefined) {
      sql += ` AND published = $${++paramCount}`;
      params.push(published);
    }

    if (topics && topics.length > 0) {
      sql += ` AND topics && $${++paramCount}::uuid[]`;
      params.push(topics);
    }

    if (search) {
      sql += ` AND (title ILIKE $${++paramCount} OR content ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (minViews !== undefined) {
      sql += ` AND views >= $${++paramCount}`;
      params.push(minViews);
    }

    if (maxViews !== undefined) {
      sql += ` AND views <= $${++paramCount}`;
      params.push(maxViews);
    }

    if (startDate) {
      sql += ` AND created_at >= $${++paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      sql += ` AND created_at <= $${++paramCount}`;
      params.push(endDate + ' 23:59:59'); // Include full end date
    }

    // Add sorting
    const allowedSortFields = ['title', 'created_at', 'updated_at', 'published_date', 'views', 'topics'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder) ? sortOrder : 'DESC';
    
    sql += ` ORDER BY ${validSortBy} ${validSortOrder}`;
    
    sql += ` LIMIT $${++paramCount} OFFSET $${++paramCount}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    const articles = result.rows.map(transformArticleFromDb);
    return this.populateTopicNames(articles);
  }

  /**
   * Populate topic names from topic IDs
   */
  private async populateTopicNames(articles: Article[]): Promise<Article[]> {
    if (articles.length === 0) return articles;

    // Get all unique topic IDs from articles
    const allTopicIds = new Set<string>();
    articles.forEach(article => {
      article.topics.forEach(topicId => allTopicIds.add(topicId));
    });

    // Fetch all topics at once
    const topics = await this.topicRepository.findAll();
    const topicMap = new Map(topics.map(topic => [topic.id, topic.name]));

    // Replace topic IDs with topic names
    return articles.map(article => ({
      ...article,
      topics: article.topics.map(topicId => topicMap.get(topicId) || topicId)
    }));
  }

  /**
   * Find article by ID
   */
  async findById(id: string): Promise<Article | null> {
    const result = await query(
      'SELECT * FROM articles WHERE id = $1',
      [id]
    );

    if (!result.rows[0]) return null;
    
    const article = transformArticleFromDb(result.rows[0]);
    const [populatedArticle] = await this.populateTopicNames([article]);
    return populatedArticle || null;
  }

  /**
   * Find article by slug and optionally increment views
   */
  async findBySlug(slug: string, incrementViews = false): Promise<Article | null> {
    // Use a transaction to get article and increment views atomically
    if (incrementViews) {
      const result = await query(
        `UPDATE articles 
         SET views = views + 1 
         WHERE slug = $1 AND published = TRUE 
         RETURNING *`,
        [slug]
      );
      if (!result.rows[0]) return null;
      const article = transformArticleFromDb(result.rows[0]);
      const [populatedArticle] = await this.populateTopicNames([article]);
      return populatedArticle || null;
    }

    const result = await query(
      'SELECT * FROM articles WHERE slug = $1 AND published = TRUE',
      [slug]
    );
    if (!result.rows[0]) return null;
    const article = transformArticleFromDb(result.rows[0]);
    const [populatedArticle] = await this.populateTopicNames([article]);
    return populatedArticle || null;
  }

  /**
   * Get popular articles (highest views)
   */
  async findPopular(limit = 3): Promise<Article[]> {
    const result = await query(
      `SELECT * FROM articles 
       WHERE published = TRUE 
       ORDER BY views DESC, created_at DESC 
       LIMIT $1`,
      [limit]
    );

    const articles = result.rows.map(transformArticleFromDb);
    return this.populateTopicNames(articles);
  }

  /**
   * Get recent articles
   */
  async findRecent(limit = 10): Promise<Article[]> {
    const result = await query(
      `SELECT * FROM articles 
       WHERE published = TRUE 
       ORDER BY created_at DESC 
       LIMIT $1`,
      [limit]
    );

    const articles = result.rows.map(transformArticleFromDb);
    return this.populateTopicNames(articles);
  }

  /**
   * Create a new article
   */
  async create(article: Partial<DatabaseArticle>): Promise<Article> {
    const result = await query(
      `INSERT INTO articles (
        title, slug, content, summary, author, topics, 
        cover_photo, cover_photo_caption, tags, published_date, published, views
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
      RETURNING *`,
      [
        article.title,
        article.slug,
        article.content,
        article.summary ?? null,
        article.author ?? null,
        article.topics,
        article.cover_photo ?? null,
        article.cover_photo_caption ?? null,
        article.tags ?? [],
        article.published_date ?? new Date(),
        article.published ?? true,
        0
      ]
    );

    const newArticle = transformArticleFromDb(result.rows[0]);
    const [populatedArticle] = await this.populateTopicNames([newArticle]);
    return populatedArticle || newArticle;
  }

  /**
   * Update an article
   */
  async update(id: string, updates: Partial<DatabaseArticle>): Promise<Article | null> {
    const fields: string[] = [];
    const values: (string | number | boolean | string[] | null)[] = [];
    let paramCount = 1;

    // Build dynamic UPDATE query
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id') {
        fields.push(`${key} = $${paramCount++}`);
        values.push(value);
      }
    });

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const sql = `
      UPDATE articles 
      SET ${fields.join(', ')}, updated_at = NOW() 
      WHERE id = $${paramCount} 
      RETURNING *
    `;

    const result = await query(sql, values);
    if (!result.rows[0]) return null;
    const article = transformArticleFromDb(result.rows[0]);
    const [populatedArticle] = await this.populateTopicNames([article]);
    return populatedArticle || null;
  }

  /**
   * Delete an article (soft delete by setting published = false)
   */
  async delete(id: string): Promise<boolean> {
    const result = await query(
      'UPDATE articles SET published = FALSE WHERE id = $1',
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Hard delete article from database
   */
  async hardDelete(id: string): Promise<boolean> {
    const result = await query(
      'DELETE FROM articles WHERE id = $1',
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Count total articles
   */
  async count(filters: ArticleFilters = {}): Promise<number> {
    const { 
      topics, 
      search, 
      published, 
      minViews, 
      maxViews, 
      startDate, 
      endDate 
    } = filters;
    
    let sql = 'SELECT COUNT(*) as count FROM articles WHERE 1=1';
    const params: (string | string[] | number | boolean)[] = [];
    let paramCount = 0;

    if (published !== undefined) {
      sql += ` AND published = $${++paramCount}`;
      params.push(published);
    }

    if (topics && topics.length > 0) {
      sql += ` AND topics && $${++paramCount}::uuid[]`;
      params.push(topics);
    }

    if (search) {
      sql += ` AND (title ILIKE $${++paramCount} OR content ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (minViews !== undefined) {
      sql += ` AND views >= $${++paramCount}`;
      params.push(minViews);
    }

    if (maxViews !== undefined) {
      sql += ` AND views <= $${++paramCount}`;
      params.push(maxViews);
    }

    if (startDate) {
      sql += ` AND created_at >= $${++paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      sql += ` AND created_at <= $${++paramCount}`;
      params.push(endDate + ' 23:59:59');
    }

    const result = await query(sql, params);
    return parseInt(result.rows[0].count);
  }
}