export interface Article {
  id: string;
  title: string;
  content: string;
  topic: string;
  coverPhoto?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
}

export interface CreateArticleInput {
  title: string;
  content: string;
  topic: string;
  coverPhoto?: string;
}

export interface UpdateArticleInput {
  title?: string;
  content?: string;
  topic?: string;
  coverPhoto?: string;
}