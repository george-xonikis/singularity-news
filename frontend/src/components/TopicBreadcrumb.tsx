import Link from 'next/link';
import Script from 'next/script';
import type { Topic } from '@singularity-news/shared';

interface TopicBreadcrumbProps {
  topics: Topic[];
  articleTitle?: string;
}

export function TopicBreadcrumb({ topics, articleTitle }: TopicBreadcrumbProps) {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

  // Generate JSON-LD structured data for breadcrumbs
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Αρχική',
        item: SITE_URL ? `${SITE_URL}/` : '/',
      },
      ...(topics.length > 0 ? [{
        '@type': 'ListItem',
        position: 2,
        name: topics[0].name,
        item: SITE_URL ? `${SITE_URL}/topics/${topics[0].slug}` : `/topics/${topics[0].slug}`,
      }] : []),
      ...(articleTitle ? [{
        '@type': 'ListItem',
        position: topics.length > 0 ? 3 : 2,
        name: articleTitle,
      }] : []),
    ],
  };

  if (topics.length === 0) return null;

  return (
    <>
      <Script
        id="topic-breadcrumb-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="text-center mb-8">
        {topics.map((topic, index) => (
          <span key={topic.id}>
            <Link
              href={`/topics/${topic.slug}`}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 uppercase tracking-wider"
            >
              {topic.name}
            </Link>
            {index < topics.length - 1 && (
              <span className="text-gray-400 mx-2">|</span>
            )}
          </span>
        ))}
      </div>
    </>
  );
}