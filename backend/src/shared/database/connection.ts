import { Pool, QueryResult } from 'pg';
import { DATABASE_CONFIG } from '../../config/env';

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
const pool = new Pool(dbConfig);

// Log database configuration (hide password)
console.log('🐘 Database config:', {
  ...dbConfig,
  password: '***'
});

// Test database connection on startup
pool.connect()
  .then(client => {
    console.log('✅ Database connected successfully');
    client.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.error('   Please check your database configuration and ensure PostgreSQL is running');
  });

/**
 * Execute a parameterized query
 * @param text - SQL query with parameters ($1, $2, etc.)
 * @param params - Array of parameter values
 * @returns Query result
 */
export async function query(text: string, params?: any[]): Promise<QueryResult> {
  try {
    return await pool.query(text, params);
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 */
export async function getClient() {
  return await pool.connect();
}

/**
 * Close all database connections
 */
export async function closePool() {
  await pool.end();
}

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});