import { query } from './query';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Database initialization module
 * Executes the existing schema.sql file with safety checks
 * Modified to use CREATE TABLE IF NOT EXISTS to avoid dropping data
 */
export async function initializeDatabase(): Promise<void> {
  console.log('🔧 Initializing database schema...');
  
  try {
    // Determine schema path based on environment
    // In development: running from src/, schema is at ../../../database/schema.sql
    // In production: running from dist/, schema is at ../database/schema.sql
    const isDevelopment = __dirname.includes('/src/');
    const schemaPath = isDevelopment 
      ? path.join(__dirname, '../../../database/schema.sql')
      : path.join(__dirname, '../../database/schema.sql');
    
    console.log(`📁 Schema path: ${schemaPath} (${isDevelopment ? 'development' : 'production'} mode)`);
    
    // Check if schema file exists
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at: ${schemaPath}. Make sure 'database' folder is copied during build.`);
    }
    
    let schemaSQL = fs.readFileSync(schemaPath, 'utf-8');
    console.log(`📄 Schema file loaded, ${schemaSQL.length} characters`);
    
    // Test database connection and permissions
    await query('SELECT 1 as test');
    console.log('🔗 Database connection verified');
    
    // Check database permissions
    try {
      const permCheck = await query(`
        SELECT has_database_privilege(current_user, current_database(), 'CREATE') as can_create_objects
      `);
      console.log(`🔑 CREATE permissions: ${permCheck.rows[0].can_create_objects}`);
      
      if (!permCheck.rows[0].can_create_objects) {
        throw new Error('Database user does not have CREATE permissions');
      }
    } catch (permError: any) {
      console.error('⚠️  Could not check database permissions:', permError.message);
    }
    
    // Make the schema safe by replacing CREATE TABLE with CREATE TABLE IF NOT EXISTS
    schemaSQL = schemaSQL.replace(/CREATE TABLE\s+(\w+)/g, 'CREATE TABLE IF NOT EXISTS $1');
    
    // Also make indexes safe by replacing CREATE INDEX with CREATE INDEX IF NOT EXISTS
    schemaSQL = schemaSQL.replace(/CREATE INDEX\s+(\w+)/g, 'CREATE INDEX IF NOT EXISTS $1');
    
    // Split statements more carefully to handle functions with $$ delimiters
    const statements: string[] = [];
    let currentStatement = '';
    let inFunction = false;
    
    const lines = schemaSQL.split('\n');
    for (const line of lines) {
      // Check if we're entering or exiting a function definition
      if (line.includes('$$')) {
        inFunction = !inFunction;
      }
      
      currentStatement += line + '\n';
      
      // If we hit a semicolon and we're not inside a function, it's the end of a statement
      if (line.trim().endsWith(';') && !inFunction) {
        const stmt = currentStatement.trim();
        if (stmt.length > 0 && !stmt.startsWith('--')) {
          statements.push(stmt);
        }
        currentStatement = '';
      }
    }
    
    // Execute each statement
    let criticalErrors: string[] = [];
    for (const statement of statements) {
      try {
        await query(statement);
      } catch (error: any) {
        // Only ignore errors for objects that already exist
        if (error.message.includes('already exists')) {
          console.log(`  ℹ️  Skipped existing: ${error.message.split('"')[1] || 'object'}`);
        } else {
          // Critical errors should fail the initialization
          const errorMsg = `Failed to execute statement: ${error.message}`;
          console.error(`  ❌ ${errorMsg}`);
          criticalErrors.push(errorMsg);
        }
      }
    }
    
    // Fail if there were critical errors
    if (criticalErrors.length > 0) {
      throw new Error(`Database initialization failed with ${criticalErrors.length} critical errors:\n${criticalErrors.join('\n')}`);
    }
    
    console.log('✅ Database schema initialized from schema.sql');
    
    // Check if tables were created and verify critical tables exist
    const tableCheck = await query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `);
    
    const tableNames = tableCheck.rows.map(r => r.table_name);
    const requiredTables = ['topics', 'articles'];
    const missingTables = requiredTables.filter(table => !tableNames.includes(table));
    
    if (missingTables.length > 0) {
      throw new Error(`Critical tables are missing: ${missingTables.join(', ')}`);
    }
    
    console.log(`✅ Tables ready: ${tableNames.join(', ')}`);
    console.log('🎉 Database initialization completed successfully');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}