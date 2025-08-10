import { Router } from 'express';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { ArticleRepository } from './article.repository';

// Dependency injection
const repository = new ArticleRepository();
const service = new ArticleService(repository);
const controller = new ArticleController(service);

// Bind controller methods to preserve 'this' context
const boundController = {
  getAllArticles: controller.getAllArticles.bind(controller),
  getPopularArticles: controller.getPopularArticles.bind(controller),
  getRecentArticles: controller.getRecentArticles.bind(controller),
  getArticleBySlug: controller.getArticleBySlug.bind(controller),
  getArticleById: controller.getArticleById.bind(controller),
};

// Create router with public routes
export const ArticleRoutes: Router = Router();

ArticleRoutes.get('/', boundController.getAllArticles);
ArticleRoutes.get('/popular', boundController.getPopularArticles);
ArticleRoutes.get('/recent', boundController.getRecentArticles);
ArticleRoutes.get('/id/:id', boundController.getArticleById);
ArticleRoutes.get('/:slug', boundController.getArticleBySlug);