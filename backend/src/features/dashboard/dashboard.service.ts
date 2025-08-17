import { DashboardRepository } from './dashboard.repository';

export interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalViews: number;
  averageViews: number;
  totalTopics: number;
  lastMonthArticles: number;
  lastMonthViews: number;
}

export interface RecentArticle {
  id: string;
  title: string;
  views: number;
  published: boolean;
  createdAt: string;
  topic: string;
}

export class DashboardService {
  constructor(private readonly repository: DashboardRepository) {}

  async getStats(): Promise<DashboardStats> {
    const [
      articleStats,
      viewStats,
      topicCount,
      lastMonthStats
    ] = await Promise.all([
      this.repository.getArticleStats(),
      this.repository.getViewStats(),
      this.repository.getTopicCount(),
      this.repository.getLastMonthStats()
    ]);

    return {
      totalArticles: articleStats.total,
      publishedArticles: articleStats.published,
      draftArticles: articleStats.draft,
      totalViews: viewStats.total,
      averageViews: viewStats.average,
      totalTopics: topicCount,
      lastMonthArticles: lastMonthStats.articles,
      lastMonthViews: lastMonthStats.views
    };
  }

  async getRecentArticles(limit: number = 5): Promise<RecentArticle[]> {
    return this.repository.getRecentArticles(limit);
  }
}