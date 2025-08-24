import { Article, Topic } from '@singularity-news/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3002';

export async function getArticles(): Promise<Article[]> {
  try {
    // Skip API calls if we're in production without a configured backend
    if (process.env.NODE_ENV === 'production' && API_BASE_URL.includes('localhost')) {
      console.log('Backend not configured for production, returning mock data');
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/api/articles`, { cache: 'no-store' });

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
    // Skip API calls if we're in production without a configured backend
    if (process.env.NODE_ENV === 'production' && API_BASE_URL.includes('localhost')) {
      console.log('Backend not configured for production, returning mock data');
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/api/topics`, {
      cache: 'no-store' // Always fetch fresh data
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