import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DashboardRepository } from './dashboard.repository';

// Dependency injection
const repository = new DashboardRepository();
const service = new DashboardService(repository);
const controller = new DashboardController(service);

// Create router
export const DashboardRoutes: Router = Router();

DashboardRoutes.get('/stats', (req, res) => controller.getStats(req, res));
DashboardRoutes.get('/recent-articles', (req, res) => controller.getRecentArticles(req, res));