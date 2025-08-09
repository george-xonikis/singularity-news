import express, { Router } from 'express';
import { ArticleService } from '../services/articleService';
import { CreateArticleRequest, UpdateArticleRequest } from '../types/database';

const router: Router = express.Router();
const articleService = new ArticleService();

// GET /api/articles - Get all articles
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const topic = req.query.topic as string;
    const search = req.query.search as string;

    let articles;
    
    if (search) {
      articles = await articleService.searchArticles(search, limit, offset);
    } else if (topic) {
      articles = await articleService.getArticlesByTopic(topic, limit, offset);
    } else {
      articles = await articleService.getAllArticles(limit, offset);
    }

    res.json(articles);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch articles',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/articles/:id - Get article by ID
router.get('/:id', async (req, res) => {
  try {
    const article = await articleService.getArticleById(req.params.id);
    
    if (!article) {
      res.status(404).json({
        error: 'Article not found'
      });
      return;
    }

    // Increment view count
    await articleService.incrementViews(req.params.id);

    res.json(article);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch article',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/articles - Create new article
router.post('/', async (req, res) => {
  try {
    const articleData: CreateArticleRequest = req.body;
    
    // Basic validation
    if (!articleData.title || !articleData.content || !articleData.topic) {
      res.status(400).json({
        error: 'Missing required fields',
        message: 'Title, content, and topic are required'
      });
      return;
    }

    const article = await articleService.createArticle(articleData);
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create article',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/articles/:id - Update article
router.put('/:id', async (req, res) => {
  try {
    const updates: UpdateArticleRequest = req.body;
    const article = await articleService.updateArticle(req.params.id, updates);
    
    if (!article) {
      res.status(404).json({
        error: 'Article not found'
      });
      return;
    }

    res.json(article);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update article',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/articles/:id - Delete article
router.delete('/:id', async (req, res) => {
  try {
    await articleService.deleteArticle(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete article',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;