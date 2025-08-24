import { pool } from './pool';
import { initializeDatabase } from './init';

/**
 * Database connection and initialization module
 * Handles database connectivity testing and schema initialization
 */

// Test database connection and initialize schema on startup
pool.connect()
  .then(async (client) => {
    console.log('✅ Database connected successfully');
    client.release();
    
    // Initialize database schema (create tables, indexes, functions if not exists)
    await initializeDatabase();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.error('   Please check your database configuration and ensure PostgreSQL is running');
  });

// Re-export query functions for backward compatibility (deprecated)
export { query, getClient, closePool } from './query';