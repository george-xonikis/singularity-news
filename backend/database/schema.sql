-- Database schema for Singularity News
-- Tables, indexes, functions, and triggers

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Topics table
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles table
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(600) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  summary TEXT,
  author VARCHAR(200),
  topics UUID[] NOT NULL DEFAULT '{}'::uuid[], -- Array of topic UUIDs for referential integrity
  cover_photo TEXT,
  cover_photo_caption VARCHAR(500),
  tags TEXT[], -- Array of tags for SEO and filtering
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_date TIMESTAMPTZ, -- When article was published (can be scheduled)
  views INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT TRUE
);

-- Indexes for better query performance
CREATE INDEX idx_articles_topics ON articles USING gin(topics); -- GIN index for array operations
CREATE INDEX idx_articles_published ON articles(published);
CREATE INDEX idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX idx_articles_published_date ON articles(published_date DESC);
CREATE INDEX idx_articles_views ON articles(views DESC);
CREATE INDEX idx_articles_tags ON articles USING gin(tags); -- GIN index for array operations
CREATE INDEX idx_topics_slug ON topics(slug);
CREATE INDEX idx_articles_slug ON articles(slug);

-- Full-text search indexes
CREATE INDEX idx_articles_search 
ON articles USING gin(to_tsvector('english', title || ' ' || content));

-- Topics are stored as UUIDs for referential integrity with topics table

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_articles_updated_at 
    BEFORE UPDATE ON articles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to increment article views
CREATE OR REPLACE FUNCTION increment_article_views(article_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE articles 
    SET views = views + 1 
    WHERE id = article_id AND published = TRUE;
END;
$$ language 'plpgsql';