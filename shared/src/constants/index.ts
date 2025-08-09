export const API_ENDPOINTS = {
  ARTICLES: '/api/articles',
  TOPICS: '/api/topics',
  HEALTH: '/health',
} as const;

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const CACHE_SETTINGS = {
  NO_STORE: 'no-store',
  REVALIDATE_1_HOUR: 3600,
  REVALIDATE_24_HOURS: 86400,
} as const;