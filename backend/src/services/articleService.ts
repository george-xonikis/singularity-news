import { query } from '../lib/database';
import { Article, CreateArticleInput, UpdateArticleInput } from '@singularity-news/shared';
import { transformArticleFromDb } from '../utils/dataTransform';

export class ArticleService {
  async getAllArticles(limit = 50, offset = 0): Promise<Article[]> {
    const result = await query(
      'SELECT * FROM articles WHERE published = TRUE ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    return result.rows.map(transformArticleFromDb);
  }

  async getArticleById(id: string): Promise<Article | null> {
    const result = await query(
      'SELECT * FROM articles WHERE id = $1 AND published = TRUE',
      [id]
    );

    return result.rows[0] ? transformArticleFromDb(result.rows[0]) : null;
  }

  async getArticlesByTopic(topic: string, limit = 50, offset = 0): Promise<Article[]> {
    const result = await query(
      'SELECT * FROM articles WHERE topic = $1 AND published = TRUE ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [topic, limit, offset]
    );

    return result.rows.map(transformArticleFromDb);
  }

  async searchArticles(searchQuery: string, limit = 50, offset = 0): Promise<Article[]> {
    const result = await query(
      `SELECT * FROM articles 
       WHERE published = TRUE 
       AND (title ILIKE $1 OR content ILIKE $1)
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [`%${searchQuery}%`, limit, offset]
    );

    return result.rows.map(transformArticleFromDb);
  }

  async createArticle(articleData: CreateArticleInput & { published?: boolean }): Promise<Article> {
    const result = await query(
      `INSERT INTO articles (title, content, topic, cover_photo, published, views) 
       VALUES ($1, $2, $3, $4, $5, 0) 
       RETURNING *`,
      [
        articleData.title,
        articleData.content,
        articleData.topic,
        articleData.coverPhoto || null,
        (articleData as any).published ?? true
      ]
    );

    return transformArticleFromDb(result.rows[0]);
  }

  async updateArticle(id: string, updates: UpdateArticleInput & { published?: boolean }): Promise<Article | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.title !== undefined) {
      fields.push(`title = $${paramCount++}`);
      values.push(updates.title);
    }
    if (updates.content !== undefined) {
      fields.push(`content = $${paramCount++}`);
      values.push(updates.content);
    }
    if (updates.topic !== undefined) {
      fields.push(`topic = $${paramCount++}`);
      values.push(updates.topic);
    }
    if (updates.coverPhoto !== undefined) {
      fields.push(`cover_photo = $${paramCount++}`);
      values.push(updates.coverPhoto);
    }
    if ((updates as any).published !== undefined) {
      fields.push(`published = $${paramCount++}`);
      values.push((updates as any).published);
    }

    if (fields.length === 0) {
      // No fields to update, return current article
      return this.getArticleById(id);
    }

    // Add updated_at field
    fields.push(`updated_at = NOW()`);
    values.push(id); // Add ID as the last parameter

    const result = await query(
      `UPDATE articles SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] ? transformArticleFromDb(result.rows[0]) : null;
  }

  async deleteArticle(id: string): Promise<boolean> {
    const result = await query('DELETE FROM articles WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async incrementViews(id: string): Promise<void> {
    await query('SELECT increment_article_views($1)', [id]);
  }
}