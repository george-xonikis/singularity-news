import { Client } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function runMigrations() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is not set');
    console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('DATABASE') || key.includes('PG')));
    process.exit(1);
  }

  console.warn(`Connecting to database: ${databaseUrl.substring(0, 20)}...`);
  
  const client = new Client({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.warn('Connected to database');

    // Read migration SQL file
    const migrationPath = join(__dirname, '..', '..', 'database', 'run-migrations.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    console.warn('Running database migrations...');
    await client.query(migrationSQL);
    console.warn('✅ Database migrations completed successfully');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();