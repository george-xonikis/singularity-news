export interface Article {
  id: number;
  title: string;
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

export interface CreateArticleInput {
  title: string;
  content: string;
  summary?: string;
  topic: string;
  coverPhoto?: string;
  tags: string[];
  publishedDate?: string | null;
  published?: boolean;
}

export interface UpdateArticleInput {
  title?: string;
  content?: string;
  summary?: string;
  topic?: string;
  coverPhoto?: string;
  tags?: string[];
  publishedDate?: string | null;
  published?: boolean;
}