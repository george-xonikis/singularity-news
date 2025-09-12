import Link from 'next/link';
import Image from 'next/image';
import { EyeIcon } from '@heroicons/react/24/outline';
import type { Article } from '@singularity-news/shared';
import { TopicBreadcrumb } from './TopicBreadcrumb';
import { ArticleActions } from './ArticleActions';

interface ArticleContentProps {
  article: Article;
  isPreview?: boolean;
  children?: React.ReactNode;
}

export function ArticleContent({ article, isPreview = false, children }: ArticleContentProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).toLowerCase();

    const timeZone = date.toLocaleDateString('en-US', { timeZoneName: 'short' }).split(', ').pop() || '';

    return `${month}. ${day}, ${year} ${time} ${timeZone}`;
  };

  return (
    <div className={isPreview ? 'bg-white border rounded-lg p-6' : 'bg-white'}>
      {isPreview && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 flex items-center gap-2">
          <EyeIcon className="h-5 w-5 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-800">Preview Mode - This is how your article will appear when published</span>
        </div>
      )}

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <TopicBreadcrumb topics={article.topics || []} articleTitle={article.title} />

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-8 text-center max-w-4xl mx-auto">
          {article.title}
        </h1>

        {article.summary && (
          <p className="text-xl text-gray-700 leading-relaxed mb-12 text-center font-light max-w-2xl mx-auto">
            {article.summary}
          </p>
        )}

        <ArticleActions article={article} isPreview={isPreview} />

        {article.coverPhoto && (
          <figure className="mb-8">
            <Image
              src={article.coverPhoto}
              alt={article.title}
              width={800}
              height={400}
              className="w-full h-auto rounded-lg shadow-lg"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 800px"
            />
            {article.coverPhotoCaption && (
              <figcaption className="mt-2 text-sm text-gray-600 italic">
                {article.coverPhotoCaption}
              </figcaption>
            )}
          </figure>
        )}

        <div className="mb-8 text-center">
          <p className="text-sm text-gray-600 mb-2">
            By <span className="font-medium text-gray-900">{article.author || 'Editorial Team'}</span>
          </p>
          <p className="text-sm text-gray-500">
            {formatDate(article.publishedDate || article.createdAt)}
          </p>
        </div>

        <div
          id="article-content"
          className="px-2 prose prose-lg max-w-none text-gray-900"
          style={{
            lineHeight: '1.7',
            letterSpacing: '0.01em'
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="inline-block bg-gray-100 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 text-sm px-3 py-1 rounded-full transition-all duration-200 transform hover:scale-105"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {!isPreview && children}
      </article>
    </div>
  );
}