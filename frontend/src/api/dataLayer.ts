// import { apiClient } from './apiClient';

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

export interface Topic {
  id: string;
  name: string;
  slug: string;
}

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'AI Revolution in Healthcare',
    content: 'Artificial Intelligence is transforming healthcare with unprecedented innovations...',
    topic: 'Technology',
    coverPhoto: '/placeholder-image.jpg',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    views: 1250
  },
  {
    id: '2',
    title: 'Climate Change Solutions',
    content: 'Scientists propose new breakthrough technologies to combat climate change...',
    topic: 'Environment',
    coverPhoto: '/placeholder-image.jpg',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    views: 890
  },
  {
    id: '3',
    title: 'Economic Outlook 2024',
    content: 'Global economic trends and predictions for the upcoming year...',
    topic: 'Economy',
    coverPhoto: '/placeholder-image.jpg',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
    views: 2100
  }
];

const mockTopics: Topic[] = [
  { id: '1', name: 'Technology', slug: 'technology' },
  { id: '2', name: 'Environment', slug: 'environment' },
  { id: '3', name: 'Economy', slug: 'economy' },
  { id: '4', name: 'Politics', slug: 'politics' },
  { id: '5', name: 'Health', slug: 'health' }
];

export const dataLayer = {
  async getArticles(): Promise<Article[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockArticles;
  },

  async getArticleById(id: string): Promise<Article | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockArticles.find(article => article.id === id) || null;
  },

  async getArticlesByTopic(topic: string): Promise<Article[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockArticles.filter(article => article.topic.toLowerCase() === topic.toLowerCase());
  },

  async searchArticles(query: string): Promise<Article[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockArticles.filter(article => 
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.content.toLowerCase().includes(query.toLowerCase())
    );
  },

  async createArticle(articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'views'>): Promise<Article> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newArticle: Article = {
      ...articleData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0
    };
    return newArticle;
  },

  async updateArticle(id: string, updates: Partial<Article>): Promise<Article | null> {
    await new Promise(resolve => setTimeout(resolve, 700));
    const existingArticle = mockArticles.find(article => article.id === id);
    if (!existingArticle) return null;
    
    return {
      ...existingArticle,
      ...updates,
      updatedAt: new Date().toISOString()
    };
  },

  async deleteArticle(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockArticles.some(article => article.id === id);
  },

  async getTopics(): Promise<Topic[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockTopics;
  }
};