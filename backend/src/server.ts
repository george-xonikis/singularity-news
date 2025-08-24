import express from 'express';
import cors from 'cors';
import { errorHandler, notFoundHandler } from './shared/middleware/error-handler';
import { SERVER_CONFIG, CORS_CONFIG, PORT, FRONTEND_URL } from './config/env';

const app: express.Application = express();

// Middleware
app.use(cors({
  origin: SERVER_CONFIG.IS_PRODUCTION 
    ? CORS_CONFIG.ALLOWED_ORIGINS 
    : true, // Allow all origins in development
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
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: SERVER_CONFIG.NODE_ENV,
    port: PORT,
    version: '1.0.0',
    FE_Url: FRONTEND_URL
  });
});

// Public routes
import publicRouter from './routes/public';
app.use('/api', publicRouter);

// Admin routes
import adminRouter from './routes/admin';
app.use('/api/admin', adminRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📊 Environment: ${SERVER_CONFIG.NODE_ENV}`);
  console.log(`🏥 Health check available at: /health`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err);
  process.exit(1);
});

export default app;