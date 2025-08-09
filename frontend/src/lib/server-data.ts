import { Article, Topic } from '@singularity-news/shared';

const API_BASE_URL = process.env.API_URL || 'http://localhost:3002';

export async function getArticles(): Promise<Article[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/articles`, {
      cache: 'no-store' // Always fetch fresh data
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

export async function getArticlesByTopic(topic: string): Promise<Article[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/articles?topic=${encodeURIComponent(topic)}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch articles by topic:', error);
    return [];
  }
}

export async function searchArticles(query: string): Promise<Article[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/articles?search=${encodeURIComponent(query)}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to search articles:', error);
    return [];
  }
}
