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
export type CreateArticleInput = {
  title: string;
  content: string;
  topic: string;
  slug?: string | undefined;
  summary?: string | undefined;
  coverPhoto?: string | undefined;
  tags: string[];
  publishedDate?: string | null | undefined;
  published?: boolean | undefined;
};

// UpdateArticleInput: Make all user-editable fields optional
export type UpdateArticleInput = {
  title?: string | undefined;
  slug?: string | undefined;
  content?: string | undefined;
  summary?: string | undefined;
  topic?: string | undefined;
  coverPhoto?: string | undefined;
  tags?: string[] | undefined;
  publishedDate?: string | null | undefined;
  published?: boolean | undefined;
};