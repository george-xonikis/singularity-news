import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@singularity-news/shared';

interface ArticleSummaryProps {
  article: Article;
  variant?: 'list' | 'card' | 'grid';
  showImage?: boolean;
}

export function ArticleSummary({ 
  article, 
  variant = 'list', 
  showImage = true 
}: ArticleSummaryProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (variant === 'card' || variant === 'grid') {
    return (
      <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden hover:scale-[1.02] active:scale-[0.98]">
        <Link href={`/articles/${article.slug}`} className="block">
          {article.coverPhoto && showImage && (
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              <Image
                src={article.coverPhoto}
                alt={article.title}
                width={400}
                height={192}
                className="w-full h-48 object-cover transition-transform duration-200 hover:scale-[1.05]"
              />
            </div>
          )}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-black mb-2 hover:text-blue-600 cursor-pointer transition-colors line-clamp-2">
              {article.title}
            </h2>
            <p className="text-gray-700 mb-4 line-clamp-3">
              {article.summary || article.content.substring(0, 150)}
            </p>
            <div className="flex justify-between items-center text-sm">
              <div className="flex flex-wrap gap-1">
                {article.topics.slice(0, 2).map((topic) => (
                  <span key={topic.id} className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {topic.name}
                  </span>
                ))}
              </div>
              <div className="flex flex-col items-end text-gray-500">
                <span className="text-xs">
                  {formatDate(article.publishedDate || article.createdAt)}
                </span>
                <span className="text-xs">
                  {article.views?.toLocaleString() || 0} αναγνώσεις
                </span>
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="border-b border-gray-200 pb-6">
      {/* Mobile layout with thumbnail */}
      <div className="md:hidden">
        <Link href={`/articles/${article.slug}`} className="block p-3 -m-3 rounded-lg hover:bg-gray-50 hover:shadow-md active:bg-gray-100 active:scale-[0.98] transition-all duration-200">
          {article.coverPhoto && showImage && (
            <div className="mb-3">
              <Image
                src={article.coverPhoto}
                alt={article.title}
                width={400}
                height={200}
                className="w-full h-48 object-cover rounded-lg transition-transform duration-200 hover:scale-[1.02]"
              />
            </div>
          )}
          <h3 className="text-lg font-semibold text-black mb-2 group-hover:text-blue-600 transition-colors">
            {article.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3">
            {article.summary || article.content.substring(0, 150)}
          </p>
        </Link>
        <div className="flex justify-between items-center text-sm text-black mt-3">
          <div className="flex flex-wrap gap-1">
            {article.topics.map((topic) => (
              <span key={topic.id} className="bg-gray-100 px-2 py-1 rounded text-xs">
                {topic.name}
              </span>
            ))}
          </div>
          <span className="text-xs">{article.views?.toLocaleString() || 0} αναγνώσεις</span>
        </div>
      </div>

      {/* Desktop layout without thumbnail */}
      <div className="hidden md:block">
        <Link href={`/articles/${article.slug}`}>
          <h3 className="text-xl font-semibold text-black mb-2 hover:text-blue-600 cursor-pointer transition-colors">
            {article.title}
          </h3>
        </Link>
        <p className="text-black mb-2">
          {article.summary || article.content.substring(0, 150)}
        </p>
        <div className="flex justify-between items-center text-sm text-black">
          <div className="flex flex-wrap gap-1">
            {article.topics.map((topic) => (
              <span key={topic.id} className="bg-gray-100 px-2 py-1 rounded text-xs">
                {topic.name}
              </span>
            ))}
          </div>
          <span>{article.views?.toLocaleString() || 0} αναγνώσεις</span>
        </div>
      </div>
    </article>
  );
}