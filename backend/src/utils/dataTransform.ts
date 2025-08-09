import { Article, Topic } from '@singularity-news/shared';

interface DatabaseArticle {
  id: string;
  title: string;
  content: string;
  topic: string;
  cover_photo: string | null;
  created_at: string;
  updated_at: string;
  views: number;
  published: boolean;
}

interface DatabaseTopic {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export const transformArticleFromDb = (dbArticle: DatabaseArticle): Article => ({
  id: dbArticle.id,
  title: dbArticle.title,
  content: dbArticle.content,
  topic: dbArticle.topic,
  coverPhoto: dbArticle.cover_photo || undefined,
  createdAt: dbArticle.created_at,
  updatedAt: dbArticle.updated_at,
  views: dbArticle.views,
});

export const transformTopicFromDb = (dbTopic: DatabaseTopic): Topic => ({
  id: dbTopic.id,
  name: dbTopic.name,
  slug: dbTopic.slug,
});