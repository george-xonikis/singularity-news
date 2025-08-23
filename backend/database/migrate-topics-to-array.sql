-- Migration script to convert single topic field to topics array
-- Run this script to migrate existing data

BEGIN;

-- Add the new topics array column
ALTER TABLE articles ADD COLUMN topics_new TEXT[] NOT NULL DEFAULT '{}';

-- Migrate existing topic data to topics array
UPDATE articles 
SET topics_new = ARRAY[topic] 
WHERE topic IS NOT NULL AND topic != '';

-- Drop the old foreign key constraint (if it exists)
ALTER TABLE articles DROP CONSTRAINT IF EXISTS fk_articles_topic;

-- Drop the old topic column
ALTER TABLE articles DROP COLUMN topic;

-- Rename the new column to topics
ALTER TABLE articles RENAME COLUMN topics_new TO topics;

-- Add constraint to ensure topics array is not empty
ALTER TABLE articles ADD CONSTRAINT chk_articles_topics_not_empty 
  CHECK (array_length(topics, 1) > 0);

-- Drop old index and create new GIN index for array operations
DROP INDEX IF EXISTS idx_articles_topic;
CREATE INDEX idx_articles_topics ON articles USING gin(topics);

COMMIT;