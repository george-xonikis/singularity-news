import { Article } from '@singularity-news/shared';

/**
 * Database representation of an article
 */
export interface DatabaseArticle {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  author: string | null;
  content: string;
  topics: string[];
  cover_photo: string | null;
  cover_photo_caption: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  published_date: string | null;
  views: number;
  published: boolean;
}

/**
 * Article with topic IDs (intermediate type before populating topics)
 */
export interface ArticleWithTopicIds {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  author?: string;
  topics: string[];
  coverPhoto?: string;
  coverPhotoCaption?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedDate?: string | null;
  views: number;
  published: boolean;
}

/**
 * Transform database article to article with topic IDs
 */
export const transformArticleFromDb = (dbArticle: DatabaseArticle): ArticleWithTopicIds => {
  const result: ArticleWithTopicIds = {
    id: dbArticle.id, // Keep UUID as string
    title: dbArticle.title,
    slug: dbArticle.slug,
    content: dbArticle.content,
    topics: dbArticle.topics || [],
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
  
  if (dbArticle.author) {
    result.author = dbArticle.author;
  }
  
  if (dbArticle.cover_photo) {
    result.coverPhoto = dbArticle.cover_photo;
  }
  
  if (dbArticle.cover_photo_caption) {
    result.coverPhotoCaption = dbArticle.cover_photo_caption;
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
  if (article.topics) result.topics = article.topics.map(topic => topic.id);
  if (article.summary !== undefined) result.summary = article.summary || null;
  if (article.author !== undefined) result.author = article.author || null;
  if (article.coverPhoto !== undefined) result.cover_photo = article.coverPhoto || null;
  if (article.coverPhotoCaption !== undefined) result.cover_photo_caption = article.coverPhotoCaption || null;
  if (article.tags) result.tags = article.tags;
  if (article.publishedDate !== undefined) result.published_date = article.publishedDate || null;
  if (article.published !== undefined) result.published = article.published;
  if (article.views !== undefined) result.views = article.views;

  return result;
};