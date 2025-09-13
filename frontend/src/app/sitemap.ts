import { MetadataRoute } from 'next';
import { API_CONFIG, SITE_URL } from '@/config/env';
import { Article, Topic } from '@singularity-news/shared';

async function getArticles(): Promise<Article[]> {
  try {
    const response = await fetch(`${API_CONFIG.SERVER_URL}/articles?limit=1000`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

async function getTopics(): Promise<Topic[]> {
  try {
    const response = await fetch(`${API_CONFIG.SERVER_URL}/topics`, {
      next: { revalidate: 3600 }
    });
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, topics] = await Promise.all([getArticles(), getTopics()]);

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}articles/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.createdAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const topicEntries: MetadataRoute.Sitemap = topics.map((topic) => ({
    url: `${SITE_URL}topics/${topic.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}admin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    ...articleEntries,
    ...topicEntries,
  ];
}