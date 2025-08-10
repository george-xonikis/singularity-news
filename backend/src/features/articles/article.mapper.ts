import { Article } from '@singularity-news/shared';

/**
 * Database representation of an article
 */
export interface DatabaseArticle {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  topic: string;
  cover_photo: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  published_date: string | null;
  views: number;
  published: boolean;
}

/**
 * Transform database article to domain article
 */
export const transformArticleFromDb = (dbArticle: DatabaseArticle): Article => {
  const result: Article = {
    id: dbArticle.id, // Keep UUID as string
    title: dbArticle.title,
    slug: dbArticle.slug,
    content: dbArticle.content,
    topic: dbArticle.topic,
    tags: dbArticle.tags || [],
    createdAt: dbArticle.created_at,
    updatedAt: dbArticle.updated_at,
    views: dbArticle.views,
    published: dbArticle.published,
  };
  
  // Optional fields
  if (dbArticle.summary) {
    result.summary = dbArticle.summary;
  }
  
  if (dbArticle.cover_photo) {
    result.coverPhoto = dbArticle.cover_photo;
  }
  
  if (dbArticle.published_date) {
    result.publishedDate = dbArticle.published_date;
  }
  
  return result;
};

/**
 * Transform domain article to database format
 */
export const transformArticleToDb = (article: Partial<Article>): Partial<DatabaseArticle> => {
  const result: Partial<DatabaseArticle> = {};

  if (article.id) result.id = article.id;
  if (article.title) result.title = article.title;
  if (article.slug) result.slug = article.slug;
  if (article.content) result.content = article.content;
  if (article.topic) result.topic = article.topic;
  if (article.summary !== undefined) result.summary = article.summary || null;
  if (article.coverPhoto !== undefined) result.cover_photo = article.coverPhoto || null;
  if (article.tags) result.tags = article.tags;
  if (article.publishedDate !== undefined) result.published_date = article.publishedDate || null;
  if (article.published !== undefined) result.published = article.published;
  if (article.views !== undefined) result.views = article.views;

  return result;
};