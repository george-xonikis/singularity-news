import { Article, Topic } from '@singularity-news/shared';

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

interface DatabaseTopic {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export const transformArticleFromDb = (dbArticle: DatabaseArticle): Article => {
  const result: Article = {
    id: parseInt(dbArticle.id),
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

export const transformTopicFromDb = (dbTopic: DatabaseTopic): Topic => ({
  id: dbTopic.id,
  name: dbTopic.name,
  slug: dbTopic.slug,
});