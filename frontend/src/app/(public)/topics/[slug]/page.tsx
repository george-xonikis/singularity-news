import Link from 'next/link';
import { Article, Topic } from '@singularity-news/shared';
import { API_CONFIG } from '@/config/env';
import { ArticleSummary } from '@/components/ArticleSummary';

interface TopicPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getTopicBySlug(topicSlug: string): Promise<Topic | null> {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/topics/slug/${topicSlug}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      console.error(`Failed to fetch topic ${topicSlug}:`, response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch topic:', error);
    return null;
  }
}

async function getArticlesByTopic(topicSlug: string): Promise<Article[]> {
  try {
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/articles?topic=${topicSlug}`,
      { next: { revalidate: 60 } } // Revalidate every minute
    );

    if (!response.ok) {
      console.error(`Failed to fetch articles for topic ${topicSlug}:`, response.status);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch articles by topic:', error);
    return [];
  }
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const [topic, articles] = await Promise.all([
    getTopicBySlug(slug),
    getArticlesByTopic(slug)
  ]);

  // Use actual topic name or fallback to formatted slug
  const topicDisplayName = topic?.name || slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();

  if (articles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-black mb-8">{topicDisplayName}</h1>
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">Δεν βρέθηκε άρθρο στην κατηγορία</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700 underline">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">{topicDisplayName}</h1>
        <p className="text-gray-600">
          {articles.length} σε αυτή την κατηγορία
        </p>
      </div>

      <div className="space-y-6">
        {articles.map((article) => (
          <ArticleSummary
            key={article.id}
            article={article}
            variant="list"
          />
        ))}
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: TopicPageProps) {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);
  const topicDisplayName = topic?.name || slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();

  return {
    title: `${topicDisplayName} - Αμερόληπτα Νέα`,
    description: `Διαβάστε τα τελευταία νέα και άρθρα για ${topicDisplayName.toLowerCase()} στα Αμερόληπτα Νέα`,
  };
}