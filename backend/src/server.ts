import express from 'express';
import cors from 'cors';
import { errorHandler, notFoundHandler } from './shared/middleware/error-handler';

const app: express.Application = express();
const PORT = parseInt(process.env.PORT || '3002', 10);

// Middleware
const allowedOrigins: string[] = [
  'http://localhost:3000', 
  'http://localhost:3001', 
  'http://localhost:3004',
  // Add your Vercel frontend URL here when deployed
  process.env.FRONTEND_URL
].filter((origin): origin is string => Boolean(origin));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? allowedOrigins 
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
    environment: process.env.NODE_ENV ?? 'development',
    port: PORT,
    version: '1.0.0'
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
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏥 Health check available at: /health`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err);
  process.exit(1);
});

export default app;