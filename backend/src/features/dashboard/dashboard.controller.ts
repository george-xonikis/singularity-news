import { Request, Response } from 'express';
import { DashboardService } from './dashboard.service';

export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  async getStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.dashboardService.getStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch dashboard statistics'
      });
    }
  }

  async getRecentArticles(_req: Request, res: Response): Promise<void> {
    try {
      const articles = await this.dashboardService.getRecentArticles();
      res.json({ success: true, data: articles });
    } catch (error) {
      console.error('Error fetching recent articles:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch recent articles'
      });
    }
  }
}