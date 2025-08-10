import { Router } from 'express';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { ArticleRepository } from './article.repository';

export function createArticleRoutes(): Router {
  const router = Router();
  
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
    createArticle: controller.createArticle.bind(controller),
    updateArticle: controller.updateArticle.bind(controller),
    deleteArticle: controller.deleteArticle.bind(controller),
  };

  // Define routes
  router.get('/', boundController.getAllArticles);
  router.get('/popular', boundController.getPopularArticles);
  router.get('/recent', boundController.getRecentArticles);
  router.get('/id/:id', boundController.getArticleById);
  router.get('/:slug', boundController.getArticleBySlug);
  router.post('/', boundController.createArticle);
  router.put('/:id', boundController.updateArticle);
  router.delete('/:id', boundController.deleteArticle);

  return router;
}