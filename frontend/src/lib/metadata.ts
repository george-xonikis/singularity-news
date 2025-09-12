import type { Metadata } from 'next';
import type { Article } from '@singularity-news/shared';
import { API_CONFIG } from '@/config/env';

const SITE_URL = API_CONFIG.NEXT_URL;

export function generateArticleMetadata(article: Article | null, slug: string): Metadata {
  if (!article) {
    return {
      title: 'Άρθρο δεν βρέθηκε',
      description: 'Το άρθρο που αναζητάτε δεν βρέθηκε.',
    };
  }

  const cleanContent = article.content.replace(/<[^>]*>/g, '').substring(0, 160);

  return {
    title: article.title,
    description: article.summary || cleanContent,
    keywords: article.tags?.join(', '),
    authors: article.author ? [{ name: article.author }] : [{ name: 'Αμερόληπτα Νέα' }],
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.summary || cleanContent,
      url: SITE_URL ? `${SITE_URL}/articles/${slug}` : `/articles/${slug}`,
      siteName: 'Αμερόληπτα Νέα - Amerolipta Nea',
      publishedTime: article.publishedDate || article.createdAt,
      modifiedTime: article.updatedAt || article.createdAt,
      authors: article.author ? [article.author] : ['Αμερόληπτα Νέα'],
      images: article.coverPhoto ? [
        {
          url: article.coverPhoto,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ] : undefined,
      locale: 'el_GR',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary || cleanContent,
      images: article.coverPhoto ? [article.coverPhoto] : undefined,
    },
    alternates: {
      canonical: SITE_URL ? `${SITE_URL}/articles/${slug}` : `/articles/${slug}`,
    },
  };
}

export function generateArticleJsonLd(article: Article, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary || article.content.replace(/<[^>]*>/g, '').substring(0, 160),
    image: article.coverPhoto ? [article.coverPhoto] : undefined,
    datePublished: article.publishedDate || article.createdAt,
    dateModified: article.updatedAt || article.createdAt,
    author: {
      '@type': 'Organization',
      name: article.author || 'Αμερόληπτα Νέα',
      url: SITE_URL || '',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Αμερόληπτα Νέα - Amerolipta Nea',
      url: SITE_URL || '',
      logo: {
        '@type': 'ImageObject',
        url: SITE_URL ? `${SITE_URL}/logo.png` : '/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': SITE_URL ? `${SITE_URL}/articles/${slug}` : `/articles/${slug}`,
    },
    articleBody: article.content.replace(/<[^>]*>/g, ''),
    keywords: article.tags?.join(', '),
    inLanguage: 'el',
  };
}