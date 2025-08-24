import { query } from '../../shared/database/connection';
import { RecentArticle } from './dashboard.service';

export class DashboardRepository {
  async getArticleStats(): Promise<{ total: number; published: number; draft: number }> {
    const result = await query(
      `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN published = true THEN 1 END) as published,
        COUNT(CASE WHEN published = false THEN 1 END) as draft
      FROM articles`
    );
    
    return {
      total: parseInt(result.rows[0].total, 10),
      published: parseInt(result.rows[0].published, 10),
      draft: parseInt(result.rows[0].draft, 10)
    };
  }

  async getViewStats(): Promise<{ total: number; average: number }> {
    const result = await query(
      `SELECT 
        COALESCE(SUM(views), 0) as total,
        COALESCE(AVG(views), 0) as average
      FROM articles`
    );
    
    return {
      total: parseInt(result.rows[0].total, 10),
      average: Math.round(parseFloat(result.rows[0].average))
    };
  }

  async getTopicCount(): Promise<number> {
    const result = await query('SELECT COUNT(*) as count FROM topics');
    return parseInt(result.rows[0].count, 10);
  }

  async getLastMonthStats(): Promise<{ articles: number; views: number }> {
    const result = await query(
      `SELECT 
        COUNT(*) as articles,
        COALESCE(SUM(views), 0) as views
      FROM articles
      WHERE created_at >= NOW() - INTERVAL '30 days'`
    );
    
    return {
      articles: parseInt(result.rows[0].articles, 10),
      views: parseInt(result.rows[0].views, 10)
    };
  }

  async getRecentArticles(limit: number): Promise<RecentArticle[]> {
    const result = await query(
      `SELECT 
        id,
        title,
        views,
        published,
        created_at,
        topics
      FROM articles
      ORDER BY created_at DESC
      LIMIT $1`,
      [limit]
    );
    
    return result.rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      views: row.views,
      published: row.published,
      createdAt: row.created_at,
      topic: row.topics && row.topics.length > 0 ? row.topics[0] : 'No Topic'
    }));
  }
}