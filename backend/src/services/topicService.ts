import { query } from '../lib/database';
import { Topic } from '@singularity-news/shared';
import { transformTopicFromDb } from '../utils/dataTransform';

interface CreateTopicRequest {
  name: string;
  slug: string;
}

export class TopicService {
  async getAllTopics(): Promise<Topic[]> {
    const result = await query('SELECT * FROM topics ORDER BY name');
    return result.rows.map(transformTopicFromDb);
  }

  async getTopicById(id: string): Promise<Topic | null> {
    const result = await query('SELECT * FROM topics WHERE id = $1', [id]);
    return result.rows[0] ? transformTopicFromDb(result.rows[0]) : null;
  }

  async getTopicBySlug(slug: string): Promise<Topic | null> {
    const result = await query('SELECT * FROM topics WHERE slug = $1', [slug]);
    return result.rows[0] ? transformTopicFromDb(result.rows[0]) : null;
  }

  async createTopic(topicData: CreateTopicRequest): Promise<Topic> {
    const result = await query(
      'INSERT INTO topics (name, slug) VALUES ($1, $2) RETURNING *',
      [topicData.name, topicData.slug]
    );

    return transformTopicFromDb(result.rows[0]);
  }

  async deleteTopic(id: string): Promise<boolean> {
    const result = await query('DELETE FROM topics WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}