import { Pool, QueryResult } from 'pg';

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433'),
  database: process.env.DB_NAME || 'singularity_news',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'dev_password_123',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Create a single pool instance to be reused
const pool = new Pool(dbConfig);

// Log database configuration (hide password)
console.log('Database config:', {
  ...dbConfig,
  password: '***'
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