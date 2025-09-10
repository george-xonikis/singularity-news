-- Simple SQL-based migration runner
-- This creates the migrations table and runs all migrations in order

-- Create migrations table if it doesn't exist
CREATE TABLE IF NOT EXISTS migrations (
  id SERIAL PRIMARY KEY,
  migration_name VARCHAR(255) NOT NULL UNIQUE,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_migrations_name ON migrations(migration_name);

-- Run migration 001 if not already applied
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM migrations WHERE migration_name = '001_create_migrations_table') THEN
    -- Migration already handled by table creation above
    INSERT INTO migrations (migration_name) VALUES ('001_create_migrations_table');
    RAISE NOTICE 'Applied migration: 001_create_migrations_table';
  ELSE
    RAISE NOTICE 'Skipping migration: 001_create_migrations_table (already applied)';
  END IF;
END $$;

-- Run migration 002 if not already applied
DO $$
DECLARE
    topic_record RECORD;
    topic_text TEXT;
    topic_id UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM migrations WHERE migration_name = '002_migrate_topics_to_ids') THEN
    RAISE NOTICE 'Running migration: 002_migrate_topics_to_ids';
    
    -- Check if topics column is already UUID[] type
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'articles' 
      AND column_name = 'topics' 
      AND udt_name = '_uuid'
    ) THEN
      RAISE NOTICE 'Topics already migrated to UUID[], skipping conversion';
    ELSE
      -- Create temporary table for mappings
      CREATE TEMP TABLE topic_mappings (
          name TEXT PRIMARY KEY,
          id UUID NOT NULL
      );
      
      -- Insert all unique topic names and their corresponding IDs
      FOR topic_record IN 
          SELECT DISTINCT unnest(topics) as topic_name FROM articles
      LOOP
          -- Check if topic exists
          SELECT id INTO topic_id FROM topics WHERE name = topic_record.topic_name;
          
          IF topic_id IS NULL THEN
              -- Create the topic if it doesn't exist
              INSERT INTO topics (name, slug) 
              VALUES (topic_record.topic_name, lower(replace(topic_record.topic_name, ' ', '-')))
              RETURNING id INTO topic_id;
          END IF;
          
          -- Store the mapping
          INSERT INTO topic_mappings (name, id) VALUES (topic_record.topic_name, topic_id)
          ON CONFLICT (name) DO NOTHING;
      END LOOP;
      
      -- Add new UUID column
      ALTER TABLE articles ADD COLUMN topics_new UUID[];
      
      -- Convert data
      UPDATE articles SET topics_new = (
          SELECT ARRAY_AGG(tm.id)
          FROM unnest(articles.topics) AS topic_name
          JOIN topic_mappings tm ON tm.name = topic_name
      );
      
      -- Replace old column
      ALTER TABLE articles DROP COLUMN topics;
      ALTER TABLE articles RENAME COLUMN topics_new TO topics;
      ALTER TABLE articles ALTER COLUMN topics SET DEFAULT '{}';
      ALTER TABLE articles ALTER COLUMN topics SET NOT NULL;
      
      -- Add validation function
      CREATE OR REPLACE FUNCTION validate_topic_ids(topic_ids UUID[])
      RETURNS BOOLEAN AS $validate$
      BEGIN
          RETURN NOT EXISTS (
              SELECT 1 
              FROM unnest(topic_ids) AS topic_id
              WHERE topic_id NOT IN (SELECT id FROM topics)
          );
      END;
      $validate$ LANGUAGE plpgsql;
      
      -- Add constraint
      ALTER TABLE articles ADD CONSTRAINT articles_topics_exist 
          CHECK (validate_topic_ids(topics));
    END IF;
    
    -- Record migration as applied
    INSERT INTO migrations (migration_name) VALUES ('002_migrate_topics_to_ids');
    RAISE NOTICE 'Applied migration: 002_migrate_topics_to_ids';
  ELSE
    RAISE NOTICE 'Skipping migration: 002_migrate_topics_to_ids (already applied)';
  END IF;
END $$;

-- Show migration status
SELECT 'Migration completed. Applied migrations:' as status;
SELECT migration_name, applied_at FROM migrations ORDER BY applied_at;