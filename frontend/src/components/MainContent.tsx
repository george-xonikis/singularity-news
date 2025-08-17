import Link from 'next/link';
import { Article } from '@singularity-news/shared';

interface MainContentProps {
  articles: Article[];
}

export default function MainContent({ articles }: MainContentProps) {
  return (
    <section className="lg:col-span-2">
      <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
      <div className="space-y-6">
        {articles.map(article => {
          return (
            <article key={article.id} className="border-b border-gray-200 pb-6">
              <Link href={`/articles/${article.slug}`}>
                <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 cursor-pointer transition-colors">
                  {article.title}
                </h3>
              </Link>
              <p className="text-gray-600 mb-2">
                {article.summary || article.content.substring(0, 150)}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded">{article.topic}</span>
                <span>{article.views.toLocaleString()} views</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
