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
    // Read the schema file
    const schemaPath = path.join(__dirname, '../../../database/schema.sql');
    let schemaSQL = fs.readFileSync(schemaPath, 'utf-8');
    
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
    for (const statement of statements) {
      try {
        await query(statement);
      } catch (error: any) {
        // Ignore errors for already existing objects
        if (!error.message.includes('already exists')) {
          console.error(`  ⚠️  Failed to execute statement:`, error.message.substring(0, 100));
        }
      }
    }
    
    console.log('✅ Database schema initialized from schema.sql');
    
    // Check if tables were created
    const tableCheck = await query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `);
    
    console.log(`✅ Tables ready: ${tableCheck.rows.map(r => r.table_name).join(', ')}`);
    console.log('🎉 Database initialization completed successfully');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}