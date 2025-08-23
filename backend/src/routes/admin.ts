import { Router } from 'express';
import { AdminArticleRoutes } from '../features/articles/admin-article.routes';
import { AdminTopicRoutes } from '../features/topics/admin-topic.routes';
import { DashboardRoutes } from '../features/dashboard/dashboard.routes';

const router: Router = Router();

// Mount feature-based admin routes
router.use('/dashboard', DashboardRoutes);
router.use('/articles', AdminArticleRoutes);
router.use('/topics', AdminTopicRoutes);

export default router;