-- AI News Database Schema for Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  topic VARCHAR(100) NOT NULL,
  cover_photo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  views INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT TRUE,
  
  -- Add foreign key constraint to topics
  CONSTRAINT fk_articles_topic 
    FOREIGN KEY (topic) 
    REFERENCES topics(name) 
    ON UPDATE CASCADE 
    ON DELETE RESTRICT
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_articles_topic ON articles(topic);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_views ON articles(views DESC);
CREATE INDEX IF NOT EXISTS idx_topics_slug ON topics(slug);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_articles_search 
ON articles USING gin(to_tsvector('english', title || ' ' || content));

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
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

-- Insert initial topics
INSERT INTO topics (name, slug) VALUES 
  ('Technology', 'technology'),
  ('Environment', 'environment'), 
  ('Economy', 'economy'),
  ('Politics', 'politics'),
  ('Health', 'health')
ON CONFLICT (name) DO NOTHING;

-- Insert sample articles
INSERT INTO articles (title, content, topic, views, published) VALUES 
  (
    'AI Revolution in Healthcare',
    'Artificial Intelligence is transforming healthcare with unprecedented innovations. From diagnostic tools to personalized treatment plans, AI is revolutionizing how we approach medical care. Machine learning algorithms can now detect diseases earlier than human doctors in many cases, while robotic surgery systems provide precision beyond human capabilities.',
    'Technology',
    1250,
    TRUE
  ),
  (
    'Climate Change Solutions',
    'Scientists propose new breakthrough technologies to combat climate change. Innovative carbon capture methods, renewable energy advances, and sustainable agriculture practices are showing promising results in the fight against global warming. These solutions offer hope for a sustainable future.',
    'Environment',
    890,
    TRUE
  ),
  (
    'Economic Outlook 2024',
    'Global economic trends and predictions for the upcoming year. Market analysts are cautiously optimistic about recovery prospects, with emerging markets showing strong growth potential. However, inflation concerns and geopolitical tensions continue to pose challenges for the global economy.',
    'Economy',
    2100,
    TRUE
  )
ON CONFLICT DO NOTHING;

-- Row Level Security (RLS) policies
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published articles
CREATE POLICY "Allow public read access to published articles" 
  ON articles FOR SELECT 
  TO public 
  USING (published = TRUE);

-- Allow public read access to topics
CREATE POLICY "Allow public read access to topics" 
  ON topics FOR SELECT 
  TO public 
  USING (TRUE);

-- For now, allow all operations for authenticated users (service role)
-- In production, you'd want more granular permissions
CREATE POLICY "Allow service role full access to articles" 
  ON articles FOR ALL 
  TO service_role 
  USING (TRUE);

CREATE POLICY "Allow service role full access to topics" 
  ON topics FOR ALL 
  TO service_role 
  USING (TRUE);