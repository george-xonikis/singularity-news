import { ArticleDetail } from '@/components/ArticleDetail';
import { RelatedArticles } from '@/components/RelatedArticles';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { getArticleBySlug } from '@/lib/server-data';
import { generateArticleMetadata, generateArticleJsonLd } from '@/lib/metadata';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  return generateArticleMetadata(article, slug);
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const jsonLd = generateArticleJsonLd(article, slug);

  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleDetail article={article}>
        <RelatedArticles
          currentArticleId={article.id}
          currentTopics={article.topics}
          currentTags={article.tags}
        />
      </ArticleDetail>
    </>
  );
}