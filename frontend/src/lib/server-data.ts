import { dataLayer } from '@/api/dataLayer';

export async function getArticles() {
  return dataLayer.getArticles();
}

export async function getTopics() {
  return dataLayer.getTopics();
}