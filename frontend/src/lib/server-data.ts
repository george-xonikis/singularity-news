import { Article, Topic } from '@singularity-news/shared';
import { API_CONFIG } from '@/config/env';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export async function getArticles(): Promise<Article[]> {
  try {
    const response = await fetch(`${API_CONFIG.SERVER_URL}/articles`, {
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return [];
  }
}

export async function getTopics(): Promise<Topic[]> {
  try {
    const response = await fetch(`${API_CONFIG.SERVER_URL}/topics`, {
      next: { revalidate: 600 } // Topics change less frequently, revalidate every 10 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch topics:', error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const response = await fetch(`${API_CONFIG.SERVER_URL}/articles/${slug}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return null;
    }

    const { success, data }: ApiResponse<Article> = await response.json();

    return success && data ? data : null;
  } catch (error) {
    console.error('Failed to fetch article:', error);
    return null;
  }
}