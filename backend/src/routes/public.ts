import { Router } from 'express';
import { ArticleRoutes } from '../features/articles/article.routes';
import { TopicRoutes } from '../features/topics/topic.routes';

const router: Router = Router();

// Mount feature-based public routes
router.use('/articles', ArticleRoutes);
router.use('/topics', TopicRoutes);

export default router;