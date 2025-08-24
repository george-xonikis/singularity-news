import { BE_API_URL } from '@/config/env';

const API_BASE_URL = BE_API_URL;

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
  static async getStats(): Promise<DashboardStats> {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }
    const data = await response.json();
    return data.data;
  }

  static async getRecentArticles(): Promise<RecentArticle[]> {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/recent-articles`);
    if (!response.ok) {
      throw new Error('Failed to fetch recent articles');
    }
    const data = await response.json();
    return data.data;
  }
}