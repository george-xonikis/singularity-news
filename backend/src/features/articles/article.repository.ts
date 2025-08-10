import { query } from '../../shared/database/connection';
import { Article } from '@singularity-news/shared';
import { DatabaseArticle, transformArticleFromDb } from './article.mapper';

export interface ArticleFilters {
  topic?: string | undefined;
  search?: string | undefined;
  published?: boolean;
  limit?: number;
  offset?: number;
}

export class ArticleRepository {
  /**
   * Get all articles with optional filters
   * Optimized query that sorts by views for popularity
   */
  async findAll(filters: ArticleFilters = {}): Promise<Article[]> {
    const {
      topic,
      search,
      published = true,
      limit = 50,
      offset = 0
    } = filters;

    let sql = 'SELECT * FROM articles WHERE 1=1';
    const params: (string | number | boolean)[] = [];
    let paramCount = 0;

    if (published !== undefined) {
      sql += ` AND published = $${++paramCount}`;
      params.push(published);
    }

    if (topic) {
      sql += ` AND topic = $${++paramCount}`;
      params.push(topic);
    }

    if (search) {
      sql += ` AND (title ILIKE $${++paramCount} OR content ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    // Order by views first (popular), then by date
    sql += ' ORDER BY views DESC, created_at DESC';
    
    sql += ` LIMIT $${++paramCount} OFFSET $${++paramCount}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    return result.rows.map(transformArticleFromDb);
  }

  /**
   * Find article by ID
   */
  async findById(id: string): Promise<Article | null> {
    const result = await query(
      'SELECT * FROM articles WHERE id = $1',
      [id]
    );

    return result.rows[0] ? transformArticleFromDb(result.rows[0]) : null;
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
      return result.rows[0] ? transformArticleFromDb(result.rows[0]) : null;
    }

    const result = await query(
      'SELECT * FROM articles WHERE slug = $1 AND published = TRUE',
      [slug]
    );
    return result.rows[0] ? transformArticleFromDb(result.rows[0]) : null;
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

    return result.rows.map(transformArticleFromDb);
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

    return result.rows.map(transformArticleFromDb);
  }

  /**
   * Create a new article
   */
  async create(article: Partial<DatabaseArticle>): Promise<Article> {
    const result = await query(
      `INSERT INTO articles (
        title, slug, content, summary, topic, 
        cover_photo, tags, published_date, published, views
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING *`,
      [
        article.title,
        article.slug,
        article.content,
        article.summary || null,
        article.topic,
        article.cover_photo || null,
        article.tags || [],
        article.published_date || new Date(),
        article.published ?? true,
        0
      ]
    );

    return transformArticleFromDb(result.rows[0]);
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
    return result.rows[0] ? transformArticleFromDb(result.rows[0]) : null;
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
   * Count total articles
   */
  async count(filters: ArticleFilters = {}): Promise<number> {
    const { topic, search, published = true } = filters;
    
    let sql = 'SELECT COUNT(*) as count FROM articles WHERE 1=1';
    const params: (string | number | boolean)[] = [];
    let paramCount = 0;

    if (published !== undefined) {
      sql += ` AND published = $${++paramCount}`;
      params.push(published);
    }

    if (topic) {
      sql += ` AND topic = $${++paramCount}`;
      params.push(topic);
    }

    if (search) {
      sql += ` AND (title ILIKE $${++paramCount} OR content ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    const result = await query(sql, params);
    return parseInt(result.rows[0].count);
  }
}