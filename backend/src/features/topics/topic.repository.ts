import { query } from '../../shared/database/connection';
import { Topic } from '@singularity-news/shared';
import { DatabaseTopic, transformTopicFromDb } from './topic.mapper';

export class TopicRepository {
  /**
   * Get all topics ordered by name
   */
  async findAll(): Promise<Topic[]> {
    const result = await query('SELECT * FROM topics ORDER BY name');
    return result.rows.map(transformTopicFromDb);
  }

  /**
   * Find topic by ID
   */
  async findById(id: string): Promise<Topic | null> {
    const result = await query('SELECT * FROM topics WHERE id = $1', [id]);
    return result.rows[0] ? transformTopicFromDb(result.rows[0]) : null;
  }

  /**
   * Find topic by slug
   */
  async findBySlug(slug: string): Promise<Topic | null> {
    const result = await query('SELECT * FROM topics WHERE slug = $1', [slug]);
    return result.rows[0] ? transformTopicFromDb(result.rows[0]) : null;
  }

  /**
   * Find topic by name (for uniqueness check)
   */
  async findByName(name: string): Promise<Topic | null> {
    const result = await query('SELECT * FROM topics WHERE name = $1', [name]);
    return result.rows[0] ? transformTopicFromDb(result.rows[0]) : null;
  }

  /**
   * Create a new topic
   */
  async create(topic: Partial<DatabaseTopic>): Promise<Topic> {
    const result = await query(
      'INSERT INTO topics (name, slug) VALUES ($1, $2) RETURNING *',
      [topic.name, topic.slug]
    );

    return transformTopicFromDb(result.rows[0]);
  }

  /**
   * Update a topic
   */
  async update(id: string, updates: Partial<DatabaseTopic>): Promise<Topic | null> {
    const fields: string[] = [];
    const values: (string | number | boolean | null)[] = [];
    let paramCount = 1;

    // Build dynamic UPDATE query
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id') {
        fields.push(`${key} = $${paramCount++}`);
        values.push(value as string);
      }
    });

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const sql = `
      UPDATE topics 
      SET ${fields.join(', ')} 
      WHERE id = $${paramCount} 
      RETURNING *
    `;

    const result = await query(sql, values);
    return result.rows[0] ? transformTopicFromDb(result.rows[0]) : null;
  }

  /**
   * Delete a topic
   */
  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM topics WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Count total topics
   */
  async count(): Promise<number> {
    const result = await query('SELECT COUNT(*) as count FROM topics');
    return parseInt(result.rows[0].count);
  }

  /**
   * Check if a topic has associated articles
   */
  async hasArticles(topicName: string): Promise<boolean> {
    const result = await query(
      'SELECT COUNT(*) as count FROM articles WHERE topic = $1',
      [topicName]
    );
    return parseInt(result.rows[0].count) > 0;
  }
}