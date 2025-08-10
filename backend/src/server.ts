import express from 'express';
import cors from 'cors';
import { createArticleRoutes } from './features/articles/article.routes';
import { createTopicRoutes } from './features/topics/topic.routes';
import { errorHandler, notFoundHandler } from './shared/middleware/error-handler';

const app: express.Application = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3004'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Feature routes
app.use('/api/articles', createArticleRoutes());
app.use('/api/topics', createTopicRoutes());

// Temporary fallback to old routes for non-refactored endpoints
import adminRouter from './routes/admin';
app.use('/api/admin', adminRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;