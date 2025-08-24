import { Article, Topic } from '@singularity-news/shared';
import { BE_API_URL } from '@/config/env';

export async function getArticles(): Promise<Article[]> {
  try {
    const response = await fetch(`${BE_API_URL}/articles`, { cache: 'no-store' });

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
    const response = await fetch(`${BE_API_URL}/topics`, {
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