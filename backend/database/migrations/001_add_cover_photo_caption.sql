-- Migration to add cover_photo_caption column to articles table
-- Date: 2025-08-16

-- Add cover_photo_caption column to articles table
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS cover_photo_caption VARCHAR(500);

-- Add comment for documentation
COMMENT ON COLUMN articles.cover_photo_caption IS 'Caption or credit text for the cover photo';