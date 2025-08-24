import { Pool } from 'pg';
import { DATABASE_CONFIG } from '../../config/env';

/**
 * Database connection pool
 * Single instance to be reused across the application
 */

// Database configuration from environment variables
const dbConfig = {
  host: DATABASE_CONFIG.HOST,
  port: DATABASE_CONFIG.PORT,
  database: DATABASE_CONFIG.NAME,
  user: DATABASE_CONFIG.USER,
  password: DATABASE_CONFIG.PASSWORD,
  max: DATABASE_CONFIG.MAX_CONNECTIONS,
  idleTimeoutMillis: DATABASE_CONFIG.IDLE_TIMEOUT,
  connectionTimeoutMillis: DATABASE_CONFIG.CONNECTION_TIMEOUT,
};

// Create a single pool instance to be reused
export const pool = new Pool(dbConfig);

// Log database configuration (hide password)
console.log('🐘 Database config:', {
  ...dbConfig,
  password: '***'
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});