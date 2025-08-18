import { Router } from 'express';
import { AdminArticleController } from './admin-article.controller';
import { ArticleService } from './article.service';
import { ArticleRepository } from './article.repository';

// Dependency injection
const repository = new ArticleRepository();
const service = new ArticleService(repository);
const controller = new AdminArticleController(service);

// Create router with admin routes
export const AdminArticleRoutes: Router = Router();

AdminArticleRoutes.get('/', (req, res, next) => controller.getAllArticles(req, res, next));
AdminArticleRoutes.get('/:id', (req, res, next) => controller.getArticleById(req, res, next));
AdminArticleRoutes.post('/', (req, res, next) => controller.createArticle(req, res, next));
AdminArticleRoutes.put('/:id', (req, res, next) => controller.updateArticle(req, res, next));
AdminArticleRoutes.delete('/:id', (req, res, next) => controller.deleteArticle(req, res, next));