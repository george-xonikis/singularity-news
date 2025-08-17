import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DashboardRepository } from './dashboard.repository';

// Dependency injection
const repository = new DashboardRepository();
const service = new DashboardService(repository);
const controller = new DashboardController(service);

// Bind controller methods
const boundController = {
  getStats: controller.getStats.bind(controller),
  getRecentArticles: controller.getRecentArticles.bind(controller)
};

// Create router
export const DashboardRoutes: Router = Router();

DashboardRoutes.get('/stats', boundController.getStats);
DashboardRoutes.get('/recent-articles', boundController.getRecentArticles);