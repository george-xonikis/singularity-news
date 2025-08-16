-- Migration to add author column to articles table
-- Date: 2025-08-16

-- Add author column to articles table
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS author VARCHAR(200);

-- Add comment for documentation
COMMENT ON COLUMN articles.author IS 'Article author name';

-- Set default author for existing articles
UPDATE articles 
SET author = 'Editorial Team' 
WHERE author IS NULL;