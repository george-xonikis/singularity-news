import { QueryResult } from 'pg';
import { pool } from './pool';

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