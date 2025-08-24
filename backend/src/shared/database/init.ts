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
    
    // Make triggers safe by adding DROP IF EXISTS before CREATE TRIGGER
    schemaSQL = schemaSQL.replace(
      /CREATE TRIGGER\s+(\w+)/g, 
      'DROP TRIGGER IF EXISTS $1 ON articles;\nCREATE TRIGGER $1'
    );
    
    console.log('🔍 First few CREATE statements after replacement:');
    const createStatements = schemaSQL.match(/CREATE\s+(TABLE|INDEX)\s+[^\n]*/gi) || [];
    createStatements.slice(0, 3).forEach((stmt, i) => {
      console.log(`  ${i + 1}. ${stmt}`);
    });
    
    // Split statements more carefully to handle functions with $$ delimiters
    const statements: string[] = [];
    let currentStatement = '';
    let inFunction = false;
    let dollarCount = 0;
    
    const lines = schemaSQL.split('\n');
    for (const line of lines) {
      // Skip comment lines
      if (line.trim().startsWith('--') || line.trim() === '') {
        continue;
      }
      
      // Count $$ occurrences to track function boundaries more accurately
      const dollarsInLine = (line.match(/\$\$/g) || []).length;
      dollarCount += dollarsInLine;
      
      // We're in a function if we have an odd number of $$ markers
      inFunction = (dollarCount % 2) !== 0;
      
      currentStatement += line + '\n';
      
      // If we hit a semicolon and we're not inside a function, it's the end of a statement
      if (line.trim().endsWith(';') && !inFunction) {
        const stmt = currentStatement.trim();
        if (stmt.length > 0) {
          statements.push(stmt);
          console.log(`📝 Parsed statement (${stmt.split('\n')[0]}...)`);
        }
        currentStatement = '';
      }
    }
    
    // Add any remaining statement
    if (currentStatement.trim().length > 0) {
      statements.push(currentStatement.trim());
    }
    
    console.log(`📊 Total statements parsed: ${statements.length}`);
    
    // Execute each statement
    let criticalErrors: string[] = [];
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (!statement) {
        console.log(`  ⚠️  Skipping empty statement at index ${i + 1}`);
        continue;
      }
      
      const statementPreview = statement.split('\n')[0]?.substring(0, 80) || '';
      
      try {
        console.log(`🔄 Executing statement ${i + 1}/${statements.length}: ${statementPreview}...`);
        const startTime = Date.now();
        await query(statement);
        const duration = Date.now() - startTime;
        console.log(`  ✅ Success (${duration}ms)`);
      } catch (error: any) {
        // Only ignore errors for objects that already exist
        if (error.message.includes('already exists') || error.code === '42710') {
          const objectName = error.message.split('"')[1] || 'object';
          console.log(`  ℹ️  Skipped existing: ${objectName} (code: ${error.code})`);
        } else {
          // Critical errors should fail the initialization
          const errorMsg = `Statement ${i + 1} failed: ${error.message} (code: ${error.code})`;
          console.error(`  ❌ ${errorMsg}`);
          console.error(`  📄 Statement was: ${statementPreview}...`);
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
    console.log('🔍 Verifying database state...');
    const tableCheck = await query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    const tableNames = tableCheck.rows.map(r => r.table_name);
    const requiredTables = ['topics', 'articles'];
    const missingTables = requiredTables.filter(table => !tableNames.includes(table));
    
    console.log(`📋 Found ${tableNames.length} tables: ${tableNames.join(', ')}`);
    console.log(`🎯 Required tables: ${requiredTables.join(', ')}`);
    
    if (missingTables.length > 0) {
      console.error(`❌ Missing critical tables: ${missingTables.join(', ')}`);
      throw new Error(`Critical tables are missing: ${missingTables.join(', ')}`);
    }
    
    // Check indexes
    const indexCheck = await query(`
      SELECT indexname FROM pg_indexes 
      WHERE schemaname = 'public' 
      ORDER BY indexname
    `);
    const indexNames = indexCheck.rows.map(r => r.indexname);
    console.log(`📊 Found ${indexNames.length} indexes: ${indexNames.slice(0, 5).join(', ')}${indexNames.length > 5 ? '...' : ''}`);
    
    console.log(`✅ Database verification complete - All required tables exist`);
    console.log('🎉 Database initialization completed successfully');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}