export interface Article {
  id: string; // UUID from database
  title: string;
  slug: string;
  content: string;
  summary?: string;
  topic: string;
  topicName?: string;
  coverPhoto?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedDate?: string | null;
  views: number;
  published: boolean;
}

// CreateArticleInput: Pick user-provided fields, exclude auto-generated ones
export type CreateArticleInput = Pick<Article, 'title' | 'content' | 'topic' | 'tags'> & {
  slug?: string | undefined;
  summary?: string | undefined;
  coverPhoto?: string | undefined;
  publishedDate?: string | null | undefined;
  published?: boolean | undefined;
};

// UpdateArticleInput: Make all user-editable fields optional
export type UpdateArticleInput = Partial<Pick<Article, 'title' | 'slug' | 'content' | 'summary' | 'topic' | 'coverPhoto' | 'tags' | 'publishedDate' | 'published'>>;