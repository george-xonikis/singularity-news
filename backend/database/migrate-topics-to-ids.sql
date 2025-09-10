-- Migration: Convert topics from TEXT[] to UUID[]
-- This migration changes the articles.topics column from storing topic names to storing topic IDs

-- Step 1: Add a temporary column for topic IDs
ALTER TABLE articles ADD COLUMN topic_ids UUID[] DEFAULT '{}';

-- Step 2: Populate the new column with topic IDs based on current topic names
UPDATE articles a
SET topic_ids = (
  SELECT ARRAY_AGG(t.id)
  FROM topics t
  WHERE t.name = ANY(a.topics::text[])
);

-- Step 3: Drop the old topics column
ALTER TABLE articles DROP COLUMN topics;

-- Step 4: Rename the new column to topics
ALTER TABLE articles RENAME COLUMN topic_ids TO topics;

-- Step 5: Update the comment to reflect the change
COMMENT ON COLUMN articles.topics IS 'Array of topic IDs (references topics.id)';

-- Step 6: Recreate the GIN index for the new column
DROP INDEX IF EXISTS idx_articles_topics;
CREATE INDEX idx_articles_topics ON articles USING gin(topics);

-- Step 7: Add a function to validate topic IDs exist (optional but recommended)
CREATE OR REPLACE FUNCTION validate_topic_ids(topic_ids UUID[])
RETURNS BOOLEAN AS $$
DECLARE
  valid_count INTEGER;
  array_length INTEGER;
BEGIN
  array_length := array_length(topic_ids, 1);
  
  IF array_length IS NULL OR array_length = 0 THEN
    RETURN TRUE; -- Empty array is valid
  END IF;
  
  SELECT COUNT(*) INTO valid_count
  FROM topics
  WHERE id = ANY(topic_ids);
  
  RETURN valid_count = array_length;
END;
$$ LANGUAGE plpgsql;

-- Step 8: Add a CHECK constraint to ensure only valid topic IDs are used
ALTER TABLE articles ADD CONSTRAINT check_valid_topic_ids 
  CHECK (validate_topic_ids(topics));

-- Display migration results
SELECT 
  'Migration completed successfully' as status,
  COUNT(*) as articles_updated,
  (SELECT COUNT(DISTINCT topic_id) FROM articles, unnest(topics) AS topic_id) as unique_topic_ids_used
FROM articles
WHERE topics IS NOT NULL AND array_length(topics, 1) > 0;