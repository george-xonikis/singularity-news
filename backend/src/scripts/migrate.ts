import { Client } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

async function runMigrations() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
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