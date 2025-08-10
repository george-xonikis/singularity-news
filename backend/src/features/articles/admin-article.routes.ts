import { Router } from 'express';
import { AdminArticleController } from './admin-article.controller';
import { ArticleService } from './article.service';
import { ArticleRepository } from './article.repository';

// Dependency injection
const repository = new ArticleRepository();
const service = new ArticleService(repository);
const controller = new AdminArticleController(service);

// Bind controller methods to preserve 'this' context
const boundController = {
  getAllArticles: controller.getAllArticles.bind(controller),
  getArticleById: controller.getArticleById.bind(controller),
  createArticle: controller.createArticle.bind(controller),
  updateArticle: controller.updateArticle.bind(controller),
  deleteArticle: controller.deleteArticle.bind(controller),
};

// Create router with admin routes
export const AdminArticleRoutes: Router = Router();

AdminArticleRoutes.get('/', boundController.getAllArticles);
AdminArticleRoutes.get('/:id', boundController.getArticleById);
AdminArticleRoutes.post('/', boundController.createArticle);
AdminArticleRoutes.put('/:id', boundController.updateArticle);
AdminArticleRoutes.delete('/:id', boundController.deleteArticle);