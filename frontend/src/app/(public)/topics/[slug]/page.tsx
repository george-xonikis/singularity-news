import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@singularity-news/shared';
import { API_CONFIG } from '@/config/env';

interface TopicPageProps {
  params: Promise<{
    slug: string;
  }>;
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
  const articles = await getArticlesByTopic(slug);

  // Convert slug to display name
  const topicDisplayName = slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();

  if (articles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-black mb-8">{topicDisplayName}</h1>
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No articles found in this topic yet.</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700 underline">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">{topicDisplayName}</h1>
        <p className="text-gray-600">
          {articles.length} article{articles.length !== 1 ? 's' : ''} in this topic
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <article
            key={article.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
          >
            {article.coverPhoto && (
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <Image
                  src={article.coverPhoto}
                  alt={article.title}
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <Link href={`/articles/${article.slug}`}>
                <h2 className="text-xl font-semibold text-black mb-2 hover:text-blue-600 cursor-pointer transition-colors line-clamp-2">
                  {article.title}
                </h2>
              </Link>
              <p className="text-gray-700 mb-4 line-clamp-3">
                {article.summary || article.content.substring(0, 150)}
              </p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">
                  {new Date(article.publishedDate || article.createdAt).toLocaleDateString()}
                </span>
                <span className="text-gray-500">
                  {article.views?.toLocaleString() || 0} views
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: TopicPageProps) {
  const { slug } = await params;
  const topicDisplayName = slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();

  return {
    title: `${topicDisplayName} News - AI News`,
    description: `Read the latest ${topicDisplayName.toLowerCase()} news and articles on AI News`,
  };
}