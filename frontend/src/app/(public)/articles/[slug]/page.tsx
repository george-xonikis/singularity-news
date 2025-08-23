import { ArticleDetail } from '@/components/ArticleDetail';
import { RelatedArticles } from '@/components/RelatedArticles';
import { notFound } from 'next/navigation';
import type { Article } from '@singularity-news/shared';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const response = await fetch(`http://localhost:3002/api/articles/${slug}`, {
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

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <ArticleDetail article={article}>
      <RelatedArticles
        currentArticleId={article.id}
        currentTopic={article.topic}
        currentTags={article.tags}
      />
    </ArticleDetail>
  );
}