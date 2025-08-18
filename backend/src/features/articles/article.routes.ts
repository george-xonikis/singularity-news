import { Router } from 'express';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { ArticleRepository } from './article.repository';

// Dependency injection
const repository = new ArticleRepository();
const service = new ArticleService(repository);
const controller = new ArticleController(service);

// Create router with public routes
export const ArticleRoutes: Router = Router();

ArticleRoutes.get('/', (req, res, next) => controller.getAllArticles(req, res, next));
ArticleRoutes.get('/popular', (req, res, next) => controller.getPopularArticles(req, res, next));
ArticleRoutes.get('/recent', (req, res, next) => controller.getRecentArticles(req, res, next));
ArticleRoutes.get('/id/:id', (req, res, next) => controller.getArticleById(req, res, next));
ArticleRoutes.get('/:slug', (req, res, next) => controller.getArticleBySlug(req, res, next));