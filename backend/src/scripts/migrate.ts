import { Client } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

async function runMigrations() {
  // Railway provides DATABASE_URL directly, no need for dotenv in production
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is not set');
    console.error('Available env vars:', Object.keys(process.env).filter(key => 
      key.includes('DATABASE') || key.includes('PG') || key.includes('RAILWAY')
    ));
    console.error('NODE_ENV:', process.env.NODE_ENV);
    process.exit(1);
  }

  console.warn(`Connecting to database: ${databaseUrl.substring(0, 30)}...`);
  console.warn('NODE_ENV:', process.env.NODE_ENV);
  
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